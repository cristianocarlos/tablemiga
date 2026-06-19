import {DateTime, Settings} from 'luxon';

import {getLanguage} from '@/utils/globals';

import type {TFormattedDate, TFormattedDateHour} from '@/types/common';
import type {TLuxonDateObjectUnits, TLuxonDateTimeFormatOptions, TLuxonParam, TLuxonValid} from '@/types/thirdParty';

Settings.defaultLocale = getLanguage().replace('_', '-');
// Settings.defaultZoneName = 'America/Sao_Paulo'; // Isso, nem faz sentido, tem que deixar acontecer automáticamente

const MIN_VALID_MILLIS = 210946500000; // 1976-09-07 09:15:00 aleatório, basicamente pra identificar que veio um Date.now() de parâmetro

/** ***************************
 ******************************
 **** private core parsers ****
 ******************************
 **************************** */

function parseStringLuxon(value: null | number | string | undefined) {
  if (!value) return DateTime.invalid(`!value ≡ ${value}`);
  if (typeof value !== 'string') return DateTime.invalid(`typeof value !== 'string' ≡ ${value}`); // Luxon inválido
  // if (isSafeNumeric(value)) return DateTime.invalid(`isSafeNumeric(${value})`); // Luxon inválido não considerar número-string
  if (value === '24:00') return DateTime.invalid(`value === '24:00' ≡ ${value}`); // Luxon inválido 24:00 é uma hora válida do dia seguinte, não considerar
  if (value.includes(' 24:00')) return DateTime.invalid(`value.includes(' 24:00') ≡ ${value}`); // Luxon inválido 24:00 é uma hora válida do dia seguinte, não considerar) return DateTime.fromJSDate(undefined); // Luxon inválido 24:00 é uma hora válida do dia seguinte, não considerar. precisa do espaço por que é possível 23:24:00
  // Quando a data é anterior a 1914-01-01, o Postgres armazena o timezone diferente, incluindo com minutos e segundos
  // Não parece ter algo haver com o postgres, mas com o timezone, se usarmos o DateTime.DATETIME_SHORT_WITH_SECONDS
  // para formatar uma data antes de 1914, vai formatar com 28 segundos a menos ex: 31/12/1913 00:00:00 vira 30/12/1913 23:59:32
  // Exemplos:
  // 1914-01-01 12:00:00-03 salva como 1914-01-01 12:00:00-03
  // 1913-12-31 12:00:00-03 salva como 1913-12-31 11:53:32-03:06:28 (timezonado com 6min e 28s a menos)
  // O luxon não aceita o formato com segundos, então testamos o tamanho da string
  // Caso o timezone contenha minutos e segundos, corta os segundos fora
  // const resolvedValue = value.length === 28 ? value.substring(0, 25) : value;
  const resolvedValue = value.length === 28 ? value.substring(0, 25) : value;
  let valueLuxon = DateTime.fromISO(resolvedValue);
  if (!valueLuxon.isValid) {
    valueLuxon = DateTime.fromSQL(resolvedValue);
    if (!valueLuxon.isValid) {
      const formats = ['dd/MM/yyyy', 'dd/MM/yyyy HH:mm', 'dd/MM/yyyy HH:mm:ss'];
      for (let i = 0; i < formats.length; i++) {
        const customValueLuxon = DateTime.fromFormat(resolvedValue, formats[i]);
        if (customValueLuxon.isValid) {
          valueLuxon = customValueLuxon;
          break;
        }
      }
    }
  }
  return valueLuxon;
}

/**
 * @param value
 * @param minValidMillis para durantions não da pra usar o MIN_VALID_MILLIS, precisa ser 0
 */
function parseAnyLuxon(value: TLuxonParam, minValidMillis = MIN_VALID_MILLIS) {
  // undefined, null, ''
  if (!value) return DateTime.invalid('!value');
  let valueLuxon: DateTime<false> | DateTime<true>;
  if (value instanceof DateTime) {
    valueLuxon = value;
  } else if (typeof value === 'number') {
    if (value >= minValidMillis) {
      valueLuxon = DateTime.fromMillis(value);
    } else {
      valueLuxon = DateTime.invalid('value < minValidMillis (' + minValidMillis + ')');
    }
  } else if (value instanceof Date) {
    valueLuxon = DateTime.fromJSDate(value);
  } else {
    valueLuxon = parseStringLuxon(value);
  }
  return valueLuxon;
}

/** ******************
 *********************
 **** main parser ****
 *********************
 ******************* */

/**
 * https://moment.github.io/luxon/docs/manual/parsing.html
 * https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#static-method-fromSQL
 */
export function parseLuxon(value: TLuxonValid, adjustments?: TLuxonDateObjectUnits): TLuxonValid;
export function parseLuxon(value: TLuxonParam, adjustments?: TLuxonDateObjectUnits): TLuxonValid | undefined;
export function parseLuxon(value: TLuxonParam, adjustments?: TLuxonDateObjectUnits) {
  const valueLuxon = parseAnyLuxon(value);
  if (valueLuxon.isValid) return adjustments ? valueLuxon.set(adjustments) : valueLuxon;
  // return DateTime.invalid(`Parametro value inválido ≡ ${value}`);
  // console.warn(`Parametro data inválido ≡ ${value}`);
  // Não retorna luxon deliberadamente, as funcões usadas externamente não podem acessar nenhum recurso exclusivo do luxon
  return undefined;
}

export function getLuxonNow(): TLuxonValid {
  return DateTime.local();
}

export function getYear(value: TLuxonValid): number;
export function getYear(value: TLuxonParam): number | undefined;
export function getYear(value: TLuxonParam) {
  return parseLuxon(value)?.year;
}

/** *****************
 ********************
 **** formatters ****
 ********************
 ****************** */

/**
 * https://moment.github.io/luxon/docs/manual/formatting.html
 */
export function format(mask: string | TLuxonDateTimeFormatOptions, value: TLuxonParam) {
  const valueLuxon = parseLuxon(value);
  if (!valueLuxon) return '';
  if (typeof mask === 'object') return valueLuxon.toLocaleString(mask);
  return valueLuxon.toFormat(mask);
}

export function formatDate(value: TLuxonParam): TFormattedDate {
  return format(DateTime.DATE_SHORT, value);
}

export function formatDateHour(value: TLuxonParam): TFormattedDateHour {
  // return format(DateTime.DATETIME_SHORT, value); // Esta caralha passou a enfiar uma vírgula entre o ano e a hora a partir da versão 110 do Chrome
  return format('dd/MM/yyyy HH:mm', value);
}

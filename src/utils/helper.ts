export const DEFAULT_EMPTY_CHAR = '-';

/**
 * Retorna o caractere padrão (DEFAULT_EMPTY_CHAR) se o valor fornecido for considerado vazio.
 * Um valor é considerado vazio se a função hasValue retornar falso para ele.
 * @see hasValue
 */
export function emptyChar<G>(value?: G, char = DEFAULT_EMPTY_CHAR) {
  return hasValue(value) ? value : char;
}

/**
 * Retorna o caractere padrão (DEFAULT_EMPTY_CHAR) se o valor fornecido for considerado vazio considerando 0, '0' e '0.0'.
 * Para definir se um elemento é vazio, consulte a função hasValue.
 * @see hasValue
 */
export function emptyCharWhenZero(value?: number | string, char = DEFAULT_EMPTY_CHAR) {
  if (value === 0 || value === '0' || value === '0.0') return char;
  return hasValue(value) ? value : char;
}

/**
 * Retorna verdadeiro se o valor passado não for undefined, null e nem uma string vazia.
 * Essa funcao não tem suporte para Arrays e objetos e retornara true indenpendente do valor.
 */
function hasValue<G>(value: G): value is NonNullable<G> {
  if (typeof value === 'undefined') return false;
  if (value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
}

export function strToNumeric<G extends number | string | undefined>(value: G) {
  // pt_br
  if (typeof value !== 'string') return value;
  return value.replaceAll('.', '').replace(',', '.');
}

export function valueAsNumber<
  P extends boolean | null | number | string | undefined,
  R = P extends boolean | number | string ? number : undefined,
>(value: P) {
  if (typeof value === 'number') {
    // console.warn('value is already a number');
    return value as R;
  }
  if (!value) return undefined as R;
  return Number(value) as R;
}

/*
 * Maluquisse condicional em vez de usar overload, só por diversão
 */
export function valueAsString<
  P extends boolean | FormDataEntryValue | null | number | string | undefined,
  R = P extends boolean | FormDataEntryValue | number | string ? string : undefined,
>(value: P) {
  if (typeof value === 'string') return value as R;
  if (value === false) return '0' as R;
  if (value === 0) return '0' as R;
  if (!value) return undefined as R;
  if (value === true) return '1' as R;
  return value.toString() as R;
}

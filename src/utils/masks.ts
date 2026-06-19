import {strToNumeric, valueAsNumber, valueAsString} from '@/utils/helper';
import {isSafeInteger, isSafeNumeric} from '@/utils/validators';

export function formatCurrency(value?: null | number | string) {
  // pt_br
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (isSafeNumeric(value)) {
    return formatNumber(value, 2, ',', '.');
  }
  if (typeof value === 'string') {
    const resolvedValue = strToNumeric(value);
    return isSafeNumeric(resolvedValue) ? formatNumber(resolvedValue, 2, ',', '.') : value;
  }
  return value;
}

export function formatInteger(value?: null | number | string) {
  // pt_br
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (isSafeNumeric(value)) {
    const resolvedValue = valueAsString(value);
    return formatNumber(resolvedValue, 0, '', '.');
  }
  return value;
}

function formatNumber(value?: null | number | string, decimals = 2, decPoint = '.', thousandsSep = ',') {
  // http://kevin.vanzonneveld.net
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +     bugfix by: Michael White (http://crestidg.com)
  // +     bugfix by: Benjamin Lupton
  // +     bugfix by: Allan Jensen (http://www.winternet.no)
  // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +     bugfix by: Howard Yeend
  // *     example 1: number_format(1234.5678, 2, '.', '');
  // *     returns 1: 1234.57
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (isSafeNumeric(value)) {
    let resolvedValue = valueAsNumber(value);
    const negativeSignal = resolvedValue < 0 ? '-' : '';
    resolvedValue = valueAsNumber(Math.abs(resolvedValue).toFixed(decimals));
    const integerPart = valueAsString(Math.floor(resolvedValue));
    const separatorEndPos = integerPart.length > 3 ? integerPart.length % 3 : 0;
    return (
      negativeSignal +
      (separatorEndPos ? integerPart.substring(0, separatorEndPos) + thousandsSep : '') +
      integerPart.substring(separatorEndPos).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) +
      (decimals
        ? decPoint +
          Math.abs(resolvedValue - valueAsNumber(integerPart))
            .toFixed(decimals)
            .slice(2)
        : '')
    );
  }
  return value;
}

export function formatPhoneNumber(value?: null | number | string) {
  // pt_br
  if (typeof value !== 'number' && typeof value !== 'string') return '';
  if (!isSafeInteger(value)) return valueAsString(value);
  const resolvedValue = valueAsString(value);
  if (resolvedValue.length === 10) {
    return resolvedValue.substring(0, 2) + ' ' + resolvedValue.substring(2, 6) + '-' + resolvedValue.substring(6, 10);
  }
  if (resolvedValue.length === 11) {
    return resolvedValue.substring(0, 2) + ' ' + resolvedValue.substring(2, 7) + '-' + resolvedValue.substring(7, 11);
  }
  if (resolvedValue.length === 12) {
    return (
      '+' +
      resolvedValue.substring(0, 2) +
      ' ' +
      resolvedValue.substring(2, 4) +
      ' ' +
      resolvedValue.substring(4, 8) +
      '-' +
      resolvedValue.substring(8, 12)
    );
  }
  if (resolvedValue.length === 13) {
    return (
      '+' +
      resolvedValue.substring(0, 2) +
      ' ' +
      resolvedValue.substring(2, 4) +
      ' ' +
      resolvedValue.substring(4, 9) +
      '-' +
      resolvedValue.substring(9, 13)
    );
  }
  return resolvedValue;
}

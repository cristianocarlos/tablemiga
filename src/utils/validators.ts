import {valueAsNumber} from '@/utils/helper';

export function isSafeInteger<G extends number | string | undefined>(value: G): value is G {
  if (!isSafeNumeric(value)) return false;
  if (typeof value === 'string' && value.includes('.')) return false; // 100.00 é um integer valido, não pode
  return Number.isInteger(valueAsNumber(value));
  // return (value % 1) === 0;
}

export function isSafeNumeric<G extends number | string | undefined>(value: G): value is G {
  if (typeof value === 'number' && isTypeOfSafeNumber(value)) return true;
  if (typeof value !== 'string') return false;
  // As strings no formato 0x539; 0x539; 0o2471 (02471 no php); 0b10100111001; 1337e0
  // NÃO SÃO consideradas válidas, isso casa com o comportamento do isNumeric do PHP
  // return !Number.isNaN(Number(value)); // Dessa forma as string seriam consideradas válidas
  // A expressão regular é pra validar as strings que começam com zero, ou negativo: 01314000 /^-?\d+\.?\d*$/
  const regex = /^-?\d+\.?\d*$/;
  return Number(value).toString() === value || regex.test(value);
}

function isTypeOfSafeNumber(value: number) {
  // Previne as cagalhada do tipo 1e+24 (ultrapassa maximo) -7.7e+76 (ultrapassa mínimo)
  // Para ve-los impresso: value.toLocaleString('fullwide', {useGrouping: false})
  return value <= Number.MAX_SAFE_INTEGER && value >= Number.MIN_SAFE_INTEGER;
}

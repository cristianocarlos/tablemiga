import {DEFAULT_EMPTY_CHAR, emptyChar, emptyCharWhenZero} from '@/utils/helper';
import {formatDate, formatDateHour} from '@/utils/luxonHelper';
import {formatCurrency, formatInteger, formatPhoneNumber} from '@/utils/masks';

import DateLogCell from './DateLogCell';
import HourCell from './HourCell';
import NameCell from './NameCell';

import type {TTablemigaColumnData} from '@/lib/types';
import type {TTableId} from '@/types/common';
import type {TDBValue} from '@/types/db-schema';

type TTableCol<GRowData> = {
  columnData: TTablemigaColumnData<GRowData>;
  columnValueId?: TTableId;
  value: TDBValue;
};

export default function TablemigaCol<GRowData>(props: TTableCol<GRowData>) {
  const {columnData, columnValueId, value} = props;

  const valueIsString = typeof value === 'string';
  const valueIsNumber = typeof value === 'number';
  const valueIsNumberOrString = typeof value === 'number' || typeof value === 'string';
  if (!value) return DEFAULT_EMPTY_CHAR;

  switch (columnData.type) {
    case 'currency':
      if (!valueIsNumberOrString) return emptyChar(value);
      return formatCurrency(value);
    case 'date':
      if (!valueIsString) return emptyChar(value);
      return formatDate(value);
    case 'dateHour':
      if (!valueIsString) return emptyChar(value);
      return formatDateHour(value);
    case 'dateLog': // Diferente do dateHour, só apresenta a hora no hint e o ano quando é diferente do atual
      if (!valueIsString) return emptyChar(value);
      return <DateLogCell value={value} />;
    case 'hour': // Diferente do dateHour, só apresenta o dia e ano quando diferentes do atual
      if (!valueIsString) return emptyChar(value);
      return <HourCell value={value} />;
    case 'integer':
      if (!valueIsNumber) return emptyChar(value);
      return emptyCharWhenZero(formatInteger(value));
    case 'name': {
      if (!valueIsString) return emptyChar(value);
      return <NameCell id={columnValueId} value={value} />;
    }
    case 'phoneNumber':
      if (!valueIsNumberOrString) return emptyChar(value);
      return formatPhoneNumber(value);
    default:
      return emptyChar(value);
  }
}

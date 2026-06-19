import {DEFAULT_EMPTY_CHAR} from '@/utils/helper';
import {format, formatDateHour, getLuxonNow, getYear, parseLuxon} from '@/utils/luxonHelper';

export default function HourCell({value}: {value: string}) {
  let formattedValue = DEFAULT_EMPTY_CHAR;
  let yearElement;
  let hint;
  const valueLuxon = parseLuxon(value);
  if (valueLuxon) {
    formattedValue = format('HH:mm', valueLuxon);
    const valueYear = getYear(valueLuxon);
    const currentYear = getYear(getLuxonNow());
    const isPreviousYear = valueYear !== currentYear;
    yearElement = (
      <div className={`day-month ${isPreviousYear ? 'is-previous-year' : ''}`}>
        {isPreviousYear ? format('dd/MM/yy', valueLuxon) : format('dd/MMM', valueLuxon)}
      </div>
    );
    hint = formatDateHour(valueLuxon);
  }
  return (
    <div title={hint}>
      {yearElement}
      {formattedValue}
    </div>
  );
}

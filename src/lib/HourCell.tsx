import {DEFAULT_EMPTY_CHAR} from '@/utils/helper';
import {format, formatDateHour, getLuxonNow, getYear, parseLuxon} from '@/utils/luxonHelper';

export default function HourCell({children}: {children: string}) {
  let formattedValue = DEFAULT_EMPTY_CHAR;
  let yearElement;
  let hint;
  const valueLuxon = parseLuxon(children);
  if (valueLuxon) {
    formattedValue = format('HH:mm', valueLuxon);
    const valueYear = getYear(valueLuxon);
    const currentYear = getYear(getLuxonNow());
    const isPreviousYear = valueYear !== currentYear;
    yearElement = (
      <div className={`text-[0.64em]`}>
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

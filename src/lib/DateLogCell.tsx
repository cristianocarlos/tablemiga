import {DEFAULT_EMPTY_CHAR} from '@/utils/helper';
import {format, formatDateHour, getLuxonNow, getYear, parseLuxon} from '@/utils/luxonHelper';

export default function DateLogCell({value}: {value: string}) {
  let formattedValue = DEFAULT_EMPTY_CHAR;
  let yearElement;
  let hint;
  const valueLuxon = parseLuxon(value);
  if (valueLuxon) {
    formattedValue = format('dd/MMM', valueLuxon);
    const valueYear = getYear(valueLuxon);
    const currentYear = getYear(getLuxonNow());
    if (valueYear !== currentYear) {
      yearElement = <span className="year">{valueYear}</span>;
    }
    hint = formatDateHour(valueLuxon);
  }
  return (
    <div title={hint}>
      {yearElement}
      {formattedValue}
    </div>
  );
}

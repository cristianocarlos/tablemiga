import type {DateObjectUnits, DateTime, DateTimeFormatOptions} from 'luxon';

export type TLuxonDateObjectUnits = DateObjectUnits;
export type TLuxonDateTimeFormatOptions = DateTimeFormatOptions;
export type TLuxonParam = Date | DateTime | null | number | string | undefined;
export type TLuxonValid = DateTime<true>;

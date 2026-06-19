import type {TDBValue} from '@/types/db-schema';

export type TFormattedDate = string;
export type TFormattedDateHour = string;

export type TLanguage = 'en' | 'es' | 'pt_BR';

export type TTableId = number;
export type TTableData<T = TDBValue> = {[columnName: string]: T};

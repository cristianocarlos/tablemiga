import type {TTableData, TTableId} from '@/types/common';
import type {TDBValue} from '@/types/db-schema';
import type {ReactNode} from 'react';

/** **********************************************
 * * *
 *********************************************** */

export type TTablemigaOptimizedWidths = {[p: string]: Array<number>};

export type TTablemigaColumnData<GRowData> = {
  columnKey:
    | '_custom_column_key0'
    | '_custom_column_key1'
    | '_custom_column_key2'
    | '_custom_column_key3'
    | '_custom_column_key4'
    | 'copy'
    | 'print'
    | 'update'
    | 'view'
    | keyof GRowData;
  id?: number | string; // Vem do servidor quando usa arrangement
  idKey?: keyof GRowData;
  label?: string;
  noWrap?: boolean;
  render?: (rowData: GRowData, rowDataId: TTableId) => ReactNode;
  type?:
    | 'currency'
    | 'date'
    | 'dateHour'
    | 'dateLog'
    | 'hour'
    | 'integer'
    | 'name'
    | 'phoneNumber'
    | 'text';
  width?: number;
};

export type TTablemigaColumnRows<GRowData> = Array<TTablemigaColumnData<GRowData>>;

export type TTablemigaRows = Array<TTableData>;
export type TTablemigaLabels = {[p: string]: string};

export type TTablemigaDataGridColumnData<GRowData> = {
  dataGridColumns: TTablemigaColumnRows<GRowData>;
  defaultDataGridColumns: TTablemigaColumnRows<GRowData>;
};

export type TTablemigaColumnRenderer<GRowData> = (params: {
  additionalRowData?: Partial<GRowData>;
  columnData: TTablemigaColumnData<GRowData>;
  rowData: GRowData;
  value: TDBValue;
}) => ReactNode;
export type TTablemigaAdditionalRowDataLoad<GRowData> = (params: {
  abortController: AbortController;
  rowData: GRowData;
  rowDataId: TTableId;
  setAdditionalRowData: (value: Partial<GRowData>) => void;
}) => void;

/** **********************************************
 * * *
 *********************************************** */

export type TTablemigaProps<GRowData> = {
  actionColumns: TTablemigaColumnRows<GRowData>;
  additionalRowDataLoad?: TTablemigaAdditionalRowDataLoad<GRowData>;
  arrangement?: {[p: string]: number};
  columnClassNameFn?: (params: {
    additionalRowData?: Partial<GRowData>;
    columnData: TTablemigaColumnData<GRowData>;
    rowData: GRowData;
  }) => string | undefined;
  columnRenderer?: (params: {
    additionalRowData?: Partial<GRowData>;
    columnData: TTablemigaColumnData<GRowData>;
    rowData: GRowData;
  }) => ReactNode;
  columns: TTablemigaColumnRows<GRowData>;
  idKey: keyof GRowData;
  labels?: TTablemigaLabels;
  rowClassNameFn?: (data: GRowData) => string | undefined;
  rows?: Array<GRowData>;
};

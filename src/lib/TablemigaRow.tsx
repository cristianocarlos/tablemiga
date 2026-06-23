import {useRef} from 'react';

import {shouldShowColumn} from '@/lib/Tablemiga';
import useTablemigaAdditionalRowData from '@/lib/useTablemigaAdditionalRowData';

import type {TTablemigaAdditionalRowDataLoad, TTablemigaColumnRenderer, TTablemigaProps} from '@/lib/types';
import type {TTableId} from '@/types/common';
import type {TDBValue} from '@/types/db-schema';

type TTableRow<GRowData> = {
  additionalRowDataLoad?: TTablemigaAdditionalRowDataLoad<GRowData>;
  allColumns: TTablemigaProps<GRowData>['columns'];
  arrangement?: TTablemigaProps<GRowData>['arrangement'];
  columnClassNameFn?: TTablemigaProps<GRowData>['columnClassNameFn'];
  columnRenderer: TTablemigaColumnRenderer<GRowData>;
  rowClassNameFn?: TTablemigaProps<GRowData>['rowClassNameFn'];
  rowData: GRowData;
  rowDataId: TTableId;
};

export default function TablemigaRow<GRowData>(props: TTableRow<GRowData>) {
  const {
    additionalRowDataLoad,
    allColumns,
    arrangement,
    columnClassNameFn,
    columnRenderer,
    rowClassNameFn,
    rowData,
    rowDataId,
  } = props;
  const refHtmlTableRow = useRef<HTMLTableRowElement>(null);

  const additionalRowData = useTablemigaAdditionalRowData({
    additionalRowDataLoad,
    refHtmlTableRow,
    rowData,
    rowDataId,
  });

  const className = rowClassNameFn?.(rowData) || '';
  return (
    <tr className={`${className} last:[&>td]:border-b-0`} ref={refHtmlTableRow}>
      {allColumns.map((columnData) => {
        if (!shouldShowColumn<GRowData>(columnData, arrangement)) return undefined;
        const style = {
          maxWidth: columnData.noWrap ? columnData.width : undefined, // Tem que ser maxWidth pra funcionar o nowrap
          width: columnData.noWrap ? undefined : columnData.width,
        };
        const value =
          rowData[columnData.columnKey as keyof typeof rowData] ||
          additionalRowData?.[columnData.columnKey as keyof typeof rowData];
        const fnClassName = columnClassNameFn?.({additionalRowData, columnData, rowData}) || '';
        return (
          <td
            className={`h-14 border-b border-b-gray-200 px-1 py-2 leading-tight first:pr-0 first:pl-0 ${fnClassName} ${columnData.noWrap ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''}`}
            key={String(columnData.columnKey)}
            style={style}
            title={columnData.noWrap && typeof value === 'string' ? value : undefined}
          >
            {typeof columnData.render === 'function'
              ? columnData.render(rowData, rowDataId)
              : columnRenderer({
                  additionalRowData,
                  columnData,
                  rowData,
                  value: value as TDBValue,
                })}
          </td>
        );
      })}
    </tr>
  );
}

import BackgroundFallback from '@/components/BackgroundFallback';
import TablemigaCol from '@/lib/TablemigaCol';
import TablemigaRow from '@/lib/TablemigaRow';
import {getIsMobile} from '@/utils/globals';
import YiiLang from '@/utils/yii-lang';

import type {TTablemigaColumnData, TTablemigaColumnRenderer, TTablemigaProps} from '@/lib/types';
import type {TTableData, TTableId} from '@/types/common';

export function rowInactiveClassNameHof<GRowData>(statusKey: keyof GRowData, inactiveValue: boolean | number | string) {
  return (data: GRowData) => {
    return data[statusKey as keyof typeof data] === inactiveValue ? 'opacity-50' : undefined;
  };
}

export function shouldShowColumn<GRowData>(
  columnData: TTablemigaColumnData<GRowData>,
  arrangement?: Record<string, number>,
) {
  return columnData.id && arrangement ? !!arrangement[columnData.id] : true;
}

export default function Tablemiga<GRowData = TTableData>(props: TTablemigaProps<GRowData>) {
  const {
    actionColumns,
    additionalRowDataLoad,
    arrangement,
    columnClassNameFn,
    columnRenderer: propColumnRenderer,
    columns,
    idKey,
    labels,
    rowClassNameFn,
    rows,
  } = props;

  let allColumns = actionColumns.concat(columns);
  if (getIsMobile()) {
    allColumns = [columns[0]].concat(actionColumns.reverse());
  }

  const columnRenderer: TTablemigaColumnRenderer<GRowData> = (params) => {
    const {additionalRowData, columnData, rowData, value} = params;
    const customElement = propColumnRenderer?.({additionalRowData, columnData, rowData});
    if (customElement) return customElement;
    let columnValueId;
    if (columnData.type === 'name') {
      const resolvedIdKey = columnData.idKey || idKey; // columnData.idKey para apresentar o id de uma coluna específica, sem ser do registro principal
      columnValueId = rowData[resolvedIdKey as keyof typeof rowData] as TTableId;
    }
    return <TablemigaCol<GRowData> columnData={columnData} columnValueId={columnValueId} value={value} />;
  };

  const rowRenderer = (rowData: GRowData) => {
    const rowDataId = rowData[idKey] as TTableId;
    return (
      <TablemigaRow
        additionalRowDataLoad={additionalRowDataLoad}
        allColumns={allColumns}
        arrangement={arrangement}
        columnClassNameFn={columnClassNameFn}
        columnRenderer={columnRenderer}
        key={rowDataId}
        rowClassNameFn={rowClassNameFn}
        rowData={rowData}
        rowDataId={rowDataId}
      />
    );
  };

  if (!rows) return <BackgroundFallback className="h-40" />;

  return (
    <div className={`mf__tablemiga`}>
      {rows.length === 0 ? (
        <div className="agg--message-smooth">{YiiLang.tablemiga('textNotFound')}</div>
      ) : (
        <div className="rounded-2xl bg-white px-8 py-2 shadow-lg max-sm:px-5 max-sm:py-1">
          <table className="w-full border-collapse bg-white">
            <thead className="max-sm:hidden">
              <tr>
                {allColumns.map((columnData) => {
                  if (!shouldShowColumn(columnData, arrangement)) return;
                  const style = {
                    maxWidth: columnData.width || undefined, // Tem que ter maxWidth pra funcionar o noWrap // 0 não deve ser considerado
                    whiteSpace: columnData.width ? 'nowrap' : undefined,
                  };
                  const resolvedColumnKey = String(columnData.columnKey); // é sempre string, mas por algum motivo não da pra dizer isso no keyof
                  return (
                    <td
                      className="tablemiga--no-wrap border-b-tablemiga--theme tablemiga--head-sticky h-14 border-b bg-white px-1 py-2 text-sm leading-tight font-medium text-gray-600 first:pr-0 first:pl-0"
                      key={resolvedColumnKey}
                      style={style}
                      title={labels?.[resolvedColumnKey]}
                    >
                      {labels?.[resolvedColumnKey]}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows?.map((rowData) => {
                return rowRenderer(rowData);
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import {useEffect, useState} from 'react';

import useInViewport from '@/lib/useInViewport';

import type {TTablemigaAdditionalRowDataLoad} from '@/lib/types';
import type {TTableId} from '@/types/common';
import type {RefObject} from 'react';

type TUseAppointmentAdditionalRowDataLoad<GRowData> = {
  additionalRowDataLoad?: TTablemigaAdditionalRowDataLoad<GRowData>;
  refHtmlTableRow: RefObject<HTMLTableRowElement | null>;
  rowData: GRowData;
  rowDataId: TTableId;
};

export default function useTablemigaAdditionalRowData<GRowData>({
  additionalRowDataLoad,
  refHtmlTableRow,
  rowData,
  rowDataId,
}: TUseAppointmentAdditionalRowDataLoad<GRowData>) {
  const [additionalRowData, setAdditionalRowData] = useState<Partial<GRowData>>();

  const isInViewport = useInViewport(refHtmlTableRow);

  // Não sei exatamente como, mas funciona usar só um abort controller
  // Será que ele manda o mesmo sinal pra todos e consegue cancelar tudo de uma vez?
  const abortController = new AbortController();

  // Essa cb só deve rodar na montagem do componente
  useEffect(() => {
    if (!isInViewport) return;
    if (!additionalRowDataLoad) return;
    additionalRowDataLoad({
      abortController,
      rowData,
      rowDataId,
      setAdditionalRowData,
    });
    return () => {
      abortController.abort();
    };
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [isInViewport]);

  return additionalRowData;
}

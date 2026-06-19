import {getLanguage} from '@/utils/globals';
const language = getLanguage();
type TYiiLangKeys = 'pt_BR';

const langTablemiga = {
  pt_BR: {
    textNotFound: 'Nenhum registro econtrado',
  },
};
type TYiiLangTablemigaMessageKey = keyof typeof langTablemiga.pt_BR;
const tablemiga = (messageKey: TYiiLangTablemigaMessageKey) =>
  langTablemiga[language as TYiiLangKeys]?.[messageKey] || '';

export default {tablemiga};

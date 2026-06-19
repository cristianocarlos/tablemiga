import type {TLanguage} from '@/types/common';

/**
 * É verdadeiro se o usuário estiver utilizando a aplicação em um dispositivo menor ou igual a 480px de largura ou se o
 * dispositivo estiver deitado e seu comprimento for menor ou igual a 896px.
 */
export function getIsMobile() {
  // 480 telefone mais largo, 896 telefone mais comprido, horizontal
  // iPhone XR: 414 x 896
  // Samsung Galaxy Note 5: 480 x 853
  if (typeof window === 'undefined') return;
  return window.innerWidth <= 480 || (window.innerWidth <= 896 && window.innerWidth > window.innerHeight);
}

export function getLanguage(): TLanguage {
  return (getWindowLocalStorage().getItem('language') || 'pt_BR') as TLanguage;
}

function getWindowLocalStorage() {
  return typeof window === 'undefined'
    ? ({
        getItem: (v) => v,
      } as Storage)
    : window.localStorage;
}

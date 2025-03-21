import type { Locale } from '@/i18n/routing';
import type { NamespaceKeys } from 'next-intl';

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string | number ? `${K}` | Join<K, Paths<T[K]>> : never;
    }[keyof T]
  : never;

declare namespace NextIntl {
  type Namespace<T extends Paths<IntlMessages>> = NamespaceKeys<IntlMessages, T>;
  type LocaleParams = { params: Promise<{ locale: Locale }> };
}

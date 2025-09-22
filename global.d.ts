import en from './messages/en.json';
import '@tanstack/react-table';

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  type IntlMessages = Messages;
}

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    style: {
      textAlign: 'left' | 'center' | 'right';
    };
  }
}

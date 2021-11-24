import { IItem } from '@/interfaces/IItem';

export interface IDataTableColumn {
  title?: string;
  visible?: boolean;
  sortKey?: string;
  slot?: string;
  sortable?: boolean;
  searchable?: boolean;
  cssClass?: string;
  inlineStyle?: any;
}

export interface IDataTableColumns {
  [key: string]: IDataTableColumn;
}

export interface IDataTableCell {
  column: string;
  value: any;
  visible: boolean;
  cssClass: string;
  inlineStyle: any;
  selected: boolean;
  slot?: string;
}

export interface IDataTableRowGroup {
  title?: string;
  rows: any[];
  recordCount: number;
}

export interface IDataTableRow {
  isGroupHeader?: boolean;
  recordCount?: number;
  primaryKeyValue: string | number;
  selected: boolean;
  cells: Array<IDataTableCell>;
}

export interface IDataTableBulkActionEvent {
  action: IItem;
  records: Array<any>;
  selectedAllRecords: boolean;
}

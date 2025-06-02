export interface BookmarkTab {
  name: string;
  id: string;
  fields: BookmarkField[];
}

export interface BookmarkField {
  field: string;
  label: string;
  icon: string;
}

export interface Wallet {
  name: string;
  url: string;
}

export type WalletsByCategory = Record<string, Wallet[]>;
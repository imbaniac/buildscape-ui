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
  logo?: string;
}

export type WalletsByCategory = Record<string, Wallet[]>;

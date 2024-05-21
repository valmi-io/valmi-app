export type TData = {
  ids: string[];
  entities: any;
};

export interface IParams {
  wid?: string;
  pid?: string;
  cid?: string;
  eid?: string;
}

export interface IButton {
  title: string;
  onClick: any;
  disabled: boolean;
}

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

export type TPromptSource = { id: string; name: string };

export type TPromptSchema = { id: string; name: string; sources: TPromptSource[] };

export type TPrompt = {
  id: string;
  name: string;
  gated?: boolean;
  package_id?: string;
  query?: string;
  schemas?: TPromptSchema[];
  spec?: any;
  table?: string;
  type: string;
  description: string;
  enabled: boolean;
};

export type TCatalogModes = 'etl' | 'retl';

export type TOAuthKeys = 'private' | 'public';

export type TCatalog = {
  display_name: string;
  docker_image: string;
  docker_tag: string;
  oauth?: boolean;
  type: string;
  oauth_keys?: TOAuthKeys;
  mode?: TCatalogModes[];
};

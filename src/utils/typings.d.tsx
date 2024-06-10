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

export interface TCatalog {
  display_name: string;
  docker_image: string;
  docker_tag: string;
  oauth?: boolean;
  type: string;
  oauth_keys?: TOAuthKeys;
  mode?: TCatalogModes[];
  connector_type?: string; // returns from credentials object.
  connections?: number;
}

export interface TCredential extends TCatalog {
  id: string;
  name: string;
  account: TAccount;
  connector_config: any;
}

export type TAccount = {
  id: string;
  name: string;
  external_id: string;
  meta_data: any;
  profile: string;
};

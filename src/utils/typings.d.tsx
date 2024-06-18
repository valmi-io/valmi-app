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
  type: string;
  description: string;
  filters: TPromptFilter[];
  operators: TPromptOperator;
  time_grain_enabled?: boolean;
  time_window_enabled?: boolean;
  time_grain?: null | string[];
};

// Interface for filter options
export interface TPromptFilter {
  db_column: string;
  display_column: string;
  column_type: string;
}

// Interface for operators
interface TPromptOperator {
  [key: string]: string[];
}

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
export interface TConnection {
  id: string;
  name: string;
  status: string;
  ui_state: any;
  schedule: Schedule;
  source: TConfiguredSource;
  destination: TConfiguredDestination;
}
export interface Schedule {
  run_interval: number;
}
export interface TConfiguredSource {
  id: string;
  name: string;
  catalog: TConfiguredSourceCatalog;
  credential: TCredential;
}

export interface TConfiguredSourceCatalog {
  streams: TConfiguredSourceStream[];
}

export interface TConfiguredSourceStream {
  stream: TSourceStream;
  sync_mode: string;
  primary_key: string[][];
  cursor_field: string[];
  destination_sync_mode: string;
}

export interface TSourceStream {
  name: string;
  json_schema: any;
  default_cursor_field?: string[];
  supported_sync_modes?: string[];
  source_defined_cursor?: boolean;
  source_defined_primary_key?: string[][];
}

export interface TConfiguredDestination {
  name: string;
  catalog: TConfiguredDestinationCatalog;
  id: string;
  credential: TCredential;
}
export interface TConfiguredDestinationCatalog {
  streams: TConfiguredDestinationStream[];
}
export interface TConfiguredDestinationStream {
  stream: TDestinationStream;
  sync_mode?: string;
  primary_key?: string[][];
  cursor_field?: string[];
  destination_sync_mode?: string;
}

export interface TDestinationStream {
  name: string;
  json_schema?: any;
  default_cursor_field?: string[];
  supported_sync_modes?: string[];
  source_defined_cursor?: boolean;
  source_defined_primary_key?: string[][];
}

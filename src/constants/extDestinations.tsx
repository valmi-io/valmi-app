export interface EventSourceType {
  display_name: string;
  type: string;
  icon: string;
}

type Destinations = {
  postgres: EventSourceType;
  snowflake: EventSourceType;
};

type Streams = {
  browser: EventSourceType;
};

export const extDestinations: Destinations = {
  postgres: {
    display_name: 'Postgres',
    type: 'postgres',
    icon: 'postgres'
  },
  snowflake: {
    display_name: 'Snowflake',
    type: 'snowflake',
    icon: 'snowflake'
  }
};

export const extStreams: Streams = {
  browser: {
    display_name: 'Browser',
    type: 'browser',
    icon: 'browser'
  }
};

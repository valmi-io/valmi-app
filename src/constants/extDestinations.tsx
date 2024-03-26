export interface EventSourceType {
  display_name: string;
  type: string;
  icon: string;
}

type Destinations = {
  postgres: EventSourceType;
  snowflake: EventSourceType;
  google_analytics: EventSourceType;
  facebook_conversions: EventSourceType;
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
  },
  google_analytics: {
    display_name: 'Google Analytics 4',
    type: 'ga4',
    icon: 'ga4'
  },
  facebook_conversions : {
    display_name: 'Facebook Conversions',
    type: 'facebook-conversions',
    icon: 'facebook-conversions'
  }
};

export const extStreams: Streams = {
  browser: {
    display_name: 'Browser',
    type: 'browser',
    icon: 'browser'
  }
};

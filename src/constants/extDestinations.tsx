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

type AnalyticsDestinations = {
  google_analytics: EventSourceType,
  facebook_conversions: EventSourceType
}

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

export const extAnalyticsDestinations: AnalyticsDestinations = {
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
}
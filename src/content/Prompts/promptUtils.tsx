import { TPromptSource } from '@/content/Prompts/PromptCard';

interface JsonSchema {
  $schema: string;
  type: string;
  required: string[];
  properties: {
    time_window: {
      type: string;
      properties: {
        label: {
          type: string;
          enum: string[];
        };
        range: {
          type: string;
          properties: {
            start: { type: string; format: string };
            end: { type: string; format: string };
          };
          required: string[];
        };
      };
      required: string[];
    };
    filters: {
      type: string;
      items: {
        anyOf: [
          {
            type: string;
            properties: {
              label: { type: string };
              name: { type: string };
              type: { type: string };
              value: { type: string };
              operator: { type: string; enum: string[] };
            };
            required: string[];
          },
          {
            type: string;
            properties: {
              label: { type: string };
              name: { type: string };
              type: { type: string };
              values: { type: string; items: { type: string } };
              operator: { type: string; enum: string[] };
            };
            required: string[];
          }
        ];
      };
    };
  };
}

export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['time_window'],
  properties: {
    time_window: {
      type: 'object',
      properties: {
        label: {
          type: 'string',
          enum: ['custom', 'Last 7 days', 'Last 15 days', 'Last 30 days', 'Last 60 days', 'Last 90 days']
        },
        range: {
          type: 'object',
          properties: {
            start: {
              type: 'string',
              format: 'date-time'
            },
            end: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['start', 'end']
        }
      },
      required: ['range']
    },
    filters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          name: { type: 'string', enum: ['title'] },
          // type: { type: 'string' },
          operator: { type: 'string', enum: ['=', '!='] },
          value: { type: 'string' }
        },

        required: ['label', 'name', 'value', 'operator']
      }
    }
  }
};

type TimeWindowType = { label: string; range: { start: string; end: string } };

type TPayloadIn = {
  schema: TPromptSource[];
  filters: {}[];
  time_window: TimeWindowType;
};

export type TPayloadOut = {
  schema_id: string;
  filters: {}[];
  time_window: TimeWindowType;
};

export const generatePreviewPayload = ({ schema, filters, time_window }: TPayloadIn) => {
  const payload: TPayloadOut = {
    schema_id: schema.length ? schema[0].id : '',

    filters: filters,
    time_window: time_window
  };

  return payload;
};

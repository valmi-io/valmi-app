import { TPromptSource } from '@/content/Prompts/Prompt';

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

export const schema: JsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['timeWindow', 'sourceId'],
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
        anyOf: [
          {
            type: 'object',
            properties: {
              label: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string' },
              value: { type: 'string' },
              operator: { type: 'string', enum: ['=', '!='] }
            },
            required: ['label', 'name', 'type', 'value', 'operator']
          },
          {
            type: 'object',
            properties: {
              label: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string' },
              values: { type: 'array', items: { type: 'string' } },
              operator: { type: 'string', enum: ['in', 'not in'] }
            },
            required: ['label', 'name', 'type', 'values', 'operator']
          }
        ]
      }
    }
  }
};

type TimeWindowType = { label: string; range: { start: string; end: string } };

type TPayloadIn = {
  sources: TPromptSource[];
  filters: {}[];
  time_window: TimeWindowType;
};

export type TPayloadOut = {
  source_id: string;
  filters: {}[];
  time_window: TimeWindowType;
};

export const generatePreviewPayload = ({ sources, filters, time_window }: TPayloadIn) => {
  const payload: TPayloadOut = {
    source_id: sources[0].id,
    filters: filters,
    time_window: time_window
  };

  return payload;
};

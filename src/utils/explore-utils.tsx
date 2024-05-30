import { generateAccountPayload } from '@/utils/account-utils';
import moment from 'moment';

export const generateExplorePayload = (
  wid: string,
  pid: string,
  user: any,
  schemaID: string,
  exploreName: string,
  filters: []
) => {
  return {
    workspaceId: wid,
    explore: {
      name: exploreName,
      prompt_id: pid,
      account: generateAccountPayload(user),
      schema_id: schemaID,
      time_window: {
        label: 'custom',
        range: {
          // 1 month range
          start: moment().subtract(1, 'months').toISOString(),
          end: moment().toISOString()
        }
      },
      filters: filters || []
    }
  };
};

const promptFilters = [
  { val: 7, name: 'Last 7 days' },
  { val: 15, name: 'Last 15 days' },
  { val: 30, name: 'Last 30 days' },
  { val: 90, name: 'Last 90 days' },
  { val: 60, name: 'Last 2 months' }
];

export const getPromptFilter = (filter: string) => {
  //@ts-ignore
  const { val } = promptFilters.find((item) => filter === item.name);

  return val;
};

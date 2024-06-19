import { generateAccountPayload } from '@/utils/account-utils';
import { TPrompt } from '@/utils/typings.d';

export const generateExplorePayload = (
  wid: string,
  pid: string,
  user: any,
  schemaID: string,
  timeWindow: string,
  timeGrain: string,
  filters: string,
  exploreName: string,
  prompt: TPrompt
) => {
  const { time_grain_enabled = false, time_window_enabled = false } = prompt;
  const parsedFilters = filters ? JSON.parse(filters) : [];
  const parsedTimeWindow = time_window_enabled ? (timeWindow ? JSON.parse(timeWindow) : {}) : {};
  const parsedTimeGrain = timeGrain ? JSON.parse(timeGrain) : 'day';

  const payload: any = {
    workspaceId: wid,
    explore: {
      name: exploreName,
      prompt_id: pid,
      account: generateAccountPayload(user),
      schema_id: schemaID,
      time_window: parsedTimeWindow,
      filters: parsedFilters
    }
  };
  if (time_grain_enabled) {
    payload.time_grain = parsedTimeGrain;
  }

  return payload;
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

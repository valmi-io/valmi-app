import { generateAccountPayload } from '@/utils/account-utils';

export const generateExplorePayload = (wid: string, pid: string, user: any) => {
  return {
    workspaceId: wid,
    explore: {
      name: '',
      prompt_id: pid,
      ready: false,
      account: generateAccountPayload(user),
      refresh_token:
        '1//04-3EPBsjabP3CgYIARAAGAQSNwF-L9IrD2d-9DGpUop1OA6QmCQ73eMBUQUpssfUfc3OfL3BtWxRaqAgs-nbIhJMFiFjH8gCK9k'
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

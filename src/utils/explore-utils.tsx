import { generateAccountPayload } from '@/utils/account-utils';

export const generateExplorePayload = (wid: string, pid: string, user: any) => {
  return {
    workspaceId: wid,
    explore: {
      name: '',
      prompt_id: pid,
      spreadsheet_url: 'https://www.abcd.com',
      ready: false,
      account: generateAccountPayload(user)
    }
  };
};

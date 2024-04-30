import { useSession } from 'next-auth/react';

export const useWorkspaceId = () => {
  const { data: session } = useSession();

  if (session) {
    //@ts-ignore
    return { workspaceId: session?.workspaceId ?? '' };
  } else {
    return { workspaceId: null };
  }
};

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useWorkspaceId = () => {
  const { data: session } = useSession();

  const [workspaceId, setWorkspaceId] = useState(null);
  // if (session) {
  //   //@ts-ignore
  //   return { workspaceId: session?.workspaceId ?? '' };
  // } else {
  //   return { workspaceId: null };
  // }

  useEffect(() => {
    if (session) {
      //@ts-ignore
      setWorkspaceId(session?.workspaceId ?? '');
    }
  }, [session]);

  return {
    workspaceId
  };
};

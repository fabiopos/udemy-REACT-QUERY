import jsonpatch from 'fast-json-patch';
import { useMutation, useQueryClient } from 'react-query';
import { queryKeys } from 'react-query/constants';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from './useUser';

async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): (newData: User | null) => void {
  const { user, updateUser } = useUser();
  const queryClient = useQueryClient();
  const toast = useCustomToast();
  const { mutate: patchUser } = useMutation(
    (newData: User) => patchUserOnServer(newData, user),
    {
      onMutate: async (newData: User | null) => {
        // cancel outgoing queries, so old server data
        // donesn't override out optimistic data
        queryClient.cancelQueries([queryKeys.user]);
        // snapshot prev user value
        const prevUserData: User = queryClient.getQueryData([queryKeys.user]);
        // optimistic update the cache with the new value
        updateUser(newData);
        // return that context (spanshot value)
        return { prevUserData };
      },
      onError: (error, newData, ctx) => {
        // take snapshot and rollback the cache to saved value
        if (ctx.prevUserData) {
          updateUser(ctx.prevUserData);
          toast({
            title: 'Update failied, rolling back previous user data',
            status: 'error',
          });
        }
      },
      onSuccess: (updatedUser: User | null) => {
        if (updateUser) {
          updateUser(updatedUser);
          toast({
            title: 'Your information has beed updated!',
            status: 'info',
          });
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries([queryKeys.user]);
      },
    },
  );

  return patchUser;
}

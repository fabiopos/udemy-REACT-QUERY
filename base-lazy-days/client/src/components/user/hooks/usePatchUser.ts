import { useCustomToast } from 'components/app/hooks/useCustomToast';
import jsonpatch from 'fast-json-patch';
import { useMutation } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
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
  const toast = useCustomToast();
  const { mutate: patchUser } = useMutation(
    (newData: User) => patchUserOnServer(newData, user),
    {
      onSuccess: (updatedUser: User | null) => {
        if (updateUser) {
          updateUser(updatedUser);
          toast({
            title: 'Your information has beed updated!',
            status: 'info',
          });
        }
      },
    },
  );

  return patchUser;
}

import { useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update return type
export function useCancelAppointment(): (appointment: Appointment) => void {
  const toast = useCustomToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (appmt: Appointment) => removeAppointmentUser(appmt),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.appointments]);
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === queryKeys.userAppointments &&
            !!query.queryKey[1],
        });
        toast.closeAll();
        toast({
          title: 'You cancelled a reservation',
          status: 'success',
        });
      },
    },
  );

  return mutate;
}

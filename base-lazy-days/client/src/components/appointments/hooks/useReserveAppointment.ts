import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';

async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useReserveAppointment(): UseMutateFunction<
  void,
  unknown,
  Appointment,
  unknown
> {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const toast = useCustomToast();
  const { mutate } = useMutation(
    (apmt: Appointment) => setAppointmentUser(apmt, user.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.appointments]);
        queryClient.invalidateQueries([queryKeys.userAppointments, user?.id]);
        toast.closeAll();
        toast({
          title: 'You have reserved the appointment!',
          status: 'success',
        });
      },
    },
  );

  return mutate;
}

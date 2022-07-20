/* eslint-disable no-console */
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { createQueryClientWrapper } from '../../../test-utils';
import { useStaff } from '../hooks/useStaff';

test('filter staff', async () => {
  // the magic happens here
  const { result, waitFor } = renderHook(() => useStaff(), {
    wrapper: createQueryClientWrapper(),
  });

  await waitFor(() => result.current.staff.length > 0);

  const beforeFilter = result.current.staff.length;
  expect(result.current.staff).toHaveLength(4);

  act(() => result.current.setFilter('scrub'));

  await waitFor(() => beforeFilter !== result.current.staff.length);

  expect(result.current.staff).toHaveLength(2);
});

import { render, screen } from '@testing-library/react';
import {
  generateTestQueryClient,
  getDefaultOptions,
  renderWithQueryClient,
} from 'test-utils';
import { rest } from 'msw';

// import { defaultQueryClientOptions } from '../../../react-query/queryClient';
import { server } from '../../../mocks/server';
// import { renderWithClient } from '../../../test-utils';
import { AllStaff } from '../AllStaff';
import { QueryClientProvider, setLogger } from 'react-query';

test('renders response from query', async () => {
  // write test here
  renderWithQueryClient(<AllStaff />);
  //
  const staffNames = await screen.findAllByRole('heading', {
    name: /Divya|Michael|Mateo|Sandra/i,
  });

  expect(staffNames).toHaveLength(4);
});

test('handles query error', async () => {
  // (re)set handler to return a 500 error for staff
  server.resetHandlers(
    rest.get('http://localhost:3030/staff', (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  setLogger({
    log: console.log,
    warn: console.log,
    error: () => {
      // empty fn
    },
  });

  const defaultOptions = getDefaultOptions();
  defaultOptions.defaultOptions.queries = {
    ...defaultOptions.defaultOptions.queries,
    retry: false,
  };
  const queryClient = generateTestQueryClient(defaultOptions);
  render(
    <QueryClientProvider client={queryClient}>
      <AllStaff />
    </QueryClientProvider>,
  );

  const alertToast = await screen.findByRole('alert');
  expect(alertToast).toHaveTextContent('Request failed with status code 500');
});

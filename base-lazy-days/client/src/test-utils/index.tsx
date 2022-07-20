/* eslint-disable no-console */
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';

import { defaultQueryClientOptions } from '../react-query/queryClient';

const generateTestQueryClient = () => {
  const { defaultOptions: baseOptions, ...rest } = defaultQueryClientOptions;
  const defaultOptions = {
    ...baseOptions,
    queries: { ...baseOptions.queries, retry: false },
  };
  return new QueryClient({ defaultOptions, ...rest });
};
// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks

setLogger({
  log: console.log,
  warn: console.log,
  error: () => {
    //
  },
});
export const renderWithQueryClient = (
  ui: ReactElement,
  client?: QueryClient,
): RenderResult => {
  const queryClient = client ?? generateTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

export const createQueryClientWrapper = (): React.FC => {
  const queryClient = generateTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

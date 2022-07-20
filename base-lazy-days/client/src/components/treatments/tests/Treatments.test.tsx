import { screen } from '@testing-library/react';

import { renderWithQueryClient } from '../../../test-utils';
import { Treatments } from '../Treatments';

test('renders response from query', async () => {
  // write test here
  renderWithQueryClient(<Treatments />);

  const treatmentTitle = await screen.findAllByRole('heading', {
    name: /massage|facial|scrub/i,
  });

  expect(treatmentTitle).toHaveLength(3);
});

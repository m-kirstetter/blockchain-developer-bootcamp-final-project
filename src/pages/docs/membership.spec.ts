import { render, RenderResult } from '@testing-library/vue';
import Membership from './membership.vue';

describe('Membership.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(Membership, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('membership-page');
  });
});

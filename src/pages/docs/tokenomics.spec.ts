import { render, RenderResult } from '@testing-library/vue';
import Tokenomics from './tokenomics.vue';

describe('Tokenomics.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(Tokenomics, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('tokenomics-page');
  });
});

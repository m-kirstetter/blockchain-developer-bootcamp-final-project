import { render, RenderResult } from '@testing-library/vue';
import Index from './index.vue';

describe('Index.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(Index, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getByText } = harness;

    getByText('Index');
  });
});

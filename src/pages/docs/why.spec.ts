import { render, RenderResult } from '@testing-library/vue';
import Why from './why.vue';

describe('Why.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(Why, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('why-page');
  });
});

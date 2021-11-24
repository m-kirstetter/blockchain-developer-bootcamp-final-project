import { render, RenderResult } from '@testing-library/vue';
import IndexDocs from './index.vue';

describe('Dao.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(IndexDocs, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('docs-page');
  });
});

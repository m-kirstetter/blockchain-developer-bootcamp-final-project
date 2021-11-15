import { render, RenderResult } from '@testing-library/vue';
import Dao from './dao.vue';

describe('Dao.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(Dao, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('dao-page');
  });
});

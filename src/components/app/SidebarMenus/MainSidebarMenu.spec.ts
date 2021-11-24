import { render, RenderResult } from '@testing-library/vue';
import MainSidebarMenu from './MainSidebarMenu.vue';

describe('MainSidebarMenu.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(MainSidebarMenu, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('main-sidebar');
  });
});

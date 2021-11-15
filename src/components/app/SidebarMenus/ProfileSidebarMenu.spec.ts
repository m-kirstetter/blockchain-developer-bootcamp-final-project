import { render, RenderResult } from '@testing-library/vue';
import ProfileSidebarMenu from './ProfileSidebarMenu.vue';

describe('ProfileSidebarMenu.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(ProfileSidebarMenu, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('profile-sidebar');
  });
});

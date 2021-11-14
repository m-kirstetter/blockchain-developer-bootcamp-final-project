import { render, RenderResult } from '@testing-library/vue';
import RoleModal from './RoleModal.vue';

describe('RoleModal.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(RoleModal, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getByText } = harness;

    getByText('RoleModal');
  });
});

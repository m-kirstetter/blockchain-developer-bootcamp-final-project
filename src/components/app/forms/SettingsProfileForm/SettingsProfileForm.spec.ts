import { render, RenderResult } from '@testing-library/vue';
import SettingsProfileForm from './SettingsProfileForm.vue';

describe('SettingsProfileForm.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(SettingsProfileForm, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getByText } = harness;

    getByText('SettingsProfileForm');
  });
});

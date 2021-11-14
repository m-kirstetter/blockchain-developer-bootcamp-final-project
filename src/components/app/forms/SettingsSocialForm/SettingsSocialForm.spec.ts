import { render, RenderResult } from '@testing-library/vue';
import SettingsSocialForm from './SettingsSocialForm.vue';

describe('SettingsSocialForm.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(SettingsSocialForm, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getByText } = harness;

    getByText('SettingsSocialForm');
  });
});

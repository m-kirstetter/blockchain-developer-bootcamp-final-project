import { render, RenderResult } from '@testing-library/vue';
import SettingsGeneralForm from './SettingsGeneralForm.vue';

describe('SettingsGeneralForm.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(SettingsGeneralForm, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getByText } = harness;

    getByText('SettingsGeneralForm');
  });
});

import { render, RenderResult } from '@testing-library/vue';
import CreateGigForm from './CreateGigForm.vue';

describe('CreateGigForm.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(CreateGigForm, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getByText } = harness;

    getByText('CreateGigForm');
  });
});

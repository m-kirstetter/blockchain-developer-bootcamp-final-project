import { GigFixture } from '@/fixtures/GigFixture';
import { render, RenderResult } from '@testing-library/vue';
import ApplyToGigForm from './ApplyToGigForm.vue';

describe('ApplyToGigForm.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(ApplyToGigForm, {
      stubs: ['nuxt-link'],
      props: {
        gig: GigFixture(),
      },
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('apply-to-gig-form');
  });
});

import { render, RenderResult } from '@testing-library/vue';
import ApplyToGigForm from './ApplyToGigForm.vue';

describe('ApplyToGigForm.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(ApplyToGigForm, {
      stubs: ['nuxt-link'],
      props: {
        gig: {
          _id: '1',
          budget: {
            _id: '1',
            min: 1,
            max: 10,
          },
          createdAt: 'string',
          updatedAt: 'string',
          title: 'title',
          description: 'description',
          details: 'details',
          skills: 'skills',
          owner: 'ownerId',
          status: 'Open',
        },
      },
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('apply-to-gig-form');
  });
});

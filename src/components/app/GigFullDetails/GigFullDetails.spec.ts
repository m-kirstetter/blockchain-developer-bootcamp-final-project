import { render, RenderResult } from '@testing-library/vue';
import GigFullDetails from './GigFullDetails.vue';

describe('GigFullDetails.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(GigFullDetails, {
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
        user: {
          _id: '1',
          address: 'address',
          bio: 'bio',
          createdAt: 'date',
          email: 'email',
          firstname: 'firstname',
          fullname: 'lastname',
          isEmailVerified: false,
          lastname: 'lastname',
          nonce: 1285764783,
          role: 'FREELANCER',
          updatedAt: 'date',
        },
      },
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('gig-full-details');
  });
});

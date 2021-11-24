import { GigFixture } from '@/fixtures/GigFixture';
import { UserFixture } from '@/fixtures/UserFixture';
import { render, RenderResult } from '@testing-library/vue';
import Vue from 'vue';
import moment from 'vue-moment';
import GigFullDetails from './GigFullDetails.vue';

Vue.use(moment);

describe('GigFullDetails.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(GigFullDetails, {
      stubs: ['nuxt-link'],
      props: {
        gig: GigFixture(),
        user: UserFixture(),
      },
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('gig-full-details');
  });
});

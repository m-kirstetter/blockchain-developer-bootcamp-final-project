import { ApplicationFixture } from '@/fixtures/ApplicationFixture';
import { GigFixture } from '@/fixtures/GigFixture';
import { UserFixture } from '@/fixtures/UserFixture';
import { render, RenderResult } from '@testing-library/vue';
import Vue from 'vue';
import moment from 'vue-moment';
import ApplicationCard from './ApplicationCard.vue';

Vue.use(moment);

describe('ApplicationCard.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(ApplicationCard, {
      stubs: ['nuxt-link'],
      props: {
        gig: GigFixture(),
        user: UserFixture(),
        application: ApplicationFixture(),
      },
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('application-card');
  });
});

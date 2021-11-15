import { render, RenderResult } from '@testing-library/vue';
import FreelancersDataTable from './FreelancersDataTable.vue';

describe('FreelancersDataTable.vue', () => {
  let harness: RenderResult;

  beforeEach(() => {
    harness = render(FreelancersDataTable, {
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getByText } = harness;

    getByText('FreelancersDataTable');
  });
});

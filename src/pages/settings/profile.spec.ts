import { render, RenderResult } from '@testing-library/vue';
import Vuex, { Store } from 'vuex';
import { IState } from '@/interfaces/IState';
import { AuthStoreModule } from '@/test/test-utils';
import Profile from './profile.vue';

describe('Settings.vue', () => {
  let store: Store<IState>;
  let harness: RenderResult;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        auth: AuthStoreModule,
      },
    } as any);

    harness = render(Profile, {
      mocks: {
        $nuxt: {
          context: {
            store,
          },
        },
      },
      stubs: ['nuxt-link'],
    });
  });

  test('renders component', () => {
    const { getAllByTestId } = harness;

    getAllByTestId('profile-page');
  });
});

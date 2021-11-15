import { render, RenderResult } from '@testing-library/vue';
import Vuex, { Store } from 'vuex';
import { IState } from '@/interfaces/IState';
import { AuthStoreModule } from '@/test/test-utils';
import SettingsProfileForm from './SettingsProfileForm.vue';

describe('SettingsProfileForm.vue', () => {
  let store: Store<IState>;
  let harness: RenderResult;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        auth: AuthStoreModule,
      },
    } as any);

    harness = render(SettingsProfileForm, {
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
    const { getByText } = harness;

    getByText('Save Profile');
  });
});

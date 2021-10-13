import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Vuelidate from "vuelidate";
import { BootstrapVue } from "bootstrap-vue";
import PostGig from "~/components/modals/PostGig.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Vuelidate);
localVue.use(BootstrapVue);

describe("PostGig", () => {
  let actions;
  let state;
  let store;

  beforeEach(() => {
    actions = {
      actionClick: jest.fn(),
      actionInput: jest.fn()
    };
    state = {
      postGig: {
        show: false,
        data: {}
      }
    };
    store = new Vuex.Store({
      modules: {
        modals: {
          namespaced: true,
          actions,
          state
        }
      }
    });
  });

  test("is a Vue instance", () => {
    const wrapper = shallowMount(PostGig, { store, localVue });
    expect(wrapper.vm).toBeTruthy();
  });

  test("is showing postGig modal", () => {
    state.postGig.show = true;
    const wrapper = shallowMount(PostGig, { store, localVue });
    expect(wrapper.find("#postGig").exists()).toBe(true);
  });
});

import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Vuelidate from "vuelidate";
import { BootstrapVue } from "bootstrap-vue";
import SubmitWork from "@/components/modals/SubmitWork.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Vuelidate);
localVue.use(BootstrapVue);

describe("SubmitWork", () => {
  let actions;
  let state;
  let store;

  beforeEach(() => {
    actions = {
      actionClick: jest.fn(),
      actionInput: jest.fn()
    };
    state = {
      submitWork: {
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
    const wrapper = shallowMount(SubmitWork, { store, localVue });
    expect(wrapper.vm).toBeTruthy();
  });

  test("is showing submitWork modal", () => {
    state.submitWork.show = true;
    const wrapper = shallowMount(SubmitWork, { store, localVue });
    expect(wrapper.find("#submitWork").exists()).toBe(true);
  });
});

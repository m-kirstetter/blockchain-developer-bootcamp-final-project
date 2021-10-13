import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Vuelidate from "vuelidate";
import { BootstrapVue } from "bootstrap-vue";
import PostGigButton from "~/components/PostGigButton.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Vuelidate);
localVue.use(BootstrapVue);

describe("PostGigButton", () => {
  let actionsModals;
  let stateEthers;
  let store;

  beforeEach(() => {
    actionsModals = {
      openPostGigModal: jest.fn()
    };
    stateEthers = {
      connected: false
    };
    store = new Vuex.Store({
      modules: {
        ethers: {
          namespaced: true,
          state: stateEthers
        },
        modals: {
          namespaced: true,
          actions: actionsModals
        }
      }
    });
  });

  test("is a Vue instance", () => {
    const wrapper = shallowMount(PostGigButton, { store, localVue });
    expect(wrapper.vm).toBeTruthy();
  });

  test("it should show button as disabled if user disconnected", () => {
    const wrapper = shallowMount(PostGigButton, { store, localVue });
    expect(wrapper.find("#button-post-gig").attributes("disabled")).toBe(
      "true"
    );
  });

  test("it should show button tooltip if user disconnected", () => {
    const wrapper = shallowMount(PostGigButton, { store, localVue });
    expect(wrapper.find("#tooltip-disconnected").exists()).toBe(true);
  });

  test("it should not show button as disabled if user connected", () => {
    stateEthers.connected = true;
    const wrapper = shallowMount(PostGigButton, { store, localVue });
    expect(wrapper.find("#button-post-gig").attributes("disabled")).toBe(
      undefined
    );
  });

  test("it should not show button tooltip if user connected", () => {
    stateEthers.connected = true;
    const wrapper = shallowMount(PostGigButton, { store, localVue });
    expect(wrapper.find("#tooltip-disconnected").exists()).toBe(false);
  });

  test("it should open post gig modal if button click", () => {
    stateEthers.connected = true;
    const wrapper = shallowMount(PostGigButton, { store, localVue });
    wrapper.find("#button-post-gig").trigger("click");
    expect(actionsModals.openPostGigModal).toHaveBeenCalled();
  });
});

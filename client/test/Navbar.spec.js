import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Vuelidate from "vuelidate";
import { BootstrapVue } from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/components/Navbar.vue";

library.add(faWallet);
library.add(faPowerOff);

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Vuelidate);
localVue.use(BootstrapVue);

describe("Navbar", () => {
  let actions;
  let state;
  let store;

  beforeEach(() => {
    actions = {
      handler: () => {},
      init: jest.fn(),
      disconnect: jest.fn(),
    };
    state = {
      connected: false,
      user: "", // 0xcB49CEDB000Db856aa56038EF4fd09704e2d617b
    };
    store = new Vuex.Store({
      modules: {
        ethers: {
          namespaced: true,
          actions,
          state,
        },
      },
    });
  });

  test("is a Vue instance", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  test("is Navbar component", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon },
    });
    expect(wrapper.findComponent(Navbar).exists()).toBe(true);
  });

  test("it contains Smart Gig text", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon },
    });
    expect(wrapper.find("#navbar-brand").text()).toContain("Smart Gig");
  });

  test("it should show button connect by default", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon },
    });
    expect(wrapper.find("#button-connect").text()).toContain("Connect");
  });

  test("it should call connect method on connect button click", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon },
    });
    wrapper.find("#button-connect").trigger("click");
    expect(actions.init).toHaveBeenCalled();
  });

  test("it should show button disconnect if user connected", () => {
    state.connected = true;
    state.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon },
    });
    expect(wrapper.find("#button-disconnect").exists()).toBe(true);
  });

  test("it should show button disconnect text as user address truncated", () => {
    state.connected = true;
    state.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon },
    });
    expect(wrapper.find("#button-disconnect").text()).toContain(
      "0xcB49 .... 2d617b"
    );
  });

  test("it should call disconnect method on disconnect button click", () => {
    state.connected = true;
    state.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon },
    });
    wrapper.find("#button-disconnect").trigger("click");
    expect(actions.disconnect).toHaveBeenCalled();
  });
});

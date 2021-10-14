import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Vuelidate from "vuelidate";
import { BootstrapVue } from "bootstrap-vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import Navbar from "~/components/Navbar.vue";

library.add(faWallet);
library.add(faPowerOff);

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Vuelidate);
localVue.use(BootstrapVue);

describe("Navbar", () => {
  let ethersActions;
  let ethersState;
  let appActions;
  let appState;
  let store;

  beforeEach(() => {
    ethersActions = {
      handler: () => {},
      walletConnect: jest.fn(),
      disconnect: jest.fn()
    };
    ethersState = {
      connected: false,
      user: "", // 0xcB49CEDB000Db856aa56038EF4fd09704e2d617b
      loading: false
    };
    appActions = {
      handler: () => {},
      resetGigs: jest.fn()
    };
    appState = {
      loading: false
    };
    store = new Vuex.Store({
      modules: {
        ethers: {
          namespaced: true,
          actions: ethersActions,
          state: ethersState
        },
        app: {
          namespaced: true,
          actions: appActions,
          state: appState
        }
      }
    });
  });

  test("is a Vue instance", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon }
    });
    expect(wrapper.vm).toBeTruthy();
  });

  test("is Navbar component", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon }
    });
    expect(wrapper.findComponent(Navbar).exists()).toBe(true);
  });

  test("it contains Smart Gig text", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon }
    });
    expect(wrapper.find("#navbar-brand").text()).toContain("Smart Gig");
  });

  test("it should show button connect by default", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon }
    });
    expect(wrapper.find("#button-connect").text()).toContain("Connect");
  });

  test("it should call connect method on connect button click", () => {
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon }
    });
    wrapper.find("#button-connect").trigger("click");
    expect(ethersActions.walletConnect).toHaveBeenCalled();
  });

  test("it should show button disconnect if user connected", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon }
    });
    expect(wrapper.find("#button-disconnect").exists()).toBe(true);
  });

  test("it should show button disconnect text as user address truncated", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon }
    });
    expect(wrapper.find("#button-disconnect").text()).toContain(
      "0xcB49 .... 2d617b"
    );
  });

  test("it should call disconnect method on disconnect button click", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    const wrapper = shallowMount(Navbar, {
      store,
      localVue,
      stubs: { FontAwesomeIcon }
    });
    wrapper.find("#button-disconnect").trigger("click");
    expect(ethersActions.disconnect).toHaveBeenCalled();
  });
});

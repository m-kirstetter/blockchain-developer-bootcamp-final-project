import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Vuelidate from "vuelidate";
import { BootstrapVue } from "bootstrap-vue";
import Gigs from "@/components/Gigs.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Vuelidate);
localVue.use(BootstrapVue);

describe("Gigs", () => {
  let appActions;
  let modalsActions;
  let appState;
  let ethersState;
  let store;

  beforeEach(() => {
    appActions = {
      enroll: jest.fn(),
    };
    modalsActions = {
      openSubmitWorkModal: jest.fn(),
    };
    appState = {
      gigsCount: "0",
      const: {
        gigStatusMappingKeys: {
          0: "registered",
          1: "open",
          2: "review",
          3: "awarded",
        },
      },
      gigs: [
        // {
        //   id: 0,
        //   name: "Gig Name",
        //   compensation: "1000000000000000000",
        //   status: "open",
        //   owner: "Ox",
        //   freelancersNumber: "1",
        //   freelancers: [],
        //   worksSubmitted: "0",
        //   works: [],
        //   awardedTo: "Ox",
        // }
      ],
    };
    ethersState = {
      user: ""
    }
    store = new Vuex.Store({
      modules: {
        app: {
          namespaced: true,
          actions: appActions,
          state: appState,
        },
        ethers: {
          namespaced: true,
          state: ethersState,
        },
        modals: {
          namespaced: true,
          actions: modalsActions,
        },
      },
    });
  });

  test("is a Vue instance", () => {
    const wrapper = shallowMount(Gigs, { store, localVue });
    expect(wrapper.vm).toBeTruthy();
  });

  test("is showing no gigs by default", () => {
    const wrapper = shallowMount(Gigs, { store, localVue });
    expect(wrapper.find("#no-gigs-placeholder").exists()).toBe(true);
  });

  test("is showing gigs if store holds gigs", () => {
    appState.gigs = [
      {
        id: 1,
        name: "Gig Name",
        compensation: "1000000000000000000",
        status: "open",
        owner: "Ox000000000000000000000",
        freelancersNumber: "1",
        freelancers: [],
        worksSubmitted: "0",
        works: [],
        awardedTo: "Ox000000000000000000000",
      }
    ];
    const wrapper = shallowMount(Gigs, { store, localVue });
    expect(wrapper.find("#gigs-list").exists()).toBe(true);
  });
});

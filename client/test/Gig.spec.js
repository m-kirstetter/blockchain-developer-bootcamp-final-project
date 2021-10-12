import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Vuelidate from "vuelidate";
import { BootstrapVue } from "bootstrap-vue";
import Gig from "@/components/Gig.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Vuelidate);
localVue.use(BootstrapVue);

describe("Gig", () => {
  let ethersState;
  let store;
  let propsData;

  const variants = {
    registered: "info",
    open: "success",
    review: "warning",
    awarded: "dark",
  };

  beforeEach(() => {
    propsData = {
      gig: {
        id: 1,
        name: "Gig Name",
        compensation: "1000000000000000000",
        status: "registered",
        owner: "Ox000000000000000000000",
        freelancersNumber: "1",
        freelancers: [],
        worksSubmitted: "0",
        works: [],
        awardedTo: "Ox000000000000000000000",
      },
      status: {
        name: "Registered",
        variant: variants.registered,
      },
    };
    ethersState = {
      user: "",
      connected: false,
    };
    store = new Vuex.Store({
      modules: {
        ethers: {
          namespaced: true,
          state: ethersState,
        },
      },
    });
  });

  test("is a Vue instance", () => {
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.vm).toBeTruthy();
  });

  test("is showing badge status name text", () => {
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.find(`#status-badge-${propsData.gig.id}`).text()).toContain(
      propsData.status.name
    );
  });

  test("is showing gig name as title", () => {
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.find(`#gig-title-${propsData.gig.id}`).text()).toContain(
      propsData.gig.name
    );
  });

  test("is showing gig owner", () => {
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.find(`#gig-owner-${propsData.gig.id}`).text()).toContain(
      propsData.gig.owner
    );
  });

  test("is not showing gig actions if user not connected", () => {
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.find(`#gig-actions-${propsData.gig.id}`).exists()).toBe(
      false
    );
  });

  test("is showing gig actions if user connected", () => {
    ethersState.connected = true;
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.find(`#gig-actions-${propsData.gig.id}`).exists()).toBe(
      true
    );
  });

  test("is showing gig freelancers stats if gig status is registered", () => {
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.find(`#gig-freelancers-${propsData.gig.id}`).exists()).toBe(
      true
    );
  });

  test("is showing gig works stats if gig status is open", () => {
    propsData.gig.status = "open";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.find(`#gig-works-${propsData.gig.id}`).exists()).toBe(true);
  });

  test("is showing gig works stats if gig status is review", () => {
    propsData.gig.status = "review";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.find(`#gig-works-${propsData.gig.id}`).exists()).toBe(true);
  });

  test("is showing gig works stats if gig status is awarded", () => {
    propsData.gig.status = "awarded";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(wrapper.find(`#gig-works-${propsData.gig.id}`).exists()).toBe(true);
  });

  test("is showing enroll button if gig is registered", () => {
    ethersState.connected = true;
    propsData.gig.status = "registered";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(
      wrapper.find(`#gig-enroll-button-${propsData.gig.id}`).exists()
    ).toBe(true);
  });

  test("is not showing enroll button if user already enrolled", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    propsData.gig.status = "registered";
    propsData.gig.freelancersNumber = "5";
    propsData.gig.freelancers.push(
      "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b"
    );
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(
      wrapper.find(`#gig-enroll-button-${propsData.gig.id}`).exists()
    ).toBe(false);
  });

  test("is not showing enroll button if user is gig owner", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    propsData.gig.status = "registered";
    propsData.gig.owner = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    propsData.gig.freelancersNumber = "5";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(
      wrapper.find(`#gig-enroll-button-${propsData.gig.id}`).exists()
    ).toBe(false);
  });

  test("is showing submit work button if gig status is open", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    propsData.gig.freelancers.push(
      "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b"
    );
    propsData.gig.status = "open";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(
      wrapper.find(`#gig-submit-work-button-${propsData.gig.id}`).exists()
    ).toBe(true);
  });

  test("is not showing submit work button if user is not enrolled", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    propsData.gig.status = "open";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(
      wrapper.find(`#gig-submit-work-button-${propsData.gig.id}`).exists()
    ).toBe(false);
  });

  test("is not showing submit work button if work is already submitted", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    propsData.gig.freelancers.push(
      "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b"
    );
    propsData.gig.works.push("0xcB49CEDB000Db856aa56038EF4fd09704e2d617b");
    propsData.gig.status = "open";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(
      wrapper.find(`#gig-submit-work-button-${propsData.gig.id}`).exists()
    ).toBe(false);
  });

  test("is not showing submit work button if gig status is registered", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    propsData.gig.freelancers.push(
      "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b"
    );
    propsData.gig.status = "registered";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(
      wrapper.find(`#gig-submit-work-button-${propsData.gig.id}`).exists()
    ).toBe(false);
  });

  test("is not showing submit work button if gig status is review", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    propsData.gig.freelancers.push(
      "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b"
    );
    propsData.gig.status = "review";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(
      wrapper.find(`#gig-submit-work-button-${propsData.gig.id}`).exists()
    ).toBe(false);
  });

  test("is not showing submit work button if gig status is awarded", () => {
    ethersState.connected = true;
    ethersState.user = "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b";
    propsData.gig.freelancers.push(
      "0xcB49CEDB000Db856aa56038EF4fd09704e2d617b"
    );
    propsData.gig.status = "awarded";
    const wrapper = shallowMount(Gig, { store, localVue, propsData });
    expect(
      wrapper.find(`#gig-submit-work-button-${propsData.gig.id}`).exists()
    ).toBe(false);
  });
});

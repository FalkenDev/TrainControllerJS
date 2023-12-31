import { describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import Home from "../components/Home.vue";
vi.mock("socket.io-client", async () => {
  const actual = await vi.importActual("socket.io-client");
  return {
    ...actual,
    io: vi.fn().mockReturnValue({
      on: vi.fn(),
    }),
  };
});

vi.mock("leaflet", () => ({
  default: {
    map: vi.fn().mockReturnValue({
      setView: vi.fn(),
      invalidateSize: vi.fn(),
    }),
    tileLayer: vi.fn().mockReturnValue({
      addTo: vi.fn(),
    }),
    divIcon: vi.fn(),
  },
}));

describe("Home", () => {
  it("should always display TripList component", () => {
    const wrapper = mount(Home);

    expect(wrapper.findComponent({ name: "TripList" }).exists()).toBe(true);
  });

  it("should display Map component by default", async () => {
    const wrapper = mount(Home);
    // await wrapper.setData({ showDetails: false });
    expect(wrapper.findComponent({ name: "Map" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "TrainDetails" }).exists()).toBe(
      false,
    );
  });

  it("should display TrainDetails component when showDetails is true", async () => {
    const mockAuth = {
      isAuthenticated: ref(true),
    };

    const wrapper = mount(Home, {
      global: {
        provide: {
          auth: mockAuth,
        },
      },
    });

    wrapper.vm.displayTrue();
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: "TrainDetails" }).exists()).toBe(true);
  });
});

import { mount } from "@vue/test-utils";
import Home from "../components/Home.vue";
import { nextTick } from "vue";
import { train_api } from "../models/trains.js";
jest.mock("../models/trains.js");

describe("Home.vue", () => {
  // Mock API response
  const delayedTrainObj = {
    ActivityId: "5481ef7a-a80a-5183-80a5-1bffd8621be4",
    ActivityType: "Avgang",
    AdvertisedTimeAtLocation: "2023-09-11T21:35:00.000+02:00",
    AdvertisedTrainIdent: "5771",
    Canceled: false,
    EstimatedTimeAtLocation: "2023-09-11T21:48:19.000+02:00",
    LocationSignature: "Lustån",
    OperationalTrainNumber: "65771",
  };

  const code = {
    Code: "ANA002",
    Level1Description: "Avvikelse",
    Level2Description: "Nationell",
    Level3Description: "Bakre tåg",
  };
  beforeEach(() => {
    train_api.fetchDelayedTrains.mockResolvedValue({ data: [delayedTrainObj] });
    train_api.fetchCodes.mockResolvedValue({
      data: [code],
    });
  });

  it("fetches and displays delayed trains correctly on mount", async () => {
    const wrapper = mount(Home);

    await nextTick();

    expect(wrapper.vm.delayedTrains).toEqual([delayedTrainObj]);
    expect(wrapper.find(".some-delayed-train-class").text()).toContain("65771"); // Replace '.some-delayed-train-class' with the actual class or identifier you use for displaying delayed trains
  });

  it("toggles details correctly", async () => {
    const wrapper = mount(Home);
    await nextTick();

    expect(wrapper.vm.showDetails).toBe(false);

    await wrapper.vm.displayTrue();

    expect(wrapper.vm.showDetails).toBe(true);

    await wrapper.vm.displayFalse();

    expect(wrapper.vm.showDetails).toBe(false);
  });

  it("sets inspect train correctly", async () => {
    const wrapper = mount(Home);
    await nextTick();

    expect(wrapper.vm.inspectTrain).toEqual({});

    const train = { name: "Train 1" };

    await wrapper.vm.setInspectTrain(train);

    expect(wrapper.vm.inspectTrain).toEqual(train);
  });
});

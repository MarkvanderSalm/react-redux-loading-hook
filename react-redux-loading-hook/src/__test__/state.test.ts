import {
  LoadingState,
  loadingStateReducer,
  registerLoadingModuleCreator,
  setLoadingStateCreator,
} from "../state";
import { LoadingModuleData } from "../types";

describe("action creators", () => {
  it("create a correct set loading state action", () => {
    const actionNames = ["start:finish:error"];
    const expectedAction = {
      type: "loadingState/set",
      payload: {
        actionNames,
        isLoading: true,
      },
    };

    expect(setLoadingStateCreator(actionNames, true)).toEqual(expectedAction);
  });

  it("create a correct register loading module action", () => {
    const moduleData: LoadingModuleData = {
      name: "test",
      actionTriplets: [["start", "finish", "error"]],
    };

    const expectedAction = {
      type: "loadingState/registerModule",
      payload: moduleData,
    };

    expect(registerLoadingModuleCreator(moduleData)).toEqual(expectedAction);
  });
});

describe("set loading state", () => {
  const existingState: LoadingState = {
    registeredLoadingModules: ["test"],
    actionTriplets: {
      "start:finish:error": false,
      "start2:finish2:error2": false,
    },
    startActions: ["start", "start2"],
    finishActions: ["finish", "finish2"],
    errorActions: ["error", "error2"],
  };

  const state: LoadingState = loadingStateReducer(
    existingState,
    setLoadingStateCreator(["start:finish:error"], true)
  );

  it("correctly sets loading state", () => {
    expect(state.actionTriplets["start:finish:error"]).toEqual(true);
  });

  it("does not alter other loading state", () => {
    expect(state.actionTriplets["start2:finish2:error2"]).toEqual(false);
  });
});

describe("register loading module", () => {
  const existingState: LoadingState = {
    registeredLoadingModules: ["test"],
    actionTriplets: {
      "start:finish:error": false,
    },
    startActions: ["start"],
    finishActions: ["finish"],
    errorActions: ["error"],
  };

  const moduleData: LoadingModuleData = {
    name: "test",
    actionTriplets: [
      ["start", "finish", "error"],
      ["start2", "finish2", "error2"],
    ],
  };

  const state: LoadingState = loadingStateReducer(
    existingState,
    registerLoadingModuleCreator(moduleData)
  );

  it("registers the loading module's name", () => {
    expect(state.registeredLoadingModules).toContain(moduleData.name);
  });

  it("registers the start actions", () => {
    expect(state.startActions).toContain(moduleData.actionTriplets[0][0]);
  });

  it("registers the finish actions", () => {
    expect(state.finishActions).toContain(moduleData.actionTriplets[0][1]);
  });

  it("registers the error actions", () => {
    expect(state.errorActions).toContain(moduleData.actionTriplets[0][2]);
  });

  it("does not register the same action multiple times", () => {
    const startCount = state.startActions.reduce((prev, cur) => {
      return cur === "start" ? prev + 1 : prev;
    }, 0);

    const finishCount = state.finishActions.reduce((prev, cur) => {
      return cur === "finish" ? prev + 1 : prev;
    }, 0);

    const errorCount = state.errorActions.reduce((prev, cur) => {
      return cur === "error" ? prev + 1 : prev;
    }, 0);

    expect(startCount).toBe(1);
    expect(finishCount).toBe(1);
    expect(errorCount).toBe(1);
  });

  it("registers the action triplet", () => {
    expect(state.actionTriplets).toHaveProperty("start2:finish2:error2");
  });
});

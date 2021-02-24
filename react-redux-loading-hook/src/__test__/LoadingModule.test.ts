import { LoadingModule } from "../types";

it("cannot have an empty name", () => {
  expect(
    () =>
      new LoadingModule({
        name: "",
        actionTriplets: [["", "", ""]],
      })
  ).toThrow();
});

it("cannot have action triplets with empty error actions", () => {
  expect(
    () =>
      new LoadingModule({
        name: "test",
        actionTriplets: [["start", "finish"]],
      })
  ).toThrow();
});

it("falls back on global default error action", () => {
  LoadingModule.defaultErrorAction = "error";

  expect(
    new LoadingModule({
      name: "test",
      actionTriplets: [["start", "finish"]],
    }).actionTriplets[0][2]
  ).toBe("error");

  LoadingModule.defaultErrorAction = undefined;
});

it("falls back on default error action", () => {
  expect(
    new LoadingModule({
      name: "test",
      actionTriplets: [["start", "finish"]],
      defaultErrorAction: "error",
    }).actionTriplets[0][2]
  ).toBe("error");
});

it("returns data", () => {
  const module = new LoadingModule({
    name: "test",
    actionTriplets: [
      ["start", "finish", "error"],
      ["start2", "finish2"],
    ],
    defaultErrorAction: "error2",
  });

  expect(module.data).toEqual({
    name: "test",
    actionTriplets: [
      ["start", "finish", "error"],
      ["start2", "finish2", "error2"],
    ],
  });
});

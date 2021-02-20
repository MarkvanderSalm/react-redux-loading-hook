import { AnyAction, Middleware } from "redux";
import { LoadingState, setLoadingStateCreator } from "./state";
import { GetLoadingStateSelector } from "./types/GetLoadingStateSelector";

export const createLoadingMiddleware = (selector: GetLoadingStateSelector) => {
  const loadingMiddleware: Middleware = (store) => (next) => (
    action: AnyAction
  ) => {
    const loadingState: LoadingState = selector(store.getState());

    const isStart =
      loadingState.startActions.find((a) => a === action.type) !== undefined;
    const isFinish =
      loadingState.finishActions.find((a) => a === action.type) !== undefined;
    const isError =
      loadingState.errorActions.find((a) => a === action.type) !== undefined;

    if (!isStart && !isFinish && !isError) return next(action);

    if (Number(isStart) + Number(isFinish) + Number(isError) > 1)
      throw new Error(
        `An action can only be registered as one type: start, finish, or error. Check your loading modules and make sure the "${action.type}" action is only used as either a start, finish, or error type.`
      );

    const allActionTripletNames = Object.keys(loadingState.actionTriplets);

    if (isStart) {
      const startActionNames = allActionTripletNames.filter(
        (atn) => atn.split(":")[0] === action.type
      );

      store.dispatch(setLoadingStateCreator(startActionNames, true));
    } else if (isFinish) {
      const finishActionNames = allActionTripletNames.filter(
        (atn) => atn.split(":")[1] === action.type
      );

      store.dispatch(setLoadingStateCreator(finishActionNames, false));
    } else if (isError) {
      const errorActionNames = allActionTripletNames.filter(
        (atn) => atn.split(":")[2] === action.type
      );

      store.dispatch(setLoadingStateCreator(errorActionNames, false));
    }

    return next(action);
  };

  return loadingMiddleware;
};

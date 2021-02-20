import { LoadingModuleData } from "./types";

enum LoadingStateActionTypes {
  SET_LOADING_STATE = "loadingState/set",
  REGISTER_LOADING_MODULE = "loadingState/registerModule",
}

interface SetLoadingState {
  payload: {
    actionNames: string[];
    isLoading: boolean;
  };
  type: LoadingStateActionTypes.SET_LOADING_STATE;
}

export const setLoadingStateCreator = (
  actionNames: string[],
  isLoading: boolean
): SetLoadingState => ({
  payload: {
    actionNames,
    isLoading,
  },
  type: LoadingStateActionTypes.SET_LOADING_STATE,
});

interface RegisterLoadingModule {
  payload: LoadingModuleData;
  type: LoadingStateActionTypes.REGISTER_LOADING_MODULE;
}

export const registerLoadingModuleCreator = (
  module: LoadingModuleData
): RegisterLoadingModule => ({
  payload: module,
  type: LoadingStateActionTypes.REGISTER_LOADING_MODULE,
});

type LoadingStateActions = SetLoadingState | RegisterLoadingModule;

type ActionTriplets = {
  [actionTripletName: string]: boolean;
};

export type LoadingState = {
  registeredLoadingModules: string[];
  actionTriplets: ActionTriplets;
  startActions: string[];
  finishActions: string[];
  errorActions: string[];
};

const initialState: LoadingState = {
  registeredLoadingModules: [],
  actionTriplets: {},
  startActions: [],
  finishActions: [],
  errorActions: [],
};

export const loadingStateReducer = (
  state: LoadingState = initialState,
  action: LoadingStateActions
) => {
  if (action.type === LoadingStateActionTypes.REGISTER_LOADING_MODULE) {
    const newLoadingState: LoadingState = {
      registeredLoadingModules: [
        ...new Set(state.registeredLoadingModules.concat(action.payload.name)),
      ],
      startActions: [
        ...new Set(
          state.startActions.concat(
            action.payload.actionTriplets.map((at) => at[0])
          )
        ),
      ],
      finishActions: [
        ...new Set(
          state.finishActions.concat(
            action.payload.actionTriplets.map((at) => at[1])
          )
        ),
      ],
      errorActions: [
        ...new Set(
          state.errorActions.concat(
            action.payload.actionTriplets.map((at) => at[2])
          )
        ),
      ],
      actionTriplets: { ...state.actionTriplets },
    };

    action.payload.actionTriplets.forEach((at) => {
      newLoadingState.actionTriplets[`${at[0]}:${at[1]}:${at[2]}`] = false;
    });

    return newLoadingState;
  } else if (action.type === LoadingStateActionTypes.SET_LOADING_STATE) {
    const newLoadingState: LoadingState = {
      ...state,
      actionTriplets: { ...state.actionTriplets },
    };

    action.payload.actionNames.forEach((atn) => {
      newLoadingState.actionTriplets[atn] = action.payload.isLoading;
    });

    return newLoadingState;
  } else {
    return state;
  }
};

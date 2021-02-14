import { RootStateOrAny } from "react-redux";
import { LoadingState } from "../state";

export type GetLoadingStateSelector = (state: RootStateOrAny) => LoadingState;

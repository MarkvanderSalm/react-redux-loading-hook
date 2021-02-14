import { createUseLoading } from "react-redux-loading-hook";
import { getLoadingState } from "../state/store";

export const useLoading = createUseLoading(getLoadingState);

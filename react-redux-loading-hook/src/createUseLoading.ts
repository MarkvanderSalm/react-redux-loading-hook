import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerLoadingModuleCreator } from "./state";
import { GetLoadingStateSelector } from "./types/GetLoadingStateSelector";
import { LoadingModule } from "./types/LoadingModule";
import { UseLoading } from "./types/UseLoading";

export const createUseLoading = (
  selector: GetLoadingStateSelector
): UseLoading => {
  const useLoading = (module: LoadingModule) => {
    const [hasRegistered, setHasRegistered] = useState(false);
    const dispatch = useDispatch();
    const loadingState = useSelector(selector);

    if (
      !hasRegistered &&
      loadingState.registeredLoadingModules.find((lm) => lm === module.name) ===
        undefined
    ) {
      dispatch(registerLoadingModuleCreator(module.data));
      setHasRegistered(true);
    }

    for (const at of module.actionTriplets) {
      const name = `${at[0]}:${at[1]}:${at[2]}`;
      if (loadingState.actionTriplets[name] === true) return true;
    }

    return false;
  };

  return useLoading;
};

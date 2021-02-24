import { InternalActionTriplet, ActionTriplet } from "./ActionTriplet";

export class LoadingModule {
  public static defaultErrorAction?: string;

  constructor(config: {
    name: string;
    actionTriplets: ActionTriplet[];
    defaultErrorAction?: string;
  }) {
    const { name, actionTriplets, defaultErrorAction } = config;

    if (name.length === 0)
      throw new Error("LoadingModule name cannot be an empty string.");

    this.actionTriplets = actionTriplets.map(
      (at): InternalActionTriplet => {
        let errorAction =
          at[2] ?? defaultErrorAction ?? LoadingModule.defaultErrorAction;
        if (errorAction === undefined)
          throw new Error(
            "No error action specified. Set an error action on the ActionTriplet, set a default error action during creation of the LoadingModule instance, or use a global default error action by setting the LoadingModule.defaultErrorAction static property."
          );
        return [at[0], at[1], errorAction];
      }
    );

    this.name = name;
  }

  name: string;
  actionTriplets: InternalActionTriplet[];

  get data(): LoadingModuleData {
    return {
      name: this.name,
      actionTriplets: this.actionTriplets,
    };
  }
}

export type LoadingModuleData = {
  name: string;
  actionTriplets: InternalActionTriplet[];
};

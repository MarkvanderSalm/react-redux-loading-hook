import { InternalActionTriplet, ActionTriplet } from "./ActionTriplet";

export class LoadingModule {
  constructor(config: {
    name: string;
    actionTriplets: ActionTriplet[];
    defaultErrorAction?: string;
  }) {
    const { name, actionTriplets, defaultErrorAction } = config;

    if (defaultErrorAction) {
      this.actionTriplets = actionTriplets.map(
        (at): InternalActionTriplet => [
          at[0],
          at[1],
          at[2] ?? defaultErrorAction,
        ]
      );
    } else {
      actionTriplets.forEach((at) => {
        if (at[2] === undefined)
          throw new Error(
            "When no default error action is specified, each ActionTriplet must have its own error action." //TODO: improve error message
          );
      });
      this.actionTriplets = actionTriplets as InternalActionTriplet[];
    }

    this.name = name;
  }

  name: string;
  actionTriplets: InternalActionTriplet[];
}

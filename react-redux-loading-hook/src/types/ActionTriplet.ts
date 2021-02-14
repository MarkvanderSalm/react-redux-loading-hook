export type InternalActionTriplet = [
  start: string,
  finish: string,
  error: string
];

export interface ActionTriplet extends Omit<InternalActionTriplet, "error"> {
  error?: string;
}

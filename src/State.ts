import { Config } from "./Config";

export interface IState {
  config: Config | null;
  a: Date | null;
  b: Date | null;
  confirm: boolean | null;
  error: string | null;
  authFail: boolean | null;
}

export class State implements IState {
  config = null;
  a = null;
  b = null;
  confirm = null;
  error = null;
  authFail = null;
}

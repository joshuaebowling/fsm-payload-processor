import { Response, ResponseMessages } from "./Response";
import { Config } from "./Config";
import { IState } from "./State";
export class Xfer {
  key: string = "";
  constructor(key: string) {
    this.key = key;
  }

  init() {
    return new Promise<Response<Config>>((resolve, reject) => {
      setTimeout(() => {
        const resp = new Response<Config>();
        resp.Data = new Config("a", "b");
        resolve(resp);
      }, 2000);
    });
  }
  auth() {
    return new Promise<Response<boolean>>((resolve, reject) => {
      const resp = new Response<boolean>();
      if (this.key === "TEST") {
        setTimeout(() => {
          resp.Data = true;
          resolve(resp);
        }, 2000);
      } else {
        setTimeout(() => {
          resp.Data = false;
          resp.Message = ResponseMessages.CALLED2CE;
          reject(resp);
        }, 5000);
      }
    });
  }
  xA(state: IState) {
    return new Promise<Response<boolean>>((resolve, reject) => {
      const resp = new Response<boolean>();
      if (state.a === null) {
        setTimeout(() => {
          resp.Data = true;
          resolve(resp);
        }, 2000);
      } else {
        setTimeout(() => {
          resp.Data = false;
          resp.Message = ResponseMessages.CALLED2CE;
          reject(resp);
        }, 5000);
      }
    });
  }
  xB(state: IState) {
    return new Promise<Response<boolean>>((resolve, reject) => {
      const resp = new Response<boolean>();
      if (state.b === null) {
        setTimeout(() => {
          resp.Data = true;
          resolve(resp);
        }, 2000);
        return;
      }
      setTimeout(() => {
        resp.Data = false;
        resp.Message = ResponseMessages.CALLED2CE;
        reject(resp);
      }, 5000);
    });
  }
  confirm(finished: boolean) {
    return new Promise<Response<Date | null>>((resolve, reject) => {
      const resp = new Response<Date | null>();
      if (finished) {
        resp.Data = new Date();
        resolve(resp);
        return;
      }
      resp.Message = ResponseMessages.NORESPONSE;
      reject(resp);
    });
  }
  reportAuthFail() {
    return new Promise<Response<boolean | null>>((resolve, reject) => {
      const resp = new Response<boolean | null>(true);
      resp.Message = ResponseMessages.OK.toString();
      resolve(resp);
    });
  }
}

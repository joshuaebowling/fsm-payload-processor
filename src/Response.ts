export enum ResponseMessages {
  OK = "OK",
  NORESPONSE = "NORESPONSE",
  XFERTIMEOUT = "XFERTIMEOUT",
  CALLED2CE = "CALLEDTWICE"
}
export class Response<T> {
  Message: string = ResponseMessages.OK.toString();
  Data: null | T = null;
  IsError: boolean = false;
  //@ts-ignore
  constructor(Data: T = null, Message: string = "", IsError: boolean = false) {
    this.Data = Data ? Data : this.Data;
    this.Message = Message ? Message : this.Message;
    this.IsError = IsError;
  }
}

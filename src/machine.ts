//@ts-nocheck
import machina from "machina";
import { IState, State } from "./State";
import { Xfer } from "./xferSvc";

const xfer = new Xfer("TEST");
export const xferMachine = new machina.BehavioralFsm({
  initialize: function (log: (val: any) => {}) {
    console.log("kick it off");
    this.log = log;
  },

  namespace: "xfer",

  initialState: "authorized",

  states: {
    authorized: {
      _onEnter: function (state: IState) {
        xfer
          .auth()
          .then((resp) => {
            console.log("xfer init then");
            if (resp.IsError) {
              state.error = resp.Message;
              this.transition(state, "error");
              this.emit("xfer", { state });
              return;
            }
            state.config = resp.Data;
            this.transition(state, "initialized");
            this.emit("xfer", { state });
          })
          .catch((resp) => {
            state.error = resp.Message;
            this.transition(state, "error");
            this.emit("xfer", { state });
          });
      }
    },
    initialized: {
      _onEnter: function (state: IState) {
        this.log("helloz", state);
        if (state.config) {
          //this.emit("xfer", { state });
          //return this.transition(state, "awaitA");
        }
        const self = this;
        xfer
          .init()
          .then((resp) => {
            console.log("xfer init then");
            if (resp.IsError) {
              state.error = resp.Message;
              this.transition(state, "error");
              this.emit("xfer", { state });
              return;
            }
            state.config = resp.Data;
            this.transition(state, "awaitA");
            self.emit("xfer", { state });
          })
          .catch((resp) => {
            state.error = resp.Message;
            this.transition(state, "error");
            this.emit("xfer", { state });
          });
      }
    },
    awaitA: {
      _onEnter: function (state: IState) {
        console.log("initialized > wait");
        xfer
          .xA(state)
          .then((resp) => {
            console.log("XA then");
            if (resp.IsError) {
              state.error = resp.Message;
              return this.transition(state, "error");
            }
            state.a = new Date();
            this.transition(state, "awaitB");
            this.emit("xfer", { state });
          })
          .catch((resp) => {
            console.log("error");
            state.error = resp.Message;
            this.transition(state, "error");
            this.emit("xfer", { state });
          });
      }
    },
    awaitB: {
      _onEnter: function (state: IState) {
        console.log("wait for a > wait for b");
        xfer
          .xB(state)
          .then((resp) => {
            console.log("XB then");
            if (resp.IsError) {
              state.error = resp.Message;
              return this.transition(state, "error");
            }
            state.b = new Date();
            this.transition(state, "confirm");
            this.emit("xfer", { state });
          })
          .catch((resp) => {
            state.error = resp.Message;
            this.transition(state, "error");
            this.emit("xfer", { state });
          });
      }
    },
    confirm: {
      _onEnter: function (state: IState) {
        console.log("awaitB > wait for confirm");
        xfer
          .confirm(state)
          .then((resp) => {
            console.log("confirm then");
            if (resp.IsError) {
              state.error = resp.Message;
              return this.transition(state, "error");
            }
            state.confirm = new Date();
            this.transition(state, "sleep");
            this.emit("xfer", { state });
          })
          .catch((resp) => {
            state.error = resp.Message;
            this.transition(state, "error");
            this.emit("xfer", { state });
          });
      },
      authFailed: {
        _onEnter: function (state: IState) {
          xfer
            .reportAuthFail()
            .then((resp) => {
              state.authFail = true;
              return this.trasition(state, "authorized");
            })
            .catch();
        }
      }
    },
    sleep: {
      _onEnter: function (state: IState) {
        console.log("in sleep");
      },
      wake: function (state: IState) {
        this.transition("initialized", state);
      }
    },
    error: {
      reset: function (state) {
        const newState = new State();
        this.transition("initialized", newState);
        this.emit("xfer", { newState });
      }
    }
  },
  reset: function (state: IState) {
    this.handle(state, "_reset");
  },
  wake: function (state: IState) {
    this.handle(state, "wake");
  }
});

// Now we can have multiple 'instances' of traffic lights that all share the same FSM:
//var cliXfer = new State();
//var light2 = { location: "Dijsktra Ave & Hunt Blvd", direction: "east-west" };

// to use the behavioral fsm, we pass the "client" in as the first arg to API calls:
//xferMachine.reset(cliXfer);

// Now let's signal a pedestrian waiting at light2
//vehicleSignal.pedestrianWaiting(light2);

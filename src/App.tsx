import "./styles.css";
import { useState } from "react";
import { xferMachine } from "./machine";
import { State } from "./State";

const MachineLog: React.FunctionComponent<{ machine: any }> = ({ machine }) => {
  const [log, setLog] = new Array<string>([]);
  machine.on("*", function (val, x) {
    setLog([...log, `from: ${x.fromState} > to: ${x.toState}`]);
  });

  return (
    <ol>
      {log.map((x) => {
        <li>{x}</li>;
      })}
    </ol>
  );
};
export default function App() {
  xferMachine.initialize((val) => console.log(val));
  const replay = () => xferMachine.reset(new State());
  return (
    <div className="App">
      <h1>Log</h1>
      <button onClick={replay}>replay</button>
    </div>
  );
}

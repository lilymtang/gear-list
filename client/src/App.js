import React from "react";
import "./App.less";

import logo from "./assets/logo.png"
import SelectableTableContainer from "./components/SelectableTableContainer"
import EditableTableContainer from "./components/EditableTableContainer"

const divStyle = {
  paddingTop: "20px"
};

function App() {
  return (
    <>
      <div className="container" style={divStyle}>
        <div style={{ paddingBottom: "48px" }}>
          <img src={logo} alt="gearlist" width="160px" />
        </div>
        <div style={{ paddingBottom: "48px" }}>
          <SelectableTableContainer />
        </div>
        <EditableTableContainer />
      </div>
    </>);
}

export default App;

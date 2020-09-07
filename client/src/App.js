import React from 'react';
import "./App.less";


// import components
// import CreateItem from "./components/CreateItem"
// import EditableTable from "./components/EditableTable"
import EditableTableContainer from "./components/EditableTableContainer"

function App() {
  return (
    <>
      <div className="container">
        <EditableTableContainer />
      </div>
    </>);
}

export default App;

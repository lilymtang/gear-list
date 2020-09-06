import React from 'react';
import "./App.less";


// import components
import CreateItem from "./components/CreateItem"
import EditableTable from "./components/EditableTable"

function App() {
  return (
    <>
      <div className="container">
        {/* <CreateItem /> */}
        <EditableTable />
      </div>
    </>);
}

export default App;

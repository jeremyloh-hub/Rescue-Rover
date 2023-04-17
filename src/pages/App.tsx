import { useState } from "react";
import { Route, Routes } from "react-router";
import { Link } from "react-router-dom";
import Dogs from "./Dogs/AllDogs";
import NavBar from "../components/NavBar";
import SelectedDogs from "./Dogs/SelectedDogs";

function App() {
  return (
    <div className="App">
      <NavBar />

      <Routes>
        <Route path="/" element={<Dogs />} />
        <Route path="/dogs/:dogName" element={<SelectedDogs />} />
      </Routes>
    </div>
  );
}

export default App;

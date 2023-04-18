import { useState } from "react";
import { Route, Routes } from "react-router";
import { Link } from "react-router-dom";
import { getUser } from "../utilities/users-service";
import Dogs from "./Dogs/AllDogs";
import NavBar from "../components/NavBar";
import SelectedDogs from "./Dogs/SelectedDogs";
import Login from "./Users/Login";
import SignUp from "./Users/Signup";

function App() {
  const [user, setUser] = useState(getUser());
  return (
    <div className="App">
      <NavBar />

      <Routes>
        <Route path="/dogs" element={<Dogs />} />
        <Route path="/dogs/:dogName" element={<SelectedDogs />} />
        <Route path="/Login" element={<Login setUser={setUser} />} />
        <Route path="/Signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;

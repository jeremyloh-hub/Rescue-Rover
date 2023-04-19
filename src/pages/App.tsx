import React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router";
import { Link } from "react-router-dom";
import { getUser } from "../utilities/users-service";
import Dogs from "./Dogs/AllDogs";
import UserNavBar from "../components/UserNavBar";
import NavBar from "../components/NavBar";
import SelectedDogs from "./Dogs/SelectedDogs";
import Login from "./Users/Login";
import SignUp from "./Users/Signup";
import HomePage from "./HomePage/HomePage";
import AdoptionForm from "./AdoptionForm/AdoptionForm";
import FosterForm from "./FosterForm/FosterForm";

function App() {
  const [user, setUser] = useState(getUser());
  const token = localStorage.getItem("token");
  const tokenUser = token ? JSON.parse(window.atob(token.split(".")[1])) : null;

  const loginRoutes = [
    {
      path: "/login",
      element: <Login setUser={setUser} />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ];

  const formRoutes = [
    {
      path: "/dogs/adopt/:dogID",
      element: <AdoptionForm />,
    },
    {
      path: "/dogs/foster/:dogID",
      element: <FosterForm />,
    },
  ];

  const dogPageRoutes = [
    {
      path: "/dogs",
      element: <Dogs />,
    },
    {
      path: "/dogs/:dogName",
      element: <SelectedDogs />,
    },
  ];

  const accessDeniedComponent = (
    <div className="centered-message">Access denied</div>
  );

  const userPagesRoutes = [
    ...dogPageRoutes,
    {
      path: "/",
      element: <HomePage />,
    },
  ];
  const AdminRouteConfig = [];

  const loggedInRoleSpecificRoutes = [
    {
      role: "user",
      content: (
        <Routes>
          {userPagesRoutes.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={config.element}
            />
          ))}
          {formRoutes.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={config.element}
            />
          ))}
          <Route key="*" path="*" element={accessDeniedComponent} />
        </Routes>
      ),
    },
    //   {
    //     role: "admin",
    //     content: (
    //       <Routes>
    //         {AdminRouteConfig.map((config) => (
    //           <Route
    //             key={config.path}
    //             path={config.path}
    //             element={
    //               <NavBar>{config.element}</NavBar>
    //             }
    //           />
    //         ))}
    //         <Route key="*" path="*" element={accessDeniedComponent} />
    //       </Routes>
    //     ),
    //   },
  ];

  const renderAuthenticatedPages = (tokenUser: any) => {
    const renderLoggedInContent = loggedInRoleSpecificRoutes.find(
      (config) => config.role === tokenUser.role
    )?.content;

    return (
      <React.Fragment>
        <UserNavBar />
        {renderLoggedInContent}
      </React.Fragment>
    );
  };

  const renderUnauthenticatedPages = () => (
    <React.Fragment>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {loginRoutes.map((config) => (
          <Route {...config} />
        ))}
        {dogPageRoutes.map((config) => (
          <Route key={config.path} {...config}></Route>
        ))}
        {/* {AdminRouteConfig.map((config) => (
            <Route
              key={config.path}
              path={config.path}
              element={accessDeniedComponent}
            />
          ))} */}
      </Routes>
    </React.Fragment>
  );
  console.log("user ", tokenUser?.user);

  return (
    <div className="App">
      {tokenUser
        ? renderAuthenticatedPages(tokenUser.user)
        : renderUnauthenticatedPages()}
    </div>
  );
}

export default App;

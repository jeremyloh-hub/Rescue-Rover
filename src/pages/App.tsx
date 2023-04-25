import React from "react";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router";
import { Link } from "react-router-dom";
import { getUser } from "../utilities/users-service";
import Dogs from "./Dogs/AllDogs";
import UserNavBar from "../components/UserNavBar";
import NavBar from "../components/NavBar";
import AdminNavBar from "../components/AdminNavBar";
import SelectedDogs from "./Dogs/SelectedDogs";
import Login from "./Users/Login";
import SignUp from "./Users/Signup";
import HomePage from "./HomePage/HomePage";
import AdoptionForm from "./AdoptionForm/AdoptionForm";
import FosterForm from "./FosterForm/FosterForm";
import PostForm from "./PostForm/PostForm";
import EditPostForm from "./PostForm/EditPostForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddPostForm from "./PostForm/AddPostForm";
import ApplicationStatus from "./ApplicationStatus/ApplicationStatus";
import Footer from "../components/Footer";

function App() {
  const [user, setUser] = useState(getUser());
  const token = localStorage.getItem("token");
  const tokenUser = token ? JSON.parse(window.atob(token.split(".")[1])) : null;
  const [dogs, setDogs] = useState([]);

  const handleEditPost = (editedPost: any) => {
    setDogs((prevPost: any) =>
      prevPost.map((dog: any) => (dog.id === editedPost.id ? editedPost : dog))
    );
  };

  const delPostForm = (id: number) =>
    setDogs(dogs.filter(({ id: postId }) => postId !== id));

  const addPost = (dog: any) => {
    setDogs(dogs.concat(dog));
  };

  useEffect(() => {
    fetch("/api/dogs")
      .then((response) => response.json())
      .then((data) => setDogs(data))
      .catch((error) => console.error(error));
  }, []);

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

  const applicationStatusRoutes = [
    {
      path: "/status",
      element: <ApplicationStatus />,
    },
  ];

  const accessDeniedComponent = <div className="">Access denied</div>;

  const userPagesRoutes = [
    ...dogPageRoutes,
    ...formRoutes,
    ...applicationStatusRoutes,
    {
      path: "/",
      element: <HomePage />,
    },
  ];
  const AdminRouteConfig = [
    {
      path: "/postform",
      element: <PostForm dogs={dogs} delPostForm={delPostForm} />,
    },
    {
      path: "/postform/edit/:id",
      element: <EditPostForm handleEditPost={handleEditPost} />,
    },
    {
      path: "/postform/add/",
      element: <AddPostForm addPost={addPost} />,
    },
  ];

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
          <Route key="*" path="*" element={accessDeniedComponent} />
        </Routes>
      ),
    },
    {
      role: "admin",
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
          {AdminRouteConfig.map((config) => (
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
  ];

  const renderAuthenticatedPages = (tokenUser: any) => {
    const renderLoggedInContent = loggedInRoleSpecificRoutes.find(
      (config) => config.role === tokenUser.role
    )?.content;

    return (
      <React.Fragment>
        {tokenUser.role === "admin" ? <AdminNavBar /> : <UserNavBar />}
        {renderLoggedInContent}
        <Footer />
      </React.Fragment>
    );
  };

  const renderUnauthenticatedPages = () => (
    <React.Fragment>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {loginRoutes.map((config) => (
          <Route key={config.path} {...config} />
        ))}
        {dogPageRoutes.map((config) => (
          <Route key={config.path} {...config}></Route>
        ))}
        {AdminRouteConfig.map((config) => (
          <Route
            key={config.path}
            path={config.path}
            element={accessDeniedComponent}
          />
        ))}
      </Routes>
      <Footer />
    </React.Fragment>
  );

  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {tokenUser
          ? renderAuthenticatedPages(tokenUser.user)
          : renderUnauthenticatedPages()}
      </LocalizationProvider>
    </div>
  );
}

export default App;

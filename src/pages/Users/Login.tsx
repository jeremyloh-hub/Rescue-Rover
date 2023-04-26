import { useState } from "react";
import { getUser } from "../../utilities/users-service";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";

type UF = (user: object) => void;

export default function Login({ setUser }: { setUser: UF }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loginTry, setLoginTry] = useState({
    userid: "",
    password: "",
  });

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginTry),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Incorrect Password or UserID");
      }
      localStorage.setItem("token", JSON.stringify(data.token));
      const decoded = getUser();
      const User = JSON.parse(window.atob(data.token.split(".")[1]));
      setUser(decoded);
      if (User.user.role === "user") {
        navigate("/");
      } else if (User.user.role === "admin") {
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginTry({
      ...loginTry,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ my: 4, bgcolor: "grey.100", mx: "auto" }}
      border={1}
      borderColor="grey.300"
      borderRadius={4}
      maxWidth={800}
      height={300}
    >
      <form autoComplete="off" onSubmit={handleLogin}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl variant="outlined">
            <InputLabel htmlFor="userid">UserID</InputLabel>
            <OutlinedInput
              id="userid"
              name="userid"
              label="Outlined"
              value={loginTry.userid}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              label="Outlined"
              type="password"
              value={loginTry.password}
              onChange={handleChange}
              required
            />
          </FormControl>
          <Button type="submit" variant="contained">
            LOGIN
          </Button>
          <Button type="button" variant="contained" onClick={handleRegister}>
            Register
          </Button>
        </Box>
      </form>
      {error ? <Typography color="error">{error}</Typography> : null}
    </Box>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../type";
import { object, string, number } from "yup";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const userSchema = object({
  name: string().required(),
  userid: string().required().min(3),
  password: string().required().min(3),
  confirm: string().required().min(3),
  email: string().required().email(),
  age: number().positive().required(),
  residential: string().required(),
});

export default function SignUp() {
  const navigate = useNavigate();
  const [state, setState] = useState<User>({
    name: "",
    userid: "",
    password: "",
    confirm: "",
    email: "",
    age: 0,
    residential: "",
  });
  const [error, setError] = useState<string | null>(null);

  const disable = state.password !== state.confirm;

  const userExists = async (userid: string, email: string) => {
    const response = await fetch(`/api/users?userid=${userid}&email=${email}`);
    if (!response.ok) {
      throw new Error("Error checking if user exists");
    }
    const data = await response.json();
    if (data) {
      return true;
    } else {
      return false;
    }
  };

  const newUser = async (userData: User) => {
    const response = await fetch(`/api/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "User registration failed");
    }

    const data = await response.json();
    return data;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validatedData = await userSchema.validate(state);
    try {
      const { userid, email } = validatedData;
      const exists = await userExists(userid, email);
      if (exists === true) {
        setError("User with this email or userid already exists");
        return;
      } else {
        await newUser(validatedData);
        setState({
          name: "",
          userid: "",
          password: "",
          confirm: "",
          email: "",
          age: 0,
          residential: "",
        });
        navigate("/login");
      }
    } catch (error: any) {
      setError(error.message);
      console.error(`Error: ${error.message}`);
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleChangeSelect = (event: SelectChangeEvent<string>) => {
    setState({
      ...state,
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
      height={600}
    >
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <InputLabel htmlFor="name">Name</InputLabel>
            <OutlinedInput
              id="name"
              name="name"
              label="Outlined"
              value={state.name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="userid">UserID</InputLabel>
            <OutlinedInput
              id="userid"
              name="userid"
              label="Outlined"
              value={state.userid}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              name="email"
              label="Outlined"
              type="email"
              value={state.email}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="age">Age</InputLabel>
            <OutlinedInput
              id="age"
              name="age"
              label="Outlined"
              type="number"
              value={state.age}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="residential">Residential</InputLabel>
            <Select
              id="residential"
              name="residential"
              value={state.residential}
              onChange={handleChangeSelect}
              label="Residential"
              required
            >
              <MenuItem value="HDB">HDB</MenuItem>
              <MenuItem value="LANDED">LANDED</MenuItem>
              <MenuItem value="CONDO">CONDO</MenuItem>
              <MenuItem value="RENTAL">RENTAL</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              label="Outlined"
              type="password"
              value={state.password}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="confirm">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirm"
              name="confirm"
              label="Outlined"
              type="password"
              value={state.confirm}
              onChange={handleChange}
              required
            />
          </FormControl>
          <Button type="submit" variant="contained" disabled={disable}>
            SIGN UP
          </Button>
        </Box>
      </form>
      {error ? <Typography color="error">{error}</Typography> : null}
    </Box>
  );
}

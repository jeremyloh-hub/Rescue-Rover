import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { FosterForm } from "../../type";
import { object, string, number, boolean } from "yup";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
} from "@mui/material";

const FosterFormSchema = object({
  dog_id: number().required(),
  user_id: number().required(),
  history: boolean().required(),
  activity_level: string().required(),
  existing_pet: string().required(),
  reason: string().required(),
  duration: string().required(),
});

export default function FosterForm() {
  const navigate = useNavigate();
  const { dogID } = useParams();
  const dogIdNumber = Number(dogID);
  const token = localStorage.getItem("token");
  const tokenUser = token ? JSON.parse(window.atob(token.split(".")[1])) : null;
  const [state, setState] = useState<FosterForm>({
    dog_id: dogIdNumber,
    user_id: tokenUser.user.id,
    history: false,
    activity_level: "",
    existing_pet: "",
    reason: "",
    duration: "",
  });
  const [error, setError] = useState<string | null>(null);

  const formExists = async (userid: number) => {
    const response = await fetch(`/api/foster?userid=${userid}`);
    if (!response.ok) {
      throw new Error("Error checking if user adoption exists");
    }
    const data = await response.json();
    if (data) {
      return true;
    } else {
      return false;
    }
  };

  const newFoster = async (userData: FosterForm) => {
    const response = await fetch("/api/foster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit form");
    }

    const data = await response.json();
    return data;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validatedData = await FosterFormSchema.validate(state);
    console.log(validatedData);
    try {
      const { user_id } = validatedData;
      const exists = await formExists(user_id);
      if (exists === true) {
        setError("You have already submitted an application !");
        return;
      } else {
        await newFoster(validatedData);
        setState({
          dog_id: 0,
          user_id: 0,
          history: false,
          activity_level: "",
          existing_pet: "",
          reason: "",
          duration: "",
        });
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message);
      console.error(`Error: ${error.message}`);
    }
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setState({
  //     ...state,
  //     [event.target.name]: event.target.value,
  //   });
  // };

  const handleChangeSelect = (event: SelectChangeEvent<string>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeTextArea: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
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
      height={450}
    >
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          Fostering Application Form
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl variant="outlined">
            <InputLabel htmlFor="history">Owned dogs before?</InputLabel>
            <Select
              id="history"
              name="history"
              label="Outlined"
              value={state.history.toString()}
              onChange={handleChangeSelect}
              required
            >
              <MenuItem value={true.toString()}>Yes</MenuItem>
              <MenuItem value={false.toString()}>No</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="activity_level">
              Lifestyle activity level
            </InputLabel>
            <Select
              id="activity_level"
              name="activity_level"
              value={state.activity_level}
              onChange={handleChangeSelect}
              label="Outlined"
              required
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="activity_level">Existing Pets</InputLabel>
            <Select
              id="existing_pet"
              name="existing_pet"
              value={state.existing_pet}
              onChange={handleChangeSelect}
              label="Outlined"
              required
            >
              <MenuItem value="cat">Cat</MenuItem>
              <MenuItem value="dog">Dog</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="duration">Foster duration</InputLabel>
            <Select
              id="duration"
              name="duration"
              value={state.duration}
              onChange={handleChangeSelect}
              label="Outlined"
              required
            >
              <MenuItem value="3months">3 Months</MenuItem>
              <MenuItem value="6months">6 Months</MenuItem>
              <MenuItem value="12months">12 Months</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="reason"></InputLabel>
            <TextareaAutosize
              id="reason"
              name="reason"
              aria-label="reason for adopting"
              placeholder="State the reason for fostering"
              value={state.reason}
              onChange={handleChangeTextArea}
              required
            />
          </FormControl>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
      {error ? <Typography color="error">{error}</Typography> : null}
    </Box>
  );
}

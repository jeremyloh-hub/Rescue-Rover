import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AdoptionForm } from "../../type";
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

const AdoptionFormSchema = object({
  dog_id: number().required(),
  user_id: number().required(),
  history: boolean().required(),
  activity_level: string().required(),
  existing_pet: string().required(),
  reason: string().required(),
});

export default function AdoptionForm() {
  const navigate = useNavigate();
  const { dogID } = useParams();
  const dogIdNumber = Number(dogID);
  const token = localStorage.getItem("token");
  const tokenUser = token ? JSON.parse(window.atob(token.split(".")[1])) : null;

  const [state, setState] = useState<AdoptionForm>({
    dog_id: dogIdNumber,
    user_id: tokenUser.user.id,
    history: false,
    activity_level: "",
    existing_pet: "",
    reason: "",
  });
  const [error, setError] = useState<string | null>(null);

  const formExists = async (userid: number) => {
    const response = await fetch(`/api/adoption?userid=${userid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

  const newUser = async (userData: AdoptionForm) => {
    const response = await fetch("/api/adoption", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
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
    const validatedData = await AdoptionFormSchema.validate(state);
    console.log(validatedData);
    try {
      const { user_id } = validatedData;
      const exists = await formExists(user_id);
      if (exists === true) {
        setError("You have already submitted an application !");
        return;
      } else {
        await newUser(validatedData);
        setState({
          dog_id: 0,
          user_id: 0,
          history: false,
          activity_level: "",
          existing_pet: "",
          reason: "",
        });
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message);
      console.error(`Error: ${error.message}`);
    }
  };

  //   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setState({
  //       ...state,
  //       [event.target.name]: event.target.value,
  //     });
  //   };

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
      height={380}
    >
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          Adoption Application Form
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
            <InputLabel htmlFor="reason"></InputLabel>
            <TextareaAutosize
              id="reason"
              name="reason"
              aria-label="reason for adopting"
              placeholder="State the reason for adopting"
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

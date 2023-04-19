import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AdoptionForm } from "../../type";
import { object, string, number, boolean } from "yup";
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
  const [state, setState] = useState<AdoptionForm>({
    dog_id: 0,
    user_id: 0,
    history: false,
    activity_level: "",
    existing_pet: "",
    reason: "",
  });
  const [error, setError] = useState(null);

  const newUser = async (userData: AdoptionForm) => {
    const response = await fetch(`/api/dog/adoption`, {
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
    const validatedData = await AdoptionFormSchema.validate(state);
    try {
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
    } catch (error: any) {
      setError(error.message);
      console.error(`Error: ${error.message}`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
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
      height={400}
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
            <InputLabel htmlFor="reason">Reason for adopting</InputLabel>
            <OutlinedInput
              id="reason"
              name="reason"
              label="Outlined"
              value={state.reason}
              onChange={handleChange}
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

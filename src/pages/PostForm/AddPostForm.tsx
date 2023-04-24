import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PostForms, PostFormAddProps } from "../../type";
import { object, string, number, boolean, date } from "yup";
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
  OutlinedInput,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const PostFormSchema = object({
  name: string().required(),
  breed: string().required(),
  gender: string().required(),
  hdbapproved: boolean().required(),
  dob: date().required(),
  status: boolean().required(),
  personality: string().required(),
  imgurl: string().required(),
});

export default function AddPostForm({ addPost }: PostFormAddProps) {
  const navigate = useNavigate();

  const [state, setState] = useState<PostForms>({
    name: "",
    breed: "",
    gender: "",
    hdbapproved: false,
    dob: new Date(),
    status: false,
    personality: "",
    imgurl: "",
  });
  const [error, setError] = useState<string | null>(null);

  const newPost = async (postData: PostForms) => {
    const response = await fetch("/api/dogs/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit form");
    }

    const data = await response.json();
    addPost(data);
    return data;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validatedData = await PostFormSchema.validate(state);
    try {
      await newPost(validatedData);
      setState({
        name: "",
        breed: "",
        gender: "",
        hdbapproved: false,
        dob: new Date(),
        status: false,
        personality: "",
        imgurl: "",
      });

      navigate("/postform");
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

  const handleChangeTextArea: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleDobChange = (date: any) => {
    if (date) {
      const dateObject = dayjs(date).toDate();
      setState({
        ...state,
        dob: dateObject,
      });
    }
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
      height={580}
    >
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          Add Post Form
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <InputLabel htmlFor="name">Name of the Dog</InputLabel>
            <OutlinedInput
              id="name"
              name="name"
              label="Outlined"
              value={state.name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="breed">Breed of the Dog</InputLabel>
            <OutlinedInput
              id="breed"
              name="breed"
              label="Outlined"
              value={state.breed}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="gender">Gender of the Dog</InputLabel>
            <Select
              id="gender"
              name="gender"
              value={state.gender}
              onChange={handleChangeSelect}
              label="Outlined"
              required
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="hdbapproved">HDB Approved</InputLabel>
            <Select
              id="hdbapproved"
              name="hdbapproved"
              value={state.hdbapproved.toString()}
              onChange={handleChangeSelect}
              label="Outlined"
              required
            >
              <MenuItem value={true.toString()}>Yes</MenuItem>
              <MenuItem value={false.toString()}>No</MenuItem>
            </Select>
          </FormControl>
          <DatePicker
            label="Date of Birth"
            value={dayjs(state.dob)}
            onChange={handleDobChange}
          />
          <FormControl variant="outlined">
            <InputLabel htmlFor="personality"></InputLabel>
            <TextareaAutosize
              id="personality"
              name="personality"
              aria-label="personality"
              placeholder="Personality of the Dog"
              value={state.personality}
              onChange={handleChangeTextArea}
              required
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="imgurl">Image URL</InputLabel>
            <OutlinedInput
              id="imgurl"
              name="imgurl"
              label="Outlined"
              value={state.imgurl}
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

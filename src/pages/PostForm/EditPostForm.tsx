import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Dog } from "../../type";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Typography,
  MenuItem,
  Select,
  TextareaAutosize,
  OutlinedInput,
  Stack,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function EditPostForm({ handleEditPost }: any) {
  const { dogName } = useParams<{ dogName: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [editedPost, setEditedPost] = useState({
    name: "",
    hdbapproved: false,
    dob: new Date(),
    personality: "",
  });
  console.log(dayjs(editedPost.dob).format("MM/DD/YYYY"));
  useEffect(() => {
    fetch(`/api/dogs/postform/${dogName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: Dog) => {
        setEditedPost(data);
      })
      .catch((error) => console.error(error));
  }, [dogName]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPost({
      ...editedPost,
      name: event.target.value,
    });
  };

  const handleHdbChange = (event: any) => {
    setEditedPost({
      ...editedPost,
      hdbapproved: event.target.value as boolean,
    });
  };

  const handleDobChange = (event: any) => {
    setEditedPost({
      ...editedPost,
      dob: event.target.value,
    });
  };

  const handlePersonalityChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditedPost({
      ...editedPost,
      personality: event.target.value,
    });
  };

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(`/api/dogs/${dogName}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedPost), // Fix typo here
    });
    if (response.ok) {
      const updatedPost = await response.json();
      console.log(updatedPost);
      handleEditPost(updatedPost);
      navigate("/postform");
    } else {
      console.error("Error updating post:", response.status);
    }
  };

  function Label({
    componentName,
    valueType,
    isProOnly,
  }: {
    componentName: string;
    valueType: string;
    isProOnly?: boolean;
  }) {
    const content = (
      <span>
        <strong>{componentName}</strong> for {valueType} editing
      </span>
    );

    if (isProOnly) {
      return (
        <Stack direction="row" spacing={0.5} component="span">
          <Tooltip title="Included on Pro package">
            <a href="/x/introduction/licensing/#pro-plan">
              <span className="plan-pro" />
            </a>
          </Tooltip>
          {content}
        </Stack>
      );
    }

    return content;
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ my: 4, bgcolor: "grey.100", mx: "auto" }}
        border={1}
        borderColor="grey.300"
        borderRadius={4}
        maxWidth={800}
        height={570}
      >
        <form autoComplete="off" onSubmit={handleEdit}>
          <Typography variant="h5" align="center" gutterBottom>
            Edit Dog Post
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl>
              <InputLabel htmlFor="name">Name</InputLabel>
              <OutlinedInput
                id="name"
                name="name"
                label="Outlined"
                value={editedPost.name}
                onChange={handleNameChange}
                required
              />
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel htmlFor="hdbapproved">HDB Approved</InputLabel>
              <Select
                id="hdbapproved"
                name="hdbapproved"
                value={editedPost.hdbapproved}
                onChange={handleHdbChange}
                label="Outlined"
                required
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            </FormControl>
            <DatePicker
              label="Date of Birth"
              value={dayjs(editedPost.dob)}
              onChange={handleDobChange}
            />
            <FormControl variant="outlined">
              <InputLabel htmlFor="personality"></InputLabel>
              <TextareaAutosize
                id="personality"
                name="personality"
                aria-label="personality"
                placeholder="Personality"
                value={editedPost.personality}
                onChange={handlePersonalityChange}
                required
              />
            </FormControl>
            <Button type="submit" variant="contained">
              Edit Post
            </Button>
          </Box>
        </form>
        {error ? <Typography color="error">{error}</Typography> : null}
      </Box>
    </>
  );
}

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
  TextField,
} from "@mui/material";

export default function EditPostForm() {
  const { dogName } = useParams<{ dogName: string }>();
  const navigate = useNavigate();
  const [editedPost, setEditedPost] = useState({
    name: "",
    hdbapproved: false,
    dob: "",
    personality: "",
  });

  useEffect(() => {
    fetch(`/api/postform/dogs/${dogName}`)
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

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setEditedPost({
      ...editedPost,
      [name]: value,
    });
  };

  const handleEdit = async () => {
    const token = localStorage.getItem("token");
    const nameExists = products.some(
      (p) => p._id !== productID && p.name === editedProduct.name
    );
    if (nameExists) {
      alert("Product with the same name already exists!");
      return;
    } else {
      const newProduct = {
        ...editedProduct,
        price: editedProduct.price * CONVERTTODOLLAR, // divide price by 100 to convert it back to dollars
      };
      const response = await fetch(`/api/AdminProduct/${productID}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(newProduct),
      });
      const updatedProduct = await response.json();
      handleEditProduct(updatedProduct);
      navigate("/productpage");
    }
  };

  const handleCancel = async () => {
    navigate("/postform");
  };

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
        height={380}
      >
        <form autoComplete="off" onSubmit={handleEdit}>
          <Typography variant="h5" align="center" gutterBottom>
            Edit Dog Post
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="name">Name</InputLabel>
              <TextField
                id="name"
                name="name"
                variant="standard"
                aria-label="name"
                placeholder="Name"
                value={editedPost.name}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel htmlFor="hdbapproved">HDB Approved</InputLabel>
              <Select
                id="hdbapproved"
                name="hdbapproved"
                value={editedPost.hdbapproved}
                onChange={handleChange}
                label="Outlined"
                required
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
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
    </>
  );
}

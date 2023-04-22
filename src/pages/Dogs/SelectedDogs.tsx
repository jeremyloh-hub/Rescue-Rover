import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Dog } from "../../type";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import * as dayjs from "dayjs";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function SelectedDogs() {
  const [dogs, setDogs] = useState<Dog | null>(null);
  const { dogName } = useParams<{ dogName: string }>();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`/api/dogs/${dogName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: Dog) => {
        setDogs(data);
      })
      .catch((error) => console.error(error));
  }, [dogName]);

  return (
    <>
      {dogs && (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Item>
                <img src={dogs.imgurl} alt={dogs.name} />
              </Item>
            </Grid>
            <Grid xs={6}>
              <Item>
                <h2>{dogs.name}</h2>
                {dogs.hdbapproved === true ? (
                  <p>HDB Approved: Yes</p>
                ) : (
                  <p>HDB Approved: No</p>
                )}
                <p>Breed: {dogs.breed}</p>
                <p>Gender: {dogs.gender}</p>
                {dogs && dogs.dob && (
                  <p>DOB: {dayjs(dogs.dob).format("DD/MM/YYYY")}</p>
                )}
                <p>Personality: {dogs.personality}</p>
                {token && ( // Conditionally render buttons based on token
                  <>
                    <Link
                      to={`/dogs/adopt/${dogs.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Button variant="outlined">Adopt</Button>
                    </Link>
                    <Link
                      to={`/dogs/foster/${dogs.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Button variant="outlined">Foster</Button>
                    </Link>
                  </>
                )}
              </Item>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

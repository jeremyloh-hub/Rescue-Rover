import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import type { Dog } from "../../type";

export default function Dogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [hdbapproved, setHdbapproved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let url = "/api/dogs";
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDogs(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (event: SelectChangeEvent<boolean>) => {
    const { name, checked } = event.target as HTMLInputElement;
    if (name === "hdbapproved") {
      setHdbapproved(checked);
      setLoading(true);
      const url = `/api/dogs?hdbapproved=${checked ? "true" : ""}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setDogs(data);
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          variant="h3"
          component="h1"
          gutterBottom
        >
          Adoption Gallery
        </Typography>
        <FormControlLabel
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          control={
            <Checkbox
              name="hdbapproved"
              checked={hdbapproved}
              onChange={handleChange}
            />
          }
          label="HDB Approved"
        />
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {dogs.map((dog) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                <Link
                  to={`/dogs/${dog.name}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="200"
                        image={dog.imgurl}
                        alt={dog.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {dog.name}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          Gender:{" "}
                          {dog.gender === "male" ? (
                            <img
                              src="https://i.imgur.com/MnNnNPz.png"
                              alt="male"
                              width="25"
                              height="25"
                            />
                          ) : (
                            <img
                              src="https://i.imgur.com/8zRGd6N.png"
                              alt="female"
                              width="25"
                              height="25"
                            />
                          )}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                          HDB Approved:{" "}
                          {dog.hdbapproved === true ? (
                            <img
                              src="https://i.imgur.com/OluSXkQ.png"
                              alt="HDB approved"
                              width="30"
                              height="30"
                            />
                          ) : (
                            <img
                              src="https://i.imgur.com/KOoepTi.png"
                              alt="HDB not approved"
                              width="30"
                              height="30"
                            />
                          )}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

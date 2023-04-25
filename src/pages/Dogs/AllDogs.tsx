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
} from "@mui/material";
import type { Dog } from "../../type";

export default function Dogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    fetch("/api/dogs")
      .then((response) => response.json())
      .then((data) => setDogs(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Adoption Gallery
      </Typography>
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
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

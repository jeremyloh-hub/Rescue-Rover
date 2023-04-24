import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Grid,
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
    <>
      <h1>Adoption Gallery</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {dogs.map((d) => (
            <Grid
              item
              xs={2}
              sm={3}
              md={3}
              key={d.id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card sx={{ maxWidth: 600 }}>
                <Link
                  to={`/dogs/${d.name}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="160"
                      image={d.imgurl}
                      alt={d.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {d.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

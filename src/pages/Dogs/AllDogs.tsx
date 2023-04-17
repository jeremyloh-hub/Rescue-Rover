import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

interface Dog {
  id: number;
  name: string;
  breed: string;
  gender: string;
  hdbapproved: boolean;
  dob: string;
  status: boolean;
  personality: string;
  imgurl: string;
}

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
                <Link to={`/dogs/${d.name}`}>
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

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { Box, Paper, Button, Grid } from "@mui/material";
import type { Dog } from "../../type";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.2)",
  },
}));

export default function SelectedDogs() {
  const [dog, setDog] = useState<Dog | null>(null);
  const { dogName } = useParams<{ dogName: string }>();
  const token = localStorage.getItem("token");
  const tokenUser = token ? JSON.parse(window.atob(token.split(".")[1])) : null;
  const [adoptionFormExists, setAdoptionFormExists] = useState(false);
  const [fosterFormExists, setFosterFormExists] = useState(false);

  const formExists = async (userid: number | null, formType: string) => {
    const response = await fetch(`/api/${formType}?userid=${userid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error checking if user ${formType} exists`);
    }
    const data = await response.json();
    if (data) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const checkForms = async () => {
      if (!token) {
        return null;
      } else {
        const userid = tokenUser.user.id;
        const adoptionExists = await formExists(userid, "adoption");
        const fosterExists = await formExists(userid, "foster");
        setAdoptionFormExists(adoptionExists);
        setFosterFormExists(fosterExists);
      }
    };
    checkForms();
  }, [token]);

  useEffect(() => {
    fetch(`/api/dogs/${dogName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: Dog) => {
        setDog(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {dog && (
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Item>
              <img src={dog.imgurl} alt={dog.name} width="100%" />
            </Item>
          </Grid>
          <Grid item xs={12} md={6}>
            <Item>
              <h2>{dog.name}</h2>
              <p>Breed: {dog.breed}</p>
              <p>
                Gender:{" "}
                {dog.gender === "male" ? (
                  <img
                    src="https://i.imgur.com/MnNnNPz.png"
                    alt="male"
                    width="20"
                    height="20"
                  />
                ) : (
                  <img
                    src="https://i.imgur.com/8zRGd6N.png"
                    alt="female"
                    width="20"
                    height="20"
                  />
                )}
              </p>
              HDB Approved:{" "}
              {dog.hdbapproved === true ? (
                <img
                  src="https://i.imgur.com/OluSXkQ.png"
                  alt="HDB approved"
                  width="20"
                  height="20"
                />
              ) : (
                <img
                  src="https://i.imgur.com/KOoepTi.png"
                  alt="HDB not approved"
                  width="20"
                  height="20"
                />
              )}
              {dog.dob && (
                <p>
                  <img
                    src="https://i.imgur.com/k9iIAtp.png"
                    alt="Birthday"
                    width="20"
                    height="20"
                  />
                  {dayjs(dog.dob).format("DD/MM/YYYY")}
                </p>
              )}
              <p>Personality: {dog.personality}</p>
              {token && (
                <>
                  <Link
                    to={`/dogs/adopt/${dog.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={(event) => {
                      if (adoptionFormExists) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{ mr: 1 }}
                      disabled={adoptionFormExists}
                    >
                      Adopt
                    </Button>
                  </Link>
                  <Link
                    to={`/dogs/foster/${dog.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={(event) => {
                      if (fosterFormExists) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <Button variant="outlined" disabled={fosterFormExists}>
                      Foster
                    </Button>
                  </Link>
                </>
              )}
            </Item>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

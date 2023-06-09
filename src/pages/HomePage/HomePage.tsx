import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Typography, Container } from "@mui/material";

const items = [
  {
    name: "Jurong Island Trap, Neuter, Release Program",
    image:
      "https://sosd.org.sg/wp-content/uploads/2015/01/CauseJurongIslandTNRM.jpg",
  },
  {
    name: "Rescue Fundraiser",
    image:
      "https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    name: "Rescue Charity Dinner",
    image:
      "https://images.pexels.com/photos/4877849/pexels-photo-4877849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

export default function HomePage() {
  return (
    <Container sx={{ marginTop: "2rem" }}>
      <Carousel
        autoPlay={false}
        navButtonsAlwaysVisible={true}
        indicatorContainerProps={{
          style: {
            marginTop: "1rem",
          },
        }}
      >
        {items.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </Carousel>
      <Container sx={{ marginTop: "2rem", marginBottom: "4rem" }}>
        <Typography variant="h4" align="center">
          Our Mission
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          Our mission is to connect adoptable dogs with loving families by
          creating a platform that simplifies the adoption process. We aim to
          provide a user-friendly and secure web application that allows
          potential adopters to browse available dogs, apply for adoption, and
          track the status of their application. Our goal is to make the
          adoption process as transparent and efficient as possible while
          promoting responsible pet ownership and supporting animal shelters and
          rescue organizations.
        </Typography>
      </Container>
    </Container>
  );
}

function Item(props: any) {
  return (
    <Paper
      style={{
        height: "350px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
          {props.item.name}
        </Typography>
        <img
          src={props.item.image}
          alt={props.item.name}
          style={{ width: "500px", height: "250px", objectFit: "cover" }}
        />
      </div>
    </Paper>
  );
}

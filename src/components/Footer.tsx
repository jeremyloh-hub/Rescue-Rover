import { Container, Typography } from "@mui/material";

const footerStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  backgroundColor: "#1876d2",
  color: "#fff",
  textAlign: "center",
};

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <Container maxWidth="sm">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Rescue Rover
        </Typography>
      </Container>
    </footer>
  );
}

import { Box, Button, Typography } from "@mui/material";

export default function AccessDeniedPage() {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" gutterBottom>
        You do not have permission to access this page.
      </Typography>
      <Button variant="contained" onClick={handleBackClick}>
        Go Back
      </Button>
    </Box>
  );
}

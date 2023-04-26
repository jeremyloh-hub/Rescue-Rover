import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import type { GetAdoptionForm, GetFosterForm } from "../../type";

export default function ApplicationStatus() {
  const [adoption, setAdoption] = useState<GetAdoptionForm[]>([]);
  const [foster, setFoster] = useState<GetFosterForm[]>([]);
  const token = localStorage.getItem("token");
  const tokenUser = token ? JSON.parse(window.atob(token.split(".")[1])) : null;
  const id = tokenUser.user.id;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/adoption/status/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      }),
      fetch(`/api/foster/status/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      }),
    ])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then(([adoptionData, fosterData]) => {
        setAdoption(adoptionData);
        setFoster(fosterData);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
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
        <>
          <Box mt={3}>
            <TableContainer
              component={Paper}
              style={{ width: "80%", margin: "auto" }}
            >
              <Table size="small" aria-label="a dense table">
                <caption
                  style={{
                    captionSide: "top",
                    textAlign: "center",
                    fontSize: "20px",
                  }}
                >
                  Adoption Application Status
                </caption>

                <TableHead>
                  <TableRow>
                    <TableCell align="center">Applicant</TableCell>
                    <TableCell align="center">Dog Name</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adoption.map((row) => (
                    <TableRow key={row.dog_name}>
                      <TableCell align="center" component="th" scope="row">
                        {row.user_name}
                      </TableCell>
                      <TableCell align="center">{row.dog_name}</TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box mt={3}></Box>
          <Box mt={3}>
            <TableContainer
              component={Paper}
              style={{ width: "80%", margin: "auto" }}
            >
              <Table size="small" aria-label="a dense table">
                <caption
                  style={{
                    captionSide: "top",
                    textAlign: "center",
                    fontSize: "20px",
                  }}
                >
                  Foster Application Status
                </caption>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Applicant</TableCell>
                    <TableCell align="center">Dog Name</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foster.map((row) => (
                    <TableRow key={row.dog_name}>
                      <TableCell align="center" component="th" scope="row">
                        {row.user_name}
                      </TableCell>
                      <TableCell align="center">{row.dog_name}</TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </>
  );
}

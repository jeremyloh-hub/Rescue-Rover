import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import type { GetAdoptionForm, GetFosterForm } from "../../type";

export default function ApplicationStatus() {
  const [adoption, setAdoption] = useState<GetAdoptionForm[]>([]);
  const [foster, setFoster] = useState<GetFosterForm[]>([]);
  const token = localStorage.getItem("token");
  const tokenUser = token ? JSON.parse(window.atob(token.split(".")[1])) : null;
  const id = tokenUser.user.id;

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
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Adoption Application Status
      </Typography>
      <TableContainer
        component={Paper}
        style={{ width: "80%", margin: "auto" }}
      >
        <Table size="small" aria-label="a dense table">
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
      <Typography variant="h4" align="center" gutterBottom>
        Foster Application Status
      </Typography>
      <TableContainer
        component={Paper}
        style={{ width: "80%", margin: "auto" }}
      >
        <Table size="small" aria-label="a dense table">
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
    </>
  );
}

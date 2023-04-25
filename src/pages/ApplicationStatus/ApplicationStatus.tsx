import { Link } from "react-router-dom";
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
import dayjs from "dayjs";

export default function ApplicationStatus() {
  const [adoption, setAdoption] = useState<any[]>([]);
  const [foster, setFoster] = useState<any[]>([]);
  const token = localStorage.getItem("token");
  const tokenUser = token ? JSON.parse(window.atob(token.split(".")[1])) : null;

  useEffect(() => {
    fetch(`/api/adoption/status/${tokenUser.user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: any) => {
        setAdoption(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetch(`/api/foster/status/${tokenUser.user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: any) => {
        setFoster(data);
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
            {adoption.map((row: any) => (
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
            {foster.map((row: any) => (
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

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
  Button,
} from "@mui/material";
import type { Dog, PostFormProps } from "../../type";
import dayjs from "dayjs";

export default function PostForm({ dogs }: PostFormProps) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">HDB Approved</TableCell>
              <TableCell align="center">Date Of Birth</TableCell>
              <TableCell align="center">Personality</TableCell>
              <TableCell align="center">Edit</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dogs.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">
                  {row.hdbapproved === true ? <p>Yes</p> : <p>No</p>}
                </TableCell>
                <TableCell align="center">
                  {dayjs(row.dob).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell align="center">{row.personality}</TableCell>
                <TableCell align="center">
                  <Link to={`/postform/edit/${row.id}`}>
                    <Button variant="contained">Edit</Button>
                  </Link>
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained">ADD</Button>
    </>
  );
}

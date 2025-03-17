import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


export default function TestRunTable ({ testRuns, onDelete, onEdit }: { testRuns: any[]; onDelete: (id: number) => void; onEdit: (testRun: any) => void }) {
    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testRuns.map((run) => (
                        <TableRow key={run.id}>
                            <TableCell>{run.id}</TableCell>
                            <TableCell>{run.title}</TableCell>
                            <TableCell>{run.status}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(run)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(run.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

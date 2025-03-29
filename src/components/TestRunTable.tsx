import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { getTestRuns, deleteTestRun } from "../api/TestRunApi";
import { useNavigate } from "react-router-dom";

interface TestRunTableProps {
    projectId: number;
    onEdit: (testRun: any) => void;
}

interface TestRun {
    id: number;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    testCases: any[];
}

const statusColors: { [key: string]: string } = {
    PASSED: "green",
    FAILED: "red",
    SKIPPED: "gray",
    ONWORK: "blue",
    COMPLETED: "purple",
};

const TestRunTable: React.FC<TestRunTableProps> = ({ projectId, onEdit }) => {
    const [testRuns, setTestRuns] = useState<TestRun[]>([]);
    const navigate = useNavigate();

    const fetchTestRuns = async () => {
        console.log("Fetching test runs for projectId:", projectId);
        try {
            const data = await getTestRuns(projectId);
            console.log("Test runs received from API:", data);
            setTestRuns([...data]);
        } catch (error) {
            console.error("Error fetching test runs:", error);
        }
    };

    useEffect(() => {
        console.log("useEffect triggered with projectId:", projectId);
        if (projectId) fetchTestRuns();
    }, [projectId]);

    const handleDelete = async (testRunId: number) => {
        await deleteTestRun(projectId, testRunId);
        fetchTestRuns();
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Дата создания</TableCell>
                        <TableCell>Дата обновления</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testRuns.length > 0 ? (
                        testRuns.map((testRun) => (
                            <TableRow key={testRun.id}>
                                <TableCell>{testRun.id}</TableCell>
                                <TableCell>{testRun.title}</TableCell>
                                <TableCell style={{ color: statusColors[testRun.status] || "black" }}>
                                    {testRun.status}
                                </TableCell>
                                <TableCell>{new Date(testRun.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{new Date(testRun.updatedAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => onEdit(testRun)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDelete(testRun.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <Button
                                        variant="outlined"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => navigate(`/projects/${projectId}/test-runs/${testRun.id}/execute`)}
                                    >
                                        Выполнить
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                Нет тест-ранов
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TestRunTable;
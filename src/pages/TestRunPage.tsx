import React, { useEffect, useState } from "react";
import { getTestRuns, deleteTestRun } from "../api/TestRunApi";
import { Button, Container, Typography } from "@mui/material";
import TestRunTable from "../components/TestRunTable";
import TestRunModal from "../components/TestRunModal";
import { useParams } from "react-router-dom";

export default function TestRunsPage() {
    const { id } = useParams();
    const projectId = Number(id);
    const [testRuns, setTestRuns] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRun, setSelectedRun] = useState(null);

    useEffect(() => {
        fetchTestRuns();
    }, []);

    const fetchTestRuns = async () => {
        const data = await getTestRuns(projectId);
        setTestRuns(data);
    };

    const handleDelete = async (testRunId: number) => {
        await deleteTestRun(projectId, testRunId);
        fetchTestRuns();
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Тест-раны
            </Typography>
            <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                Создать тест-ран
            </Button>
            <TestRunTable testRuns={testRuns} onDelete={handleDelete} onEdit={setSelectedRun} />
            <TestRunModal
                open={openModal || !!selectedRun}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedRun(null);
                }}
                projectId={projectId}
                testRun={selectedRun}
                onSuccess={fetchTestRuns}
            />
        </Container>
    );
};

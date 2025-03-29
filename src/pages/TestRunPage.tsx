import { useEffect, useState } from "react";
import { getTestRuns, deleteTestRun } from "../api/TestRunApi";
import { Button, Container, Typography, Stack, CircularProgress, Snackbar, Alert } from "@mui/material";
import TestRunTable from "../components/TestRunTable";
import TestRunModal from "../components/TestRunModal";
import { useParams } from "react-router-dom";

export default function TestRunsPage() {
    const { id } = useParams();
    const projectId = Number(id);

    const [testRuns, setTestRuns] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRun, setSelectedRun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTestRuns();
    }, []);

    const fetchTestRuns = async () => {
        setLoading(true);
        try {
            const data = await getTestRuns(projectId);
            setTestRuns(data);
        } catch (err) {
            setError("Ошибка загрузки тест-ранов");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (testRunId: number) => {
        try {
            await deleteTestRun(projectId, testRunId);
            fetchTestRuns();
        } catch {
            setError("Ошибка удаления тест-рана");
        }
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Тест-раны
            </Typography>

            {error && (
                <Snackbar open autoHideDuration={4000} onClose={() => setError(null)}>
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
            )}

            {/* Кнопка создания тест-рана */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                    Создать тест-ран
                </Button>
            </Stack>

            {/* Таблица с тест-ранами */}
            {loading ? (
                <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />
            ) : (
                <TestRunTable projectId={projectId} testRuns={testRuns} onDelete={handleDelete} onEdit={setSelectedRun} />
            )}

            {/* Модалка создания/редактирования тест-рана */}
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
}
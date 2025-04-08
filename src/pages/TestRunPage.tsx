import { useEffect, useState } from "react";
import { getTestRuns, deleteTestRun, updateTestRun } from "../api/TestRunApi";
import { Button, Container, Typography, Stack, CircularProgress, Snackbar, Alert, Box } from "@mui/material";
import TestRunTable from "../components/TestRunTable";
import TestRunModal from "../components/TestRunModal";
import { useNavigate, useParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function TestRunsPage() {
    const { id } = useParams();
    const projectId = Number(id);

    const [testRuns, setTestRuns] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRun, setSelectedRun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

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

    const handleDelete = async (e:React.MouseEvent,testRunId: number) => {
        e.stopPropagation();
        try {
            await deleteTestRun(projectId, testRunId);
            fetchTestRuns();
        } catch {
            setError("Ошибка удаления тест-рана");
        }
    };

    // const handleUpdate = async (e:React.MouseEvent,testRunId: number, data:any) => {
    //     e.stopPropagation();
    //     try{
    //         await updateTestRun(projectId, testRunId,data);
    //     }
    // }

    return (
        <Container>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
            </IconButton>
                <Typography variant="h4">
                    Тест-раны
                </Typography>
            </Box>

            {error && (
                <Snackbar open autoHideDuration={4000} onClose={() => setError(null)}>
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
            )}

            {/* Кнопка создания тест-рана */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained" sx={{bgcolor:'#BA3CCD'}} onClick={() => setOpenModal(true)}>
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
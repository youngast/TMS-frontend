import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProjectById,
  deleteTestSuite,
  updateTestSuite,
  createTestSuite,
  fetchTestSuitesByProjectId
} from "../api";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateTestSuiteModal from "../components/CreateTestSuiteModal";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  testSuites?: { id: number; name: string; testCasesCount: number; createdAt: string; updatedAt: string }[];
  members: { id: number; name: string }[];
  owner: { id: number; name: string };
}

export default function ProjectDetails() {
  const { id } = useParams<{ id?: string }>();
  const projectId = id ? parseInt(id, 10) : NaN;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testSuiteModalOpen, setTestSuiteModalOpen] = useState(false);
  const [editSuite, setEditSuite] = useState<{ id: number; name: string } | null>(null);
  const [deleteSuiteId, setDeleteSuiteId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isNaN(projectId)) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      console.log(`Запрос на проект: /projects/${projectId}`);
      const projectData = await fetchProjectById(projectId);
      const testsuite = await fetchTestSuitesByProjectId(projectId);
      setProject({ ...projectData, testSuites: testsuite });
      setError(null);
    } catch (err) {
      console.error("❌ Ошибка при загрузке проекта:", err);
      setError("Не удалось загрузить проект. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuite = async () => {
    if (editSuite && projectId) {
      console.log(`🔹 Обновление тест-сьюта ${editSuite.id} в проекте ${projectId}`);
      try {
        await updateTestSuite(projectId, editSuite.id, { name: editSuite.name });
        setEditSuite(null);
        loadProject(); // Обновляем данные после редактирования
      } catch (error) {
        console.error("❌ Ошибка при обновлении тест-сьюта:", error);
      }
    }
  };
  
  // const handleDeleteSuite = async () => {
  //   if (deleteSuiteId) {
  //     await deleteTestSuite(deleteSuiteId);
  //     setDeleteSuiteId(null);
  //     loadProject();
  //   }
  // };
  

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f5f5" }}>
      <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {project?.name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" onClick={() => setTestSuiteModalOpen(true)}>
              Создать тест-сьют
            </Button>
          </CardActions>
        </Card>
        
        <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Тест-сьюты</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Кол-во тест-кейсов</TableCell>
                  <TableCell>Дата создания</TableCell>
                  <TableCell>Дата обновления</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {project?.testSuites?.map((suite) => (
                  <TableRow key={suite.id}>
                    <TableCell>{suite.id}</TableCell>
                    <TableCell>{suite.name}</TableCell>
                    <TableCell>{suite.testCasesCount}</TableCell>
                    <TableCell>{suite.createdAt}</TableCell>
                    <TableCell>{suite.updatedAt}</TableCell>
                    <TableCell>
                      <Tooltip title="Редактировать">
                        <IconButton onClick={() => setEditSuite({ id: suite.id, name: suite.name })}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton color="error" onClick={() => setDeleteSuiteId(suite.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
      <CreateTestSuiteModal projectId={project?.id || 0} open={testSuiteModalOpen} onClose={() => setTestSuiteModalOpen(false)} onCreate={loadProject} />
      
      <Dialog open={!!editSuite} onClose={() => setEditSuite(null)}>
        <DialogTitle>Редактировать тест-сьют</DialogTitle>
        <DialogContent>
          <TextField fullWidth value={editSuite?.name || ""} onChange={(e) => setEditSuite({ ...editSuite!, name: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSuite(null)}>Отмена</Button>
          <Button onClick={handleEditSuite} color="primary">Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteSuiteId} onClose={() => setDeleteSuiteId(null)}>
        <DialogTitle>Удаление тест-сьюта</DialogTitle>
        <DialogContent>Вы уверены, что хотите удалить этот тест-сьют?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteSuiteId(null)}>Отмена</Button>
          {/* <Button onClick={handleDeleteSuite} color="error">Удалить</Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProjectById,
  deleteProject,
  createTestSuite,
  addUserToProject
} from "../api";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../useAuth";
import CreateTestSuiteModal from "../components/CreateTestSuiteModal";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  members: { id: number; name: string }[];
  owner: { id: number; name: string };
}

export default function ProjectDetails() {
  const { id } = useParams<{ id?: string }>();
  const projectId = id ? parseInt(id, 10) : NaN;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testSuiteModalOpen, setTestSuiteModalOpen] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [addingUser, setAddingUser] = useState(false);

  const navigate = useNavigate();
  const { userId } = useAuth();

  // useEffect(() => {
  //   if (!isNaN(projectId)) {
  //     loadProject();
  //   } else {
  //     console.error("❌ Ошибка: projectId = NaN");
  //     setLoading(false);
  //   }
  // }, [projectId]);

  useEffect(() => {
    if (!isNaN(projectId)) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectData = await fetchProjectById(projectId);
      setProject(projectData);
      setError(null);
    } catch (err) {
      console.error("❌ Ошибка при загрузке проекта:", err);
      setError("Не удалось загрузить проект. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project?.id || 0);
      navigate("/");
    } catch (err) {
      console.error("❌ Ошибка при удалении проекта:", err);
    }
  };

  const handleCreateTestSuite = async (name: string) => {
    try {
      await createTestSuite(project?.id || 0, name);
      alert("✅ Тест-сьют создан успешно!");
    } catch (err) {
      console.error("❌ Ошибка при создании тест-сьюта:", err);
    }
  };

  const handleAddUser = async () => {
    if (!newUserId.trim()) return;
    try {
      setAddingUser(true);
      await addUserToProject(project?.id || 0, +newUserId);
      setNewUserId("");
      loadProject(); // Обновляем список участников
    } catch (err) {
      console.error("❌ Ошибка при добавлении пользователя:", err);
    } finally {
      setAddingUser(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={loadProject} variant="contained" sx={{ mt: 2 }}>
          Повторить попытку
        </Button>
      </Box>
    );
  }

  const isOwner = project?.owner?.id === userId;
  const isMember = project?.members?.some((member) => member.id === userId);
  const canCreateTestSuite = isOwner || isMember;

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f5f5" }}>
      <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Карточка проекта */}
        <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {project?.name}
              </Typography>

              {isOwner && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Редактировать">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Удалить проект">
                    <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {project?.description}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Дата создания: {project?.createdAt || "Неизвестно"}
            </Typography>
          </CardContent>

          <CardActions>
            <Button variant="contained" onClick={() => navigate(`/test-suites/${projectId}`)}>
              Открыть тест-сьюты
            </Button>

            {canCreateTestSuite && (
              <Button variant="contained" color="primary" onClick={() => setTestSuiteModalOpen(true)}>
                Создать тест-сьют
              </Button>
            )}
          </CardActions>
        </Card>

        {/* Карточка участников */}
        <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6">Участники проекта</Typography>
            <List>
              {project?.members.map((member) => (
                <ListItem key={member.id}>
                  <ListItemText primary={member.name} />
                </ListItem>
              ))}
            </List>

            {isOwner && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="ID пользователя"
                  fullWidth
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={handleAddUser}
                  disabled={addingUser}
                >
                  {addingUser ? "Добавляем..." : "+ Добавить участника"}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Модалка создания тест-сьюта */}
      <CreateTestSuiteModal projectId={project?.id || 0} open={testSuiteModalOpen} onClose={() => setTestSuiteModalOpen(false)} />

      {/* Диалог удаления */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Удаление проекта</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы уверены, что хотите удалить этот проект?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleDeleteProject} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

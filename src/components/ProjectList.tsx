import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects, fetchCurrentUser } from "../api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateProjectModal from "./CreateProjectModal";
import Filters from "./Filters";
import { deleteProject } from "../api/Projectapi";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useAuth } from "./AuthContext";
import { fetchMyProjects, addUserToProject, deleteUserFromProject } from "../api/Projectapi";


interface Project {
  id: number;
  name: string;
  owner: { id: number; name: string };
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("active");

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const navigate = useNavigate();

  const {user} = useAuth();

  const [modalOpenProjectId, setModalOpenProjectId] = useState<number | null>(null);
  const [memberEmail, setMemberEmail] = useState<string>("");

  useEffect(() => {
    loadProjects();
  }, [searchTerm, status]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка при загрузке проектов:", err);
      setError("Не удалось загрузить проекты.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleDeleteProject = (projectId: number) => {
    deleteProject(projectId).then(() => {
      loadProjects();
    });
  };

  const handleConfirmAddMember = async () => {
    if (!modalOpenProjectId || !memberEmail) return;
  
    try {
      await addUserToProject(modalOpenProjectId, memberEmail);
      alert('Пользователь добавлен!');
      setModalOpenProjectId(null);
      setMemberEmail("");
      loadProjects();
    } catch (err) {
      alert('Ошибка при добавлении пользователя');
    }
  };  

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      {/* Компонент фильтров */}
      <Filters
        searchTerm={searchTerm}
        status={status}
        viewMode={viewMode}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatus}
        onViewChange={setViewMode}
        onOpenCreateProject={() => setModalOpen(true)}
      />

      {/* Модальное окно создания проекта */}
      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onProjectCreated={loadProjects}
      />



      {/* Отображение проектов в зависимости от viewMode */}
      {viewMode === "list" ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Название проекта</b></TableCell>
                <TableCell><b>Владелец</b></TableCell>
                <TableCell align="right"><b>Действия</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow
                    key={project.id}
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f5f5f5" } }}
                    onClick={() => handleOpenProject(project.id)}
                  >
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.owner.name}</TableCell>
                    <TableCell align="right">
                    {user && user.id === project.owner.id && (
                      <>
                      <IconButton onClick={(e)=> {e.stopPropagation(); setModalOpenProjectId(project.id);}}><MoreVertIcon/></IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Dialog open={modalOpenProjectId !== null} onClose={() => setModalOpenProjectId(null)}>
                        <DialogTitle>Добавить пользователя в проект</DialogTitle>
                        <DialogContent>
                        <TextField label="Email пользователя" type="email" fullWidth value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)}/>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setModalOpenProjectId(null)}>Отмена</Button>
                          <Button variant="contained" onClick={handleConfirmAddMember}> Добавить </Button>
                        </DialogActions>
                      </Dialog>
                      </>
                    )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Проектов нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Grid item xs={12} sm={6} md={3} key={project.id}>
                <Card
                  sx={{ p: 2, cursor: "pointer", "&:hover": { bgcolor: "#f5f5f5" } }}
                  onClick={() => handleOpenProject(project.id)}
                >
                  <CardContent>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography variant="body2">Владелец: {project.owner.name}</Typography>
                  </CardContent>
                  <Button variant="outlined" onClick={(e) => { e.stopPropagation(); handleOpenProject(project.id);}}sx={{ m: 1 }}> Открыть</Button>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", width: "100%", mt: 2 }}>
              Проектов нет
            </Typography>
          )}
        </Grid>
      )}
    </>
  );


  
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Grid, Card, CardContent,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateProjectModal from "./CreateProjectModal";
import Filters from "./Filters";
import { useAuth } from "./AuthContext";
import {fetchMyProjects,deleteProject,addUserToProject,deleteUserFromProject} from "../api/Projectapi";
import UsersAutocomplete from "./UserAutocomplete";

interface Project {
  id: number;
  name: string;
  owner: { id: number; name: string };
  // Предположим, у нас есть список участников
  members?: { id: number; email: string }[];
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("active");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Модалка управления участниками
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, [searchTerm, status]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyProjects(); // ваш API
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

  // Открыть/закрыть модалку участников
  const openMembersModal = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setMembersModalOpen(true);
  };
  const closeMembersModal = () => {
    setMembersModalOpen(false);
    setSelectedProject(null);
  };

  const handleSelectUser = async (newUser: { id: number; email: string } | null) => {
    if (!newUser || !selectedProject) return;
    try {
      await addUserToProject(selectedProject.id, newUser.email);
      await loadProjects();
    } catch (err) {
      alert("Ошибка при добавлении пользователя");
    }
  };

  // Удалить участника
  const handleRemoveMember = async (userEmail: string) => {
    if (!selectedProject) return;
    try {
      await deleteUserFromProject(selectedProject.id, userEmail);
      await loadProjects();
    } catch (err) {
      alert("Ошибка при удалении пользователя");
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Filters
        searchTerm={searchTerm}
        status={status}
        viewMode={viewMode}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatus}
        onViewChange={setViewMode}
        onOpenCreateProject={() => setModalOpen(true)}
      />

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onProjectCreated={loadProjects}
      />

      {/* Модалка "Управление участниками" */}
      <Dialog open={membersModalOpen} onClose={closeMembersModal} sx={ { "& .MuiDialog-paper": { width: "80%" } }}>
        <DialogTitle>Управление участниками</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {selectedProject.name}
              </Typography>

              {/* Список участников */}
              {selectedProject.members && selectedProject.members.length > 0 ? (
                <List>
                  {selectedProject.members.map((m) => (
                    <ListItem
                      key={m.id}
                      secondaryAction={
                        <Button color="error" onClick={() => handleRemoveMember(m.email)}>
                          Удалить
                        </Button>
                      }
                    >
                      <ListItemText primary={m.email} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Пока нет участников</Typography>
              )}

              {/* Автокомплит для добавления нового участника */}
              <UsersAutocomplete onUserSelect={handleSelectUser} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeMembersModal}>Закрыть</Button>
        </DialogActions>
      </Dialog>

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
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      {user && user.id === project.owner.id && (
                        <>
                          <IconButton onClick={(e) => openMembersModal(e, project)}>
                            <MoreVertIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
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
                    <Typography variant="body2">
                      Владелец: {project.owner.name}
                    </Typography>
                  </CardContent>
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

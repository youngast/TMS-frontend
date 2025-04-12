import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Grid, Card, CardContent,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateProjectModal from "./CreateProjectModal";
import Filters from "./Filters";
import { useAuth } from "../context/AuthContext";
import { fetchMyProjects, deleteProject, addUserToProject, deleteUserFromProject, findProjectByName } from "../api/Projectapi";
import UsersAutocomplete from "./UserAutocomplete";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

interface Project {
  id: number;
  name: string;
  owner: { id: number; name: string };
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

  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const navigate = useNavigate();
  const { user, loadingUser } = useAuth();

  useEffect(() => {
    loadProjects();
}, [ status, loadingUser]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyProjects(); // API
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Ошибка при загрузке проектов:", err);
      setError("Не удалось загрузить проекты.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (term: string) => {
    setSearchTerm(term);

    if (!term) {
      loadProjects();
      return;
    }
  
    try {
      const results = await findProjectByName(term);
  
      // 🔒 Фильтрация по доступу
      const accessible = results.filter((project) => {
        return (
          project.owner.id === user?.id ||
          project.members?.some((member) => member.id === user?.id)
        );
      });
  
      setProjects(accessible);
    } catch (err) {
      console.error("Ошибка при поиске проектов:", err);
      setError("Ошибка при поиске");
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
      setSelectedProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          members: [
            ...(prev.members || []),
            {
              id: newUser.id,
              email: newUser.email,
            },
          ],
        };
      });
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === selectedProject.id
            ? {
                ...proj,
                members: [
                  ...(proj.members || []),
                  {
                    id: newUser.id,
                    email: newUser.email,
                  },
                ],
              }
            : proj
        )
      );
    } catch (err) {
      alert("Ошибка при добавлении пользователя");
    }
  };

  const handleRemoveMember = async (userEmail: string) => {
    if (!selectedProject) return;
    try {
      await deleteUserFromProject(selectedProject.id, userEmail);
      setSelectedProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          members: (prev.members || []).filter((m) => m.email !== userEmail),
        };
      });

      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === selectedProject.id
            ? {
                ...proj,
                members: (proj.members || []).filter((m) => m.email !== userEmail),
              }
            : proj
        )
      );
    } catch (err) {
      alert("Ошибка при удалении пользователя");
    }
  };

  if (loading || !user) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Filters
        searchTerm={searchTerm}
        status={status}
        viewMode={viewMode}
        onSearchChange={handleSearchChange}
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
      <Dialog open={membersModalOpen} onClose={closeMembersModal} sx={{ "& .MuiDialog-paper": { width: "80%" } }}>
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

      {/* Список проектов */}
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
                      <PersonAddAltIcon />
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
  <Grid container spacing={2} sx={{ mt: 2 }}>
    {projects.length > 0 ? (
      projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Card
            sx={{ cursor: "pointer", "&:hover": { boxShadow: 6 } }}
            onClick={() => handleOpenProject(project.id)}
          >
            <CardContent>
              <Typography variant="h6">{project.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Владелец: {project.owner.name}
              </Typography>
              {user && user.id === project.owner.id && (
                <div style={{ marginTop: "8px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  <IconButton onClick={(e) => openMembersModal(e, project)} size="small">
                    <PersonAddAltIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))
    ) : (
      <Typography sx={{ mx: 2 }}>Проектов нет</Typography>
    )}
  </Grid>
)}
    </>
  );
}
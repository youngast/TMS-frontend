import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Добавляем `useNavigate`
import { fetchProjects } from "../api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, Card, CardContent } from "@mui/material";
import CreateProjectModal from "./CreateProjectModal"; // ✅ Импортируем модалку
import Filters from "./Filters"; // ✅ Импортируем кнопку "Новый проект"

interface Project {
  id: number;
  name: string;
  owner: { name: string }; 
}

export default function ProjectList({ viewMode }: { viewMode: "list" | "grid" }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    fetchProjects()
      .then(setProjects)
      .catch((error) => {
        console.error("Ошибка при загрузке проектов:", error);
        setError("Не удалось загрузить проекты.");
      })
      .finally(() => setLoading(false));
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Filters onOpenCreateProject={() => setModalOpen(true)} onViewChange={() => {}} />
      <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onProjectCreated={loadProjects} />

      {viewMode === "list" ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Название проекта</b></TableCell>
                <TableCell><b>Владелец</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow 
                    key={project.id} 
                    onClick={() => handleProjectClick(project.id)} //Добавляем клик
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f5f5f5" } }} //Добавляем эффект при наведении
                  >
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.owner.name}</TableCell> 
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">Проектов нет</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {projects.length > 0 ? (
            projects.map((project) => (
              <Grid item xs={12} sm={6} md={2} key={project.id}>
                <Card 
                  sx={{ p: 2, cursor: "pointer", "&:hover": { bgcolor: "#f5f5f5" } }} 
                  onClick={() => handleProjectClick(project.id)} //Добавляем клик
                >
                  <CardContent>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography variant="body2">Владелец: {project.owner.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", width: "100%", mt: 2 }}>Проектов нет</Typography>
          )}
        </Grid>
      )}
    </>
  );
}

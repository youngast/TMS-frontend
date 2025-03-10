import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../api";
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
} from "@mui/material";
import CreateProjectModal from "./CreateProjectModal";
import Filters from "./Filters";

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

  const handleOpenProject = (projectId: number) => {
    navigate(`/projects/${projectId}`); // Переход на страницу проекта
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
                <TableCell align="right"><b>Действия</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow
                    key={project.id}
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f5f5f5" } }}
                    onClick={() => handleOpenProject(project.id)} // Переход при клике
                  >
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.owner.name}</TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" onClick={(e) => {
                        e.stopPropagation(); // Останавливаем клик, чтобы не переходить при нажатии на кнопку
                        handleOpenProject(project.id);
                      }}>
                        Открыть
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">Проектов нет</TableCell>
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
                  onClick={() => handleOpenProject(project.id)} // Переход при клике
                >
                  <CardContent>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography variant="body2">Владелец: {project.owner.name}</Typography>
                  </CardContent>
                  <Button variant="outlined" onClick={(e) => {
                    e.stopPropagation(); // Останавливаем всплытие клика
                    handleOpenProject(project.id);
                  }} sx={{ m: 1 }}>
                    Открыть
                  </Button>
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

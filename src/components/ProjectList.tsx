import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../api/api";
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

  useEffect(() => {
    loadProjects();
  }, [searchTerm, status]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
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
                      {/* тут можно добавить кнопки "Удалить", "Редактировать" и т.д. */}
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
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation(); // чтобы не сработал onClick карточки
                      handleOpenProject(project.id);
                    }}
                    sx={{ m: 1 }}
                  >
                    Открыть
                  </Button>
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

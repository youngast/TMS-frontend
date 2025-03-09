import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById } from "../api";
import { Typography, Box } from "@mui/material";
import TestSuitesSidebar from "../components/TestSuitesSidebar";

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function ProjectDetails() {
  const { id } = useParams<{ id?: string }>();
  const projectId = id ? parseInt(id, 10) : NaN;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNaN(projectId)) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const projectData = await fetchProjectById(projectId);
      setProject(projectData);
    } catch (err) {
      console.error("Ошибка при загрузке проекта:", err);
      setError("Не удалось загрузить проект.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Боковая панель с тест-сьютами */}
      <TestSuitesSidebar />

      {/* Основная часть */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4">{project?.name}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{project?.description}</Typography>
      </Box>
    </Box>
  );
}

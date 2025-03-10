import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTestSuites, createTestSuite } from "../api";
import { Typography, Paper, List, ListItem, ListItemText, Button, Box } from "@mui/material";
import CreateTestSuiteModal from "./CreateTestSuiteModal";

interface TestSuite {
  id: number;
  name: string;
}

export default function TestSuitesSidebar() {
  const { id } = useParams<{ id?: string }>(); // ID проекта
  const projectId = id ? parseInt(id, 10) : NaN;

  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [newSuiteName, setNewSuiteName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isNaN(projectId)) {
      loadTestSuites();
    }
  }, [projectId]);

  const loadTestSuites = async () => {
    try {
      const suites = await fetchTestSuites(projectId);
      setTestSuites(suites);
    } catch (err) {
      console.error("Ошибка при загрузке тест-сьютов:", err);
    }
  };

  const handleCreateTestSuite = async () => {
    if (!newSuiteName.trim()) return;
    await createTestSuite(projectId, newSuiteName);
    setNewSuiteName("");
    loadTestSuites(); // Обновляем список тест-сьютов
  };

  return (
    <Paper sx={{ width: 250, height: "100vh", p: 2, mr: 2 }}>
      <Typography variant="h6">Тест-сьюты</Typography>

      {/* Список тест-сьютов */}
      <List>
        {testSuites.map((suite) => (
          <ListItem key={suite.id} component={Link} to={`/test-suites/${suite.id}`}>
            <ListItemText primary={suite.name} />
          </ListItem>
        ))}
      </List>

      {/* Поле для создания тест-сьюта */}
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" sx={{ mt: 1, width: "100%" }} onClick={() => setIsModalOpen(true)}>
          ➕ Добавить тест-сьют
        </Button>
      </Box>

      <CreateTestSuiteModal projectId={projectId} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Paper>
  );
}

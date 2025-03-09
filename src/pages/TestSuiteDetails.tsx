import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTestSuitesByProjectId, fetchTestCases, createTestCase } from "../api";
import { Typography, Box, Paper, List, ListItem, ListItemText, Button } from "@mui/material";

interface TestSuite {
  id: number;
  name: string;
}

interface TestCase {
  id: number;
  title: string;
}

export default function TestSuiteDetails() {
  const { id } = useParams<{ id?: string }>();
  const suiteId = id ? parseInt(id, 10) : NaN;

  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [newCaseTitle, setNewCaseTitle] = useState("");

  useEffect(() => {
    if (!isNaN(suiteId)) {
      loadTestSuite();
    }
  }, [suiteId]);

  const loadTestSuite = async () => {
    try {
      const suite = await fetchTestSuitesByProjectId(suiteId);
      const cases = await fetchTestCases(suiteId);
      setTestSuite(suite);
      setTestCases(cases);
    } catch (err) {
      console.error("Ошибка при загрузке тест-сьюта:", err);
    }
  };

  const handleCreateTestCase = async () => {
    if (!newCaseTitle.trim()) return;
    await createTestCase(suiteId, newCaseTitle);
    setNewCaseTitle("");
    loadTestSuite();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{testSuite?.name}</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Создать тест-кейс</Typography>
        <input
          type="text"
          value={newCaseTitle}
          onChange={(e) => setNewCaseTitle(e.target.value)}
          placeholder="Название тест-кейса"
        />
        <Button variant="contained" sx={{ mt: 1 }} onClick={handleCreateTestCase}>
          ➕ Добавить тест-кейс
        </Button>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Список тест-кейсов</Typography>
        <List>
          {testCases.map((testCase) => (
            <ListItem key={testCase.id}>
              <ListItemText primary={testCase.title} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

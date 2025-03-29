import React, { useEffect, useState } from "react";
import { createTestRun, updateTestRun, addTestCaseToRun } from "../api/TestRunApi";
import { fetchTestCases, fetchTestSuitesByProjectId } from "../api/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";

export default function TestRunModal({
  open,
  onClose,
  projectId,
  testRun,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  projectId: number;
  testRun?: any;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testSuites, setTestSuites] = useState<{ id: number; name: string }[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<number | null>(null);
  const [testCases, setTestCases] = useState<{ id: number; title: string }[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTestCases, setLoadingTestCases] = useState(false);

  // Загружаем тест-сьюты при открытии модалки
  useEffect(() => {
    if (open) {
      fetchTestSuitesByProjectId(projectId).then((data) => {
        setTestSuites(data);
        if (data.length > 0) {
          setSelectedSuiteId(data[0].id);
        }
      });
    }
  }, [open, projectId]);

  // Загружаем тест-кейсы при выборе тест-сьюта
  useEffect(() => {
    if (selectedSuiteId) {
      setLoadingTestCases(true);
      fetchTestCases(selectedSuiteId)
        .then((data) => setTestCases(data))
        .finally(() => setLoadingTestCases(false));
    }
  }, [selectedSuiteId]);

  // Устанавливаем данные тест-рана при редактировании
  useEffect(() => {
    if (testRun) {
      setTitle(testRun.title || "");
      setDescription(testRun.description || "");
      setSelectedSuiteId(testRun.testSuite?.id || null);
      setSelectedTestCases(testRun.testCases ? testRun.testCases.map((tc: any) => tc.id) : []);
    } else {
      setTitle("");
      setDescription("");
      setSelectedTestCases([]);
    }
  }, [testRun, open]);

  // Обработчик выбора тест-кейсов
  const handleTestCaseToggle = (testCaseId: number) => {
    setSelectedTestCases((prev) =>
      prev.includes(testCaseId) ? prev.filter((id) => id !== testCaseId) : [...prev, testCaseId]
    );
  };

  // Сохранение тест-рана (создание или редактирование)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (testRun) {
        await updateTestRun(projectId, testRun.id, { title, description });

        for (const testCaseId of selectedTestCases) {
          await addTestCaseToRun(projectId, testRun.id, testCaseId);
        }
      } else {
        const newTestRun = await createTestRun(projectId, {
          title,
          description,
          testSuiteId: selectedSuiteId,
          testCaseIds: selectedTestCases.length > 0 ? selectedTestCases : [],
        });

        console.log("Создан новый тест-ран:", newTestRun);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении тест-рана:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{testRun ? "Редактировать тест-ран" : "Создать тест-ран"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Выбор тест-сьюта */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Выберите тест-сьют</InputLabel>
          <Select
            value={selectedSuiteId || ""}
            onChange={(e) => setSelectedSuiteId(Number(e.target.value))}
          >
            {testSuites.map((suite) => (
              <MenuItem key={suite.id} value={suite.id}>
                {suite.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Выбор тест-кейсов */}
        <FormGroup sx={{ mt: 2 }}>
          <p>Выберите тест-кейсы (опционально):</p>
          {loadingTestCases ? (
            <CircularProgress size={24} sx={{ display: "block", mx: "auto", mt: 2 }} />
          ) : testCases.length > 0 ? (
            testCases.map((testCase) => (
              <FormControlLabel
                key={testCase.id}
                control={
                  <Checkbox
                    checked={selectedTestCases.includes(testCase.id)}
                    onChange={() => handleTestCaseToggle(testCase.id)}
                  />
                }
                label={testCase.title}
              />
            ))
          ) : (
            <p>Нет доступных тест-кейсов.</p>
          )}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
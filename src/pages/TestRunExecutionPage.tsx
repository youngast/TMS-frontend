import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTestRunById,
  updateTestCaseStatus,
  completeTestRun,
} from "../api/TestRunApi";
import {
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
} from "@mui/material";
import { TestRunStatus } from "../enums/TestRunStatus";

export default function TestRunExecutionPage() {
  const { projectId, testRunId } = useParams();
  const navigate = useNavigate();
  const [testRun, setTestRun] = useState<any>(null);
  const [testCaseStatuses, setTestCaseStatuses] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    if (!projectId || !testRunId) {
      console.error("Ошибка: projectId или testRunId отсутствуют", {
        projectId,
        testRunId,
      });
      return;
    }
    fetchTestRun();
  }, [projectId, testRunId]);

  const fetchTestRun = async () => {
    const pid = Number(projectId);
    const tid = Number(testRunId);

    if (isNaN(pid) || isNaN(tid)) {
      console.error("Ошибка: projectId или testRunId не являются числами", {
        projectId,
        testRunId,
      });
      return;
    }

    try {
      const data = await getTestRunById(pid, tid);
      setTestRun(data);

      const initialStatuses = data.testCases.reduce(
        (acc: any, testCase: any) => {
          acc[testCase.id] = testCase.status || TestRunStatus.ONWORK;
          return acc;
        },
        {}
      );
      setTestCaseStatuses(initialStatuses);
    } catch (error) {
      console.error("Ошибка при загрузке тест-рана:", error);
    }
  };

  const handleStatusChange = (testCaseId: number, status: string) => {
    setTestCaseStatuses((prevState) => ({
      ...prevState,
      [testCaseId]: status,
    }));
  };

  const handleSave = async () => {
    const pid = Number(projectId);
    const tid = Number(testRunId);

    if (!projectId || !testRunId) {
      console.error("Ошибка: projectId или testRunId отсутствуют", {
        projectId,
        testRunId,
      });
      return;
    }

    if (isNaN(pid) || isNaN(tid)) {
      console.error("Ошибка: projectId или testRunId не являются числами", {
        projectId,
        testRunId,
      });
      return;
    }

    if (Object.keys(testCaseStatuses).length !== testRun.testCases.length) {
      console.error("Ошибка: не все тест-кейсы были обновлены", {
        testCaseStatuses,
        testRun,
      });
      return;
    }

    try {
      for (const testCase of testRun.testCases) {
        const status = testCaseStatuses[testCase.id];

        switch (status) {
          case TestRunStatus.PASSED:
            await updateTestCaseStatus(pid, testCase.id, TestRunStatus.PASSED);
            break;
          case TestRunStatus.FAILED:
            await updateTestCaseStatus(pid, testCase.id, TestRunStatus.FAILED);
            break;
          case TestRunStatus.SKIPPED:
            await updateTestCaseStatus(
              pid,
              testCase.id,
              TestRunStatus.SKIPPED
            );
            break;
          default:
            await updateTestCaseStatus(pid, testCase.id, TestRunStatus.ONWORK);
            break;
        }
      }

      await completeTestRun(pid, tid);

      navigate(`/projects/${projectId}/test-runs`);
    } catch (error) {
      console.error("Ошибка при сохранении тест-рана:", error);
    }
  };

  if (!testRun) return <Typography>Загрузка...</Typography>;

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Выполнение тест-рана: {testRun.title}
      </Typography>

      <List>
        {testRun.testCases.map((testCase: any) => (
          <ListItem key={testCase.id}>
            <ListItemText
              primary={testCase.title}
              secondary={testCase.description}
            />
            <Select
              value={testCaseStatuses[testCase.id] || TestRunStatus.ONWORK}
              onChange={(e) =>
                handleStatusChange(testCase.id, e.target.value as string)
              }
            >
              <MenuItem value={TestRunStatus.PASSED}>Успешно</MenuItem>
              <MenuItem value={TestRunStatus.FAILED}>Провален</MenuItem>
              <MenuItem value={TestRunStatus.SKIPPED}>Пропущен</MenuItem>
            </Select>
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Завершить тест-ран
      </Button>
    </Container>
  );
}

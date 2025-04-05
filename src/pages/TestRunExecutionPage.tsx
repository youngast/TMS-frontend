import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTestRunById,
  updateTestCaseStatus,
  completeTestRun,
  exportToPdf
} from "../api/TestRunApi";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  Button,
  Box,
  TextField,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { TestRunStatus } from "../enums/TestRunStatus";
import DownloadIcon from '@mui/icons-material/Download';

export default function TestRunExecutionPage() {
  const { projectId, testRunId } = useParams();
  const navigate = useNavigate();
  const [testRun, setTestRun] = useState<any>(null);
  const [testCaseStatuses, setTestCaseStatuses] = useState<{[key: number]: TestRunStatus;}>({});
  const [testCaseComments, setTestCaseComments] = useState<{ [key: number]: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (projectId && testRunId) fetchTestRun();
  }, [projectId, testRunId]);

  const fetchTestRun = async () => {
    const pid = Number(projectId);
    const tid = Number(testRunId);
    if (isNaN(pid) || isNaN(tid)) return;

    try {
      const data = await getTestRunById(pid, tid);
      setTestRun(data);
      const initialStatuses = data.testCases.reduce((acc: any, testCase: any) => {
        acc[testCase.id] = testCase.status || TestRunStatus.ONWORK;
        return acc;
      }, {});
      setTestCaseStatuses(initialStatuses);
    } catch (err) {
      console.error("Ошибка при загрузке тест-рана:", err);
    }
  };

  function handleStatusChange(testCaseId: number, status: TestRunStatus) {
    setTestCaseStatuses(prev => ({ ...prev, [testCaseId]: status }));
  }  

  const handleSave = async () => {
    const pid = Number(projectId);
    const tid = Number(testRunId);
    if (!testRun || isNaN(pid) || isNaN(tid)) return;

    setSaving(true);
    try {
      for (const testCase of testRun.testCases) {
        const status = testCaseStatuses[testCase.id];
        await updateTestCaseStatus(pid, testCase.id, status);
      }
      await completeTestRun(pid, tid);
      navigate(`/projects/${projectId}/test-runs`);
    } catch (err) {
      console.error("Ошибка при сохранении тест-рана:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportToPdf = async () => {
    const pid = Number(projectId);
    const tid = Number(testRunId);
    if (!testRun || isNaN(pid) || isNaN(tid)) return;
  
    try {
      await exportToPdf(pid, tid);
    } catch (err) {
      console.error("Ошибка при экспорте в PDF:", err);
    }
  };
  
  if (!testRun) return <Typography>Загрузка...</Typography>;

  return (
    <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
            Выполнение тест-рана: {testRun.title}
        </Typography>
        </Box>

      {testRun.testCases.map((testCase: any) => (
        <Accordion key={testCase.id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">{testCase.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {testCase.description}
              </Typography>
            </Box>
            <Select
              value={testCaseStatuses[testCase.id] || TestRunStatus.ONWORK}
              onChange={(e) => handleStatusChange(testCase.id, e.target.value as TestRunStatus)}
              sx={{ minWidth: 150 }} disabled={testRun.status !== TestRunStatus.ONWORK}>
              <MenuItem value={TestRunStatus.PASSED}>Успешно</MenuItem>
              <MenuItem value={TestRunStatus.FAILED}>Провален</MenuItem>
              <MenuItem value={TestRunStatus.SKIPPED}>Пропущен</MenuItem>
            </Select>
          </AccordionSummary>

          <AccordionDetails>
            {testCase.steps.map((step: any, index: number) => (
              <Box
                key={step.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  px: 2,
                  py: 1,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 1,
                  mb: 1,
                  border: "1px solid #eee",
                }}
              >
                <Typography variant="body2" sx={{ flexBasis: "60%" }}>
                  <b>Шаг {index + 1}:</b> {step.step}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flexBasis: "40%", textAlign: "right" }}>
                  <b>Ожидается:</b> {step.expectedResult}
                </Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      {testRun.status === TestRunStatus.ONWORK && (
              <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              sx={{bgcolor:'#BA3CCD'}}>
              {saving ? "Сохраняем..." : "Завершить тест-ран"}
            </Button>
      )}
      <Button variant="contained" onClick={handleExportToPdf} sx={{bgcolor:'#BA3CCD',  float: 'right'}} startIcon={<DownloadIcon />}></Button>
    </Container>
  );
};
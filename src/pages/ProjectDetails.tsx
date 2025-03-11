import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectById, fetchTestSuitesByProjectId, createTestSuite, updateTestSuite, deleteTestSuite, fetchTestCasesBySuiteId, createTestCase, updateTestCase, deleteTestCase } from "../api";
import TestSuitesSidebar from "../components/TestSuitesSidebar";
import TestCasesList from "../components/TestCasesList";

interface Step {
  id: string;
  step: string;
  expectedResult: string;
}
interface TestCase {
  id: number;
  title: string;
  description?: string;
  steps: Step[];  
  expectedResult?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}


export default function ProjectDetails() {
  const { id } = useParams<{ id?: string }>();
  const projectId = id ? parseInt(id, 10) : NaN;

  const [testSuites, setTestSuites] = useState<{ id: number; name: string }[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<number | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<Omit<TestCase, "id" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    steps: [],
    expectedResult: "",
    status: "new",
  });
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    if (!isNaN(projectId)) {
      fetchProjectById(projectId).then((data) => fetchTestSuitesByProjectId(data.id).then(setTestSuites));
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedSuiteId) {
      console.log(`⚡ Запрос тест-кейсов: GET /test-suites/${selectedSuiteId}/test-cases`);
      fetchTestCasesBySuiteId(selectedSuiteId).then(setTestCases);
    } else {
      setTestCases([]);
    }
  }, [selectedSuiteId]);


  // ✅ Функция создания тест-сьюта (с обновлением состояния)
  const handleCreateSuite = async (name: string) => {
    try {
      const newSuite = await createTestSuite(projectId, name);
      setTestSuites((prev) => [...prev, newSuite]); // ✅ Добавляем новый сьют в список
    } catch (err) {
      console.error("Ошибка создания тест-сьюта:", err);
    }
  };

  const handleEditSuite = async (id: number, name: string) => {
    try {
      await updateTestSuite(projectId, id, { name });
      setTestSuites((prev) =>
        prev.map((suite) => (suite.id === id ? { ...suite, name } : suite))
      );
    } catch (err) {
      console.error("Ошибка обновления тест-сьюта:", err);
    }
  };

  const handleDeleteSuite = async (id: number) => {
    try {
      await deleteTestSuite(projectId, id);
      setTestSuites((prev) => prev.filter((suite) => suite.id !== id));
      if (selectedSuiteId === id) setSelectedSuiteId(null);
    } catch (err) {
      console.error("Ошибка удаления тест-сьюта:", err);
    }
  };
  
  const handleCreateTestCase = async (testCaseData: Omit<TestCase, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedSuiteId) return;
    try {
      const formattedTestCaseData = {
        ...testCaseData,
        steps: JSON.stringify(testCaseData.steps),  // 🔹 Преобразуем массив steps в строку
      };
      const newTestCase = await createTestCase(selectedSuiteId, formattedTestCaseData);
      setTestCases((prev) => [...prev, { ...newTestCase, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    } catch (err) {
      console.error("Ошибка создания тест-кейса:", err);
    }
  };

  const handleEditTestCase = async (id: number, testCaseData: Partial<TestCase>) => {
    try {
      const formattedTestCaseData = {
        ...testCaseData,
        steps: testCaseData.steps ? JSON.stringify(testCaseData.steps) : undefined, // 🔹 Если steps есть, преобразуем его в строку
      };
      await updateTestCase(id, formattedTestCaseData);
      setTestCases((prev) =>
        prev.map((testCase) =>
          testCase.id === id ? { ...testCase, ...testCaseData, updatedAt: new Date().toISOString() } : testCase
        )
      );
    } catch (err) {
      console.error("Ошибка обновления тест-кейса:", err);
    }
  };

  const handleDeleteTestCase = async (id: number) => {
    try {
      await deleteTestCase(id);
      setTestCases((prev) => prev.filter((testCase) => testCase.id !== id));
    } catch (err) {
      console.error("Ошибка удаления тест-кейса:", err);
    }
  };


  return (
    <div style={{ display: "flex" }}>
      <TestSuitesSidebar
        testSuites={testSuites}
        selectedSuiteId={selectedSuiteId}
        onSelectSuite={setSelectedSuiteId}
        onCreateSuite={handleCreateSuite}
        onEditSuite={handleEditSuite}
        onDeleteSuite={handleDeleteSuite}
      />
      <TestCasesList testCases={testCases} onCreateTestCase={handleCreateTestCase} onEditTestCase={handleEditTestCase} onDeleteTestCase={handleDeleteTestCase} />
    </div>
  );
}
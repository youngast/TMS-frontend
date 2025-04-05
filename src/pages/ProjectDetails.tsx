import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProjectById, fetchTestSuitesByProjectId, createTestSuite, updateTestSuite, deleteTestSuite, fetchTestCasesBySuiteId, createTestCase, updateTestCase, deleteTestCase } from "../api/api";
import TestSuitesSidebar from "../components/TestSuitesSidebar";
import TestCasesList from "../components/TestCasesList";

export interface Step {
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

export interface UpdateTestCaseDto {
  title?: string;
  description?: string;
  steps?: Step[];
  expectedResult?: string;
  status?: string;
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
  const [filter, setFilter] = useState("");


  useEffect(() => {
    if (!isNaN(projectId)) {
      fetchProjectById(projectId).then((data) => fetchTestSuitesByProjectId(data.id).then(setTestSuites));
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedSuiteId) {
        console.log(`⚡ Запрос тест-кейсов: GET /test-suites/${selectedSuiteId}/test-cases`);
        fetchTestCasesBySuiteId(selectedSuiteId).then((data) => {
            console.log("Полученные тест-кейсы:", data);
            setTestCases(data);
        });
    } else {
        setTestCases([]);
    }
    console.log("Обновление selectedTestCase:", selectedTestCase);
}, [selectedSuiteId]);


  const handleCreateSuite = async (name: string) => {
    try {
      const newSuite = await createTestSuite(projectId, name);
      setTestSuites((prev) => [...prev, newSuite]);
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
            steps: [...testCaseData.steps],
        };
        console.log("Отправляем данные на создание тест-кейса:", formattedTestCaseData);

        const newTestCase = await createTestCase(selectedSuiteId, formattedTestCaseData);
        console.log("Создан тест-кейс:", newTestCase);

        setTestCases((prev) => [...prev, { ...newTestCase, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    } catch (err) {
        console.error("Ошибка создания тест-кейса:", err);
    }
};

const handleEditTestCase = async (id: number, testCaseData: Partial<TestCase>) => {
  try {
      const formattedTestCaseData = {
          ...testCaseData,
          steps: testCaseData.steps ? [...testCaseData.steps] : [],
      };
      
      console.log("Обновляем тест-кейс:", formattedTestCaseData);

      await updateTestCase(id, formattedTestCaseData);

      setTestCases((prev) =>
          prev.map((testCase) =>
              testCase.id === id ? { ...testCase, ...formattedTestCaseData, updatedAt: new Date().toISOString() } : testCase
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

  const filteredTestCases = testCases.filter(tc =>
    tc.title.toLowerCase().includes(filter.toLowerCase())
  );  

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
      <TestCasesList testCases={testCases} onCreateTestCase={handleCreateTestCase} onEditTestCase={handleEditTestCase} onDeleteTestCase={handleDeleteTestCase}/>
      <Link to={`/projects/${projectId}/test-runs`}>
        <button style={{ padding: "10px 15px", background: "#1976d2", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", backgroundColor: "#BA3CCD", }}>
          Перейти в Test Run
        </button>
      </Link>    
    </div>
  );
}
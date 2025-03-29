import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { searchTestCase } from "../api/TestCaseapi";

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
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  testCases: TestCase[];
  onCreateTestCase: (testCaseData: Omit<TestCase, "id" | "createdAt" | "updatedAt">) => void;
  onEditTestCase: (id: number, testCaseData: Partial<TestCase>) => void;
  onDeleteTestCase: (id: number) => void;
}

export default function TestCasesList({ testCases, onCreateTestCase, onEditTestCase, onDeleteTestCase }: Props,) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [titleError, setTitleError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  const handleOpenModal = (testCase?: TestCase) => {
    setSelectedTestCase(
      testCase
        ? {
            ...testCase,
            steps: typeof testCase.steps === "string" ? JSON.parse(testCase.steps) : testCase.steps || [],
          }
        : {
            id: 0,
            title: "",
            description: "",
            steps: [],
            status: "new",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
    );
  
    setIsEditing(!!testCase);
    setTitleError(false);
    setModalOpen(true);
  };
  

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTestCase(null);
  };

  const handleSave = () => {
    if (!selectedTestCase?.title.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);
  
    const formattedTestCase = {
      ...selectedTestCase,
      steps: [...selectedTestCase.steps],
    };
  
    if (isEditing) {
      onEditTestCase(selectedTestCase.id, formattedTestCase);
    } else {
      onCreateTestCase(formattedTestCase);
    }
  
    handleCloseModal();
  };
  
  const handleAddStep = () => {
    setSelectedTestCase((prev) =>
      prev ? { ...prev, steps: [...prev.steps, { id: crypto.randomUUID(), step: "", expectedResult: "" }] } : prev
    );
  };

  const handleRemoveStep = (id: string) => {
    setSelectedTestCase((prev) => prev ? { ...prev, steps: prev.steps.filter(step => step.id !== id) } : prev);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !selectedTestCase) return;
    const reorderedSteps = Array.from(selectedTestCase.steps);
    const [movedStep] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, movedStep);
    setSelectedTestCase({ ...selectedTestCase, steps: reorderedSteps });
  };

  const filteredTestCases = testCases.filter((testCase) =>
    testCase.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Typography variant="h5">{"Проект"}</Typography>
      
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleOpenModal()}>
        + Создать тест-кейс
      </Button>
      {/* <TextField label="Поиск" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === "Enter" && searchTestCase(searchTerm)}/> */}
      <List sx={{ mt: 2 }}>
        {filteredTestCases.map((testCase) => (
          <ListItem 
            key={testCase.id} 
            sx={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }} 
            component="li"
            onClick={() => handleOpenModal(testCase)}>
            <ListItemText primary={testCase.title} secondary={`Статус: ${testCase.status}`} />
            <IconButton onClick={(e) => { e.stopPropagation(); onDeleteTestCase(testCase.id); }} color="error">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Модальное окно */}
      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Редактировать тест-кейс" : "Создать тест-кейс"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Название"
            margin="dense"
            error={titleError}
            helperText={titleError ? "Название тест-кейса обязательно" : ""}
            value={selectedTestCase?.title || ""}
            onChange={(e) => setSelectedTestCase((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
          />
          <TextField
            fullWidth
            label="Описание"
            margin="dense"
            multiline
            rows={2}
            value={selectedTestCase?.description || ""}
            onChange={(e) => setSelectedTestCase((prev) => (prev ? { ...prev, description: e.target.value } : prev))}
          />

          <Typography variant="subtitle1" sx={{ mt: 2 }}>Шаги:</Typography>
          <Button onClick={handleAddStep} variant="outlined" sx={{ mb: 2 }}>+ Добавить шаг</Button>

          <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="steps">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {Array.isArray(selectedTestCase?.steps) &&
                  selectedTestCase.steps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
                        >
                          <TextField
                            fullWidth
                            label="Шаг"
                            value={step.step}
                            onChange={(e) =>
                              setSelectedTestCase((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      steps: prev.steps.map((s) =>
                                        s.id === step.id ? { ...s, step: e.target.value } : s
                                      ),
                                    }
                                  : prev
                              )
                            }
                          />
                          <TextField
                            fullWidth
                            label="Ожидаемый результат"
                            value={step.expectedResult}
                            onChange={(e) =>
                              setSelectedTestCase((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      steps: prev.steps.map((s) =>
                                        s.id === step.id ? { ...s, expectedResult: e.target.value } : s
                                      ),
                                    }
                                  : prev
                              )
                            }
                          />
                          <IconButton onClick={() => handleRemoveStep(step.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          </DragDropContext>

          <Select
            fullWidth
            value={selectedTestCase?.status || "new"}
            onChange={(e) => setSelectedTestCase((prev) => (prev ? { ...prev, status: e.target.value } : prev))}
            sx={{ mt: 2 }}
          >
            <MenuItem value="new">Новый</MenuItem>
            <MenuItem value="in_progress">В процессе</MenuItem>
            <MenuItem value="completed">Завершен</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Отмена</Button>
          <Button onClick={handleSave} color="primary">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
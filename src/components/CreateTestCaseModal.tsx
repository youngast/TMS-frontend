import { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { createTestCase } from "../api/api";

interface CreateTestCaseModalProps {
  suiteId: number;
  open: boolean;
  onClose: () => void;
}

export default function CreateTestCaseModal({ suiteId, open, onClose }: CreateTestCaseModalProps) {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim() || !steps.trim()) {
      setError("Название и шаги не могут быть пустыми");
      return;
    }
    try {
      await createTestCase(suiteId, title);
      setTitle("");
      setSteps("");
      setError(null);
      onClose();
    } catch (err) {
      setError("Ошибка при создании тест-кейса");
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4 }}>
        <Typography variant="h6">Создать тест-кейс</Typography>
        <TextField label="Название" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} />
        <TextField label="Шаги" fullWidth multiline rows={4} value={steps} onChange={(e) => setSteps(e.target.value)} sx={{ mt: 2 }} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={handleCreate} sx={{ mt: 2 }}>
          Создать
        </Button>
      </Box>
    </Modal>
  );
}

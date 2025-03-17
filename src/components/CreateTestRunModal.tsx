import { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { createTestRun } from "../api/api";

export default function CreateTestRunModal({ suiteId, caseId, onClose }: { suiteId: number; caseId: number; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Название и описание не могут быть пустыми");
      return;
    }
    try {
      await createTestRun(suiteId, caseId, title, description);
      onClose();
    } catch (err) {
      setError("Ошибка при запуске тест-рана");
      console.error(err);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4, borderRadius: 2 }}>
        <Typography variant="h6">Запустить тест-ран</Typography>
        <TextField label="Название тест-рана" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} />
        <TextField label="Описание" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mt: 2 }} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleCreate} sx={{ mt: 2 }}>🚀 Запустить</Button>
      </Box>
    </Modal>
  );
}

import { useState } from "react";
import { createProject } from "../api/api";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

export default function CreateProjectModal({ open, onClose, onProjectCreated }: { open: boolean; onClose: () => void; onProjectCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async () => {
    try {
      await createProject({ name, description });
      console.log("✅ Проект успешно создан!");
      onProjectCreated(); // ✅ Вызываем обновление списка проектов
      onClose();
    } catch (error) {
      console.error("❌ Ошибка при создании проекта:", error);
      setError("Ошибка при создании проекта");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Создание проекта
        </Typography>
        <TextField
          label="Название проекта"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Описание проекта"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleCreateProject} sx={{ mt: 2 }}>
          Создать
        </Button>
      </Box>
    </Modal>
  );
}

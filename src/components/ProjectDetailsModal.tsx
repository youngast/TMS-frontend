import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { fetchProjectById, fetchUsers, addUserToProject } from "../api";

interface ProjectDetailsModalProps {
  open: boolean;
  projectId: number | null;
  onClose: () => void;
}

interface User {
  id: number;
  name: string;
}

export default function ProjectDetailsModal({ open, projectId, onClose }: ProjectDetailsModalProps) {
  const [project, setProject] = useState<{ name: string; owner: { name: string }; members: string[] } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId).then(setProject).catch(console.error);
      fetchUsers().then(setUsers).catch(console.error);
    }
  }, [projectId]);

  const handleAddUser = async () => {
    if (!selectedUser || !projectId) return;
    try {
      await addUserToProject(projectId, selectedUser);
      setProject((prev) =>
        prev ? { ...prev, members: [...prev.members, users.find((user) => user.id === selectedUser)?.name || ""] } : null
      );
      setSelectedUser("");
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Детали проекта</DialogTitle>
      <DialogContent>
        {project ? (
          <>
            <Typography variant="h6">{project.name}</Typography>
            <Typography variant="body2">Владелец: {project.owner.name}</Typography>

            <Typography sx={{ mt: 2 }}>Участники:</Typography>
            <List>
              {project.members.length > 0 ? (
                project.members.map((member, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={member} />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary">Нет участников</Typography>
              )}
            </List>

            {/* Выпадающий список для выбора пользователя */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Выберите пользователя</InputLabel>
              <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value as number)}>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button onClick={handleAddUser} variant="contained" sx={{ mt: 2 }} disabled={!selectedUser}>
              Добавить
            </Button>
          </>
        ) : (
          <Typography>Загрузка...</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}

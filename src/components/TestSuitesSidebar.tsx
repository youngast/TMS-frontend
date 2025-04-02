import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

interface TestSuite {
  id: number;
  name: string;
}

interface Props {
  testSuites: TestSuite[];
  selectedSuiteId: number | null;
  onSelectSuite: (id: number) => void;
  onCreateSuite: (name: string) => void;
  onEditSuite: (id: number, name: string) => void;
  onDeleteSuite: (id: number) => void;
}

export default function TestSuitesSidebar({
  testSuites,
  selectedSuiteId,
  onSelectSuite,
  onCreateSuite,
  onEditSuite,
  onDeleteSuite,
}: Props) {
  const [editSuite, setEditSuite] = useState<{ id: number; name: string } | null>(null);
  const [newSuiteName, setNewSuiteName] = useState("");

  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: 250, position: "relative" },
        }}>
      <Box sx={{ p: 2 }}>
        <IconButton onClick={() => navigate("/")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Тест-сьюты</Typography>

        {/* Поле ввода для названия нового тест-сьюта */}
        <TextField
          fullWidth
          label="Название тест-сьюта"
          value={newSuiteName}
          onChange={(e) => setNewSuiteName(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => {
            if (newSuiteName.trim()) {
              onCreateSuite(newSuiteName);
              setNewSuiteName("");
            }
          }}
        >
          + Добавить
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* Список тест-сьютов */}
        <List>
          {testSuites.map((suite) => (
            <ListItem key={suite.id} disablePadding>
              <ListItemButton
                selected={selectedSuiteId === suite.id}
                onClick={() => onSelectSuite(suite.id)}
                sx={{ display: "flex", justifyContent: "space-between" }}>
                <ListItemText primary={suite.name} />
                <Box>
                  <IconButton size="small" onClick={() => setEditSuite(suite)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDeleteSuite(suite.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Модалка */}
      <Dialog open={!!editSuite} onClose={() => setEditSuite(null)}>
        <DialogTitle>Редактировать тест-сьют</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editSuite?.name || ""}
            onChange={(e) => setEditSuite({ ...editSuite!, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSuite(null)}>Отмена</Button>
          <Button
            onClick={() => {
              if (editSuite) {
                onEditSuite(editSuite.id, editSuite.name);
                setEditSuite(null);
              }}}color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

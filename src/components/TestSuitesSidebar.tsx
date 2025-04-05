import { useState } from "react";
import {
  Drawer,
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

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

interface TestSuite {
  id: number;
  name: string;
  children?: TestSuite[]; // вложенность на будущее
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);


  const navigate = useNavigate();

  const renderTree = (suite: TestSuite) => (
    <TreeItem
      key={suite.id}
      itemId={suite.id.toString()}
      label={
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">{suite.name}</Typography>
          <Box>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setEditSuite(suite); }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onDeleteSuite(suite.id); }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      }
      onClick={() => onSelectSuite(suite.id)}
    >
      {suite.children?.map((child) => renderTree(child))}
    </TreeItem>
  );
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: 250, position: "relative" },
      }}
    >
      <Box sx={{ p: 2 }}>
        <IconButton onClick={() => navigate("/")} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Тест-сьюты</Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, bgcolor: "#BA3CCD" }}
          onClick={() => setCreateDialogOpen(true)}>
          + Создать тест-сьют
        </Button>

        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
          <DialogTitle>Создание тест-сьюта</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Название тест-сьюта"
              value={newSuiteName}
              onChange={(e) => setNewSuiteName(e.target.value)}
              placeholder="Начни вводить название..."
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Отмена</Button>
            <Button
              onClick={() => {
                if (newSuiteName.trim()) {
                  onCreateSuite(newSuiteName.trim());
                  setNewSuiteName("");
                  setCreateDialogOpen(false);
                }
              }}
              variant="contained"
              sx={{ bgcolor: "#BA3CCD" }}
            >
              Создать
            </Button>
          </DialogActions>
        </Dialog>

        <Divider sx={{ my: 2 }} />

        <SimpleTreeView
          selected={selectedSuiteId ? [selectedSuiteId.toString()] : []}>
          {testSuites.map((suite) => renderTree(suite))}
        </SimpleTreeView>
      </Box>

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
              }
            }}
            color="primary"
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
import { useState } from "react"
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Tabs,IconButton } from "@mui/material";
import AppsIcon from '@mui/icons-material/Apps';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export default function Filters({ onViewChange, onOpenCreateProject }: { 
    onViewChange: (view: "list" | "grid") => void;
    onOpenCreateProject: () => void; 
  }) {
  const [status, setstatus] = useState('active');
  const [viewMode, SetviewMode] = useState<"list" | "grid">("list");
  
  const handleViewModeChange = (mode: "list" | "grid") => {
    SetviewMode(mode);
    onViewChange(mode);
  };
  
  return (
      <>
        <Box sx={{ display: "flex", gap: "10px", justifyContent: "space-between", bgcolor: "background.white" }}>
          <Tabs>
            {/* При нажатии на кнопку вызываем `onOpenCreateProject` */}
            <Button variant="text" sx={{ bgcolor: "#BA3CCD", color: "white" }} onClick={onOpenCreateProject}>
                Создать проект
            </Button>
            <TextField variant="outlined" placeholder="Поиск проектов" size="small" />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Статус</InputLabel>
              <Select value={status} onChange={(e) => setstatus(e.target.value)}>
                <MenuItem value="active">Активный</MenuItem>
                <MenuItem value="inactive">Неактивный</MenuItem>
                <MenuItem value="archived">Архив</MenuItem>
              </Select>
            </FormControl>
            <Button variant="text" sx={{ color: "#BA3CCD" }}>
              Добавить фильтр
            </Button>
          </Tabs>
  
          <Box>
            <IconButton onClick={() => handleViewModeChange("grid")} sx={{
              bgcolor: viewMode === "grid" ? "#BA3CCD" : "transparent",
              color: viewMode === "grid" ? "white" : "black"
            }}>
              <AppsIcon />
            </IconButton>
            <IconButton onClick={() => handleViewModeChange("list")} sx={{
              bgcolor: viewMode === "list" ? "#BA3CCD" : "transparent",
              color: viewMode === "list" ? "white" : "black"
            }}>
              <FormatListBulletedIcon />
            </IconButton>
          </Box>
        </Box>
      </>
  );
  }
  
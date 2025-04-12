import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

interface Project {
  id: number;
  name: string;
}

interface FiltersProps {
  status: string;
  viewMode: "list" | "grid";
  searchTerm: string;

  onSearchChange: (searchTerm: string) => void;
  onStatusChange: (newStatus: string) => void;
  onViewChange: (view: "list" | "grid") => void;
  onOpenCreateProject: () => void;
}

export default function Filters({
  status,
  viewMode,
  onStatusChange,
  onViewChange,
  onOpenCreateProject,
  onSearchChange
}: FiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState(searchTerm);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onSearchChange(event.target.value);
  }


  return (
    <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: "background.paper",
        p: 2,
      }}
    >
      {/* Верхняя панель: Создать проект, поиск, селект статуса */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "#BA3CCD" }}
          onClick={onOpenCreateProject}
        >
          Создать проект
        </Button>

        {/* Поле поиска */}
        <TextField
          label="Поиск"
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={handleSearchChange}
          />

        {/* Селект статуса */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            label="Статус"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as string)}
          >
            <MenuItem value="active">Активный</MenuItem>
            <MenuItem value="inactive">Неактивный</MenuItem>
            <MenuItem value="archived">Архив</MenuItem>
          </Select>
        </FormControl>

      {/* Переключение вида: grid / list */}
      <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
        <IconButton
          onClick={() => onViewChange("grid")}
          sx={{
            bgcolor: viewMode === "grid" ? "#BA3CCD" : "transparent",
            color: viewMode === "grid" ? "white" : "black",
          }}
        >
          <AppsIcon />
        </IconButton>
        <IconButton
          onClick={() => onViewChange("list")}
          sx={{
            bgcolor: viewMode === "list" ? "#BA3CCD" : "transparent",
            color: viewMode === "list" ? "white" : "black",
          }}
        >
          <FormatListBulletedIcon />
        </IconButton>
      </Box>

      </Box>

      {error && <Typography color="error">{error}</Typography>}
    </Box>
    </>
  );
}
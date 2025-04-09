import { useState } from "react";
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
import { findProjectByName } from "../api/Projectapi";

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
}: FiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [foundProjects, setFoundProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setError(null);
      const results = await findProjectByName(searchTerm);
      setFoundProjects(results);
    } catch (err) {
      console.error("Ошибка при поиске:", err);
      setError("Не удалось выполнить поиск");
    }
  };

  return (
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
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

      {/* Показ результатов, если пользователь уже искал */}
      {foundProjects && foundProjects.length > 0 && (
        <Box>
          <Typography variant="subtitle1">
            Результаты поиска ({foundProjects.length}):
          </Typography>
          <ul>
            {foundProjects.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </Box>
      )}

      {foundProjects && foundProjects.length === 0 && (
        <Typography>По вашему запросу ничего не найдено</Typography>
      )}
    </Box>
  );
}
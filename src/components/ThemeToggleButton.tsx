import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "../utils/ThemeProviderWrapper";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        zIndex: 1000   
      }}
      onClick={toggleTheme}
    >
      {isDarkMode ? <LightModeIcon /> : <DarkModeIcon/>}
    </Button>
  );
};

export default ThemeToggleButton;

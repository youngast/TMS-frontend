import { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { fetchUsers } from "../api/api";

interface User {
  id: number;
  email: string;
  name?: string;
}

interface UsersAutocompleteProps {
  onUserSelect?: (user: User | null) => void;
}

export default function UsersAutocomplete({ onUserSelect }: UsersAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (!inputValue) {
      setOptions([]);
      return;
    }

    setLoading(true);

    fetchUsers(inputValue)
      .then((data) => {
        if (active) {
          setOptions(data);
        }
      })
      .catch((err) => {
        console.error("Ошибка при поиске пользователей:", err);
        if (active) setOptions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.email || ""}
      loading={loading}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        console.log("Выбрали:", newValue);
        if (onUserSelect) {
          onUserSelect(newValue as User | null);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Поиск по email"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
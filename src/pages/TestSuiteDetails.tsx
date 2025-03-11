import React, { useState } from "react";
import { Container, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

const TestSuitesPage = () => {
  const [testSuites, setTestSuites] = useState([
    { id: 1, name: "Авторизация", testCases: 12, createdAt: "01.03.2025", updatedAt: "05.03.2025" },
    { id: 2, name: "Платежи", testCases: 8, createdAt: "02.03.2025", updatedAt: "06.03.2025" }
  ]);
  const [open, setOpen] = useState(false);
  const [newSuite, setNewSuite] = useState({ name: "", description: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const handleChange = (event) => setNewSuite({ ...newSuite, [event.target.name]: event.target.value });

  const handleCreate = () => {
    if (newSuite.name.trim()) {
      setTestSuites([...testSuites, { id: testSuites.length + 1, name: newSuite.name, testCases: 0, createdAt: "Сегодня", updatedAt: "Сегодня" }]);
      setNewSuite({ name: "", description: "" });
      handleClose();
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Test Suites</Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>Создать Test Suite</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Тест-кейсы</TableCell>
            <TableCell>Дата создания</TableCell>
            <TableCell>Дата обновления</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {testSuites.map((suite) => (
            <TableRow key={suite.id}>
              <TableCell>{suite.id}</TableCell>
              <TableCell>{suite.name}</TableCell>
              <TableCell>{suite.testCases}</TableCell>
              <TableCell>{suite.createdAt}</TableCell>
              <TableCell>{suite.updatedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Создать Test Suite</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            name="name"
            fullWidth
            variant="outlined"
            value={newSuite.name}
            // onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Описание"
            name="description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newSuite.description}
            // onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleCreate} color="primary" variant="contained">Создать</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestSuitesPage;

import React, { useState } from "react";
import { createTestRun, updateTestRun } from "../api/TestRunApi";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export default function TestRunModal ({ open, onClose, projectId, testRun, onSuccess }: { open: boolean; onClose: () => void; projectId: number; testRun: any; onSuccess: () => void }) {
    const [title, setTitle] = useState(testRun?.title || "");
    const [description, setDescription] = useState(testRun?.description || "");

    const handleSubmit = async () => {
        if (testRun) {
            await updateTestRun(projectId, testRun.id, { title, description });
        } else {
            await createTestRun(projectId, { title, description });
        }
        onSuccess();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{testRun ? "Редактировать тест-ран" : "Создать тест-ран"}</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Название" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} />
                <TextField fullWidth label="Описание" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mt: 2 }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};
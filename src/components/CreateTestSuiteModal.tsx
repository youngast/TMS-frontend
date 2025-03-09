import { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { createTestSuite } from "../api";


export default function CreateTestSuiteModal({ projectId, onClose }: { projectId: number; onClose: () => void }) {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async () => {
        if(!name.trim()){
            setError("Название не должно быть пустым");
            return;
        }
        try{
            await createTestSuite(projectId, name);
            onClose();
        }catch(error){
            console.error("Error creating test suite:", error);
        }
    }
    
    return (
        <>
            <Modal open onClose={onClose}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", p: 4 }}>
                    <Typography variant="h6">Создать тест-сьют</Typography>
                    <TextField label="Название" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2 }} />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button variant="contained" onClick={handleCreate} sx={{ mt: 2 }}>Создать</Button>
                </Box>
            </Modal>
        </>
    )
}
import { useState } from "react";
import NavBar from "../components/NavBar";
import ProjectLayer from "../components/ProjectLayer";
import Filters from "../components/Filters";
import ProjectList from "../components/ProjectList";
import CreateProjectModal from "../components/CreateProjectModal";

export default function MainPage() {
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [open, setOpen] = useState(false);

    return (
        <>
            <ProjectLayer />
            {/* <Filters onViewChange={setViewMode} onOpenCreateProject={() => setOpen(true)} /> */}
            <ProjectList viewMode={viewMode} />
            <CreateProjectModal 
                open={open} 
                onClose={() => setOpen(false)} 
                onProjectCreated={() => {}} 
            />
        </>
    );
}

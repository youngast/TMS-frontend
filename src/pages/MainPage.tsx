import { useState } from "react";
import NavBar from "../components/NavBar";
import ProjectLayer from "../components/ProjectLayer";
import Filters from "../components/Filters";
import ProjectList from "../components/ProjectList";
import CreateProjectModal from "../components/CreateProjectModal";
import ThemeToggleButton from "../components/ThemeToggleButton";

interface Projectlistprops {
    viewmode: "list" | "grid";
}

export default function MainPage({viewmode}: Projectlistprops) {
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [open, setOpen] = useState(false);
    
    return (
        <>
            <ProjectLayer />
            {/* <Filters onViewChange={setViewMode} onOpenCreateProject={() => setOpen(true)} /> */}
            <ProjectList/>
            <CreateProjectModal 
                open={open} 
                onClose={() => setOpen(false)} 
                onProjectCreated={() => {}} />
            <ThemeToggleButton/>
        </>
    );
}
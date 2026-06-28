import { useMemo, useRef, useState } from "react";
import { projects } from "../../data/projects.js";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import ProjectCard from "../ProjectCard/ProjectCard.jsx";
import ProjectModal from "../ProjectModal/ProjectModal.jsx";
import styles from "./ProjectGallery.module.css";

const filters = ["All", "Kitchen", "Bathroom", "Interior"];

export default function ProjectGallery() {
  const [filter, setFilter] = useState("All");
  const [activeProject, setActiveProject] = useState(null);
  const returnFocusRef = useRef(null);
  const filtered = useMemo(() => (filter === "All" ? projects : projects.filter((project) => project.category === filter)), [filter]);

  const openProject = (project, event) => {
    returnFocusRef.current = event.currentTarget;
    setActiveProject(project);
  };

  return (
    <section id="work" className={styles.section}>
      <div className="section-shell">
        <div className={styles.top}>
          <SectionHeading eyebrow="Our work" title="Renovation stories, ready for real project photography." />
          <div className={styles.filters} role="tablist" aria-label="Project filters">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={filter === item}
                className={filter === item ? styles.selected : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.list}>
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpen={(event) => openProject(project, event)} />
          ))}
        </div>
      </div>
      <ProjectModal
        project={activeProject}
        projects={projects}
        onClose={() => setActiveProject(null)}
        onSelect={setActiveProject}
        returnFocusRef={returnFocusRef}
      />
    </section>
  );
}

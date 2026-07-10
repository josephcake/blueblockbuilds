import { useRef, useState } from "react";
import { projects } from "../../data/projects.js";
import SectionHeading from "../SectionHeading/SectionHeading.jsx";
import ProjectCard from "../ProjectCard/ProjectCard.jsx";
import ProjectModal from "../ProjectModal/ProjectModal.jsx";
import styles from "./ProjectGallery.module.css";

export default function ProjectGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProject, setActiveProject] = useState(null);
  const returnFocusRef = useRef(null);
  const activeCarouselProject = projects[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + projects.length) % projects.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % projects.length);
  };

  const openProject = (project, event) => {
    returnFocusRef.current = event.currentTarget;
    setActiveProject(project);
  };

  const selectProject = (project) => {
    const nextIndex = projects.findIndex((item) => item.id === project.id);
    if (nextIndex >= 0) setActiveIndex(nextIndex);
    setActiveProject(project);
  };

  return (
    <section id="work" className={styles.section}>
      <div className="section-shell">
        <div className={styles.top}>
          <SectionHeading eyebrow="Our work" title="Grouped project galleries." />
          <div className={styles.carouselControls} aria-label="Portfolio carousel controls">
            <button type="button" onClick={showPrevious} aria-label="Previous project">←</button>
            <span>{activeIndex + 1} / {projects.length}</span>
            <button type="button" onClick={showNext} aria-label="Next project">→</button>
          </div>
        </div>

        <div className={styles.carousel} aria-roledescription="carousel" aria-label="Portfolio project carousel">
          <ProjectCard
            key={activeCarouselProject.id}
            project={activeCarouselProject}
            index={activeIndex}
            onOpen={(event) => openProject(activeCarouselProject, event)}
          />
        </div>

        <div className={styles.dots} role="tablist" aria-label="Choose portfolio group">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              className={activeIndex === index ? styles.selected : ""}
              onClick={() => setActiveIndex(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {project.title}
            </button>
          ))}
        </div>

        <div className={styles.previewRail} aria-label="Portfolio previews">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={activeIndex === index ? styles.activePreview : ""}
              onClick={() => setActiveIndex(index)}
            >
              <img src={project.coverImage} alt="" loading="lazy" />
              <span>{project.title}</span>
            </button>
          ))}
        </div>
      </div>

      <ProjectModal
        project={activeProject}
        projects={projects}
        onClose={() => setActiveProject(null)}
        onSelect={selectProject}
        returnFocusRef={returnFocusRef}
      />
    </section>
  );
}

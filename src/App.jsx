import { Suspense, lazy, useState } from "react";
import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Expertise from "./components/Expertise/Expertise.jsx";
import KitchenStory from "./components/KitchenStory/KitchenStory.jsx";
import ProjectGallery from "./components/ProjectGallery/ProjectGallery.jsx";
import BathroomStory from "./components/BathroomStory/BathroomStory.jsx";
import Process from "./components/Process/Process.jsx";
import About from "./components/About/About.jsx";
import ServiceArea from "./components/ServiceArea/ServiceArea.jsx";
import ContactForm from "./components/ContactForm/ContactForm.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen.jsx";
import WebGLFallback from "./components/WebGLFallback/WebGLFallback.jsx";
import { useReducedMotion } from "./hooks/useReducedMotion.js";
import styles from "./App.module.css";

const Experience = lazy(() => import("./three/Experience.jsx"));

function shouldForceFallback() {
  return typeof window !== "undefined" && window.location.search.includes("fallback=1");
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const reducedMotion = useReducedMotion();
  const fallback = shouldForceFallback() || sceneFailed || (typeof window !== "undefined" && !supportsWebGL());

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <LoadingScreen ready={fallback || sceneReady || reducedMotion} />
      <Header />
      <div className={styles.sceneLayer} aria-hidden="true">
        {fallback || reducedMotion ? (
          <WebGLFallback />
        ) : (
          <Suspense fallback={<WebGLFallback />}>
            <Experience onReady={() => setSceneReady(true)} onError={() => setSceneFailed(true)} />
          </Suspense>
        )}
      </div>
      <main id="main">
        <Hero />
        <Expertise />
        <KitchenStory />
        <ProjectGallery />
        <BathroomStory />
        <Process />
        <About />
        <ServiceArea />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

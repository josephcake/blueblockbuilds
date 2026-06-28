import "@testing-library/jest-dom/vitest";

HTMLCanvasElement.prototype.getContext = HTMLCanvasElement.prototype.getContext || (() => ({}));

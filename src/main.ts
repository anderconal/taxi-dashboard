import "reflect-metadata";
import "./style.css";
import "./slices/tripAnalysis/infrastructure/user-interface/TripWidget";
import "./slices/tripAnalysis/infrastructure/user-interface/FilterComponent";
import "./shared/infrastructure/user-interface/LayoutComponent";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");
  if (appContainer) {
    const layout = document.createElement("layout-component");
    appContainer.appendChild(layout);
  }
});

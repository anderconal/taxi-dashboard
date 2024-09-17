import { container } from "../../../dependency-injection/Container";
import { FetchTripsUseCase } from "../../../slices/tripAnalysis/application/FetchTripsUseCase";
import { FilterTripsUseCase } from "../../../slices/tripAnalysis/application/FilterTripsUseCase";
import { Trip } from "../../../slices/tripAnalysis/domain/Trip";
import { FilterComponent } from "../../../slices/tripAnalysis/infrastructure/user-interface/FilterComponent";
import { TripWidget } from "../../../slices/tripAnalysis/infrastructure/user-interface/TripWidget";

export class LayoutComponent extends HTMLElement {
  private fetchTripsUseCase = container.get(FetchTripsUseCase);
  private filterTripsUseCase = container.get(FilterTripsUseCase);
  private tripWidget: TripWidget;
  private filterComponent: FilterComponent;
  private trips: Trip[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.tripWidget = new TripWidget();
    this.filterComponent = new FilterComponent(this.onFilterChange.bind(this));
  }

  connectedCallback() {
    this.render();
    this.loadInitialData();
  }

  render(): void {
    if (!this.shadowRoot) return;

    const layout = document.createElement("div");
    layout.classList.add("dashboard-content");

    const header = document.createElement("div");
    header.classList.add("dashboard-header");
    header.textContent = "Taxi Dashboard";

    layout.appendChild(this.filterComponent);
    layout.appendChild(this.tripWidget);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        padding: var(--padding);
        gap: var(--padding);
        width: 100%;
        max-width: 100%;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--padding);
        background-color: var(--primary-color);
        color: white;
        border-radius: var(--border-radius);
      }

      .dashboard-content {
        display: flex;
        flex-wrap: wrap;
        gap: var(--padding);
      }

      @media (max-width: var(--breakpoint-medium)) {
        .dashboard-content {
          flex-direction: column;
        }
      }
    `;

    this.shadowRoot.appendChild(header);
    this.shadowRoot.appendChild(layout);
    this.shadowRoot.appendChild(style);
  }

  async loadInitialData() {
    this.trips = await this.fetchTripsUseCase.execute();
    this.tripWidget.update(this.trips);
  }

  onFilterChange(filter: string) {
    const filteredTrips = this.filterTripsUseCase.execute(this.trips, filter);
    this.tripWidget.update(filteredTrips);
  }
}

customElements.define("layout-component", LayoutComponent);

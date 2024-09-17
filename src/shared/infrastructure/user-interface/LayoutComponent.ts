import { container } from "../../../dependency-injection/Container";
import { FetchTripsUseCase } from "../../../slices/tripAnalysis/application/FetchTripsUseCase";
import { FilterTripsUseCase } from "../../../slices/tripAnalysis/application/FilterTripsUseCase";
import { Trip } from "../../../slices/tripAnalysis/domain/Trip";
import { FilterComponent } from "../../../slices/tripAnalysis/infrastructure/user-interface/FilterComponent";
import { TripWidget } from "../../../slices/tripAnalysis/infrastructure/user-interface/TripWidget";


export class LayoutComponent extends HTMLElement {
  private fetchTripsUseCase = container.get(FetchTripsUseCase);
  private filterTripsUseCase = container.get(FilterTripsUseCase);
  private tripWidget!: TripWidget; 
  private filterComponent!: FilterComponent; 
  private trips: Trip[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.loadInitialData();
  }

  render(): void {
    if (!this.shadowRoot) return;

    // Create header element
    const header = document.createElement("div");
    header.classList.add("dashboard-header");
    header.textContent = "Taxi Dashboard";

    // Create the main content layout container
    const layout = document.createElement("div");
    layout.classList.add("dashboard-content");

    // Append header first
    this.shadowRoot.appendChild(header);

    // Append the layout container which will hold the filter and chart
    this.shadowRoot.appendChild(layout);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        padding: var(--padding);
        gap: var(--padding);
        width: 100%;
        max-width: 100%;
        background-color: #ffffff;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--padding);
        background-color: var(--primary-color);
        color: white;
        border-radius: var(--border-radius);
        font-size: 20px;
        font-weight: bold;
        margin-bottom: var(--padding);
      }

      .dashboard-content {
        display: flex;
        flex-direction: column;
        gap: var(--padding);
      }

      @media (max-width: var(--breakpoint-medium)) {
        .dashboard-content {
          flex-direction: column;
        }
      }
    `;

    this.shadowRoot.appendChild(style);
  }

  async loadInitialData() {
    try {
      this.trips = await this.fetchTripsUseCase.execute();

      if (this.trips.length > 0) {
        // Read the date from URL parameters if present
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get("date");
        const firstDate = dateParam || this.trips[0].taxiPassengerEnhancementProgramPickUpDateTime;

        // Initialize FilterComponent with the first date or date from URL
        this.filterComponent = new FilterComponent(this.onFilterChange.bind(this), firstDate);

        // Initialize TripWidget
        this.tripWidget = new TripWidget();

        // Append the FilterComponent and TripWidget into the dashboard content layout
        const dashboardContent = this.shadowRoot?.querySelector(".dashboard-content");
        if (dashboardContent) {
          dashboardContent.append(this.filterComponent, this.tripWidget);
        }

        // Apply filter if date parameter is available in URL
        if (dateParam) {
          this.onFilterChange(dateParam);
        } else {
          this.tripWidget.update(this.trips); // Update with all data if no filter applied
        }
      } else {
        console.error("No trips data available to render.");
      }
    } catch (error) {
      console.error("Error loading trips data:", error);
    }
  }

  onFilterChange(filter: string) {
    const filteredTrips = this.filterTripsUseCase.execute(this.trips, filter);
    this.tripWidget.update(filteredTrips);
  }
}

customElements.define("layout-component", LayoutComponent);

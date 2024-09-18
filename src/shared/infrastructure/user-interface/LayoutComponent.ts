import { container } from "../../../dependency-injection/Container";
import { FetchTripsUseCase } from "../../../slices/tripAnalysis/application/FetchTripsUseCase";
import { FilterTripsUseCase } from "../../../slices/tripAnalysis/application/FilterTripsUseCase";
import { Trip } from "../../../slices/tripAnalysis/domain/Trip";
import { FilterComponent } from "../../../slices/tripAnalysis/infrastructure/user-interface/FilterComponent";
import { TripWidget } from "../../../slices/tripAnalysis/infrastructure/user-interface/TripWidget";
import { ProfitCategoryFilter } from "../../../slices/tripAnalysis/infrastructure/user-interface/ProfitCategoryFilter";
import { NetMarginBarChart } from "../../../slices/tripAnalysis/infrastructure/user-interface/NetMarginBarChart";
import { GetAverageNetMarginByProfitUseCase } from "../../../slices/tripAnalysis/application/GetAverageNetMarginByProfitUseCase";

export class LayoutComponent extends HTMLElement {
  private fetchTripsUseCase = container.get(FetchTripsUseCase);
  private filterTripsUseCase = container.get(FilterTripsUseCase);
  private getAverageNetMarginByProfit = container.get(GetAverageNetMarginByProfitUseCase);
  private tripWidget!: TripWidget;
  private filterComponent!: FilterComponent;
  private profitCategoryFilter!: ProfitCategoryFilter;
  private netMarginBarChart!: NetMarginBarChart;
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

    const header = document.createElement("header");
    header.classList.add("dashboard-header");
    header.innerHTML = "<h1>NYC Taxi Company</h1>";

    const nav = document.createElement("nav");
    nav.classList.add("dashboard-nav");
    nav.innerHTML = `
      <ul class="nav-tabs">
        <li><a href="#" class="active">Dashboard</a></li>
        <li><a href="#">Reports</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    `;

    const main = document.createElement("main");
    main.classList.add("dashboard-main");

    this.shadowRoot.append(header, nav);
    this.shadowRoot.appendChild(main);

    const footer = document.createElement("footer");
    footer.classList.add("dashboard-footer");
    footer.textContent = "© 2024 NYC Taxi Company";

    this.shadowRoot.appendChild(footer);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        padding: var(--padding);
        gap: var(--padding);
        width: 100%;
        background-color: #f8f9fa;
        font-family: Arial, sans-serif;
        color: #333;
      }

      .dashboard-header {
        position: sticky;
        top: 0;
        z-index: 100;
        padding: 1rem 2rem;
        background-color: #4e73df;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .dashboard-header h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .dashboard-nav {
        padding: 1rem;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .nav-tabs {
        list-style: none;
        display: flex;
        gap: 1rem;
        padding: 0;
        margin: 0;
      }

      .nav-tabs a {
        text-decoration: none;
        color: #6c757d;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        transition: background-color 0.2s, color 0.2s;
      }

      .nav-tabs a.active, .nav-tabs a:hover {
        background-color: #4e73df;
        color: white;
      }

      .dashboard-main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .dashboard-card {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }

      .dashboard-footer {
        padding: 1rem;
        text-align: center;
        background-color: #ffffff;
        color: #6c757d;
        border-top: 1px solid #ddd;
        border-radius: 5px;
      }

      @media (max-width: 768px) {
        .dashboard-main {
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
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get("date");
        const firstDate = dateParam || this.trips[0].getPickupDatetime().toISOString().split("T")[0];

        this.filterComponent = new FilterComponent(this.onFilterChange.bind(this), firstDate);
        this.tripWidget = new TripWidget();

        this.profitCategoryFilter = new ProfitCategoryFilter(this.onCategoryChange.bind(this));
        this.netMarginBarChart = new NetMarginBarChart();

        const mainContent = this.shadowRoot?.querySelector(".dashboard-main");
        if (mainContent) {
          const netMarginBarChartContainer = document.createElement("div");
          netMarginBarChartContainer.classList.add("dashboard-card");
          netMarginBarChartContainer.appendChild(this.profitCategoryFilter);
          netMarginBarChartContainer.appendChild(this.netMarginBarChart);

          const tripWidgetContainer = document.createElement("div");
          tripWidgetContainer.classList.add("dashboard-card");
          tripWidgetContainer.appendChild(this.filterComponent);
          tripWidgetContainer.appendChild(this.tripWidget);

          mainContent.append(netMarginBarChartContainer, tripWidgetContainer);
        }

        if (dateParam) {
          this.onFilterChange(dateParam);
        } else {
          this.tripWidget.update(this.trips);
        }

        this.loadNetMargins("low");
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

  async onCategoryChange(profitCategory: "low" | "medium" | "high") {
    this.loadNetMargins(profitCategory);
  }

  async loadNetMargins(profitCategory: "low" | "medium" | "high") {
    const averageMargins = await this.getAverageNetMarginByProfit.execute(this.trips, profitCategory);
    this.netMarginBarChart.update(averageMargins);
  }
}

customElements.define("layout-component", LayoutComponent);

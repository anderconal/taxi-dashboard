import * as echarts from "echarts";
import { Trip } from "../../domain/Trip";

export class TripWidget extends HTMLElement {
  private chart: echarts.ECharts | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render(): void {
    if (!this.shadowRoot) return;

    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "400px";
    this.shadowRoot.appendChild(container);

    this.chart = echarts.init(container);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 400px;
        background: white;
        border-radius: var(--border-radius);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      @media (max-width: var(--breakpoint-medium)) {
        :host {
          height: 300px;
        }
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  update(data: Trip[]): void {
    if (!this.chart) return;

    const option = {
      xAxis: { type: "category", data: data.map(trip => trip.taxiPassengerEnhancementProgramPickUpDateTime) },
      yAxis: { type: "value" },
      series: [{ data: data.map(trip => trip.totalAmount), type: "line" }],
    };
    this.chart.setOption(option);
  }
}

customElements.define("trip-widget", TripWidget);

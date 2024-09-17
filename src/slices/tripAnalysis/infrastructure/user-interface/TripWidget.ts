import * as echarts from "echarts";
import { Trip } from "../../domain/Trip";

export class TripWidget extends HTMLElement {
  private chart: echarts.ECharts | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
  }

  render(): void {
    if (!this.shadowRoot) return;

    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "450px";
    this.shadowRoot.appendChild(container);

    this.chart = echarts.init(container);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 450px;
        background: #f9f9f9;
        border-radius: var(--border-radius);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        padding: var(--padding);
        margin-bottom: var(--padding);
      }

      .chart-title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 12px;
      }

      @media (max-width: var(--breakpoint-medium)) {
        :host {
          height: 350px;
        }
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  update(data: Trip[]): void {
    if (!this.chart) return;

    const option: echarts.EChartsOption = {
        title: {
          text: "Trip Earnings by Pick-Up Date and Time",
          left: "center",
          textStyle: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#333",
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: (params: echarts.TooltipComponentFormatterCallbackParams): string => {
            if (Array.isArray(params) && params.length > 0) {
              const firstParam = params[0];
              if ("axisValue" in firstParam && "data" in firstParam) {
                const date = firstParam.axisValue as string;
                const amount = firstParam.data as number;
                return `Pick-Up: ${date}<br/>Total Amount: $${amount.toFixed(2)}`;
              }
            }
            return "";
          },
        },
        xAxis: {
          type: "category",
          data: data.map((trip: Trip) => new Date(trip.taxiPassengerEnhancementProgramPickUpDateTime).toLocaleString()),
          axisLabel: {
            rotate: 45,
            formatter: (value: string) => new Date(value).toLocaleDateString("en-US", { 
              month: "short", 
              day: "numeric", 
              hour: "numeric", 
              minute: "numeric" 
            }),
            interval: 0,
            fontSize: 10,
          },
          name: "Pick-Up Date and Time",
          nameLocation: "middle",
          nameGap: 50,
          nameTextStyle: {
            fontSize: 12,
            fontWeight: "bold",
            padding: [30, 0, 0, 0],
          },
        },
        yAxis: {
          type: "value",
          name: "Total Amount ($)",
          nameLocation: "middle",
          nameGap: 60,
          axisLabel: {
            formatter: (value: number) => `$${value.toFixed(2)}`,
          },
          nameTextStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        },
        series: [{
          data: data.map((trip: Trip) => trip.totalAmount),
          type: "line",
          smooth: true,
          lineStyle: {
            color: "#007ACC",
            width: 2,
          },
          areaStyle: {
            color: "rgba(0, 122, 204, 0.3)",
          },
          emphasis: {
            focus: "series",
            itemStyle: {
              borderColor: "#FF4500",
              borderWidth: 3,
            },
          },
        }],
        grid: {
          left: "10%",
          right: "10%",
          bottom: "20%",
          containLabel: true,
        },
      };
      this.chart.setOption(option);
      
  }
}

customElements.define("trip-widget", TripWidget);

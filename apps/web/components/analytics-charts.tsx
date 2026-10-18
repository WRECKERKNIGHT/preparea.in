import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, BarController, LineController } from "chart.js";
import { Chart as ChartReact } from "react-chartjs-2";

// Register required controllers and elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null)[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    tension?: number;
    fill?: boolean;
  }[];
}

interface ChartProps {
  data: any[]; // Our analytics data
  type: "line" | "bar";
  xKey: string; // Key for x-axis labels
  yKey: string | [string, string][]; // For single dataset or multiple datasets
  title?: string;
  height?: number;
}

export default function ChartContainer({
  data,
  type,
  xKey,
  yKey,
  title,
  height = 300,
}: ChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data to display</div>;
  }

  // Process data for Chart.js
  const labels = data.map((item: any) => {
    const value = item[xKey];
    if (value instanceof Date) {
      return value.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
    return String(value);
  });

  let datasets: ChartData["datasets"] = [];

  if (typeof yKey === "string") {
    // Single dataset
    datasets = [
      {
        label: title || "Data",
        data: data.map((item: any) => {
          const val = item[yKey];
          return val === null ? null : Number(val);
        }),
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        tension: 0.1,
        fill: type === "line",
      },
    ];
  } else {
    // Multiple datasets
    const colors = [
      { bg: "rgba(59, 130, 246, 0.2)", border: "rgba(59, 130, 246, 1)" },
      { bg: "rgba(16, 185, 129, 0.2)", border: "rgba(16, 185, 129, 1)" },
      { bg: "rgba(245, 158, 11, 0.2)", border: "rgba(245, 158, 11, 1)" },
      { bg: "rgba(239, 68, 68, 0.2)", border: "rgba(239, 68, 68, 1)" },
    ];

    datasets = yKey.map(([key, label]: [string, string], index: number) => {
      const color = colors[index % colors.length];
      return {
        label,
        data: data.map((item: any) => {
          const val = item[key];
          return val === null ? null : Number(val);
        }),
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 2,
        tension: 0.1,
        fill: type === "line",
      };
    });
  }

  const chartData: ChartData = {
    labels,
    datasets,
  };

  return (
    <div className={`h-[${height}px]`}>
      <ChartReact
        type={type as keyof typeof ChartJS}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: !!title,
              text: title,
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        }}
      />
    </div>
  );
}
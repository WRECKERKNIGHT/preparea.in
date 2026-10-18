import { useMemo } from "react";
import { format } from "date-fns";

interface ChartDataPoint {
  date: string;
  value: number;
}

interface SimpleChartProps {
  data: ChartDataPoint[];
  title: string;
  height?: number;
  formatter?: (value: number) => string;
}

export default function SimpleChart({
  data,
  title,
  height = 200,
  formatter,
}: SimpleChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  const chartData = useMemo(() => {
    // Sort by date
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(point => point.value));
  }, [chartData]);

  const minValue = useMemo(() => {
    return Math.min(...chartData.map(point => point.value));
  }, [chartData]);

  const valueRange = maxValue - minValue || 1; // Avoid division by zero
  const adjustedMin = minValue - valueRange * 0.1; // Add 10% padding below
  const adjustedMax = maxValue + valueRange * 0.1; // Add 10% padding above
  const range = adjustedMax - adjustedMin;

  const width = 600; // Fixed width for simplicity
  const padding = { top: 20, right: 30, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Create scales
  const xScale = (index: number) => {
    return padding.left + (index / (chartData.length - 1)) * chartWidth;
  };

  const yScale = (value: number) => {
    return padding.top + chartHeight - ((value - adjustedMin) / range) * chartHeight;
  };

  // Format date for x-axis labels
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d");
  };

  return (
    <div className="relative w-[600px]">
      <svg width={width} height={height} className="block">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((position) => (
          <line
            key={`grid-${position}`}
            x1={padding.left}
            y1={yScale(adjustedMin + position * range)}
            x2={width - padding.right}
            y2={yScale(adjustedMin + position * range)}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        ))}

        {/* X-axis line */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={width - padding.right}
          y2={padding.top + chartHeight}
          stroke="#9ca3af"
          strokeWidth={1}
        />

        {/* Y-axis line */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#9ca3af"
          strokeWidth={1}
        />

        {/* Data line (area chart) */}
        <path
          fill="rgba(59, 130, 246, 0.1)"
          stroke="rgba(59, 130, 246, 1)"
          strokeWidth={2}
          d={`
            M${padding.left},${padding.top + chartHeight}
            ${chartData
              .map((point, index) => {
                const x = xScale(index);
                const y = yScale(point.value);
                return `L${x},${y}`;
              })
              .join(" ")}
            L${width - padding.right},${padding.top + chartHeight}
            Z
          `}
        />

        {/* Data points */}
        {chartData.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={xScale(index)}
            cy={yScale(point.value)}
            r={4}
            fill="rgba(59, 130, 246, 1)"
          />
        ))}

        {/* X-axis labels */}
        {chartData.map((point, index) => (
          <text
            key={`x-label-${index}`}
            x={xScale(index)}
            y={padding.top + chartHeight + 20}
            textAnchor="middle"
            fontSize={12}
            fill="#6b7280"
          >
            {formatDate(point.date)}
          </text>
        ))}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((position) => {
          const value = adjustedMin + position * range;
          return (
            <text
              key={`y-label-${position}`}
              x={padding.left - 10}
              y={yScale(value) + 4}
              textAnchor="end"
              fontSize={12}
              fill="#6b7280"
            >
              {formatter ? formatter(value) : `${Math.round(value)}`}
            </text>
          );
        })}

        {/* Title */}
        <text
          x={width / 2}
          y={15}
          textAnchor="middle"
          fontSize={16}
          fontWeight={600}
          fill="#374151"
        >
          {title}
        </text>
      </svg>
    </div>
  );
}
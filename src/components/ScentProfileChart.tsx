
import React from 'react';
import { ScentProfile } from '@/types/quiz';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip 
} from 'recharts';

interface ScentProfileChartProps {
  profile: ScentProfile;
  className?: string;
}

const ScentProfileChart = ({ profile, className }: ScentProfileChartProps) => {
  // Convert note affinities to chart data
  const chartData = Object.entries(profile.notes)
    // Filter out entries with very low affinity for better visualization
    .filter(([_, value]) => value > 0.1)
    // Sort by affinity value descending
    .sort(([_, a], [__, b]) => b - a)
    // Take top 8 for readability
    .slice(0, 8)
    .map(([key, value]) => ({
      note: key,
      value: Math.round(value * 100), // Convert to percentage
      fullMark: 100,
    }));

  // Color configuration for chart
  const chartConfig = {
    primary: { color: "#7C3AED" }, // Purple-ish primary color
    secondary: { color: "rgba(124, 58, 237, 0.5)" }, // Transparent version
  };

  return (
    <div className={`w-full h-80 ${className || ''}`}>
      <ChartContainer 
        config={chartConfig} 
        className="w-full h-full"
      >
        <RadarChart outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="note" 
            tick={{ fill: 'currentColor', fontSize: 12 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]}
            tick={{ fill: 'currentColor', fontSize: 10 }} 
          />
          <Radar
            name="Scent Affinity"
            dataKey="value"
            stroke="var(--color-primary)"
            fill="var(--color-secondary)"
            fillOpacity={0.6}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </RadarChart>
      </ChartContainer>
    </div>
  );
};

export default ScentProfileChart;

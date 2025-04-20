import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalaryData {
  title: string;
  min: number;
  max: number;
  currency: string;
}

interface GrowthData {
  title: string;
  growthRate: number;
}

interface SalaryGrowthChartProps {
  salaryData: SalaryData[];
  growthData: GrowthData[];
}

const SalaryGrowthChart: React.FC<SalaryGrowthChartProps> = ({ salaryData, growthData }) => {
  // Format salary data for chart
  const formatSalaryForChart = () => {
    return {
      labels: salaryData.map(job => job.title),
      datasets: [
        {
          label: 'Min Salary',
          data: salaryData.map(job => job.min),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Max Salary',
          data: salaryData.map(job => job.max),
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Format growth data for chart
  const formatGrowthForChart = () => {
    return {
      labels: growthData.map(job => job.title),
      datasets: [
        {
          label: '5-Year Growth Rate (%)',
          data: growthData.map(job => job.growthRate),
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const salaryOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Salary Ranges',
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: salaryData[0].currency,
                maximumFractionDigits: 0 
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: number | string) {
            if (typeof tickValue === 'number') {
              return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: salaryData[0].currency,
                maximumFractionDigits: 0 
              }).format(tickValue);
            }
            return tickValue;
          }
        }
      }
    }
  };

  const growthOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Projected 5-Year Growth Rate',
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: number | string) {
            if (typeof tickValue === 'number') {
              return tickValue + '%';
            }
            return tickValue;
          }
        }
      }
    }
  };

  return (
    <div className="mt-8 space-y-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Salary Comparison</h3>
        <Bar data={formatSalaryForChart()} options={salaryOptions} />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Growth Potential</h3>
        <Bar data={formatGrowthForChart()} options={growthOptions} />
      </div>
    </div>
  );
};

export default SalaryGrowthChart; 
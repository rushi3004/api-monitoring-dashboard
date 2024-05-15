// Import Chart.js typings if you're using TypeScript
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Function to fetch bill data for a date range
export async function fetchBillData(username: string, startDate: string, endDate: string) {
    const response = await fetch(`your-backend-url/calculate-bill?username=${username}&startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    return data;
}

// Function to format bill data for charting
export function formatDataForChart(billData: { date: string; totalBill: number }[]) {
    const dates = billData.map(entry => entry.date);
    const costs = billData.map(entry => entry.totalBill);
    return { dates, costs };
}

// Function to render line chart with cost on x-axis and date on y-axis
export function renderLineChart(data: { dates: string[]; costs: number[] }) {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.costs.map(cost => cost.toString()),
            datasets: [{
                label: 'Daily Cost',
                data: data.dates,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cost'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

// Example usage
export async function DisplayBillChart(username: string, startDate: string, endDate: string) {
    try {
        const billData = await fetchBillData(username, startDate, endDate);
        const formattedData = formatDataForChart(billData);
        renderLineChart(formattedData);
    } catch (error) {
        console.error('Error fetching or rendering chart:', error);
    }
}

// Call this function with appropriate parameters when you want to display the chart
// displayBillChart('username', '2024-05-01', '2024-05-15');

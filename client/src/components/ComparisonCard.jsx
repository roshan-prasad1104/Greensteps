import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getEmissionsAverages } from '../utils/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ComparisonCard = ({ userEmissions, weeklyEmissions, department, campus }) => {
    const [data, setData] = React.useState({
        labels: ['Your Emissions', 'Department Avg.', 'Campus Avg.'],
        datasets: []
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchComparisonData();
    }, [userEmissions, weeklyEmissions, department, campus]);

    const fetchComparisonData = async () => {
        try {
            setLoading(true);

            // Fetch averages if we have department/campus info
            let deptAvg = 0;
            let campusAvg = 0;

            if (department && campus) {
                const response = await getEmissionsAverages(department, campus);
                deptAvg = response.data.departmentAvg;
                campusAvg = response.data.campusAvg;
            }

            // Use the greater of total or weekly emissions to ensure we show data if available
            // This handles cases where totalEmissions might be desynced in the DB
            const displayEmissions = Math.max(Number(userEmissions) || 0, Number(weeklyEmissions) || 0);

            const chartData = {
                labels: ['Your Emissions', 'Department Avg.', 'Campus Avg.'],
                datasets: [
                    {
                        label: 'Emissions (kg CO₂)',
                        data: [displayEmissions, Number(deptAvg) || 0, Number(campusAvg) || 0],
                        backgroundColor: [
                            '#10B981', // Emerald 500
                            '#3B82F6', // Blue 500
                            '#6B7280', // Gray 500
                        ],
                        borderRadius: 6,
                        barThickness: 30,
                    },
                ],
            };
            setData(chartData);
        } catch (error) {
            console.error('Failed to fetch comparison data:', error);
        } finally {
            setLoading(false);
        }
    };

    const options = {
        indexAxis: 'y', // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Hide legend as colors are self-explanatory or explained in title
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#FFF',
                titleColor: '#1F2937',
                bodyColor: '#4B5563',
                borderColor: '#E5E7EB',
                borderWidth: 1,
                padding: 10,
                boxPadding: 4,
                callbacks: {
                    label: function (context) {
                        return ` ${context.raw.toFixed(2)} kg CO₂`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: '#F3F4F6',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9CA3AF',
                    font: {
                        size: 11
                    }
                },
                border: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 13,
                        weight: '500'
                    }
                },
                border: {
                    display: false
                }
            },
        },
        layout: {
            padding: {
                top: 0,
                bottom: 0
            }
        }
    };

    return (
        <div className="card comparison-card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 className="card-title" style={{ margin: '0 0 5px 0' }}>Performance Comparison</h3>
                <p style={{ margin: '0', fontSize: '14px', color: '#6B7280' }}>
                    Your emissions vs. department and campus averages.
                </p>
            </div>

            <div style={{ height: '250px', width: '100%' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9CA3AF' }}>
                        Loading comparison...
                    </div>
                ) : (
                    <Bar options={options} data={data} />
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#86EFAC', borderRadius: '2px' }}></span>
                    Your Emissions
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#BAE6FD', borderRadius: '2px' }}></span>
                    Department Avg.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#6B7280', borderRadius: '2px' }}></span>
                    Campus Avg.
                </div>
            </div>
        </div>
    );
};

export default ComparisonCard;

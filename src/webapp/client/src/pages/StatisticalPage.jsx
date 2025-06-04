import React, { useState, useEffect, useRef } from 'react';
import * as Chart from 'chart.js';
import Header from '../components/header';
import '../css/stat.css';

const StatisticalPage = () => {
  const [selectedPoi, setSelectedPoi] = useState('Piazza Dante');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('Marzo');
  const [pois, setPois] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalVisits: 2358,
    satisfactionRate: 74,
    monthlyVisits: [
      { month: 'Gen', visits: 1600 },
      { month: 'Feb', visits: 1200 },
      { month: 'Mar', visits: 1550 },
      { month: 'Apr', visits: 1400 },
      { month: 'Mag', visits: 2400 }
    ],
    satisfactionData: [
      { name: 'Apprezzato', value: 79, color: '#4FC3F7' },
      { name: 'Non apprezzato', value: 21, color: '#1565C0' }
    ]
  });

  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    Chart.Chart.register(...Chart.registerables);
    fetchPois();
    fetchDashboardData();
    
    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPoi, selectedYear, selectedMonth]);

  useEffect(() => {
    createCharts();
  }, [dashboardData]);

  const fetchPois = async () => {
    try {
      const response = await fetch('/api/pois');
      const data = await response.json();
      setPois(data);
    } catch (error) {
      console.error('Error fetching POIs:', error);
      setPois([
        { _id: '1', properties: { name: 'Piazza Dante' } },
        { _id: '2', properties: { name: 'Piazza San Marco' } },
        { _id: '3', properties: { name: 'Colosseo' } }
      ]);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const params = new URLSearchParams({
        poi: selectedPoi,
        year: selectedYear,
        month: selectedMonth
      });
      const response = await fetch(`/api/poi-analytics?${params}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const createCharts = () => {
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
    }
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }

    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      lineChartInstance.current = new Chart.Chart(ctx, {
        type: 'line',
        data: {
          labels: dashboardData.monthlyVisits.map(item => item.month),
          datasets: [{
            data: dashboardData.monthlyVisits.map(item => item.visits),
            borderColor: '#4FC3F7',
            backgroundColor: 'rgba(79, 195, 247, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: '#4FC3F7',
            pointBorderColor: '#4FC3F7',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'white',
              titleColor: '#666',
              bodyColor: '#666',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              cornerRadius: 6
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#666',
                font: {
                  size: 12
                }
              }
            },
            y: {
              grid: {
                color: '#f0f0f0',
                drawBorder: false
              },
              ticks: {
                color: '#666',
                font: {
                  size: 12
                }
              },
              beginAtZero: true
            }
          }
        }
      });
    }

    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      pieChartInstance.current = new Chart.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: dashboardData.satisfactionData.map(item => item.name),
          datasets: [{
            data: dashboardData.satisfactionData.map(item => item.value),
            backgroundColor: dashboardData.satisfactionData.map(item => item.color),
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'white',
              titleColor: '#666',
              bodyColor: '#666',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              cornerRadius: 6,
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          },
          cutout: '40%'
        }
      });
    }
  };

  const years = ['2022', '2023', '2024'];
  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/authn/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <Header>
        <button className="auth-button" onClick={() => window.location.href = "/poi-management"}>Gestionale</button>
        <button className="auth-button" onClick={handleLogout}>Logout</button>
      </Header>
      
      <div className="stat-container">
        <div className="max-w-7xl">
          
          
          <div className="stats-grid">
            <select
                value={selectedPoi}
                onChange={(e) => setSelectedPoi(e.target.value)}
                className="main-select"
              >
                {pois.map(poi => (
                  <option key={poi._id} value={poi.properties.name}>
                    {poi.properties.name}
                  </option>
                ))}
              </select>
            <div className="stats-card">
              <h3>Visite totali:</h3>
              <p>{dashboardData.totalVisits}</p>
            </div>
            <div className="stats-card">
              <h3>Gradimento complessivo:</h3>
              <p>{dashboardData.satisfactionRate}%</p>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-container">
              <div className="chart-header">
                <h3>Andamento visite annuale</h3>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="custom-select"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="chart-canvas">
                <canvas ref={lineChartRef}></canvas>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-header">
                <h3>Indice di gradimento mese:</h3>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="custom-select"
                >
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="pie-chart-container">
                <div className="pie-chart-canvas">
                  <canvas ref={pieChartRef}></canvas>
                </div>
                <div className="chart-legend">
                  {dashboardData.satisfactionData.map((entry, index) => (
                    <div key={index} className="legend-item">
                      <div
                        className="legend-color"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="legend-text">
                        {entry.name} {entry.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticalPage;
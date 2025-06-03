import React, { useState, useEffect, useRef } from 'react';
import * as Chart from 'chart.js';
import Header from '../components/header';

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
    // Register Chart.js components
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
    // Destroy existing charts
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
    }
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }

    // Create Line Chart
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

    // Create Pie Chart
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with POI selector */}
        <Header>
          <button className="auth-button" onClick={() => window.location.href = "/stats"}>Statistiche</button>
          <button className="auth-button" onClick={handleLogout}>Logout</button>
        </Header>

        <div className="mb-8">
          <select 
            value={selectedPoi}
            onChange={(e) => setSelectedPoi(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-lg font-medium bg-white"
          >
            {pois.map(poi => (
              <option key={poi._id} value={poi.properties.name}>
                {poi.properties.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Visite totali:</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.totalVisits}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Gradimento complessivo:</h3>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.satisfactionRate}%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-700">Andamento visite annuale</h3>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="h-80">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-700">Indice di gradimento mese:</h3>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div className="h-80 flex flex-col">
              <div className="flex-1">
                <canvas ref={pieChartRef}></canvas>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center mt-4 space-x-6">
                {dashboardData.satisfactionData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-600">
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
  );
};

export default StatisticalPage;
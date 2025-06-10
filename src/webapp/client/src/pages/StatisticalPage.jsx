import React, { useState, useEffect, useRef } from 'react';
import * as Chart from 'chart.js';
import Header from '../components/header';
import '../css/stat.css';

const StatisticalPage = () => {
  const [selectedPoi, setSelectedPoi] = useState('');
  const [selectedPoiId, setSelectedPoiId] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('Marzo');
  const [pois, setPois] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalVisits: 0,
    satisfactionRate: 0,
    monthlyVisits: [],
    satisfactionData: [
      { name: 'Apprezzato', value: 0, color: '#4FC3F7' },
      { name: 'Non apprezzato', value: 0, color: '#1565C0' }
    ]
  });

  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    Chart.Chart.register(...Chart.registerables);
    fetchPois();
    
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
    if (selectedPoiId) {
      fetchDashboardData();
    }
  }, [selectedPoiId, selectedYear, selectedMonth]);

  useEffect(() => {
    createCharts();
  }, [dashboardData]);

  const fetchPois = async () => {
    try {
      const response = await fetch('/api/app/getAllPois');
      const data = await response.json();
      setPois(data);
      
      // Set first POI as default if available
      if (data.length > 0) {
        setSelectedPoi(data[0].properties.name);
        setSelectedPoiId(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching POIs:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch stats for the selected POI
      const response = await fetch(`/api/stat/poi/${selectedPoiId}?populate=true`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const poiStats = result.data;

        // visite tolati
        const totalVisits = poiStats.visits ? poiStats.visits.length : 0;
        
        // indice di soddisfazione
        const upvotes = poiStats.rating?.upvotes || 0;
        const downvotes = poiStats.rating?.downvotes || 0;
        const totalVotes = upvotes + downvotes;
        const satisfactionRate = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0;
        console.log(downvotes);

        // dati per mese
        const monthlyVisits = processMonthlyData(poiStats.visits, selectedYear);
        
        const monthNumber = months.indexOf(selectedMonth) + 1;
        const monthlyRating = poiStats.ratingMensile?.find(
          r => r.year === parseInt(selectedYear) && r.month === monthNumber
        );
        
        //TODO: rimetti a 0 il 10 e il 5 
        const monthlyUpvotes = monthlyRating?.upvotes || 10;
        const monthlyDownvotes = monthlyRating?.downvotes || 5;
        const monthlyTotal = monthlyUpvotes + monthlyDownvotes;
        
        const satisfactionData = monthlyTotal > 0 ? [
          { 
            name: 'Apprezzato', 
            value: Math.round((monthlyUpvotes / monthlyTotal) * 100), 
            color: '#4FC3F7' 
          },
          { 
            name: 'Non apprezzato', 
            value: Math.round((monthlyDownvotes / monthlyTotal) * 100), 
            color: '#1565C0' 
          }
        ] : [
          { name: 'Apprezzato', value: 0, color: '#4FC3F7' },
          { name: 'Non apprezzato', value: 0, color: '#1565C0' }
        ];
        
        setDashboardData({
          totalVisits,
          satisfactionRate,
          monthlyVisits,
          satisfactionData
        });
      } else {
        // No data per questo POI
        setDashboardData({
          totalVisits: 0,
          satisfactionRate: 0,
          monthlyVisits: [],
          satisfactionData: [
            { name: 'Apprezzato', value: 0, color: '#4FC3F7' },
            { name: 'Non apprezzato', value: 0, color: '#1565C0' }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const processMonthlyData = (visits, year) => {
    const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 
                       'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    
    const monthlyData = {};
    
    monthNames.forEach((month, index) => {
      monthlyData[index] = { month, visits: 0 };
    });
    
    if (visits && visits.length > 0) {
      visits.forEach(visit => {
        const visitDate = new Date(visit.timestamp);
        if (visitDate.getFullYear() === parseInt(year)) {
          const monthIndex = visitDate.getMonth();
          monthlyData[monthIndex].visits++;
        }
      });
    }
    
    return Object.values(monthlyData);
  };

  const createCharts = () => {
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
    }
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }

    if (lineChartRef.current && dashboardData.monthlyVisits.length > 0) {
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

  const handlePoiChange = (e) => {
    const selectedName = e.target.value;
    const selectedPoiObj = pois.find(poi => poi.properties.name === selectedName);
    
    setSelectedPoi(selectedName);
    setSelectedPoiId(selectedPoiObj ? selectedPoiObj._id : '');
  };

  const years = ['2022', '2023', '2024', '2025'];
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
                onChange={handlePoiChange}
                className="main-select"
              >
                <option value="">Seleziona un POI</option>
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
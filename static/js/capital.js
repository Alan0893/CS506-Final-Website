/* Top 5 departments by budget */
fetch('/capital/department_cap_budget')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('department_cap_budget').getContext('2d');

    const labels = data.map(item => item.Department);
    const budgetData = data.map(item => item.Total_Project_Budget);

    const colors = {
      'Boston Public Schools': { background: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' },
      'Public Works Department': { background: 'rgba(75, 192, 192, 0.5)', border: 'rgba(75, 192, 192, 1)' },
      'Property Management Department': { background: 'rgba(255, 205, 86, 0.5)', border: 'rgba(255, 205, 86, 1)' },
      'Parks and Recreation Department': { background: 'rgba(54, 162, 235, 0.5)', border: 'rgba(54, 162, 235, 1)' },
      'Transportation Department': { background: 'rgba(201, 203, 207, 0.5)', border: 'rgba(201, 203, 207, 1)' },
      'Other': { background: 'rgba(153, 102, 255, 0.5)', border: 'rgba(153, 102, 255, 1)' }
    };

    const backgroundColors = labels.map(label => colors[label]?.background || 'rgba(0, 0, 0, 0.5)'); 
    const borderColors = labels.map(label => colors[label]?.border || 'rgba(0, 0, 0, 1)'); 

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: budgetData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': $' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));


/* Total Project Budget by Neighborhood */
fetch('/capital/neighborhood_budget')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('top_5_neighborhoods').getContext('2d');

    const labels = data.map(item => item.Neighborhood);
    const budgetData = data.map(item => item.Total_Project_Budget);

    const backgroundColors = [
      'rgba(75, 192, 192, 0.7)',    // Citywide
      'rgba(255, 99, 132, 0.7)',    // Charlestown
      'rgba(54, 162, 235, 0.7)',    // Downtown/Government Center
      'rgba(255, 205, 86, 0.7)',    // Multiple Neighborhoods
      'rgba(153, 102, 255, 0.7)',   // Roxbury
      'rgba(201, 203, 207, 0.7)'    // Other
    ];

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: budgetData,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')), 
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': $' + tooltipItem.raw.toLocaleString();
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));


/* Project Status Distribution */
fetch('/capital/project_status')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('proj_status').getContext('2d');

    const labels = data.map(item => item.Project_Status);
    const counts = data.map(item => item.count);

    const colors = {
      'In Design': 'rgba(255, 99, 132, 0.7)',
      'To Be Scheduled': 'rgba(75, 192, 192, 0.7)',
      'Annual Program': 'rgba(255, 205, 86, 0.7)',
      'In Construction': 'rgba(54, 162, 235, 0.7)',
      'New Project': 'rgba(201, 203, 207, 0.7)',
      'Implementation Underway': 'rgba(153, 102, 255, 0.7)',
      'Study Underway': 'rgba(255, 159, 64, 0.7)'
    };

    const backgroundColors = labels.map(label => colors[label] || 'rgba(0, 0, 0, 0.5)');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Project Status Counts',
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')), 
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }, 
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': ' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Project Status' },
            grid: { display: false }
          },
          y: {
            title: { display: true, text: 'Count' },
            beginAtZero: true
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));


/* Funding Sources for Capital Projects */
fetch('/capital/funding_sources')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('funding_sources').getContext('2d');

    const labels = [
      'Authorization Existing',
      'Authorization FY',
      'Authorization Future',
      'External Funds',
      'Grant Existing',
      'Grant FY',
      'Grant Future'
    ];

    const amounts = [
      data.Authorization_Existing,
      data.Authorization_FY,
      data.Authorization_Future,
      data.External_Funds,
      data.Grant_Existing,
      data.Grant_FY,
      data.Grant_Future
    ];

    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',   // Authorization Existing
      'rgba(75, 192, 192, 0.7)',   // Authorization FY
      'rgba(255, 205, 86, 0.7)',   // Authorization Future
      'rgba(54, 162, 235, 0.7)',   // External Funds
      'rgba(201, 203, 207, 0.7)',  // Grant Existing
      'rgba(153, 102, 255, 0.7)',  // Grant FY
      'rgba(255, 159, 64, 0.7)'    // Grant Future
    ];

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Amount (in USD)',
          data: amounts,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }, 
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': $' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Categories' },
            grid: { display: false }
          },
          y: {
            title: { display: true, text: 'Amount (in USD)' },
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString(); 
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));


/* Average Project Budget by Neighborhood */
fetch('/capital/avg_project_budget')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('proj_budget_neighborhood').getContext('2d');

    const labels = data.map(item => item.Neighborhood);

    const budgetData = data.map(item => item.Total_Project_Budget);

    const backgroundColors = labels.map((_, index) => {
      return `rgba(${(index * 15) % 255}, ${(index * 30) % 255}, ${(index * 45) % 255}, 0.5)`;
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Project Budget',
          data: budgetData,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }, 
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': $' + tooltipItem.raw.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString(); 
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));


/* Year-over-Year Capital Spending */
fetch('/capital/yearly_spending')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('cap_spending').getContext('2d');

    const labels = data.map(item => item.Year);

    const spendingData = data.map(item => item.Spending);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Spending',
            data: spendingData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            label: 'Line Overlay', 
            data: spendingData, 
            type: 'line', 
            fill: false, 
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.1,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': $' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString(); 
              }
            }
          },
          y1: {
            position: 'right',
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString(); 
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));


/* Funding Sources by Department */
fetch('/capital/dept_funding_sources')
  .then(response => response.json())
  .then(data => {
    const departments = data.map(item => item.Department); 

    const authorizationExisting = data.map(item => item.Authorization_Existing);
    const authorizationFY = data.map(item => item.Authorization_FY);
    const authorizationFuture = data.map(item => item.Authorization_Future);
    const grantExisting = data.map(item => item.Grant_Existing);
    const grantFY = data.map(item => item.Grant_FY);
    const grantFuture = data.map(item => item.Grant_Future);
    const externalFunds = data.map(item => item.External_Funds);

    const ctx = document.getElementById('dept_funding_sources').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: departments,
        datasets: [
          {
            label: 'Authorization Existing',
            data: authorizationExisting,
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Color for Authorization Existing
          },
          {
            label: 'Authorization FY',
            data: authorizationFY,
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color for Authorization FY
          },
          {
            label: 'Authorization Future',
            data: authorizationFuture,
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color for Authorization Future
          },
          {
            label: 'Grant Existing',
            data: grantExisting,
            backgroundColor: 'rgba(153, 102, 255, 0.6)', // Color for Grant Existing
          },
          {
            label: 'Grant FY',
            data: grantFY,
            backgroundColor: 'rgba(255, 159, 64, 0.6)', // Color for Grant FY
          },
          {
            label: 'Grant Future',
            data: grantFuture,
            backgroundColor: 'rgba(255, 205, 86, 0.6)', // Color for Grant Future
          },
          {
            label: 'External Funds',
            data: externalFunds,
            backgroundColor: 'rgba(201, 203, 207, 0.6)', // Color for External Funds
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': $' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true, 
            title: {
              display: true,
              text: 'Department'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Funding Amount (USD)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString(); 
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));

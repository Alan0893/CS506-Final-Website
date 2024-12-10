document.addEventListener("DOMContentLoaded", function () {
	const mapContainer = document.querySelector('.map-container1');

	fetch('/maps/neighborhood_budget')
		.then(response => response.text())
		.then(mapHTML => {
			mapContainer.innerHTML = mapHTML;
			mapContainer.classList.add('loaded'); 
		})
		.catch(error => {
			console.error("Error loading the map:", error);
			mapContainer.innerHTML = "<p style='color: red;'>Failed to load the map. Please try again.</p>";
		});
});

document.addEventListener("DOMContentLoaded", function () {
	const mapContainer = document.querySelector('.map-container2');

	fetch('/maps/per_capita')
		.then(response => response.text())
		.then(mapHTML => {
			mapContainer.innerHTML = mapHTML;
			mapContainer.classList.add('loaded'); 
		})
		.catch(error => {
			console.error("Error loading the map:", error);
			mapContainer.innerHTML = "<p style='color: red;'>Failed to load the map. Please try again.</p>";
		});
});


// Fetch data from the /model endpoint
fetch('/model')
  .then(response => response.json())
  .then(data => {
    // Extract scatter plot and regression line data
    const scatterX = data.scatter.x; // Per Capita Income
    const scatterY = data.scatter.y; // Per Capita Expenses
    const labels = data.scatter.labels; // Neighborhood names
    const regressionX = data.regression_line.x; // X-axis for regression line
    const regressionY = data.regression_line.y; // Y-axis for regression line

    // Create the scatter plot and regression line using Chart.js
    const ctx = document.getElementById('linear_regression_graph').getContext('2d');
    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Neighborhoods',
            data: scatterX.map((x, i) => ({ x, y: scatterY[i], label: labels[i] })), // Scatter points
            backgroundColor: 'rgba(54, 162, 235, 0.5)', // Scatter points color
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 7
          },
          {
            label: 'Regression Line',
            data: regressionX.map((x, i) => ({ x, y: regressionY[i] })), // Regression line points
            type: 'line',
            borderColor: 'rgba(255, 99, 132, 1)', // Line color
            borderWidth: 2,
            fill: false,
            pointRadius: 0 // Hide points for the line
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                if (tooltipItem.datasetIndex === 0) {
                  // Tooltip for scatter points
                  return `${tooltipItem.raw.label}: ($${tooltipItem.raw.x.toLocaleString()}, $${tooltipItem.raw.y.toLocaleString()})`;
                } else {
                  // Tooltip for regression line
                  return `Regression: ($${tooltipItem.raw.x.toLocaleString()}, $${tooltipItem.raw.y.toLocaleString()})`;
                }
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Per Capita Income'
            },
            ticks: {
              callback: value => `$${value.toLocaleString()}` // Format as currency
            }
          },
          y: {
            title: {
              display: true,
              text: 'Per Capita Expenses'
            },
            ticks: {
              callback: value => `$${value.toLocaleString()}` // Format as currency
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));


	// Fetch data from the /model endpoint
fetch('/model')
  .then(response => response.json())
  .then(data => {
    // Extract scatter plot and regression data
    const scatterX = data.scatter.x; // Per Capita Income
    const scatterY = data.scatter.y; // Per Capita Expenses
    const labels = data.scatter.labels; // Neighborhood names

    const linearX = data.linear_regression.x;
    const linearY = data.linear_regression.y;

    const polyX = data.polynomial_regression.x;
    const polyY = data.polynomial_regression.y;

    const treeX = data.decision_tree_regression.x;
    const treeY = data.decision_tree_regression.y;

    // Create the Chart.js scatter plot with multiple regression lines
    const ctx = document.getElementById('linear_regression_graph').getContext('2d');
    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Neighborhoods',
            data: scatterX.map((x, i) => ({ x, y: scatterY[i], label: labels[i] })),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 7
          },
          {
            label: 'Linear Regression',
            data: linearX.map((x, i) => ({ x, y: linearY[i] })),
            type: 'line',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false,
            pointRadius: 0
          },
          {
            label: 'Polynomial Regression',
            data: polyX.map((x, i) => ({ x, y: polyY[i] })),
            type: 'line',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            borderDash: [5, 5], // Dashed line
            pointRadius: 0
          },
          {
            label: 'Decision Tree Regression',
            data: treeX.map((x, i) => ({ x, y: treeY[i] })),
            type: 'line',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            fill: false,
            borderDash: [10, 5], // More pronounced dashed line
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                if (tooltipItem.datasetIndex === 0) {
                  return `${tooltipItem.raw.label}: ($${tooltipItem.raw.x.toLocaleString()}, $${tooltipItem.raw.y.toLocaleString()})`;
                } else {
                  return `(${tooltipItem.raw.x.toLocaleString()}, ${tooltipItem.raw.y.toLocaleString()})`;
                }
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Per Capita Income' },
            ticks: {
              callback: value => `$${value.toLocaleString()}`
            }
          },
          y: {
            title: { display: true, text: 'Per Capita Expenses' },
            ticks: {
              callback: value => `$${value.toLocaleString()}`
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));

/* Top departments by budget */
fetch('/operating/top_5_dept')
  .then(response => response.json())
  .then(data => {
    const labels = data.map(item => item.Dept);
    const budgetData = data.map(item => item['FY25 Budget']);

    const ctx = document.getElementById('department_budget').getContext('2d');

    const colors = {
      "Boston Public Schools": { background: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' },
      "Police Department": { background: 'rgba(75, 192, 192, 0.5)', border: 'rgba(75, 192, 192, 1)' },
      "Pensions": { background: 'rgba(255, 205, 86, 0.5)', border: 'rgba(255, 205, 86, 1)' },
      "Fire Department": { background: 'rgba(54, 162, 235, 0.5)', border: 'rgba(54, 162, 235, 1)' },
      "Charter School Tuition": { background: 'rgba(201, 203, 207, 0.5)', border: 'rgba(201, 203, 207, 1)' },
      "Other": { background: 'rgba(153, 102, 255, 0.5)', border: 'rgba(153, 102, 255, 1)' }
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
                return tooltipItem.label + ': $' + tooltipItem.raw.toLocaleString(); // Format as currency
              }
            }
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));


/* Budget by Category */
fetch('/operating/budget_by_category')
  .then(response => response.json())
  .then(data => {
    const labels = data.map(item => item['Expense Category']); 
    const budgetData = data.map(item => item['FY25 Budget']); 

    const ctx = document.getElementById('category_budget').getContext('2d');

    const categoryColors = {
      "Personnel Services": { background: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' },
      "Other Expenses": { background: 'rgba(75, 192, 192, 0.5)', border: 'rgba(75, 192, 192, 1)' },
      "Contractual Services": { background: 'rgba(255, 205, 86, 0.5)', border: 'rgba(255, 205, 86, 1)' },
      "Current Charges & Obligations": { background: 'rgba(54, 162, 235, 0.5)', border: 'rgba(54, 162, 235, 1)' },
      "Fixed Expenses": { background: 'rgba(201, 203, 207, 0.5)', border: 'rgba(201, 203, 207, 1)' },
      "Supplies & Materials": { background: 'rgba(153, 102, 255, 0.5)', border: 'rgba(153, 102, 255, 1)' },
      "Equipment": { background: 'rgba(255, 159, 64, 0.5)', border: 'rgba(255, 159, 64, 1)' }
    };

    const backgroundColors = labels.map(label => categoryColors[label]?.background || 'rgba(0, 0, 0, 0.5)'); 
    const borderColors = labels.map(label => categoryColors[label]?.border || 'rgba(0, 0, 0, 1)');

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


/* Budget by Program */
fetch('/operating/program_budget')
  .then(response => response.json())
  .then(data => {
    const labels = data.map(item => item['Program']); 
    const budgetData = data.map(item => item['FY25 Budget']); 

    const ctx = document.getElementById('program_budget').getContext('2d');

    const programColors = {
      "Pensions": { background: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' },
      "BPS Operations": { background: 'rgba(75, 192, 192, 0.5)', border: 'rgba(75, 192, 192, 1)' },
      "Charter School Tuition": { background: 'rgba(255, 205, 86, 0.5)', border: 'rgba(255, 205, 86, 1)' },
      "Debt Service": { background: 'rgba(54, 162, 235, 0.5)', border: 'rgba(54, 162, 235, 1)' },
      "K-8": { background: 'rgba(201, 203, 207, 0.5)', border: 'rgba(201, 203, 207, 1)' },
      "Bureau of Field Services": { background: 'rgba(153, 102, 255, 0.5)', border: 'rgba(153, 102, 255, 1)' },
      "Health Insurance": { background: 'rgba(255, 159, 64, 0.5)', border: 'rgba(255, 159, 64, 1)' },
      "Boston Fire Suppression": { background: 'rgba(75, 192, 192, 0.5)', border: 'rgba(75, 192, 192, 1)' },
      "BPS Finance": { background: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' },
      "Elementary": { background: 'rgba(54, 162, 235, 0.5)', border: 'rgba(54, 162, 235, 1)' },
      "High": { background: 'rgba(255, 205, 86, 0.5)', border: 'rgba(255, 205, 86, 1)' },
      "Public Health Commission": { background: 'rgba(201, 203, 207, 0.5)', border: 'rgba(201, 203, 207, 1)' },
      "MBTA": { background: 'rgba(153, 102, 255, 0.5)', border: 'rgba(153, 102, 255, 1)' },
      "Reserve for Collective Bargaining City": { background: 'rgba(255, 159, 64, 0.5)', border: 'rgba(255, 159, 64, 1)' },
      "BAT-Admin & Technology": { background: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' },
      "Other": { background: 'rgba(192, 75, 75, 0.5)', border: 'rgba(192, 75, 75, 1)' }
    };

    const backgroundColors = labels.map(label => programColors[label]?.background || 'rgba(0, 0, 0, 0.5)'); 
    const borderColors = labels.map(label => programColors[label]?.border || 'rgba(0, 0, 0, 1)'); 

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


/* Top 5 Departments: Expenses over the Years */
fetch('/operating/top_5_dept')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('top_5_dept').getContext('2d');

    const filteredData = data.filter(item => item.Dept !== "Other");

    const labels = ["FY22", "FY23", "FY24", "FY25"];

    const departmentColors = {
      "Boston Public Schools": 'rgba(255, 99, 132, 1)',
      "Police Department": 'rgba(54, 162, 235, 1)',
      "Pensions": 'rgba(255, 205, 86, 1)',
      "Fire Department": 'rgba(75, 192, 192, 1)',
      "Charter School Tuition": 'rgba(153, 102, 255, 1)'
    };

    const datasets = filteredData.map(item => ({
      label: item.Dept, 
      data: [
        item['FY22 Actual Expense'],
        item['FY23 Actual Expense'],
        item['FY24 Appropriation'],
        item['FY25 Budget']
      ],
      borderColor: departmentColors[item.Dept],
      backgroundColor: departmentColors[item.Dept].replace('1)', '0.5)'), 
      fill: false
    }));

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': $' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        },
        scales: {
          y: {
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


/* Top 5 Increased Budget */
fetch('/operating/top_5_increased')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('top_5_increased').getContext('2d');

    const years = data.years;
    const departments = data.departments;

    const departmentColors = {
      "Boston Public Schools": 'rgba(255, 99, 132, 1)',
      "Police Department": 'rgba(54, 162, 235, 1)',
      "Pensions": 'rgba(255, 205, 86, 1)',
      "Debt Service": 'rgba(75, 192, 192, 1)',
      "Charter School Tuition": 'rgba(153, 102, 255, 1)'
    };

    const datasets = departments.map(dept => ({
      label: dept.department,
      data: years.map(year => dept.expenses[year]), 
      borderColor: departmentColors[dept.department],
      backgroundColor: departmentColors[dept.department].replace('1)', '0.5)'), 
      fill: false
    }));

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': $' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        },
        scales: {
          y: {
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


/* Expense Categories */
fetch('/operating/category_expenses')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('category_expenses').getContext('2d');

    const years = data.years;
    const categories = data.categories;

    const categoryColors = {
      "Contractual Services": 'rgba(255, 99, 132, 1)',
      "Current Charges & Obligations": 'rgba(54, 162, 235, 1)',
      "Equipment": 'rgba(255, 205, 86, 1)',
      "Fixed Expenses": 'rgba(75, 192, 192, 1)',
      "Other Expenses": 'rgba(153, 102, 255, 1)',
      "Personnel Services": 'rgba(201, 203, 207, 1)',
      "Supplies & Materials": 'rgba(255, 159, 64, 1)'
    };

    const datasets = categories.map(cat => ({
      label: cat.category, 
      data: years.map(year => cat.expenses[year]), 
      borderColor: categoryColors[cat.category], 
      backgroundColor: categoryColors[cat.category].replace('1)', '0.5)'), 
      fill: false
    }));

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years, 
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.dataset.label + ': $' + tooltipItem.raw.toLocaleString(); 
              }
            }
          }
        },
        scales: {
          y: {
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

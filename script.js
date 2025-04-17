let monthlyChart;
let categoryChart;

function getBudget() {
  return parseInt(localStorage.getItem('pocketMoney')) || 50000;
}

function getExpensesList() {
  return JSON.parse(localStorage.getItem('expenses')) || [];
}

function getTotalExpenses(expenses) {
  return expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
}

function updateDashboard() {
  const budget = getBudget();
  const expenses = getExpensesList();
  const totalSpent = getTotalExpenses(expenses);
  const remaining = budget - totalSpent;

  document.getElementById('budget').innerText = `₹ ${budget.toLocaleString()}`;
  document.getElementById('expenses').innerText = `₹ ${totalSpent.toLocaleString()}`;
  document.getElementById('remaining').innerText = `₹ ${remaining.toLocaleString()}`;

  updateMonthlyChart(totalSpent, remaining);
  updateCategoryChart(expenses);
}

function updateMonthlyChart(expenses, remaining) {
  if (monthlyChart) monthlyChart.destroy();
  const ctx = document.getElementById('monthlyChart').getContext('2d');
  monthlyChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Expenses', 'Remaining'],
      datasets: [{
        data: [expenses, remaining],
        backgroundColor: ['#ff6384', '#36a2eb'],
        hoverOffset: 4
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: 'white' }
        }
      }
    }
  });
}

function updateCategoryChart(expenses) {
  if (categoryChart) categoryChart.destroy();

  // Group by category
  const categoryMap = {};
  expenses.forEach(e => {
    const category = e.category || 'Uncategorized';
    const amount = parseFloat(e.amount);
    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }
    categoryMap[category] += amount;
  });

  const categories = Object.keys(categoryMap);
  const totals = Object.values(categoryMap);

  const ctx = document.getElementById('categoryChart').getContext('2d');
  categoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Expenses by Category',
        data: totals,
        backgroundColor: '#4af0b0'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: 'white' }
        },
        x: {
          ticks: { color: 'white' }
        }
      },
      plugins: {
        legend: {
          labels: { color: 'white' }
        }
      }
    }
  });
}

window.onload = updateDashboard;

// Get the context of the canvas elements
const ctx = document.getElementById('categoryChart').getContext('2d');

// Dummy data for category data (you can replace this with real data)
const categoryData = {
  shirts: 5,
  pants: 4,
  shoes: 3,
  accessories: 2,
  outerwear: 1,
};

// Create the pie chart for category breakdown
const categoryChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Shirts', 'Pants', 'Shoes', 'Accessories', 'Outerwear'],
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  },
});

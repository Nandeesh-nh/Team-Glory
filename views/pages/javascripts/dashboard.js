// Get the context of the canvas element for the category breakdown chart
const ctx = document.getElementById('categoryChart').getContext('2d');

// Dummy data passed from the server (can be changed to real data in the future)
const categoryData = {
  shirts: 5,
  pants: 4,
  shoes: 3,
  accessories: 2,
  outerwear: 1,
};

// Create the chart
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

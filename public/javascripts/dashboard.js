// Get the context of the canvas element for the category breakdown chart
const ctx = document.getElementById('categoryChart').getContext('2d');
const ptx = document.getElementById('sustainabilityChart').getContext('2d');

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

// Custom function to create the doughnut chart with shadows
function drawDoughnutWithShadow(ptx, data) {
  const chart = new Chart(ptx, {
    type: 'doughnut', // Use doughnut type for a circular progress bar
    data: {
      labels: ['Used', 'Remaining'],
      datasets: [{
        data: data, // Score and remaining percentage
        backgroundColor: ['#4CAF50', '#E0E0E0'], // Green for used, grey for remaining
        borderWidth: 0, // No border
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: false // Hide legend
        },
        tooltip: {
          enabled: false // Hide tooltips
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });

  // Draw shadows manually
  ptx.save();
  ptx.shadowColor = 'rgba(0, 0, 0, 0.3)'; // Shadow color
  ptx.shadowBlur = 10; // Shadow blur size
  ptx.shadowOffsetX = 5; // Horizontal shadow offset
  ptx.shadowOffsetY = 5; // Vertical shadow offset

  // Render the chart
  chart.render();

  // Restore context
  ptx.restore();
}

// Use the sustainability score for drawing
drawDoughnutWithShadow(ptx, [sustainabilityScoreValue, 100 - sustainabilityScoreValue]);
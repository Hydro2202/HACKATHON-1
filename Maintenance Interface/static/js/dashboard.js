const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const dashboardButtons = document.querySelectorAll('.dashboard-btn');
const dashboardSections = document.querySelectorAll('.dashboard-section');

// Toggle sidebar visibility on mobile
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
  });
}

// Show first dashboard section by default
if (dashboardSections.length) {
  dashboardSections[0].classList.remove('hidden');
}

// Dashboard section toggle logic

dashboardButtons.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    dashboardSections.forEach(section => section.classList.add('hidden'));
    if (dashboardSections[idx]) {
      dashboardSections[idx].classList.remove('hidden');
      // If Job Orders section, fetch and render job orders
      if (dashboardSections[idx].querySelector('.job-orders-list')) {
        fetchJobOrdersDashboard();
      }
    }
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      sidebar.classList.add('-translate-x-full');
    }
  });
});

// Fetch and render job orders in dashboard
function fetchJobOrdersDashboard() {
  const jobOrdersList = document.querySelector('.job-orders-list');
  if (!jobOrdersList) return;
  jobOrdersList.innerHTML = '<div class="text-gray-500">Loading...</div>';
  fetch('/api/job-orders')
    .then(res => res.json())
    .then(data => {
      jobOrdersList.innerHTML = '';
      if (!data.length) {
        jobOrdersList.innerHTML = '<div class="text-gray-500">No job orders found.</div>';
        return;
      }
      data.forEach(order => {
        let statusLine = '';
        if (order.status === 'Completed') {
          statusLine = `<p class="text-gray-700">Status: <span class="font-semibold ${order.status_color}">${order.status}</span></p><p class="text-gray-700">Completed on: ${order.completion_date || ''}</p>`;
        } else if (order.status === 'Pending') {
          statusLine = `<p class="text-gray-700">Status: <span class="font-semibold ${order.status_color}">${order.status}</span></p><p class="text-gray-700">Expected Completion: ${order.expected_date || ''}</p>`;
        } else if (order.status === 'Overdue') {
          statusLine = `<p class="text-gray-700">Status: <span class="font-semibold ${order.status_color}">${order.status}</span></p><p class="text-gray-700">Was due on: ${order.expected_date || ''}</p>`;
        } else {
          statusLine = `<p class="text-gray-700">Status: <span class="font-semibold">${order.status}</span></p>`;
        }
        jobOrdersList.innerHTML += `
          <div class="border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300 mb-4">
            <h3 class="text-lg font-semibold text-primaryBlue">${order.title}</h3>
            <p class="text-gray-700">Assigned to: ${order.assigned_to}</p>
            ${statusLine}
          </div>
        `;
      });
    })
    .catch(() => {
      jobOrdersList.innerHTML = '<div class="text-red-500">Failed to load job orders.</div>';
    });
}

// Close sidebar if clicking outside on mobile
window.addEventListener('click', (e) => {
  if (window.innerWidth < 768) {
    if (!sidebar.contains(e.target) && mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
      sidebar.classList.add('-translate-x-full');
    }
  }
});

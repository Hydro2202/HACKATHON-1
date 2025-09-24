// Data model for tenant complaints and job orders
const COMPLAINTS_KEY = 'confix_complaints';
const JOBS_KEY = 'confix_jobs';

// Helper functions
const uid = (prefix = 'i') => prefix + '-' + Math.random().toString(36).slice(2, 9);
const getComplaints = () => JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || '[]');
const setComplaints = (arr) => localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(arr));
const getJobs = () => JSON.parse(localStorage.getItem(JOBS_KEY) || '[]');
const setJobs = (arr) => localStorage.setItem(JOBS_KEY, JSON.stringify(arr));

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, duration);
}

// Category icons and colors
const categoryConfig = {
    plumbing: { icon: '🚰', color: '#0ea5e9', name: 'Plumbing' },
    electrical: { icon: '💡', color: '#f59e0b', name: 'Electrical' },
    appliance: { icon: '🔌', color: '#8b5cf6', name: 'Appliance' },
    heating: { icon: '🔥', color: '#dc2626', name: 'Heating/AC' },
    structural: { icon: '🏠', color: '#059669', name: 'Structural' },
    pest: { icon: '🐜', color: '#7c3aed', name: 'Pest Control' },
    other: { icon: '❓', color: '#6b7280', name: 'Other' }
};

// Example data for demonstration
const exampleComplaints = [
    {
        id: 'c-1',
        tenantName: 'Sarah Johnson',
        unit: 'Apt 3B',
        category: 'plumbing',
        title: 'Leaking kitchen faucet',
        description: 'Water dripping continuously from kitchen faucet. Getting worse over time.',
        urgency: 'medium',
        status: 'open',
        created: Date.now() - 86400000, // 1 day ago
        reportedBy: 'tenant'
    },
    {
        id: 'c-2',
        tenantName: 'Mike Chen',
        unit: 'Apt 5A',
        category: 'electrical',
        title: 'Bedroom outlet not working',
        description: 'Top outlet in master bedroom stopped working suddenly. No power.',
        urgency: 'medium',
        status: 'inprogress',
        created: Date.now() - 172800000, // 2 days ago
        reportedBy: 'tenant'
    },
    {
        id: 'c-3',
        tenantName: 'Emma Rodriguez',
        unit: 'Apt 2C',
        category: 'heating',
        title: 'No heat in living room',
        description: 'Heating vent in living room blowing cold air only. Other rooms are fine.',
        urgency: 'high',
        status: 'open',
        created: Date.now() - 3600000, // 1 hour ago
        reportedBy: 'tenant'
    },
    {
        id: 'c-4',
        tenantName: 'David Kim',
        unit: 'Apt 1A',
        category: 'appliance',
        title: 'Refrigerator making loud noise',
        description: 'Loud grinding noise coming from refrigerator, especially at night.',
        urgency: 'medium',
        status: 'open',
        created: Date.now() - 432000000, // 5 days ago
        reportedBy: 'tenant'
    }
];

const exampleJobs = [
    {
        id: 'j-1',
        title: 'Replace hallway light fixtures',
        assignedTo: 'electrician',
        priority: 'normal',
        estimatedCost: 250,
        description: 'Replace all old hallway light fixtures with new LED fixtures as per admin request.',
        status: 'open',
        created: Date.now() - 259200000, // 3 days ago
        createdBy: 'admin'
    },
    {
        id: 'j-2',
        title: 'Quarterly pest control treatment',
        assignedTo: 'pest',
        priority: 'normal',
        estimatedCost: 180,
        description: 'Routine quarterly pest control treatment for entire building.',
        status: 'inprogress',
        created: Date.now() - 86400000, // 1 day ago
        createdBy: 'admin'
    },
    {
        id: 'j-3',
        title: 'Repair parking lot potholes',
        assignedTo: 'handyman',
        priority: 'high',
        estimatedCost: 1200,
        description: 'Fill and repair 3 large potholes in parking lot. Safety concern.',
        status: 'open',
        created: Date.now() - 432000000, // 5 days ago
        createdBy: 'admin'
    },
    {
        id: 'j-4',
        title: 'Annual fire alarm inspection',
        assignedTo: 'electrician',
        priority: 'normal',
        estimatedCost: 350,
        description: 'Annual fire alarm system inspection and testing as required by code.',
        status: 'onhold',
        created: Date.now() - 604800000, // 7 days ago
        createdBy: 'admin'
    }
];

// Check if user is logged in
const user = JSON.parse(localStorage.getItem('confix_user') || 'null');
if (!user) {
    window.location.href = 'login.html';
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Set user info
    document.getElementById('userName').textContent = user.name || 'Maintenance';
    document.getElementById('profileInitial').textContent = (user.name || 'M').slice(0, 1).toUpperCase();
    document.getElementById('profileAvatar').textContent = (user.name || 'M').slice(0, 1).toUpperCase();
    document.getElementById('profileEmail').textContent = user.email || 'maintenance@confix.com';

    // Set up event listeners
    setupEventListeners();
    
    // Set up tab switching
    setupTabs();
    
    // Check if we need to load example data
    const complaints = getComplaints();
    const jobs = getJobs();
    
    if (complaints.length === 0 && jobs.length === 0) {
        // Show option to load examples
        showNotification('No data found. Click "Load Example Data" to see demo content.', 5000);
    }
    
    // Initial render
    render();
}

function setupEventListeners() {
    // Quick actions
    document.getElementById('markInProgress').addEventListener('click', markSelectedInProgress);
    document.getElementById('markResolved').addEventListener('click', markSelectedResolved);
    document.getElementById('loadExamples').addEventListener('click', loadExampleData);
    document.getElementById('updateStatus').addEventListener('click', updateStatus);
    
    // Navigation
    document.getElementById('navHome').addEventListener('click', () => setActiveNav('navHome'));
    document.getElementById('navQR').addEventListener('click', openQRScanner);
    document.getElementById('navProfile').addEventListener('click', openProfile);
    
    // Modal controls
    document.getElementById('closeQr').addEventListener('click', closeQRScanner);
    document.getElementById('closeProfile').addEventListener('click', closeProfile);
    document.getElementById('startScan').addEventListener('click', toggleQRScan);
    document.getElementById('uploadImage').addEventListener('click', () => document.getElementById('qrFile').click());
    document.getElementById('qrFile').addEventListener('change', handleQRImageUpload);
    
    // Profile actions
    document.getElementById('exportData').addEventListener('click', exportData);
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });
}

function setActiveNav(activeId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
}

function render() {
    const complaints = getComplaints().sort((a, b) => b.created - a.created);
    const jobs = getJobs().sort((a, b) => b.created - a.created);
    
    updateStats(complaints, jobs);
    renderComplaints(complaints);
    renderJobs(jobs);
    renderStatusSelect(complaints, jobs);
    renderRecentActivity(complaints, jobs);
}

function updateStats(complaints, jobs) {
    const openComplaints = complaints.filter(c => c.status === 'open').length;
    const pendingJobs = jobs.filter(j => j.status === 'open' || j.status === 'inprogress').length;
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const resolvedThisWeek = [...complaints, ...jobs].filter(item => 
        item.status === 'resolved' && item.resolvedAt > weekAgo
    ).length;
    
    document.getElementById('openComplaints').textContent = complaints.length;
    document.getElementById('pendingJobs').textContent = jobs.length;
    document.getElementById('resolvedThisWeek').textContent = resolvedThisWeek;
    document.getElementById('complaintsCount').textContent = complaints.length;
    document.getElementById('jobsCount').textContent = jobs.length;
}

function renderComplaints(complaints) {
    const complaintsList = document.getElementById('complaintsList');
    complaintsList.innerHTML = '';
    
    if (complaints.length === 0) {
        complaintsList.innerHTML = '<div class="empty-state">No tenant complaints yet. Click "Load Example Data" to see demo content.</div>';
        return;
    }
    
    complaints.forEach(complaint => {
        const category = categoryConfig[complaint.category] || categoryConfig.other;
        const urgencyClass = `urgency-${complaint.urgency}`;
        
        const complaintElement = document.createElement('div');
        complaintElement.className = `item ${urgencyClass}`;
        complaintElement.innerHTML = `
            <div class="meta">
                <div class="item-title">${category.icon} ${escapeHtml(complaint.title)}</div>
                <div class="item-details">
                    <span>${escapeHtml(complaint.tenantName)} • ${escapeHtml(complaint.unit)}</span>
                    <span>${formatDate(complaint.created)}</span>
                    <span>${complaint.urgency.toUpperCase()}</span>
                </div>
                ${complaint.description ? `<div style="font-size:12px;color:#5b7fa2;margin-top:4px;">${escapeHtml(complaint.description)}</div>` : ''}
            </div>
            <div class="status ${complaint.status}">${complaint.status.toUpperCase()}</div>
        `;
        complaintsList.appendChild(complaintElement);
    });
}

function renderJobs(jobs) {
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = '';
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<div class="empty-state">No job orders yet. Click "Load Example Data" to see demo content.</div>';
        return;
    }
    
    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'item';
        jobElement.innerHTML = `
            <div class="meta">
                <div class="item-title">🛠️ ${escapeHtml(job.title)}</div>
                <div class="item-details">
                    <span>${job.assignedTo || 'Unassigned'}</span>
                    <span>${job.estimatedCost ? formatCurrency(parseFloat(job.estimatedCost)) : 'No estimate'}</span>
                    <span>${formatDate(job.created)}</span>
                    <span>${job.priority.toUpperCase()}</span>
                </div>
                ${job.description ? `<div style="font-size:12px;color:#5b7fa2;margin-top:4px;">${escapeHtml(job.description)}</div>` : ''}
            </div>
            <div class="status ${job.status}">${job.status.toUpperCase()}</div>
        `;
        jobsList.appendChild(jobElement);
    });
}

function renderStatusSelect(complaints, jobs) {
    const selectItem = document.getElementById('selectItem');
    selectItem.innerHTML = '<option value="">Select complaint or job to update</option>';
    
    [...complaints, ...jobs].forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        const type = item.tenantName ? 'Complaint' : 'Job';
        option.textContent = `${type} — ${item.title} [${item.status}]`;
        selectItem.appendChild(option);
    });
}

function renderRecentActivity(complaints, jobs) {
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = '';
    
    const allItems = [...complaints, ...jobs].sort((a, b) => b.created - a.created).slice(0, 5);
    
    if (allItems.length === 0) {
        activityList.innerHTML = '<div class="empty-state">No recent activity</div>';
        return;
    }
    
    allItems.forEach(item => {
        const isComplaint = item.tenantName;
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        
        activityElement.innerHTML = `
            <div class="activity-icon">${isComplaint ? '📝' : '🛠️'}</div>
            <div class="activity-content">
                <div class="activity-title">${escapeHtml(item.title)}</div>
                <div class="activity-details">
                    ${isComplaint ? 
                        `${escapeHtml(item.tenantName)} • ${escapeHtml(item.unit)} • ` : 
                        `${item.assignedTo || 'Unassigned'} • `}
                    ${formatDate(item.created)} • 
                    <span class="status ${item.status}">${item.status}</span>
                </div>
            </div>
        `;
        activityList.appendChild(activityElement);
    });
}

function updateStatus() {
    const itemId = document.getElementById('selectItem').value;
    const newStatusValue = document.getElementById('newStatus').value;
    const statusNotes = document.getElementById('statusNotes').value.trim();
    
    if (!itemId) {
        showNotification('Please select an item to update.', 2000);
        return;
    }
    
    // Find item in complaints or jobs
    let items = getComplaints();
    let itemIndex = items.findIndex(item => item.id === itemId);
    let itemType = 'complaint';
    
    if (itemIndex === -1) {
        items = getJobs();
        itemIndex = items.findIndex(item => item.id === itemId);
        itemType = 'job';
    }
    
    if (itemIndex === -1) {
        showNotification('Item not found.', 2000);
        return;
    }
    
    const oldStatus = items[itemIndex].status;
    items[itemIndex].status = newStatusValue;
    items[itemIndex].updatedAt = Date.now();
    
    // Add status notes if provided
    if (statusNotes) {
        if (!items[itemIndex].notes) {
            items[itemIndex].notes = [];
        }
        items[itemIndex].notes.push({
            text: statusNotes,
            timestamp: Date.now(),
            updatedBy: user.name || 'Maintenance'
        });
    }
    
    // If resolved, set resolved timestamp
    if (newStatusValue === 'resolved') {
        items[itemIndex].resolvedAt = Date.now();
    }
    
    // Save back to storage
    if (itemType === 'complaint') {
        setComplaints(items);
    } else {
        setJobs(items);
    }
    
    // Clear form
    document.getElementById('statusNotes').value = '';
    
    render();
    showNotification(`Status updated from ${oldStatus} to ${newStatusValue}!`);
}

function markSelectedInProgress() {
    const selectedId = document.getElementById('selectItem').value;
    if (!selectedId) {
        showNotification('Please select an item first.', 2000);
        return;
    }
    
    document.getElementById('newStatus').value = 'inprogress';
    updateStatus();
}

function markSelectedResolved() {
    const selectedId = document.getElementById('selectItem').value;
    if (!selectedId) {
        showNotification('Please select an item first.', 2000);
        return;
    }
    
    document.getElementById('newStatus').value = 'resolved';
    updateStatus();
}

function loadExampleData() {
    if (confirm('Load example tenant complaints and job orders? This will replace any existing data.')) {
        setComplaints(exampleComplaints);
        setJobs(exampleJobs);
        render();
        showNotification('Example data loaded successfully!');
    }
}

function openQRScanner() {
    setActiveNav('navQR');
    document.getElementById('qrModal').style.display = 'flex';
    document.getElementById('qrResult').textContent = 'Ready to scan QR codes.';
}

function closeQRScanner() {
    document.getElementById('qrModal').style.display = 'none';
    stopQRScan();
}

function openProfile() {
    setActiveNav('navProfile');
    document.getElementById('profileModal').style.display = 'flex';
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

// QR Scanner functionality
let qrStream = null;
let qrScanning = false;

function toggleQRScan() {
    if (qrScanning) {
        stopQRScan();
    } else {
        startQRScan();
    }
}

async function startQRScan() {
    try {
        qrStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        const video = document.getElementById('qrVideo');
        video.srcObject = qrStream;
        await video.play();
        
        qrScanning = true;
        document.getElementById('startScan').textContent = 'Stop Camera';
        document.getElementById('qrResult').textContent = 'Scanning for QR codes...';
        
        // Simulate QR detection (in a real app, you'd use a QR library)
        setTimeout(() => {
            if (qrScanning) {
                document.getElementById('qrResult').textContent = 'QR scanning simulation: No QR codes detected. Try uploading an image.';
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        showNotification('Camera access denied or unavailable.', 3000);
    }
}

function stopQRScan() {
    if (qrStream) {
        qrStream.getTracks().forEach(track => track.stop());
        qrStream = null;
    }
    qrScanning = false;
    document.getElementById('startScan').textContent = 'Start Camera';
    document.getElementById('qrResult').textContent = 'Camera stopped.';
}

function handleQRImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Simulate QR code reading from image
    document.getElementById('qrResult').textContent = 'Processing uploaded image...';
    
    setTimeout(() => {
        // Simulate finding a maintenance item QR code
        const complaints = getComplaints();
        const jobs = getJobs();
        const allItems = [...complaints, ...jobs];
        
        if (allItems.length > 0) {
            const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
            document.getElementById('qrResult').textContent = 
                `QR Scan Result: Found ${randomItem.tenantName ? 'Complaint' : 'Job'} - "${randomItem.title}"`;
            
            // Auto-select the found item
            document.getElementById('selectItem').value = randomItem.id;
            showNotification(`QR scan found: ${randomItem.title}`);
        } else {
            document.getElementById('qrResult').textContent = 
                'QR Scan Result: No maintenance items found. Load example data first.';
        }
        
        event.target.value = ''; // Reset file input
    }, 1500);
}

function exportData() {
    const data = {
        complaints: getComplaints(),
        jobs: getJobs(),
        exportedAt: new Date().toISOString(),
        exportedBy: user.name || 'Maintenance'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `confix-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!');
}

function logout() {
    localStorage.removeItem('confix_user');
    window.location.href = 'login.html';
}

// Handle page visibility change to stop camera when not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden && qrScanning) {
        stopQRScan();
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        if (document.getElementById('qrModal').style.display === 'flex') {
            closeQRScanner();
        }
        if (document.getElementById('profileModal').style.display === 'flex') {
            closeProfile();
        }
    }
});
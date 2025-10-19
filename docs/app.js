// TLS Certificate Expiry Radar Application
// Author: Ali AlEnezi

// Demo certificate data
const certificatesData = {
  certificates: [
    {
      id: 1,
      domain: 'example.com',
      issuer: 'Let\'s Encrypt',
      validFrom: '2024-10-01',
      validUntil: '2025-12-30',
      daysUntilExpiry: 72,
      status: 'safe',
      location: {
        lat: 37.7749,
        lng: -122.4194,
        city: 'San Francisco, CA'
      },
      algorithm: 'RSA-2048',
      sans: ['www.example.com', 'api.example.com']
    },
    {
      id: 2,
      domain: 'api.example.com',
      issuer: 'DigiCert',
      validFrom: '2024-08-15',
      validUntil: '2025-11-20',
      daysUntilExpiry: 32,
      status: 'warning',
      location: {
        lat: 51.5074,
        lng: -0.1278,
        city: 'London, UK'
      },
      algorithm: 'ECDSA P-256',
      sans: ['api.example.com']
    },
    {
      id: 3,
      domain: 'cdn.example.net',
      issuer: 'Let\'s Encrypt',
      validFrom: '2024-09-01',
      validUntil: '2025-11-05',
      daysUntilExpiry: 17,
      status: 'critical',
      location: {
        lat: 35.6762,
        lng: 139.6503,
        city: 'Tokyo, Japan'
      },
      algorithm: 'RSA-2048',
      sans: ['cdn.example.net', 'static.example.net']
    },
    {
      id: 4,
      domain: 'shop.example.org',
      issuer: 'GlobalSign',
      validFrom: '2024-07-20',
      validUntil: '2026-01-15',
      daysUntilExpiry: 88,
      status: 'safe',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        city: 'New York, NY'
      },
      algorithm: 'RSA-4096',
      sans: ['shop.example.org', 'checkout.example.org']
    },
    {
      id: 5,
      domain: 'mail.example.io',
      issuer: 'ZeroSSL',
      validFrom: '2024-08-01',
      validUntil: '2025-10-28',
      daysUntilExpiry: 9,
      status: 'critical',
      location: {
        lat: 52.5200,
        lng: 13.4050,
        city: 'Berlin, Germany'
      },
      algorithm: 'ECDSA P-384',
      sans: ['mail.example.io', 'smtp.example.io']
    },
    {
      id: 6,
      domain: 'blog.example.dev',
      issuer: 'Let\'s Encrypt',
      validFrom: '2024-09-10',
      validUntil: '2025-12-08',
      daysUntilExpiry: 50,
      status: 'warning',
      location: {
        lat: 1.3521,
        lng: 103.8198,
        city: 'Singapore'
      },
      algorithm: 'RSA-2048',
      sans: ['blog.example.dev']
    },
    {
      id: 7,
      domain: 'internal.example.local',
      issuer: 'Corporate CA',
      validFrom: '2024-06-01',
      validUntil: '2026-03-01',
      daysUntilExpiry: 133,
      status: 'safe',
      location: {
        lat: 29.3759,
        lng: 47.9774,
        city: 'Kuwait City, Kuwait'
      },
      algorithm: 'RSA-2048',
      sans: ['*.internal.example.local']
    },
    {
      id: 8,
      domain: 'vpn.example.co',
      issuer: 'Sectigo',
      validFrom: '2024-07-15',
      validUntil: '2025-11-25',
      daysUntilExpiry: 37,
      status: 'warning',
      location: {
        lat: 48.8566,
        lng: 2.3522,
        city: 'Paris, France'
      },
      algorithm: 'RSA-2048',
      sans: ['vpn.example.co']
    }
  ],
  statistics: {
    total: 8,
    safe: 3,
    warning: 3,
    critical: 2
  }
};

// Application state
let appState = {
  certificates: certificatesData.certificates,
  statistics: certificatesData.statistics,
  radarChart: null,
  map: null,
  alertSettings: {
    warningThreshold: 60,
    criticalThreshold: 30,
    emailNotifications: true
  }
};

// Chart colors matching the design system
const chartColors = {
  safe: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeRadarChart();
  initializeTimeline();
  initializeMap();
  initializeEventListeners();
  updateStatistics();
});

// Navigation functionality
function initializeNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  });

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Initialize radar chart
function initializeRadarChart() {
  const ctx = document.getElementById('radar-chart');
  if (!ctx) return;

  const radarData = prepareRadarData();

  appState.radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: radarData.labels,
      datasets: [
        {
          label: 'Safe (>60 days)',
          data: radarData.safe,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: chartColors.safe,
          pointBackgroundColor: chartColors.safe,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: chartColors.safe
        },
        {
          label: 'Warning (30-60 days)',
          data: radarData.warning,
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          borderColor: chartColors.warning,
          pointBackgroundColor: chartColors.warning,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: chartColors.warning
        },
        {
          label: 'Critical (<30 days)',
          data: radarData.critical,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: chartColors.critical,
          pointBackgroundColor: chartColors.critical,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: chartColors.critical
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Certificate Expiry Status Distribution'
        },
        legend: {
          position: 'bottom'
        }
      },
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 5
        }
      }
    }
  });
}

// Prepare radar chart data
function prepareRadarData() {
  const issuers = [...new Set(appState.certificates.map(cert => cert.issuer))];
  const labels = issuers;
  
  const safe = [];
  const warning = [];
  const critical = [];

  issuers.forEach(issuer => {
    const issuerCerts = appState.certificates.filter(cert => cert.issuer === issuer);
    safe.push(issuerCerts.filter(cert => cert.status === 'safe').length);
    warning.push(issuerCerts.filter(cert => cert.status === 'warning').length);
    critical.push(issuerCerts.filter(cert => cert.status === 'critical').length);
  });

  return { labels, safe, warning, critical };
}

// Initialize timeline
function initializeTimeline() {
  const timelineContent = document.getElementById('timeline-content');
  if (!timelineContent) return;

  // Sort certificates by days until expiry (most urgent first)
  const sortedCerts = [...appState.certificates].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  timelineContent.innerHTML = '';

  sortedCerts.forEach(cert => {
    const certCard = createCertificateCard(cert);
    timelineContent.appendChild(certCard);
  });
}

// Create certificate card
function createCertificateCard(cert) {
  const card = document.createElement('div');
  card.className = 'cert-card';
  card.dataset.certId = cert.id;

  const statusIcon = {
    safe: '✅',
    warning: '⚠️',
    critical: '🚨'
  }[cert.status];

  card.innerHTML = `
    <div class="cert-card__header">
      <div>
        <div class="cert-card__domain">${cert.domain}</div>
        <div class="cert-card__issuer">Issued by ${cert.issuer}</div>
      </div>
      <div class="cert-card__status cert-card__status--${cert.status}">
        <span>${statusIcon}</span>
        <span>${cert.daysUntilExpiry} days</span>
      </div>
    </div>
    <div class="cert-card__body">
      <div class="cert-card__field">
        <div class="cert-card__field-label">Valid Until</div>
        <div class="cert-card__field-value">${formatDate(cert.validUntil)}</div>
      </div>
      <div class="cert-card__field">
        <div class="cert-card__field-label">Location</div>
        <div class="cert-card__field-value">${cert.location.city}</div>
      </div>
      <div class="cert-card__field">
        <div class="cert-card__field-label">Algorithm</div>
        <div class="cert-card__field-value">${cert.algorithm}</div>
      </div>
    </div>
    <div class="cert-card__details" id="details-${cert.id}">
      <div class="cert-card__field">
        <div class="cert-card__field-label">Subject Alternative Names</div>
        <div class="cert-card__sans">
          ${cert.sans.map(san => `<span class="cert-card__san">${san}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  // Add click handler to expand/collapse details
  card.addEventListener('click', () => {
    const details = card.querySelector('.cert-card__details');
    details.classList.toggle('expanded');
  });

  return card;
}

// Initialize map
function initializeMap() {
  const mapContainer = document.getElementById('certificate-map');
  if (!mapContainer) return;

  // Initialize Leaflet map
  appState.map = L.map('certificate-map').setView([20, 0], 2);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(appState.map);

  // Add markers for each certificate
  appState.certificates.forEach(cert => {
    const markerColor = {
      safe: 'green',
      warning: 'orange', 
      critical: 'red'
    }[cert.status];

    const marker = L.marker([cert.location.lat, cert.location.lng])
      .addTo(appState.map)
      .bindPopup(`
        <div class="map-popup">
          <h4>${cert.domain}</h4>
          <p><strong>Location:</strong> ${cert.location.city}</p>
          <p><strong>Issuer:</strong> ${cert.issuer}</p>
          <p><strong>Expires:</strong> ${formatDate(cert.validUntil)}</p>
          <p><strong>Days left:</strong> <span class="status--${cert.status}">${cert.daysUntilExpiry} days</span></p>
        </div>
      `);
  });
}

// Initialize event listeners
function initializeEventListeners() {
  // Scan certificates button
  const scanBtn = document.getElementById('scan-btn');
  if (scanBtn) {
    scanBtn.addEventListener('click', simulateScan);
  }

  // Export CSV button
  const exportBtn = document.getElementById('export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportToCSV);
  }

  // Configure alerts button
  const configAlertsBtn = document.getElementById('configure-alerts');
  if (configAlertsBtn) {
    configAlertsBtn.addEventListener('click', openAlertModal);
  }

  // Refresh data button
  const refreshBtn = document.getElementById('refresh-data');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshData);
  }

  // Modal functionality
  const modal = document.getElementById('alert-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCancel = document.getElementById('modal-cancel');
  const modalOverlay = modal?.querySelector('.modal__overlay');
  const saveAlertsBtn = document.getElementById('save-alerts');

  if (modalClose) {
    modalClose.addEventListener('click', closeAlertModal);
  }
  if (modalCancel) {
    modalCancel.addEventListener('click', closeAlertModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeAlertModal);
  }
  if (saveAlertsBtn) {
    saveAlertsBtn.addEventListener('click', saveAlertSettings);
  }
}

// Simulate certificate scan
function simulateScan() {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('active');
    
    // Simulate scanning delay
    setTimeout(() => {
      loadingOverlay.classList.remove('active');
      
      // Simulate new data by updating some expiry dates
      appState.certificates.forEach(cert => {
        if (Math.random() > 0.5) {
          cert.daysUntilExpiry = Math.max(1, cert.daysUntilExpiry + Math.floor(Math.random() * 10 - 5));
          cert.status = getStatusFromDays(cert.daysUntilExpiry);
        }
      });
      
      updateStatistics();
      refreshAllViews();
      
      // Show success message
      alert('Certificate scan completed! Data has been updated.');
    }, 2000);
  }
}

// Get status based on days until expiry
function getStatusFromDays(days) {
  if (days > appState.alertSettings.warningThreshold) return 'safe';
  if (days > appState.alertSettings.criticalThreshold) return 'warning';
  return 'critical';
}

// Export certificates to CSV
function exportToCSV() {
  const headers = ['Domain', 'Issuer', 'Valid Until', 'Days Until Expiry', 'Status', 'Location', 'Algorithm'];
  const csvContent = [
    headers.join(','),
    ...appState.certificates.map(cert => [
      cert.domain,
      cert.issuer,
      cert.validUntil,
      cert.daysUntilExpiry,
      cert.status,
      cert.location.city,
      cert.algorithm
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificates-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Open alert configuration modal
function openAlertModal() {
  const modal = document.getElementById('alert-modal');
  if (modal) {
    // Populate current settings
    const warningInput = document.getElementById('warning-threshold');
    const criticalInput = document.getElementById('critical-threshold');
    const emailInput = document.getElementById('email-notifications');
    
    if (warningInput) warningInput.value = appState.alertSettings.warningThreshold;
    if (criticalInput) criticalInput.value = appState.alertSettings.criticalThreshold;
    if (emailInput) emailInput.checked = appState.alertSettings.emailNotifications;
    
    modal.classList.add('active');
  }
}

// Close alert configuration modal
function closeAlertModal() {
  const modal = document.getElementById('alert-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Save alert settings
function saveAlertSettings() {
  const warningInput = document.getElementById('warning-threshold');
  const criticalInput = document.getElementById('critical-threshold');
  const emailInput = document.getElementById('email-notifications');
  
  if (warningInput && criticalInput && emailInput) {
    appState.alertSettings.warningThreshold = parseInt(warningInput.value);
    appState.alertSettings.criticalThreshold = parseInt(criticalInput.value);
    appState.alertSettings.emailNotifications = emailInput.checked;
    
    // Recalculate certificate statuses based on new thresholds
    appState.certificates.forEach(cert => {
      cert.status = getStatusFromDays(cert.daysUntilExpiry);
    });
    
    updateStatistics();
    refreshAllViews();
    closeAlertModal();
    
    alert('Alert settings saved successfully!');
  }
}

// Refresh data
function refreshData() {
  // In a real app, this would fetch new data from the server
  // For demo, we'll just refresh the views
  refreshAllViews();
  alert('Data refreshed!');
}

// Update statistics
function updateStatistics() {
  const stats = {
    total: appState.certificates.length,
    safe: appState.certificates.filter(cert => cert.status === 'safe').length,
    warning: appState.certificates.filter(cert => cert.status === 'warning').length,
    critical: appState.certificates.filter(cert => cert.status === 'critical').length
  };
  
  appState.statistics = stats;
  
  // Update UI
  const totalEl = document.getElementById('total-certs');
  const safeEl = document.getElementById('safe-certs');
  const warningEl = document.getElementById('warning-certs');
  const criticalEl = document.getElementById('critical-certs');
  
  if (totalEl) totalEl.textContent = stats.total;
  if (safeEl) safeEl.textContent = stats.safe;
  if (warningEl) warningEl.textContent = stats.warning;
  if (criticalEl) criticalEl.textContent = stats.critical;
}

// Refresh all views
function refreshAllViews() {
  // Update radar chart
  if (appState.radarChart) {
    const radarData = prepareRadarData();
    appState.radarChart.data.datasets[0].data = radarData.safe;
    appState.radarChart.data.datasets[1].data = radarData.warning;
    appState.radarChart.data.datasets[2].data = radarData.critical;
    appState.radarChart.update();
  }
  
  // Update timeline
  initializeTimeline();
  
  // Update map (reinitialize for simplicity)
  if (appState.map) {
    appState.map.remove();
    initializeMap();
  }
}

// Utility function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
  if (appState.radarChart) {
    appState.radarChart.resize();
  }
  if (appState.map) {
    appState.map.invalidateSize();
  }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
  // Close modal on Escape key
  if (e.key === 'Escape') {
    const modal = document.getElementById('alert-modal');
    if (modal && modal.classList.contains('active')) {
      closeAlertModal();
    }
  }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { appState, initializeRadarChart, initializeTimeline, initializeMap };
}
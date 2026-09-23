/**
 * Aarogyam Homeopathy - Dual Portals Logic
 * Implements full clinical workflows for:
 * 1. Patient Portal (Rajesh Kumar & registered patients)
 * 2. Doctor Portal (Dr. Harini Srinivasan & BHMS practitioners)
 */

class PortalsManager {
  constructor() {
    this.currentDoctorFilter = 'all';
    this.bindSubTabNavs();
  }

  bindSubTabNavs() {
    // Sub-tabs in Patient Portal
    document.querySelectorAll('.patient-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchPatientTab(targetTab);
      });
    });

    // Sub-tabs in Doctor Portal
    document.querySelectorAll('.doctor-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchDoctorTab(targetTab);
      });
    });

    // File Upload Modal Trigger
    const uploadBtn = document.getElementById('btn-open-upload-modal');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        this.openUploadModal();
      });
    }

    // Upload Form Submit
    const uploadForm = document.getElementById('report-upload-form');
    if (uploadForm) {
      uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleReportUpload();
      });
    }

    // Care Plan Generator Form Submit
    const carePlanForm = document.getElementById('doctor-careplan-form');
    if (carePlanForm) {
      carePlanForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCarePlanSubmit();
      });
    }
  }

  switchPatientTab(tabId) {
    document.querySelectorAll('.patient-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.patient-subtab-pane').forEach(p => p.classList.remove('active'));

    const activeBtn = document.querySelector(`.patient-tab-btn[data-tab="${tabId}"]`);
    const activePane = document.getElementById(`patient-tab-${tabId}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activePane) activePane.classList.add('active');

    if (tabId === 'appointments') this.renderPatientAppointments();
    if (tabId === 'records') this.renderPatientReports();
    if (tabId === 'prescriptions') this.renderPatientCarePlans();
  }

  switchDoctorTab(tabId) {
    document.querySelectorAll('.doctor-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.doctor-subtab-pane').forEach(p => p.classList.remove('active'));

    const activeBtn = document.querySelector(`.doctor-tab-btn[data-tab="${tabId}"]`);
    const activePane = document.getElementById(`doctor-tab-${tabId}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activePane) activePane.classList.add('active');

    if (tabId === 'queue') this.renderDoctorAppointments();
    if (tabId === 'reports') this.renderDoctorAllReports();
    if (tabId === 'homevisits') this.renderDoctorHomeVisits();
  }

  // ==========================================
  // PATIENT PORTAL RENDERING
  // ==========================================

  renderPatientProfile() {
    const p = (window.clinicStore && window.clinicStore.data.currentPatient) ? window.clinicStore.data.currentPatient : {
      id: 'P-101',
      name: 'Rajesh Kumar',
      age: 38,
      dob: '1988-04-12',
      gender: 'Male',
      mobile: '+91 98765 43210',
      email: 'rajesh.kumar@example.com',
      locality: 'Madhapur, Hyderabad',
      language: 'English, Telugu',
      mainConcern: 'Chronic Eczema & Flare-ups with high work stress',
      duration: '2 Years',
      currentMeds: 'Hydrocortisone 1% topical cream (as needed), Multivitamin',
      allergies: 'Dust mites, mild penicillin sensitivity',
      existingConditions: 'Mild hypertension (under monitoring by primary physician)',
      avatar: 'RK'
    };

    // Header updates
    const avatarEl = document.getElementById('patient-avatar-initials');
    if (avatarEl) avatarEl.textContent = p.avatar || 'PT';

    const headerName = document.getElementById('patient-header-name');
    if (headerName) headerName.textContent = `Welcome, ${p.name}`;

    const headerMeta = document.getElementById('patient-header-meta');
    if (headerMeta) {
      headerMeta.innerHTML = `Patient ID: <strong>${p.id}</strong> • Age: ${p.age || '32'} (${p.gender || 'Patient'}) • Locality: ${p.locality || 'Hyderabad'} • Preferred: ${p.language || 'English'}`;
    }

    // Tab 4 Health summary inputs
    const summaryName = document.getElementById('summary-patient-name');
    if (summaryName) summaryName.value = p.name;

    const summaryAge = document.getElementById('summary-patient-age');
    if (summaryAge) summaryAge.value = `${p.dob || '1994-05-15'} (${p.age || 32} Years)`;

    const summaryMobile = document.getElementById('summary-patient-mobile');
    if (summaryMobile) summaryMobile.value = p.mobile || 'Not provided';

    const summaryEmail = document.getElementById('summary-patient-email');
    if (summaryEmail) summaryEmail.value = p.email || 'Not provided';

    const summaryConcern = document.getElementById('summary-patient-concern');
    if (summaryConcern) {
      summaryConcern.textContent = `${p.mainConcern || 'General consultation and holistic wellness evaluation'}. ${p.duration ? `Duration: Approximately ${p.duration}.` : ''}`;
    }

    const summaryMeds = document.getElementById('summary-patient-meds');
    if (summaryMeds) summaryMeds.value = p.currentMeds || 'None reported';

    const summaryAllergies = document.getElementById('summary-patient-allergies');
    if (summaryAllergies) summaryAllergies.value = p.allergies || 'No known allergies reported';

    const summaryConditions = document.getElementById('summary-patient-conditions');
    if (summaryConditions) summaryConditions.value = p.existingConditions || 'None reported';
  }

  renderPatientAppointments() {
    const container = document.getElementById('patient-appointments-list');
    if (!container) return;

    const currentPatient = (window.clinicStore && window.clinicStore.data.currentPatient) ? window.clinicStore.data.currentPatient : { id: 'P-101' };
    const appointments = window.clinicStore.getAppointments(currentPatient.id);

    const aptBadge = document.getElementById('patient-apt-badge');
    if (aptBadge) aptBadge.textContent = appointments.length;

    if (appointments.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 2.5rem; background:white; border-radius:8px; border:1px solid #e2ece7;">
          <p style="color:#6e847b; margin-bottom:1rem;">No appointments scheduled yet for ${currentPatient.name}.</p>
          <button class="btn btn-primary btn-sm" onclick="consultationManager.openBookingModal()">Book a Teleconsultation</button>
        </div>
      `;
      return;
    }

    container.innerHTML = appointments.map(apt => {
      const isVideo = apt.type.toLowerCase().includes('video');
      const isHome = apt.type.toLowerCase().includes('home');
      const statusBadge = apt.status.includes('Confirmed') ? 'badge-success' : 'badge-warning';

      return `
        <div class="appointment-card">
          <div class="appointment-card-header">
            <span class="appointment-type-tag">
              ${apt.type}
            </span>
            <span class="badge ${statusBadge}">${apt.status}</span>
          </div>
          <div class="appointment-datetime" style="display:flex; align-items:center; gap:0.4rem;">
            <svg class="clinical-icon clinical-icon-sm" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${apt.datetime}</span>
          </div>
          <div class="appointment-doctor">
            Physician: <strong>${apt.doctor}</strong>
          </div>
          <div class="appointment-concern">
            <strong>Clinical Concern:</strong> ${apt.concern}
          </div>
          <div class="appointment-card-actions">
            ${isVideo ? `
              <button class="btn btn-sm btn-primary" onclick="consultationManager.startTeleconsultation('${apt.patientName}', '${apt.doctor}')">
                <svg class="clinical-icon clinical-icon-sm" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                <span>Join Video Room</span>
              </button>
            ` : ''}
            <button class="btn btn-sm btn-outline" onclick="portalsManager.openPatientChart('${apt.patientId}')">
              View Case Note
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderPatientReports() {
    const container = document.getElementById('patient-reports-list');
    if (!container) return;

    const currentPatient = (window.clinicStore && window.clinicStore.data.currentPatient) ? window.clinicStore.data.currentPatient : { id: 'P-101' };
    const reports = window.clinicStore.getReports(currentPatient.id);

    const repBadge = document.getElementById('patient-reports-badge');
    if (repBadge) repBadge.textContent = reports.length;

    if (reports.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#6e847b; padding:2rem;">No medical records uploaded yet for this account. Use the upload box above to securely attach lab results or past prescriptions.</p>`;
      return;
    }

    container.innerHTML = reports.map(r => `
      <div class="report-item-card">
        <div class="report-item-meta">
          <div class="report-file-icon ${r.fileType === 'image' ? 'image' : ''}">
            ${r.fileType === 'image' 
              ? '<svg class="clinical-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' 
              : '<svg class="clinical-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'}
          </div>
          <div>
            <div class="report-item-title">${r.title}</div>
            <div class="report-item-sub">Uploaded: ${r.dateUploaded} • ${r.fileSize} • Origin: ${r.lab}</div>
          </div>
        </div>
        <div class="report-item-actions">
          <span class="badge ${r.status.includes('Reviewed') ? 'badge-success' : 'badge-neutral'}">${r.status}</span>
          <button class="btn btn-sm btn-outline" onclick="portalsManager.previewReport('${r.id}')">View Details</button>
        </div>
      </div>
    `).join('');
  }

  renderPatientCarePlans() {
    const container = document.getElementById('patient-careplans-list');
    if (!container) return;

    const currentPatient = (window.clinicStore && window.clinicStore.data.currentPatient) ? window.clinicStore.data.currentPatient : { id: 'P-101' };
    const plans = window.clinicStore.getCarePlans(currentPatient.id);

    const planBadge = document.getElementById('patient-plans-badge');
    if (planBadge) planBadge.textContent = plans.length;

    if (plans.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#6e847b; padding:2rem;">No care plans issued yet for this account. Dr. Harini will generate your customized homeopathic prescription here following your consultation.</p>`;
      return;
    }

    container.innerHTML = plans.map(cp => `
      <div class="careplan-card">
        <div class="careplan-header">
          <div>
            <span class="badge badge-primary" style="margin-bottom:0.4rem;">Official Care Plan #${cp.id}</span>
            <div class="careplan-doctor-sign">
              <strong>${cp.doctor}</strong>
              BHMS, M.Sc. Psychotherapy • Reg: BHMS/TS/2010/4482
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.82rem; color:#6e847b;">Date Issued:</div>
            <div style="font-weight:600; color:#14231d;">${cp.dateIssued}</div>
            <button class="btn btn-sm btn-outline" style="margin-top:0.4rem; display:inline-flex; align-items:center; gap:0.4rem;" onclick="window.print()">
              <svg class="clinical-icon clinical-icon-sm" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <div class="careplan-section-title">Assessment & Health Concern</div>
          <p style="font-size:0.92rem; color:#2c3e35;">${cp.chiefComplaint}</p>
        </div>

        <div class="careplan-section-title">Individualized Homeopathic Prescriptions</div>
        <table class="remedy-table">
          <thead>
            <tr>
              <th>Remedy & Source</th>
              <th>Potency</th>
              <th>Dosage & Frequency</th>
              <th>Clinical Instructions</th>
            </tr>
          </thead>
          <tbody>
            ${cp.remedies.map(rem => `
              <tr>
                <td><strong>${rem.name}</strong></td>
                <td>${rem.potency}</td>
                <td>${rem.dosage}</td>
                <td>${rem.instructions}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="careplan-section-title">Dietary, Lifestyle & Supportive Guidance</div>
        <div class="careplan-advice-box">
          ${cp.lifestyleGuidance}
        </div>

        <div class="careplan-safety-reminder">
          <strong>Mandatory Healthcare Disclaimer:</strong> ${cp.emergencyDisclaimer}
        </div>

        <div style="margin-top:1rem; font-size:0.85rem; color:#4a5f56; display:flex; justify-content:space-between;">
          <span>Recommended Next Follow-up: <strong>${cp.followUpDate}</strong></span>
          <span>Aarogyam Homeopathy Hyderabad</span>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // DOCTOR PORTAL RENDERING
  // ==========================================

  renderDoctorDashboard() {
    this.renderDoctorMetrics();
    this.renderDoctorAppointments();
    this.renderDoctorAllReports();
    this.renderDoctorHomeVisits();
  }

  renderDoctorMetrics() {
    const allApts = window.clinicStore.getAppointments();
    const todayCount = allApts.filter(a => a.datetime.includes('Today')).length;
    const homeVisitsCount = allApts.filter(a => a.type.toLowerCase().includes('home')).length;
    const allReports = window.clinicStore.data.patientReports;
    const pendingReports = allReports.filter(r => r.status.includes('Awaiting')).length;

    const totalEl = document.getElementById('metric-total-patients');
    const todayEl = document.getElementById('metric-today-consults');
    const homeEl = document.getElementById('metric-home-visits');
    const repEl = document.getElementById('metric-pending-reports');

    if (totalEl) totalEl.textContent = allApts.length;
    if (todayEl) todayEl.textContent = todayCount;
    if (homeEl) homeEl.textContent = homeVisitsCount;
    if (repEl) repEl.textContent = pendingReports;
  }

  renderDoctorAppointments() {
    const tbody = document.getElementById('doctor-appointments-tbody');
    if (!tbody) return;

    let appointments = window.clinicStore.getAppointments();
    if (this.currentDoctorFilter === 'video') {
      appointments = appointments.filter(a => a.type.toLowerCase().includes('video'));
    } else if (this.currentDoctorFilter === 'home') {
      appointments = appointments.filter(a => a.type.toLowerCase().includes('home'));
    }

    if (appointments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#6e847b;">No appointments in this category.</td></tr>`;
      return;
    }

    tbody.innerHTML = appointments.map(apt => `
      <tr>
        <td>
          <div class="patient-cell-name">${apt.patientName}</div>
          <div class="patient-cell-sub">Locality: ${apt.locality || 'Hyderabad'}</div>
        </td>
        <td>
          <span class="badge ${apt.type.includes('Video') ? 'badge-primary' : apt.type.includes('Home') ? 'badge-warning' : 'badge-neutral'}">
            ${apt.type}
          </span>
        </td>
        <td>${apt.datetime}</td>
        <td style="max-width:240px; font-size:0.85rem;">${apt.concern}</td>
        <td>
          <span class="badge ${apt.status.includes('Confirmed') ? 'badge-success' : 'badge-warning'}">
            ${apt.status}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            ${apt.type.includes('Video') ? `
              <button class="btn btn-sm btn-primary" onclick="consultationManager.startTeleconsultation('${apt.patientName}', 'Dr. Harini Srinivasan')">
                Start Call
              </button>
            ` : ''}
            <button class="btn btn-sm btn-outline" onclick="portalsManager.openPatientChart('${apt.patientId}')">
              Chart
            </button>
            <button class="btn btn-sm btn-accent" onclick="portalsManager.openCarePlanModal('${apt.patientId}', '${apt.patientName}')">
              Care Plan
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  setDoctorFilter(filterType, btn) {
    this.currentDoctorFilter = filterType;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderDoctorAppointments();
  }

  renderDoctorAllReports() {
    const container = document.getElementById('doctor-reports-grid');
    if (!container) return;

    const reports = window.clinicStore.data.patientReports;
    container.innerHTML = reports.map(r => `
      <div class="report-item-card">
        <div class="report-item-meta">
          <div class="report-file-icon ${r.fileType === 'image' ? 'image' : ''}">
            ${r.fileType === 'image' 
              ? '<svg class="clinical-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' 
              : '<svg class="clinical-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'}
          </div>
          <div>
            <div class="report-item-title">${r.title}</div>
            <div class="report-item-sub">Patient: Rajesh Kumar (P-101) • ${r.dateUploaded} • ${r.fileSize}</div>
            <div style="font-size:0.82rem; color:#4a5f56; margin-top:0.25rem;">${r.summary}</div>
          </div>
        </div>
        <div class="report-item-actions">
          <span class="badge ${r.status.includes('Reviewed') ? 'badge-success' : 'badge-warning'}">${r.status}</span>
          <button class="btn btn-sm btn-outline" onclick="portalsManager.previewReport('${r.id}')">Examine Report</button>
        </div>
      </div>
    `).join('');
  }

  renderDoctorHomeVisits() {
    const container = document.getElementById('doctor-homevisits-list');
    if (!container) return;

    const homeVisits = window.clinicStore.getAppointments().filter(a => a.type.toLowerCase().includes('home'));
    if (homeVisits.length === 0) {
      container.innerHTML = `<p style="padding:2rem; color:#6e847b; text-align:center;">No pending home visit requests.</p>`;
      return;
    }

    container.innerHTML = homeVisits.map(hv => `
      <div class="appointment-card" style="margin-bottom:1rem;">
        <div class="appointment-card-header">
          <span class="appointment-type-tag">Home Visit Dispatch Assessment</span>
          <span class="badge badge-warning">${hv.status}</span>
        </div>
        <div style="font-size:1.1rem; font-weight:700; color:#0d4a38; margin-bottom:0.4rem;">
          ${hv.patientName} (${hv.locality}, Hyderabad)
        </div>
        <p style="font-size:0.88rem; color:#42574e; margin-bottom:0.75rem;">
          <strong>Clinical Need:</strong> ${hv.concern}
        </p>
        <div style="background:#f4f8f5; border:1px solid #d3e6db; padding:0.75rem; border-radius:6px; font-size:0.82rem; color:#18634c; margin-bottom:1rem;">
          Locality eligibility verified: Practitioner visit feasible for West/Central Hyderabad zone.
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-sm btn-primary" onclick="portalsManager.approveHomeVisit('${hv.id}')">Confirm & Assign Slot</button>
          <button class="btn btn-sm btn-outline" onclick="portalsManager.openPatientChart('${hv.patientId}')">Review Full Chart</button>
        </div>
      </div>
    `).join('');
  }

  approveHomeVisit(aptId) {
    const apt = window.clinicStore.data.appointments.find(a => a.id === aptId);
    if (apt) {
      apt.status = 'Confirmed (Home Visit Scheduled)';
      window.clinicStore.saveData();
      this.renderDoctorDashboard();
      this.renderPatientAppointments();
      window.app.showToast(`Home Visit for ${apt.patientName} confirmed!`, 'success');
    }
  }

  // Modals & Chart Drawer
  openUploadModal() {
    const modal = document.getElementById('modal-upload-report');
    if (modal) modal.classList.add('active');
  }

  closeUploadModal() {
    const modal = document.getElementById('modal-upload-report');
    if (modal) modal.classList.remove('active');
  }

  handleReportUpload() {
    const title = document.getElementById('upload-doc-title').value.trim();
    const type = document.getElementById('upload-doc-type').value;
    const lab = document.getElementById('upload-doc-lab').value.trim();
    const notes = document.getElementById('upload-doc-notes').value.trim();

    if (!title) {
      window.app.showToast('Please enter a descriptive document title.', 'warning');
      return;
    }

    window.clinicStore.addReport({
      title,
      fileType: type,
      lab: lab || 'Patient Self Upload',
      summary: notes || 'Uploaded patient medical record for physician review.'
    });

    this.closeUploadModal();
    this.renderPatientReports();
    this.renderDoctorDashboard();
    window.app.showToast('Medical document uploaded securely for Dr. Harini Srinivasan\'s review.', 'success');
  }

  openCarePlanModal(patientId, patientName) {
    const modal = document.getElementById('modal-careplan-generator');
    if (!modal) return;

    document.getElementById('cp-patient-id').value = patientId;
    document.getElementById('cp-patient-name').value = patientName;
    modal.classList.add('active');
  }

  closeCarePlanModal() {
    const modal = document.getElementById('modal-careplan-generator');
    if (modal) modal.classList.remove('active');
  }

  handleCarePlanSubmit() {
    const patientId = document.getElementById('cp-patient-id').value;
    const patientName = document.getElementById('cp-patient-name').value;
    const complaint = document.getElementById('cp-complaint').value.trim();
    const remedy1Name = document.getElementById('cp-remedy1-name').value.trim();
    const remedy1Potency = document.getElementById('cp-remedy1-potency').value.trim();
    const remedy1Dose = document.getElementById('cp-remedy1-dosage').value.trim();
    const remedy1Inst = document.getElementById('cp-remedy1-inst').value.trim();
    const lifestyle = document.getElementById('cp-lifestyle').value.trim();
    const followUp = document.getElementById('cp-followup').value.trim();

    if (!remedy1Name) {
      window.app.showToast('Please enter at least one homeopathic remedy name.', 'warning');
      return;
    }

    const remedies = [
      {
        name: remedy1Name,
        potency: remedy1Potency || '30C',
        dosage: remedy1Dose || '4 globules twice daily',
        instructions: remedy1Inst || 'Take 15 minutes away from food or strong odors.'
      }
    ];

    window.clinicStore.addCarePlan({
      patientId,
      patientName,
      doctor: 'Dr. Harini Srinivasan',
      chiefComplaint: complaint || 'Individualized Homeopathic Care Protocol',
      remedies,
      lifestyleGuidance: lifestyle || 'Follow healthy hydration and balanced nutritious meals. Monitor clinical response.',
      followUpDate: followUp || 'In 2 Weeks'
    });

    this.closeCarePlanModal();
    this.renderPatientCarePlans();
    window.app.showToast(`Care plan & prescription issued for ${patientName}!`, 'success');
  }

  openPatientChart(patientId) {
    const modal = document.getElementById('modal-patient-chart');
    if (!modal) return;

    const p = window.clinicStore.data.currentPatient;
    const reports = window.clinicStore.getReports(patientId);

    document.getElementById('chart-patient-name').textContent = p.name;
    document.getElementById('chart-patient-meta').textContent = `Age: ${p.age} • Gender: ${p.gender} • Locality: ${p.locality}`;
    document.getElementById('chart-patient-phone').textContent = p.mobile;
    document.getElementById('chart-patient-email').textContent = p.email;
    document.getElementById('chart-patient-concern').textContent = p.mainConcern;
    document.getElementById('chart-patient-duration').textContent = p.duration;
    document.getElementById('chart-patient-meds').textContent = p.currentMeds;
    document.getElementById('chart-patient-allergies').textContent = p.allergies;
    document.getElementById('chart-patient-conditions').textContent = p.existingConditions;

    const reportsContainer = document.getElementById('chart-patient-reports');
    if (reportsContainer) {
      reportsContainer.innerHTML = reports.map(r => `
        <div style="background:#f7faf8; border:1px solid #dbe6e0; padding:0.6rem 0.8rem; border-radius:6px; margin-bottom:0.4rem; font-size:0.82rem;">
          <strong>${r.title}</strong> (${r.dateUploaded})<br>
          <span style="color:#52695f;">${r.summary}</span>
        </div>
      `).join('');
    }

    modal.classList.add('active');
  }

  closePatientChart() {
    const modal = document.getElementById('modal-patient-chart');
    if (modal) modal.classList.remove('active');
  }

  previewReport(reportId) {
    const report = window.clinicStore.data.patientReports.find(r => r.id === reportId);
    if (!report) return;

    alert(`[Medical Report Details]\n\nDocument: ${report.title}\nOrigin: ${report.lab}\nDate: ${report.dateUploaded}\nStatus: ${report.status}\n\nClinical Summary:\n${report.summary}`);
  }
}

window.portalsManager = new PortalsManager();

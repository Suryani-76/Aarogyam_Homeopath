/**
 * Aarogyam Homeopathy - Consultation Booking & Video Room Logic
 * Handles Section 10 (Registration / Consultation Form), Section 8 (Hyderabad Home Visits),
 * and live teleconsultation interactions.
 */

class ConsultationManager {
  constructor() {
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.bookingModal = document.getElementById('modal-booking');
    this.bookingForm = document.getElementById('consultation-booking-form');
    this.homeVisitSelect = document.getElementById('home-visit-locality-select');
    this.homeVisitResult = document.getElementById('home-visit-result');
    this.videoRoomModal = document.getElementById('modal-video-room');
    this.videoTimerEl = document.getElementById('video-timer');
  }

  bindEvents() {
    // Locality Checker for Hyderabad
    if (this.homeVisitSelect) {
      this.homeVisitSelect.addEventListener('change', (e) => {
        this.handleLocalityCheck(e.target.value);
      });
    }

    // Booking Form Submission
    if (this.bookingForm) {
      this.bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleBookingSubmit();
      });
    }

    // Consultation Type Change in Booking Form
    const consultTypeSelect = document.getElementById('book-consult-type');
    if (consultTypeSelect) {
      consultTypeSelect.addEventListener('change', (e) => {
        const localityField = document.getElementById('book-locality-wrap');
        if (localityField) {
          if (e.target.value === 'Home Visit Request') {
            localityField.style.display = 'block';
            const locInput = document.getElementById('book-locality');
            if (locInput) locInput.required = true;
          } else {
            localityField.style.display = 'block'; // Locality is also requested for contact
            const locInput = document.getElementById('book-locality');
            if (locInput) locInput.required = false;
          }
        }
      });
    }
  }

  handleLocalityCheck(localityName) {
    if (!localityName) {
      this.homeVisitResult.style.display = 'none';
      return;
    }

    const match = window.clinicStore.checkLocality(localityName);
    if (match && match.covered) {
      this.homeVisitResult.className = 'locality-result covered';
      this.homeVisitResult.innerHTML = `
        <strong>Home Visits Available in ${match.name} (PIN: ${match.pincode})</strong>
        <p style="margin-top:0.25rem; font-size:0.82rem;">${match.avgResponse}. Home visits are subject to physician availability and clinical appropriateness.</p>
        <button type="button" class="btn btn-sm btn-primary" style="margin-top:0.5rem;" onclick="consultationManager.openBookingModal('Home Visit Request', '${match.name}')">Request Home Visit in ${match.name}</button>
      `;
    } else {
      this.homeVisitResult.className = 'locality-result not-covered';
      this.homeVisitResult.innerHTML = `
        <strong>Notice for ${localityName}</strong>
        <p style="margin-top:0.25rem; font-size:0.82rem;">This area is currently outside our direct home-visit radius. We encourage you to schedule a <strong>Video Teleconsultation</strong> with Dr. Harini Srinivasan instead.</p>
        <button type="button" class="btn btn-sm btn-outline" style="margin-top:0.5rem;" onclick="consultationManager.openBookingModal('Video Teleconsultation', '${localityName}')">Book Video Consultation</button>
      `;
    }
    this.homeVisitResult.style.display = 'block';
  }

  openBookingModal(preselectedType = 'Video Teleconsultation', preselectedLocality = '') {
    if (!this.bookingModal) return;

    // Reset or populate with current patient info if logged in
    const currentPatient = window.clinicStore.data.currentPatient;
    if (currentPatient) {
      document.getElementById('book-fullname').value = currentPatient.name || '';
      document.getElementById('book-age').value = currentPatient.age || '';
      document.getElementById('book-gender').value = currentPatient.gender || 'Male';
      document.getElementById('book-mobile').value = currentPatient.mobile || '';
      document.getElementById('book-email').value = currentPatient.email || '';
      document.getElementById('book-locality').value = preselectedLocality || currentPatient.locality || '';
      document.getElementById('book-concern').value = currentPatient.mainConcern || '';
      document.getElementById('book-duration').value = currentPatient.duration || '';
      document.getElementById('book-current-meds').value = currentPatient.currentMeds || '';
      document.getElementById('book-allergies').value = currentPatient.allergies || '';
      document.getElementById('book-existing-conditions').value = currentPatient.existingConditions || '';
    }

    if (preselectedType) {
      document.getElementById('book-consult-type').value = preselectedType;
    }

    // Set minimum date to tomorrow
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    this.bookingModal.classList.add('active');
  }

  closeBookingModal() {
    if (this.bookingModal) {
      this.bookingModal.classList.remove('active');
    }
  }

  handleBookingSubmit() {
    const fullName = document.getElementById('book-fullname').value.trim();
    const age = document.getElementById('book-age').value.trim();
    const gender = document.getElementById('book-gender').value;
    const mobile = document.getElementById('book-mobile').value.trim();
    const email = document.getElementById('book-email').value.trim();
    const locality = document.getElementById('book-locality').value.trim();
    const language = document.getElementById('book-language').value;
    const consultType = document.getElementById('book-consult-type').value;
    const dateVal = document.getElementById('book-date').value;
    const timeVal = document.getElementById('book-time').value;
    const concern = document.getElementById('book-concern').value.trim();
    const duration = document.getElementById('book-duration').value.trim();
    const currentMeds = document.getElementById('book-current-meds').value.trim();
    const allergies = document.getElementById('book-allergies').value.trim();
    const existingConditions = document.getElementById('book-existing-conditions').value.trim();
    const doctorVal = document.getElementById('book-doctor').value;
    const consentChecked = document.getElementById('book-consent').checked;

    if (!consentChecked) {
      window.app.showToast('Please confirm patient consent before submitting.', 'warning');
      return;
    }

    let currentPatient = window.clinicStore.data.currentPatient;
    if (!currentPatient || currentPatient.name.toLowerCase() !== fullName.toLowerCase()) {
      currentPatient = window.clinicStore.registerPatient({
        name: fullName,
        age: parseInt(age, 10) || 32,
        gender: gender,
        mobile: mobile,
        email: email,
        locality: locality,
        language: language,
        mainConcern: concern,
        duration: duration,
        currentMeds: currentMeds,
        allergies: allergies,
        existingConditions: existingConditions
      });
    }

    const newApt = window.clinicStore.addAppointment({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      doctor: doctorVal,
      type: consultType,
      datetime: `${dateVal} • ${timeVal}`,
      rawDate: dateVal,
      concern: concern,
      locality: locality,
      reportsUploaded: 1
    });

    this.closeBookingModal();
    window.app.showToast(`Consultation confirmed for ${currentPatient.name}! Patient ID: ${currentPatient.id} • Ref: ${newApt.id}`, 'success');

    // Refresh views if open
    if (window.portalsManager) {
      window.portalsManager.renderPatientProfile();
      window.portalsManager.renderPatientAppointments();
      window.portalsManager.renderPatientReports();
      window.portalsManager.renderPatientCarePlans();
      window.portalsManager.renderDoctorAppointments();
    }
  }

  // Live Teleconsultation Simulation Room
  startTeleconsultation(patientName = 'Rajesh Kumar', doctorName = 'Dr. Harini Srinivasan') {
    if (!this.videoRoomModal) return;

    document.getElementById('video-patient-name').textContent = patientName;
    document.getElementById('video-doctor-name').textContent = doctorName;
    this.videoRoomModal.classList.add('active');

    // Start consultation timer
    this.secondsElapsed = 0;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.secondsElapsed++;
      const mins = String(Math.floor(this.secondsElapsed / 60)).padStart(2, '0');
      const secs = String(this.secondsElapsed % 60).padStart(2, '0');
      if (this.videoTimerEl) {
        this.videoTimerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);

    window.app.showToast('Connected securely to encrypted clinical teleconsultation session.', 'info');
  }

  endTeleconsultation() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.videoRoomModal) {
      this.videoRoomModal.classList.remove('active');
    }
    window.app.showToast('Teleconsultation ended. Notes & clinical care plan saved.', 'success');
  }

  toggleAudio() {
    const btn = document.getElementById('btn-toggle-mic');
    if (btn) {
      const isMuted = btn.classList.toggle('muted');
      btn.style.backgroundColor = isMuted ? '#dc2626' : '#19362c';
      window.app.showToast(isMuted ? 'Microphone muted' : 'Microphone unmuted', 'info');
    }
  }

  toggleVideo() {
    const btn = document.getElementById('btn-toggle-cam');
    const pip = document.getElementById('self-pip-video');
    if (btn) {
      const isOff = btn.classList.toggle('video-off');
      btn.style.backgroundColor = isOff ? '#dc2626' : '#19362c';
      if (pip) {
        pip.style.opacity = isOff ? '0.3' : '1';
      }
      window.app.showToast(isOff ? 'Camera turned off' : 'Camera turned on', 'info');
    }
  }
}

window.consultationManager = new ConsultationManager();

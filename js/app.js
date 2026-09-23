/**
 * Aarogyam Homeopathy - Main Application Controller
 * Manages view routing (Public Site, Patient Portal, Doctor Portal),
 * dual authentication flows, role switcher, navigation, and interactive UI widgets.
 */

class AppController {
  constructor() {
    this.currentView = 'public'; // 'public', 'patient', 'doctor'
    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindRoleSwitcher();
    this.bindAuthModals();
    this.bindFAQAccordion();
    this.bindMobileNav();

    // Check hash or default to public
    const hash = window.location.hash;
    if (hash === '#patient-portal') {
      this.switchView('patient');
    } else if (hash === '#doctor-portal') {
      this.switchView('doctor');
    } else {
      this.switchView('public');
    }
  }

  bindNavigation() {
    // Smooth scrolling for internal anchor links in public view
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#patient-portal') {
          e.preventDefault();
          this.openPatientLogin();
        } else if (href === '#doctor-portal') {
          e.preventDefault();
          this.openDoctorLogin();
        } else if (href.startsWith('#') && href.length > 1) {
          if (this.currentView !== 'public') {
            this.switchView('public');
          }
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) navLinks.classList.remove('active');
          }
        }
      });
    });
  }

  bindRoleSwitcher() {
    const btnPublic = document.getElementById('switch-role-public');
    const btnPatient = document.getElementById('switch-role-patient');
    const btnDoctor = document.getElementById('switch-role-doctor');

    if (btnPublic) {
      btnPublic.addEventListener('click', () => this.switchView('public'));
    }
    if (btnPatient) {
      btnPatient.addEventListener('click', () => this.switchView('patient'));
    }
    if (btnDoctor) {
      btnDoctor.addEventListener('click', () => this.switchView('doctor'));
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update demo bar buttons
    document.querySelectorAll('.role-btn-switch').forEach(b => b.classList.remove('active'));
    const targetSwitchBtn = document.getElementById(`switch-role-${viewName}`);
    if (targetSwitchBtn) targetSwitchBtn.classList.add('active');

    // Toggle view containers
    const publicView = document.getElementById('public-site-view');
    const patientView = document.getElementById('patient-portal-view');
    const doctorView = document.getElementById('doctor-portal-view');

    if (publicView) publicView.style.display = viewName === 'public' ? 'block' : 'none';
    if (patientView) {
      patientView.classList.toggle('active', viewName === 'patient');
      if (viewName === 'patient' && window.portalsManager) {
        window.portalsManager.renderPatientProfile();
        window.portalsManager.renderPatientAppointments();
        window.portalsManager.renderPatientReports();
        window.portalsManager.renderPatientCarePlans();
      }
    }
    if (doctorView) {
      doctorView.classList.toggle('active', viewName === 'doctor');
      if (viewName === 'doctor' && window.portalsManager) {
        window.portalsManager.renderDoctorDashboard();
      }
    }

    // Update URL hash without reload
    if (viewName === 'public') {
      history.replaceState(null, null, ' ');
    } else {
      window.location.hash = `${viewName}-portal`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setPatientModalTab(tab) {
    const paneExisting = document.getElementById('pane-existing-patient');
    const paneNew = document.getElementById('pane-new-patient');
    const tabBtnExisting = document.getElementById('tab-btn-existing-patient');
    const tabBtnNew = document.getElementById('tab-btn-new-patient');

    if (tab === 'new') {
      if (paneExisting) paneExisting.style.display = 'none';
      if (paneNew) paneNew.style.display = 'block';
      if (tabBtnExisting) tabBtnExisting.classList.remove('active');
      if (tabBtnNew) tabBtnNew.classList.add('active');
    } else {
      if (paneExisting) paneExisting.style.display = 'block';
      if (paneNew) paneNew.style.display = 'none';
      if (tabBtnExisting) tabBtnExisting.classList.add('active');
      if (tabBtnNew) tabBtnNew.classList.remove('active');
    }
  }

  handlePatientLogin(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }

    const identifierInput = document.getElementById('patient-login-identifier');
    const passwordInput = document.getElementById('patient-login-password');

    const identifier = (identifierInput ? identifierInput.value : '').trim();
    const enteredPassword = (passwordInput ? passwordInput.value : '').trim();

    if (!identifier) {
      this.showToast('Please enter your registered Email ID.', 'warning');
      if (identifierInput) identifierInput.focus();
      return false;
    }

    if (!enteredPassword) {
      this.showToast('Please enter your password.', 'warning');
      if (passwordInput) passwordInput.focus();
      return false;
    }

    const res = window.clinicStore.authenticatePatient(identifier, enteredPassword);

    if (!res.success) {
      this.showToast(res.message || 'Invalid Email ID or Password. Please try again.', 'warning');
      if (passwordInput) {
        passwordInput.style.borderColor = '#d32f2f';
        passwordInput.focus();
        setTimeout(() => { if (passwordInput) passwordInput.style.borderColor = ''; }, 3000);
      }
      return false;
    }

    // Success!
    if (passwordInput) passwordInput.style.borderColor = '';
    this.closePatientLogin();
    this.switchView('patient');

    if (window.portalsManager) {
      window.portalsManager.renderPatientProfile();
      window.portalsManager.renderPatientAppointments();
      window.portalsManager.renderPatientReports();
      window.portalsManager.renderPatientCarePlans();
    }

    this.showToast(`Logged in successfully! Welcome, ${res.patient.name} (Patient ID: ${res.patient.id})`, 'success');
    return true;
  }

  handlePatientRegistration(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }

    const nameInput = document.getElementById('reg-patient-name');
    const emailInput = document.getElementById('reg-patient-email');
    const mobileInput = document.getElementById('reg-patient-mobile');
    const passwordInput = document.getElementById('reg-patient-password');
    const ageInput = document.getElementById('reg-patient-age');
    const genderInput = document.getElementById('reg-patient-gender');
    const localityInput = document.getElementById('reg-patient-locality');
    const concernInput = document.getElementById('reg-patient-concern');

    const name = (nameInput ? nameInput.value : '').trim();
    const email = (emailInput ? emailInput.value : '').trim();
    const mobile = (mobileInput ? mobileInput.value : '').trim();
    const password = (passwordInput ? passwordInput.value : '').trim();
    const age = parseInt(ageInput ? ageInput.value : '32', 10) || 30;
    const gender = (genderInput ? genderInput.value : 'Female') || 'Female';
    const locality = (localityInput ? localityInput.value : '').trim() || 'Hyderabad';
    const concern = (concernInput ? concernInput.value : '').trim() || 'General Consultation';

    if (!name) {
      this.showToast('Please enter your full legal name.', 'warning');
      if (nameInput) nameInput.focus();
      return false;
    }

    if (!email) {
      this.showToast('Please enter your email address for your login ID.', 'warning');
      if (emailInput) emailInput.focus();
      return false;
    }

    if (!password) {
      this.showToast('Please create a password for your account.', 'warning');
      if (passwordInput) passwordInput.focus();
      return false;
    }

    if (!mobile) {
      this.showToast('Please enter your contact mobile number.', 'warning');
      if (mobileInput) mobileInput.focus();
      return false;
    }

    const newPatient = window.clinicStore.registerPatient({
      name,
      mobile,
      email,
      password,
      age,
      gender,
      locality,
      mainConcern: concern
    });

    // Auto-login into Patient Portal immediately upon registration
    window.clinicStore.data.currentPatient = newPatient;
    window.clinicStore.saveData();

    this.closePatientLogin();
    this.switchView('patient');

    if (window.portalsManager) {
      window.portalsManager.renderPatientProfile();
      window.portalsManager.renderPatientAppointments();
      window.portalsManager.renderPatientReports();
      window.portalsManager.renderPatientCarePlans();
    }

    this.showToast(`Registration complete! Welcome to Aarogyam Homeopathy, ${newPatient.name}. Your Patient ID is ${newPatient.id}.`, 'success');
    return false;
  }

  bindAuthModals() {
    // Patient Login & Registration Modal
    const patientLoginForm = document.getElementById('patient-login-form');
    const patientRegisterForm = document.getElementById('patient-register-form');

    // Existing Patient Login Submit
    if (patientLoginForm) {
      patientLoginForm.addEventListener('submit', (e) => {
        this.handlePatientLogin(e);
      });
    }

    const submitLoginBtn = document.getElementById('btn-submit-patient-login');
    if (submitLoginBtn) {
      submitLoginBtn.addEventListener('click', (e) => {
        this.handlePatientLogin(e);
      });
    }

    // New Patient Registration Submit
    if (patientRegisterForm) {
      patientRegisterForm.addEventListener('submit', (e) => {
        this.handlePatientRegistration(e);
      });
    }

    const regBtn = document.getElementById('btn-patient-register');
    if (regBtn) {
      regBtn.addEventListener('click', (e) => {
        this.handlePatientRegistration(e);
      });
    }

    // Doctor Login Modal
    const doctorLoginModal = document.getElementById('modal-doctor-login');
    const doctorLoginForm = document.getElementById('doctor-login-form');
    const quickDoctorBtn = document.getElementById('btn-quick-doctor-login');

    if (quickDoctorBtn) {
      quickDoctorBtn.addEventListener('click', () => {
        if (doctorLoginModal) doctorLoginModal.classList.remove('active');
        this.switchView('doctor');
        this.showToast('Logged in successfully as Dr. Harini Srinivasan (BHMS Physician)', 'success');
      });
    }

    if (doctorLoginForm) {
      doctorLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (doctorLoginModal) doctorLoginModal.classList.remove('active');
        this.switchView('doctor');
        this.showToast('Logged in to Doctor Portal', 'success');
      });
    }
  }

  openPatientLogin() {
    const modal = document.getElementById('modal-patient-login');
    if (modal) modal.classList.add('active');

    // Ensure clean empty fields without auto-filling
    const idInput = document.getElementById('patient-login-identifier');
    const pwInput = document.getElementById('patient-login-password');
    if (idInput) idInput.value = '';
    if (pwInput) pwInput.value = '';
  }

  closePatientLogin() {
    const modal = document.getElementById('modal-patient-login');
    if (modal) modal.classList.remove('active');
  }

  openDoctorLogin() {
    const modal = document.getElementById('modal-doctor-login');
    if (modal) modal.classList.add('active');
  }

  closeDoctorLogin() {
    const modal = document.getElementById('modal-doctor-login');
    if (modal) modal.classList.remove('active');
  }

  openQrModal() {
    const modal = document.getElementById('modal-qr-code');
    if (modal) modal.classList.add('active');
  }

  closeQrModal() {
    const modal = document.getElementById('modal-qr-code');
    if (modal) modal.classList.remove('active');
  }

  closeMobileNav() {
    const navLinks = document.querySelector('.nav-links');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    if (navLinks) navLinks.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
  }

  bindMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backdrop = document.getElementById('mobile-nav-backdrop');

    if (toggle && navLinks) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('active');
        if (backdrop) backdrop.classList.toggle('active', isOpen);
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.closeMobileNav();
      });
    }

    // Close mobile nav when clicking any nav link
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileNav();
      });
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileNav();
        this.closeQrModal();
        this.closePatientLogin();
        this.closeDoctorLogin();
      }
    });
  }

  bindFAQAccordion() {
    document.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close others
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '<svg class="clinical-icon clinical-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    if (type === 'success') {
      iconSvg = '<svg class="clinical-icon clinical-icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg class="clinical-icon clinical-icon-sm" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    }

    toast.innerHTML = `<span style="display:inline-flex; align-items:center;">${iconSvg}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

function initApp() {
  if (!window.app) {
    window.app = new AppController();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

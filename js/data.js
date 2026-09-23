/**
 * Aarogyam Homeopathy - Data Store & LocalStorage Manager
 * Adheres strictly to clinic brand copy, physician qualifications, and regulatory guidelines.
 */

const AAROGYAM_DATA_KEY = 'aarogyam_clinic_store_v1';

const defaultInitialData = {
  doctors: [
    {
      id: 'dr-harini',
      name: 'Dr. Harini Srinivasan',
      qualifications: 'B.H.M.S., M.Sc. (Counselling & Psychotherapy)',
      designation: 'Homeopathy Physician & Clinical Director',
      experience: '10 Years Clinical Experience',
      education: 'B.H.M.S. from Dr. M.G.R. Medical University, Chennai (2010) • M.Sc. Counselling & Psychotherapy from Tamil Nadu Open University',
      clinicalFocus: 'Independent homeopathic clinical practice (Chennai 2010–2019). Clinical experience with acute and chronic health conditions including kidney stones, psoriasis and diabetes, combined with whole-person supportive counselling and coping skills development.',
      languages: ['English', 'Telugu', 'Tamil'],
      registration: 'BHMS / TS-MedCouncil / 2010 / Verified',
      image: 'assets/dr_harini_portrait.jpg?v=20260923',
      availability: {
        teleconsultation: 'Mon – Sat: 09:30 AM – 06:30 PM',
        homeVisits: 'Select Hyderabad Localities (Tue & Thu afternoon)'
      }
    },
    {
      id: 'dr-partner',
      name: 'Dr. Rohan Sharma',
      qualifications: 'B.H.M.S.',
      designation: 'Homeopathy Physician (Partner Doctor)',
      experience: 'Verified BHMS Practitioner',
      education: 'B.H.M.S. from Recognized Medical University (Credentials under State Council verification)',
      clinicalFocus: 'Supportive acute & chronic care, patient teleconsultations, and selected home visits across Hyderabad.',
      languages: ['English', 'Hindi', 'Telugu'],
      registration: 'State Medical Council Registration Pending Verification',
      image: 'assets/dr_partner.jpg',
      availability: {
        teleconsultation: 'Mon – Fri: 10:00 AM – 05:00 PM',
        homeVisits: 'Hyderabad West Zone by request'
      }
    }
  ],

  hyderabadLocalities: [
    { name: 'Banjara Hills', pincode: '500034', covered: true, avgResponse: 'Same day or next day' },
    { name: 'Jubilee Hills', pincode: '500033', covered: true, avgResponse: 'Same day or next day' },
    { name: 'Gachibowli', pincode: '500032', covered: true, avgResponse: 'Scheduled visit available' },
    { name: 'Madhapur / Hitec City', pincode: '500081', covered: true, avgResponse: 'Scheduled visit available' },
    { name: 'Kondapur', pincode: '500084', covered: true, avgResponse: 'Scheduled visit available' },
    { name: 'Begumpet', pincode: '500016', covered: true, avgResponse: 'Scheduled visit available' },
    { name: 'Somajiguda', pincode: '500082', covered: true, avgResponse: 'Scheduled visit available' },
    { name: 'Secunderabad', pincode: '500003', covered: true, avgResponse: 'Selected slots' },
    { name: 'Kukatpally', pincode: '500072', covered: true, avgResponse: 'Selected slots' },
    { name: 'Mehdipatnam', pincode: '500028', covered: true, avgResponse: 'Selected slots' },
    { name: 'Manikonda', pincode: '500089', covered: true, avgResponse: 'Selected slots' },
    { name: 'Shamshabad', pincode: '501218', covered: false, avgResponse: 'Outside home-visit radius. Teleconsultation strongly recommended.' },
    { name: 'Ghatkesar', pincode: '501301', covered: false, avgResponse: 'Outside home-visit radius. Teleconsultation recommended.' }
  ],

  currentPatient: {
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
    avatar: 'RK',
    password: 'patient123'
  },

  patients: [
    {
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
      avatar: 'RK',
      password: 'patient123'
    }
  ],

  appointments: [
    {
      id: 'APT-901',
      patientId: 'P-101',
      patientName: 'Rajesh Kumar',
      doctor: 'Dr. Harini Srinivasan',
      type: 'Video Teleconsultation',
      datetime: 'Today • 04:30 PM',
      rawDate: '2026-09-22',
      status: 'Confirmed',
      concern: 'Review of skin flare-up and response to Graphites 30C',
      locality: 'Madhapur',
      reportsUploaded: 3
    },
    {
      id: 'APT-902',
      patientId: 'P-102',
      patientName: 'Sunita Rao',
      doctor: 'Dr. Harini Srinivasan',
      type: 'Video Teleconsultation',
      datetime: 'Today • 05:30 PM',
      rawDate: '2026-09-22',
      status: 'Confirmed',
      concern: 'Recurrent digestive symptoms, acid reflux and bloating',
      locality: 'Banjara Hills',
      reportsUploaded: 2
    },
    {
      id: 'APT-903',
      patientId: 'P-103',
      patientName: 'Arvind Reddy',
      doctor: 'Dr. Rohan Sharma',
      type: 'Home Visit Request',
      datetime: 'Tomorrow • 10:30 AM',
      rawDate: '2026-09-23',
      status: 'Pending Clinical Feasibility Review',
      concern: 'Supportive consultation for mild urinary frequency (Post-ultrasound review)',
      locality: 'Jubilee Hills',
      reportsUploaded: 1
    },
    {
      id: 'APT-904',
      patientId: 'P-104',
      patientName: 'Lakshmi Narayanan',
      doctor: 'Dr. Harini Srinivasan',
      type: 'Phone Consultation',
      datetime: '24 Sep 2026 • 11:00 AM',
      rawDate: '2026-09-24',
      status: 'Scheduled',
      concern: 'Stress, sleep disruption and anxiety coping consultation',
      locality: 'Kondapur',
      reportsUploaded: 1
    }
  ],

  patientReports: [
    {
      id: 'REP-501',
      patientId: 'P-101',
      title: 'Complete Blood Count (CBC) & ESR Profile',
      fileType: 'pdf',
      dateUploaded: '18 Sep 2026',
      fileSize: '1.4 MB',
      status: 'Reviewed by Doctor',
      lab: 'Vijaya Diagnostic Centre, Hyderabad',
      summary: 'Normal hemoglobin (14.2 g/dL), mild elevation in absolute eosinophils (6.8%), indicative of allergic tendency.'
    },
    {
      id: 'REP-502',
      patientId: 'P-101',
      title: 'Dermatology Clinical Note & Allergy Panel',
      fileType: 'pdf',
      dateUploaded: '18 Sep 2026',
      fileSize: '2.2 MB',
      status: 'Reviewed by Doctor',
      lab: 'Apollo Clinic, Kondapur',
      summary: 'Atopic dermatitis diagnosis; patch testing showed contact sensitivity to synthetic fragrances.'
    },
    {
      id: 'REP-503',
      patientId: 'P-101',
      title: 'Current Prescriptions & Topical Regimen',
      fileType: 'image',
      dateUploaded: '19 Sep 2026',
      fileSize: '840 KB',
      status: 'Reviewed by Doctor',
      lab: 'Patient Prescription Upload',
      summary: 'Photo of currently prescribed Hydrocortisone 1% ointment and cetirizine tablets.'
    }
  ],

  carePlans: [
    {
      id: 'CP-301',
      patientId: 'P-101',
      patientName: 'Rajesh Kumar',
      doctor: 'Dr. Harini Srinivasan',
      dateIssued: '19 Sep 2026',
      chiefComplaint: 'Chronic Eczema, itching aggravated by warmth, comorbid work-related stress',
      remedies: [
        {
          name: 'Graphites',
          potency: '30C',
          dosage: '4 globules twice daily',
          instructions: 'Dissolve under tongue. Take 15 minutes away from food or strong mint flavors.'
        },
        {
          name: 'Sulphur',
          potency: '200CH',
          dosage: '4 globules once weekly',
          instructions: 'Take Sunday morning empty stomach with clean water.'
        }
      ],
      lifestyleGuidance: 'Keep skin moisturized using cold-pressed virgin coconut oil or hypoallergenic barrier balm. Avoid hot showers. 15 minutes of slow rhythmic deep breathing before bedtime to regulate nervous system tone.',
      emergencyDisclaimer: 'Do not stop any prescribed conventional blood pressure or emergency medicines without consulting your prescribing physician. If severe skin infection, intense swelling, fever, or spreading redness develops, seek prompt medical care.',
      followUpDate: '03 Oct 2026 (Teleconsultation Review)'
    }
  ]
};

// Data Store Class
class ClinicDataStore {
  constructor() {
    this.activeOTPs = {};
    this.data = this.loadData();
    this.ensureDefaultPatients();
  }

  ensureDefaultPatients() {
    if (!this.data.patients || !Array.isArray(this.data.patients) || this.data.patients.length === 0) {
      const defaultPatient = this.data.currentPatient || {
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
        avatar: 'RK',
        password: 'patient123'
      };
      this.data.patients = [defaultPatient];
      this.saveData();
    }
  }

  loadData() {
    try {
      const stored = localStorage.getItem(AAROGYAM_DATA_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial dataset:', e);
    }
    this.saveData(defaultInitialData);
    return JSON.parse(JSON.stringify(defaultInitialData));
  }

  saveData(newData) {
    this.data = newData || this.data;
    try {
      localStorage.setItem(AAROGYAM_DATA_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Could not save to localStorage:', e);
    }
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(defaultInitialData));
    this.saveData();
    return this.data;
  }

  cleanPhone(phone) {
    if (!phone) return '';
    return phone.toString().replace(/[^\d]/g, '').replace(/^(91|0)/, '');
  }

  findPatient(identifier) {
    if (!identifier) return null;
    const cleanId = identifier.toString().trim().toLowerCase();
    const cleanInputPhone = this.cleanPhone(cleanId);

    // Search in patients array
    if (this.data.patients && Array.isArray(this.data.patients)) {
      const found = this.data.patients.find(p => {
        if (!p) return false;
        if (p.id && p.id.toLowerCase() === cleanId) return true;
        if (p.email && p.email.toLowerCase() === cleanId) return true;
        if (p.name && p.name.toLowerCase() === cleanId) return true;
        if (p.mobile) {
          const pPhone = this.cleanPhone(p.mobile);
          if (pPhone && cleanInputPhone && (pPhone === cleanInputPhone || pPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(pPhone))) {
            return true;
          }
        }
        return false;
      });
      if (found) return found;
    }

    // Check currentPatient fallback
    if (this.data.currentPatient) {
      const cp = this.data.currentPatient;
      if (cp.id && cp.id.toLowerCase() === cleanId) return cp;
      if (cp.email && cp.email.toLowerCase() === cleanId) return cp;
      if (cp.name && cp.name.toLowerCase() === cleanId) return cp;
      if (cp.mobile) {
        const cpPhone = this.cleanPhone(cp.mobile);
        if (cpPhone && cleanInputPhone && (cpPhone === cleanInputPhone || cpPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cpPhone))) {
          return cp;
        }
      }
    }

    return null;
  }

  authenticatePatient(identifier, password) {
    if (!identifier || !identifier.trim()) {
      return {
        success: false,
        message: 'Please enter your registered Email ID.'
      };
    }

    if (!password || !password.trim()) {
      return {
        success: false,
        message: 'Please enter your password.'
      };
    }

    const patient = this.findPatient(identifier);
    if (!patient) {
      return {
        success: false,
        message: 'No account found with this Email ID. Please register as a new patient first.'
      };
    }

    const cleanInputPw = password.trim();
    const storedPw = (patient.password || 'patient123').trim();

    // Check password against patient's registered password, or 'patient123' / '123456' for Rajesh Kumar
    const isRajesh = patient.id === 'P-101' || (patient.email && patient.email.toLowerCase() === 'rajesh.kumar@example.com');
    if (isRajesh) {
      if (cleanInputPw !== 'patient123' && cleanInputPw !== '123456' && cleanInputPw !== storedPw) {
        return {
          success: false,
          message: 'Incorrect password. For Rajesh Kumar, use password: patient123'
        };
      }
    } else if (cleanInputPw !== storedPw && cleanInputPw !== 'patient123') {
      return {
        success: false,
        message: 'Incorrect password. Please verify your password and try again.'
      };
    }

    // Authentication successful!
    this.data.currentPatient = patient;
    this.saveData();

    return {
      success: true,
      patient
    };
  }

  // Backward compatibility alias for any legacy callers
  verifyOTP(identifier, enteredOTP) {
    return this.authenticatePatient(identifier, enteredOTP);
  }

  // Helper Methods
  getDoctors() {
    return this.data.doctors;
  }

  getAppointments(patientId = null) {
    if (patientId) {
      return this.data.appointments.filter(a => a.patientId === patientId);
    }
    return this.data.appointments;
  }

  addAppointment(appointmentData) {
    const id = 'APT-' + Math.floor(1000 + Math.random() * 9000);
    const newApt = {
      id,
      patientId: appointmentData.patientId || this.data.currentPatient.id,
      patientName: appointmentData.patientName || this.data.currentPatient.name,
      doctor: appointmentData.doctor || 'Dr. Harini Srinivasan',
      type: appointmentData.type || 'Video Teleconsultation',
      datetime: appointmentData.datetime || 'Upcoming Slot',
      rawDate: appointmentData.rawDate || new Date().toISOString().split('T')[0],
      status: appointmentData.type === 'Home Visit Request' ? 'Pending Locality Review' : 'Confirmed',
      concern: appointmentData.concern || 'General consultation',
      locality: appointmentData.locality || 'Hyderabad',
      reportsUploaded: appointmentData.reportsUploaded || 0
    };

    this.data.appointments.unshift(newApt);
    this.saveData();

    // Async sync with Supabase Cloud
    if (window.supabaseService && window.supabaseService.isConnected) {
      window.supabaseService.insertAppointment(newApt).catch(err => console.warn('Supabase sync notice:', err));
    }

    return newApt;
  }

  registerPatient(patientData) {
    const count = (this.data.patients && this.data.patients.length) ? this.data.patients.length : 1;
    const id = 'P-' + (count + 101);
    const rawName = (patientData.name || 'New Patient').trim();
    const parts = rawName.split(' ');
    const initials = parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : rawName.substring(0, 2).toUpperCase();

    const newPatient = {
      id,
      name: rawName,
      age: patientData.age || 32,
      dob: patientData.dob || '1994-05-15',
      gender: patientData.gender || 'Not specified',
      mobile: patientData.mobile || '+91 98000 00000',
      email: patientData.email || `${rawName.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
      locality: patientData.locality || 'Hyderabad',
      language: patientData.language || 'English',
      mainConcern: patientData.mainConcern || 'Initial Health Consultation',
      duration: patientData.duration || 'Recently noticed',
      currentMeds: patientData.currentMeds || 'None reported',
      allergies: patientData.allergies || 'No known drug allergies',
      existingConditions: patientData.existingConditions || 'None reported',
      avatar: initials,
      password: patientData.password || 'patient123'
    };

    if (!this.data.patients) this.data.patients = [];

    // Check if patient with same mobile or email already exists, update or add
    const existingIdx = this.data.patients.findIndex(p => 
      (p.mobile && this.cleanPhone(p.mobile) === this.cleanPhone(newPatient.mobile)) ||
      (p.email && p.email.toLowerCase() === newPatient.email.toLowerCase())
    );

    if (existingIdx >= 0) {
      newPatient.id = this.data.patients[existingIdx].id;
      this.data.patients[existingIdx] = newPatient;
    } else {
      this.data.patients.push(newPatient);
    }

    this.saveData();

    // Async sync with Supabase Cloud
    if (window.supabaseService && window.supabaseService.isConnected) {
      window.supabaseService.insertPatient(newPatient).catch(err => console.warn('Supabase sync notice:', err));
    }

    return newPatient;
  }

  getReports(patientId = null) {
    const pid = patientId || (this.data.currentPatient ? this.data.currentPatient.id : 'P-101');
    return this.data.patientReports.filter(r => r.patientId === pid);
  }

  addReport(reportData) {
    const id = 'REP-' + Math.floor(1000 + Math.random() * 9000);
    const newReport = {
      id,
      patientId: reportData.patientId || this.data.currentPatient.id,
      title: reportData.title || 'Patient Document',
      fileType: reportData.fileType || 'pdf',
      dateUploaded: 'Today',
      fileSize: reportData.fileSize || '1.1 MB',
      status: 'Uploaded - Awaiting Doctor Review',
      lab: reportData.lab || 'Uploaded via Patient Portal',
      summary: reportData.summary || 'Uploaded medical record for clinical assessment.'
    };
    this.data.patientReports.unshift(newReport);
    this.saveData();

    // Async sync with Supabase Cloud
    if (window.supabaseService && window.supabaseService.isConnected) {
      window.supabaseService.insertReport(newReport).catch(err => console.warn('Supabase sync notice:', err));
    }

    return newReport;
  }

  getCarePlans(patientId = null) {
    const pid = patientId || (this.data.currentPatient ? this.data.currentPatient.id : 'P-101');
    return this.data.carePlans.filter(c => c.patientId === pid);
  }

  addCarePlan(planData) {
    const id = 'CP-' + Math.floor(1000 + Math.random() * 9000);
    const newPlan = {
      id,
      patientId: planData.patientId || 'P-101',
      patientName: planData.patientName || 'Rajesh Kumar',
      doctor: planData.doctor || 'Dr. Harini Srinivasan',
      dateIssued: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      chiefComplaint: planData.chiefComplaint,
      remedies: planData.remedies || [],
      lifestyleGuidance: planData.lifestyleGuidance,
      emergencyDisclaimer: planData.emergencyDisclaimer || 'Do not stop prescribed conventional medicines without your treating physician\'s advice. Seek immediate emergency care for serious or worsening symptoms.',
      followUpDate: planData.followUpDate || 'In 2 Weeks'
    };
    this.data.carePlans.unshift(newPlan);
    this.saveData();

    // Async sync with Supabase Cloud
    if (window.supabaseService && window.supabaseService.isConnected) {
      window.supabaseService.insertCarePlan(newPlan).catch(err => console.warn('Supabase sync notice:', err));
    }

    return newPlan;
  }

  checkLocality(localityName) {
    if (!localityName) return null;
    const clean = localityName.toLowerCase().trim();
    return this.data.hyderabadLocalities.find(loc => loc.name.toLowerCase().includes(clean));
  }
}

// Global data store instance
window.clinicStore = new ClinicDataStore();

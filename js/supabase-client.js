/**
 * Aarogyam Homeopathy - Supabase Cloud Client Integration
 * Connects the clinic portal to project: eiubfnurikvcgsbgpheh.supabase.co
 */

const SUPABASE_PROJECT_URL = 'https://eiubfnurikvcgsbgpheh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWJmbnVyaWt2Y2dzYmdwaGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzkzNjksImV4cCI6MjEwNTY1NTM2OX0.Ue1ao9m7Jcb4rVZxw_juX2G1e8LLNE6zp9_6b_6Uo6M';

class SupabaseService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.init();
  }

  init() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        this.client = window.supabase.createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);
        this.isConnected = true;
        console.log('[Supabase] Connected to Supabase Cloud Database:', SUPABASE_PROJECT_URL);
      } catch (e) {
        console.warn('Could not initialize Supabase client, falling back to local store:', e);
      }
    }
  }

  // Fetch all appointments from Supabase
  async fetchAppointments() {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetchAppointments error:', e.message);
      return null;
    }
  }

  // Insert an appointment into Supabase
  async insertAppointment(appointment) {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('appointments')
        .insert([{
          id: appointment.id,
          patient_id: appointment.patientId || 'P-101',
          patient_name: appointment.patientName,
          doctor_name: appointment.doctor,
          type: appointment.type,
          appointment_datetime: appointment.datetime,
          raw_date: appointment.rawDate,
          status: appointment.status,
          concern: appointment.concern,
          locality: appointment.locality,
          reports_uploaded: appointment.reportsUploaded || 0
        }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn('Supabase insertAppointment error:', e.message);
      return null;
    }
  }

  // Insert a registered patient into Supabase
  async insertPatient(patient) {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('patients')
        .insert([{
          id: patient.id,
          name: patient.name,
          age: parseInt(patient.age) || 30,
          dob: patient.dob,
          gender: patient.gender,
          mobile: patient.mobile,
          email: patient.email,
          locality: patient.locality,
          language: patient.language || 'English',
          main_concern: patient.mainConcern,
          duration: patient.duration,
          current_meds: patient.currentMeds,
          allergies: patient.allergies,
          existing_conditions: patient.existingConditions
        }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn('Supabase insertPatient error:', e.message);
      return null;
    }
  }

  // Fetch patient reports from Supabase
  async fetchReports(patientId = 'P-101') {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('patient_reports')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetchReports error:', e.message);
      return null;
    }
  }

  // Insert a patient report into Supabase
  async insertReport(report) {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('patient_reports')
        .insert([{
          id: report.id,
          patient_id: report.patientId || 'P-101',
          title: report.title,
          file_type: report.fileType,
          date_uploaded: report.dateUploaded,
          file_size: report.fileSize,
          status: report.status,
          lab_origin: report.lab,
          clinical_summary: report.summary
        }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn('Supabase insertReport error:', e.message);
      return null;
    }
  }

  // Fetch care plans from Supabase
  async fetchCarePlans(patientId = 'P-101') {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('care_plans')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetchCarePlans error:', e.message);
      return null;
    }
  }

  // Insert a care plan into Supabase
  async insertCarePlan(carePlan) {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('care_plans')
        .insert([{
          id: carePlan.id,
          patient_id: carePlan.patientId || 'P-101',
          patient_name: carePlan.patientName,
          doctor_name: carePlan.doctor,
          date_issued: carePlan.dateIssued,
          chief_complaint: carePlan.chiefComplaint,
          remedies: carePlan.remedies,
          lifestyle_guidance: carePlan.lifestyleGuidance,
          emergency_disclaimer: carePlan.emergencyDisclaimer,
          follow_up_date: carePlan.followUpDate
        }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn('Supabase insertCarePlan error:', e.message);
      return null;
    }
  }

  // Send live verification OTP to patient email
  async sendEmailOTP(email) {
    if (!email) return { success: false, message: 'No email address provided.' };
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (this.client && this.client.auth) {
        const { data, error } = await this.client.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true
          }
        });
        if (error) throw error;
        console.log('[Supabase Auth] Live verification OTP email dispatched to:', cleanEmail);
        return { success: true, email: cleanEmail };
      }

      // Direct REST fallback
      const res = await fetch(`${SUPABASE_PROJECT_URL}/auth/v1/otp`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: cleanEmail, create_user: true })
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      console.log('[Supabase REST] Live verification OTP email dispatched to:', cleanEmail);
      return { success: true, email: cleanEmail };
    } catch (err) {
      console.warn('[Supabase Auth Delivery Note]', err.message || err);
      return { success: false, message: err.message };
    }
  }

  // Verify live OTP token received by patient in email
  async verifyEmailOTP(email, token) {
    if (!email || !token) return { success: false, message: 'Missing email or token.' };
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();
    try {
      if (this.client && this.client.auth) {
        // Try email OTP type first
        const resEmail = await this.client.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: 'email'
        });
        if (!resEmail.error) {
          return { success: true, user: resEmail.data?.user };
        }

        // Try magiclink OTP type
        const resMagic = await this.client.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: 'magiclink'
        });
        if (!resMagic.error) {
          return { success: true, user: resMagic.data?.user };
        }
      }

      // Direct REST fallback
      const res = await fetch(`${SUPABASE_PROJECT_URL}/auth/v1/verify`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'email', email: cleanEmail, token: cleanToken })
      });
      const json = await res.json();
      if (!res.ok || json.error_code) {
        return { success: false, message: json.msg || json.message || 'Invalid or expired OTP token' };
      }
      return { success: true, user: json.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

window.supabaseService = new SupabaseService();

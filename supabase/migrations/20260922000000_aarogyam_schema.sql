-- ==========================================================
-- AAROGYAM HOMEOPATHY - DATABASE MIGRATION SCHEMA
-- ==========================================================

-- 1. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  designation TEXT NOT NULL,
  experience TEXT NOT NULL,
  education TEXT NOT NULL,
  clinical_focus TEXT NOT NULL,
  languages TEXT[] NOT NULL,
  registration TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INT,
  dob DATE,
  gender TEXT,
  mobile TEXT NOT NULL,
  email TEXT,
  locality TEXT,
  language TEXT,
  main_concern TEXT,
  duration TEXT,
  current_meds TEXT,
  allergies TEXT,
  existing_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  type TEXT NOT NULL,
  appointment_datetime TEXT NOT NULL,
  raw_date DATE,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  concern TEXT NOT NULL,
  locality TEXT,
  reports_uploaded INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PATIENT REPORTS & RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.patient_reports (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_type TEXT NOT NULL,
  date_uploaded TEXT NOT NULL,
  file_size TEXT,
  status TEXT NOT NULL DEFAULT 'Uploaded - Awaiting Review',
  lab_origin TEXT,
  clinical_summary TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CARE PLANS & HOMEOPATHIC PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.care_plans (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  date_issued TEXT NOT NULL,
  chief_complaint TEXT NOT NULL,
  remedies JSONB NOT NULL DEFAULT '[]'::jsonb,
  lifestyle_guidance TEXT,
  emergency_disclaimer TEXT NOT NULL,
  follow_up_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. HYDERABAD LOCALITIES TABLE
CREATE TABLE IF NOT EXISTS public.hyderabad_localities (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  pincode TEXT NOT NULL,
  covered BOOLEAN NOT NULL DEFAULT TRUE,
  avg_response TEXT NOT NULL
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hyderabad_localities ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for clinic portal operations
CREATE POLICY "Allow public read on doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Allow public read on localities" ON public.hyderabad_localities FOR SELECT USING (true);

CREATE POLICY "Allow public select on appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on appointments" ON public.appointments FOR UPDATE USING (true);

CREATE POLICY "Allow public select on patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert on patients" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on patients" ON public.patients FOR UPDATE USING (true);

CREATE POLICY "Allow public select on patient_reports" ON public.patient_reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert on patient_reports" ON public.patient_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on patient_reports" ON public.patient_reports FOR UPDATE USING (true);

CREATE POLICY "Allow public select on care_plans" ON public.care_plans FOR SELECT USING (true);
CREATE POLICY "Allow public insert on care_plans" ON public.care_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on care_plans" ON public.care_plans FOR UPDATE USING (true);

-- ==========================================================
-- INITIAL SEED DATA
-- ==========================================================

-- Seed Doctors
INSERT INTO public.doctors (id, name, qualifications, designation, experience, education, clinical_focus, languages, registration, image_url)
VALUES 
(
  'dr-harini',
  'Dr. Harini Srinivasan',
  'B.H.M.S., M.Sc. (Counselling & Psychotherapy)',
  'Homeopathy Physician & Clinical Director',
  '10 Years Clinical Experience',
  'B.H.M.S. from Dr. M.G.R. Medical University, Chennai (2010) • M.Sc. Counselling & Psychotherapy from Tamil Nadu Open University',
  'Independent homeopathic practice in Chennai from 2010 to 2019, managing acute and chronic health conditions including kidney stones, psoriasis, and diabetes, combined with counselling and coping skills support.',
  ARRAY['English', 'Telugu', 'Tamil'],
  'BHMS / TS-MedCouncil / 2010 / Verified',
  'assets/dr_harini.jpg'
),
(
  'dr-partner',
  'Dr. Rohan Sharma',
  'B.H.M.S.',
  'Homeopathy Physician (Partner Doctor)',
  'Verified BHMS Practitioner',
  'B.H.M.S. from Recognized Medical University (Under State Council Verification)',
  'Supportive acute and chronic health care, patient teleconsultations, and selected home visits across Hyderabad.',
  ARRAY['English', 'Hindi', 'Telugu'],
  'State Medical Council Registration Verification In Progress',
  'assets/dr_partner.jpg'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Patient
INSERT INTO public.patients (id, name, age, dob, gender, mobile, email, locality, language, main_concern, duration, current_meds, allergies, existing_conditions)
VALUES (
  'P-101',
  'Rajesh Kumar',
  38,
  '1988-04-12',
  'Male',
  '+91 98765 43210',
  'rajesh.kumar@example.com',
  'Madhapur, Hyderabad',
  'English, Telugu',
  'Chronic Eczema & Flare-ups with high work stress',
  '2 Years',
  'Hydrocortisone 1% topical cream (as needed), Multivitamin',
  'Dust mites, mild penicillin sensitivity',
  'Mild essential hypertension (regularly monitored by primary physician)'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Appointments
INSERT INTO public.appointments (id, patient_id, patient_name, doctor_name, type, appointment_datetime, raw_date, status, concern, locality, reports_uploaded)
VALUES 
('APT-901', 'P-101', 'Rajesh Kumar', 'Dr. Harini Srinivasan', 'Video Teleconsultation', 'Today • 04:30 PM', '2026-09-22', 'Confirmed', 'Review of skin flare-up and response to Graphites 30C', 'Madhapur', 3),
('APT-902', 'P-101', 'Sunita Rao', 'Dr. Harini Srinivasan', 'Video Teleconsultation', 'Today • 05:30 PM', '2026-09-22', 'Confirmed', 'Recurrent digestive symptoms, acid reflux and bloating', 'Banjara Hills', 2),
('APT-903', 'P-101', 'Arvind Reddy', 'Dr. Rohan Sharma', 'Home Visit Request', 'Tomorrow • 10:30 AM', '2026-09-23', 'Pending Locality Review', 'Supportive consultation for mild urinary frequency', 'Jubilee Hills', 1),
('APT-904', 'P-101', 'Lakshmi Narayanan', 'Dr. Harini Srinivasan', 'Phone Consultation', '24 Sep 2026 • 11:00 AM', '2026-09-24', 'Scheduled', 'Stress, sleep disruption and anxiety coping consultation', 'Kondapur', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Reports
INSERT INTO public.patient_reports (id, patient_id, title, file_type, date_uploaded, file_size, status, lab_origin, clinical_summary)
VALUES 
('REP-501', 'P-101', 'Complete Blood Count (CBC) & ESR Profile', 'pdf', '18 Sep 2026', '1.4 MB', 'Reviewed by Doctor', 'Vijaya Diagnostic Centre, Hyderabad', 'Normal hemoglobin (14.2 g/dL), mild elevation in absolute eosinophils (6.8%), indicative of allergic tendency.'),
('REP-502', 'P-101', 'Dermatology Clinical Note & Allergy Panel', 'pdf', '18 Sep 2026', '2.2 MB', 'Reviewed by Doctor', 'Apollo Clinic, Kondapur', 'Atopic dermatitis diagnosis; patch testing showed contact sensitivity to synthetic fragrances.'),
('REP-503', 'P-101', 'Current Prescriptions & Topical Regimen', 'image', '19 Sep 2026', '840 KB', 'Reviewed by Doctor', 'Patient Prescription Upload', 'Photo of currently prescribed Hydrocortisone 1% ointment and cetirizine tablets.')
ON CONFLICT (id) DO NOTHING;

-- Seed Care Plans
INSERT INTO public.care_plans (id, patient_id, patient_name, doctor_name, date_issued, chief_complaint, remedies, lifestyle_guidance, emergency_disclaimer, follow_up_date)
VALUES (
  'CP-301',
  'P-101',
  'Rajesh Kumar',
  'Dr. Harini Srinivasan',
  '19 Sep 2026',
  'Chronic Eczema, itching aggravated by warmth, comorbid work-related stress',
  '[{"name": "Graphites", "potency": "30C", "dosage": "4 globules twice daily", "instructions": "Dissolve under tongue. Take 15 minutes away from food or strong mint flavors."}, {"name": "Sulphur", "potency": "200CH", "dosage": "4 globules once weekly", "instructions": "Take Sunday morning empty stomach with clean water."}]'::jsonb,
  'Keep skin moisturized using cold-pressed virgin coconut oil or hypoallergenic barrier balm. Avoid hot showers. 15 minutes of slow rhythmic deep breathing before bedtime to regulate nervous system tone.',
  'Do not stop any prescribed conventional blood pressure or emergency medicines without consulting your prescribing physician. If severe skin infection, intense swelling, fever, or spreading redness develops, seek prompt medical care.',
  '03 Oct 2026 (Teleconsultation Review)'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Hyderabad Localities
INSERT INTO public.hyderabad_localities (name, pincode, covered, avg_response)
VALUES 
('Banjara Hills', '500034', true, 'Same day or next day'),
('Jubilee Hills', '500033', true, 'Same day or next day'),
('Gachibowli', '500032', true, 'Scheduled visit available'),
('Madhapur / Hitec City', '500081', true, 'Scheduled visit available'),
('Kondapur', '500084', true, 'Scheduled visit available'),
('Begumpet', '500016', true, 'Scheduled visit available'),
('Somajiguda', '500082', true, 'Scheduled visit available'),
('Secunderabad', '500003', true, 'Selected slots'),
('Kukatpally', '500072', true, 'Selected slots'),
('Mehdipatnam', '500028', true, 'Selected slots'),
('Manikonda', '500089', true, 'Selected slots'),
('Shamshabad', '501218', false, 'Outside home-visit radius. Teleconsultation strongly recommended.'),
('Ghatkesar', '501301', false, 'Outside home-visit radius. Teleconsultation recommended.')
ON CONFLICT (name) DO NOTHING;

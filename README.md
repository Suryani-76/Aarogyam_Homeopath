# Aarogyam Homeopathy — Clinical Healthcare Web Platform

A comprehensive, clinically grounded web platform developed for **Aarogyam Homeopathy** (Hyderabad), adhering strictly to clinical document specifications, ethical medical guidelines, and professional healthcare aesthetics.

## Key Features

- **Public Healthcare Portal**:
  - Telemedicine consultation booking with locality-based Hyderabad home visit eligibility checker.
  - Clinical pillars, health education sections, condition assessment cards, and medical disclaimers.
  - Verified profiles of Dr. Harini Srinivasan (BHMS Physician) and clinical team.
- **Patient Portal (`#patient-portal-view`)**:
  - Seamless patient registration and login using **Email ID and Password**.
  - Digital Health Vault with personalized health metrics, scheduled teleconsultations, uploaded diagnostic lab reports, and doctor-prescribed care plans.
- **Doctor Clinical Portal (`#doctor-portal-view`)**:
  - Physician dashboard with real-time consultation queues (Video / Home Visits).
  - In-depth patient chart drawer (chief complaints, conventional meds, allergies, lab scans).
  - Interactive Care Plan & Prescription Generator syncing remedies and lifestyle guidance in real time.
- **Telemedicine Consultation Suite**:
  - In-browser interactive consultation room with live video PIP simulation, active call timer, and clinical note-taking interface.
- **Cloud Database Integration**:
  - Integrated with Supabase Cloud Database for persistent storage of patients, appointments, lab reports, and care plans.

## Technology Stack

- **Frontend**: Semantic HTML5, Vanilla JavaScript (ES6+), Vanilla CSS (Design Tokens, Responsive Flexbox & Grid).
- **Backend & Storage**: Supabase Cloud PostgreSQL, Local Storage fallback.
- **Icons & Assets**: Clinical SVG Icon System, High-resolution verified medical portraits and branding assets.

## Running Locally

Clone the repository and run any local HTTP server:

```bash
# Using Python
python -m http.server 3030

# Or using Node.js http-server / npx serve
npx serve .
```

Open `http://localhost:3030` in your web browser.

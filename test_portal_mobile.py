import os
import sys
from playwright.sync_api import sync_playwright

output_dir = r"C:\Users\Gouda Suryani\.gemini\antigravity-ide\brain\8b478c79-2b2b-4748-808a-98f58aa43d18"

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        headless=True
    )
    
    iphone = p.devices["iPhone 14"]
    context = browser.new_context(**iphone)
    page = context.new_page()
    
    page.goto("http://localhost:3030/", wait_until="networkidle")
    page.wait_for_function("() => window.app !== undefined")
    
    # 1. Patient Portal - Tab 1 (Appointments)
    page.evaluate("() => window.app.switchView('patient')")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "portal_patient_appointments.png"), full_page=True)
    
    # Check elements layout & overflow in patient appointments
    res_patient_apt = page.evaluate("""() => {
        const aptCards = Array.from(document.querySelectorAll('#patient-appointments-list .appointment-card'));
        return {
            cardsCount: aptCards.length,
            cardsRect: aptCards.map(c => ({
                width: c.offsetWidth,
                marginRight: window.getComputedStyle(c).marginRight
            })),
            docWidth: document.documentElement.scrollWidth,
            winWidth: window.innerWidth
        };
    }""")
    print("[Patient Appointments]", res_patient_apt)

    # 2. Patient Portal - Tab 2 (Records & Reports)
    page.evaluate("() => { const b = document.querySelector('.patient-tab-btn[data-tab=\"records\"]'); if(b) b.click(); }")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "portal_patient_records.png"), full_page=True)
    
    # 3. Patient Portal - Tab 3 (Prescriptions & Care Plans)
    page.evaluate("() => { const b = document.querySelector('.patient-tab-btn[data-tab=\"prescriptions\"]'); if(b) b.click(); }")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "portal_patient_prescriptions.png"), full_page=True)

    # 4. Patient Portal - Tab 4 (Profile)
    page.evaluate("() => { const b = document.querySelector('.patient-tab-btn[data-tab=\"profile\"]'); if(b) b.click(); }")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "portal_patient_profile.png"), full_page=True)

    # 5. Doctor Portal - Tab 1 (Queue Table)
    page.evaluate("() => window.app.switchView('doctor')")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "portal_doctor_queue.png"), full_page=True)
    
    # Check doctor queue table overflow
    res_doctor_queue = page.evaluate("""() => {
        const table = document.querySelector('.clinical-table');
        const card = document.querySelector('.table-card');
        return {
            tableWidth: table ? table.offsetWidth : 0,
            tableScrollWidth: table ? table.scrollWidth : 0,
            cardWidth: card ? card.offsetWidth : 0,
            cardScrollWidth: card ? card.scrollWidth : 0,
            docWidth: document.documentElement.scrollWidth,
            winWidth: window.innerWidth
        };
    }""")
    print("[Doctor Queue]", res_doctor_queue)

    # 6. Doctor Portal - Tab 2 (Reports)
    page.evaluate("() => { const b = document.querySelector('.doctor-tab-btn[data-tab=\"reports\"]'); if(b) b.click(); }")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "portal_doctor_reports.png"), full_page=True)

    # 7. Doctor Portal - Tab 3 (Home Visits)
    page.evaluate("() => { const b = document.querySelector('.doctor-tab-btn[data-tab=\"homevisits\"]'); if(b) b.click(); }")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "portal_doctor_homevisits.png"), full_page=True)

    # 8. Modals check: Open Patient Login Modal
    page.evaluate("() => window.app.openPatientLogin()")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "modal_patient_login.png"), full_page=False)
    page.evaluate("() => window.app.closePatientLogin()")

    # 9. Modals check: Open Doctor Login Modal
    page.evaluate("() => window.app.openDoctorLogin()")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "modal_doctor_login.png"), full_page=False)
    page.evaluate("() => window.app.closeDoctorLogin()")

    # 10. Modals check: Open Care Plan Modal
    page.evaluate("() => window.portalsManager.openCarePlanModal('P-101', 'Rajesh Kumar')")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(output_dir, "modal_careplan.png"), full_page=False)

    # 11. Multi-Resolution Audit (360px and 320px)
    for width in [360, 320]:
        page.set_viewport_size({"width": width, "height": 700})
        page.wait_for_timeout(200)
        # Check Public Home
        page.evaluate("() => window.app.switchView('public')")
        page.wait_for_timeout(200)
        s_home = page.evaluate("() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth })")
        print(f"[{width}px Home]", s_home, "Overflow:", s_home['doc'] > s_home['win'])
        
        # Check Patient Portal
        page.evaluate("() => window.app.switchView('patient')")
        page.wait_for_timeout(200)
        s_patient = page.evaluate("() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth })")
        print(f"[{width}px Patient Portal]", s_patient, "Overflow:", s_patient['doc'] > s_patient['win'])
        
        # Check Doctor Portal
        page.evaluate("() => window.app.switchView('doctor')")
        page.wait_for_timeout(200)
        s_doctor = page.evaluate("() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth })")
        print(f"[{width}px Doctor Portal]", s_doctor, "Overflow:", s_doctor['doc'] > s_doctor['win'])

    browser.close()
    print("[Done] Mobile audit screenshots generated.")

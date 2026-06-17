import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './reference-styles.css';
import './index.css';
import { AppProvider } from './context/AppContext';
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import AppointmentSection from './components/AppointmentSection';
import DepartmentsSection from './components/DepartmentsSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsSection from './components/NewsSection';
import PatientPortal from './components/PatientPortal';
import ComplaintSuggestion from './components/ComplaintSuggestion';
import FeaturesSection from './components/FeaturesSection';
import Footer, { BackToTop, ProgressBar } from './components/FooterAndMisc';
import ChatBot from './components/ChatBot';
import FloatingBanner from './components/FloatingBanner';
import HealthPackagesSection from './components/HealthPackagesSection';
import { Doctor } from './api';

function AppContent() {
  const [showPortal, setShowPortal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [preSelectedDoctor, setPreSelectedDoctor] = useState<Doctor | undefined>();
  const [initialCancelMode, setInitialCancelMode] = useState(false);

  const handleBookAppointment = (doctor?: Doctor, cancelMode: boolean = false) => {
    if (!doctor && !cancelMode) {
      // No specific doctor — scroll to departments so user picks one first
      setTimeout(() => {
        document.querySelector('#departments')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    setPreSelectedDoctor(doctor);
    setInitialCancelMode(cancelMode);
    setShowAppointment(true);
  };

  const handleFindDoctor = () => {
    document.querySelector('#departments')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <ProgressBar />
      <IntroAnimation />
      <Navbar
        onAppointmentClick={() => handleBookAppointment()}
        onCancelClick={() => { setPreSelectedDoctor(undefined); setInitialCancelMode(true); setShowAppointment(true); }}
        onPortalClick={() => setShowPortal(true)}
        onFeedbackClick={() => setShowFeedback(!showFeedback)}
      />
      <FloatingBanner
        onBook={() => handleBookAppointment()}
        onFindDoctor={handleFindDoctor}
        onCancel={() => { setPreSelectedDoctor(undefined); setInitialCancelMode(true); setShowAppointment(true); }}
        onFeedback={() => setShowFeedback(true)}
      />
      
      <main>
        {/* 1. Hero */}
        <HeroSection onBook={() => handleBookAppointment()} onDoctors={handleFindDoctor} />

        {/* Features Row */}
        <FeaturesSection 
          onBook={() => handleBookAppointment()} 
          onDoctors={handleFindDoctor} 
          onPortal={() => setShowPortal(true)} 
        />

        {/* 2. Services */}
        <ServicesSection />

        {/* 3. Departments */}
        <DepartmentsSection onBook={(doctor) => handleBookAppointment(doctor, false)} />

        {/* Health Packages (Under Doctors/Departments) */}
        <HealthPackagesSection />

        {/* 4. Patient Reviews */}
        <TestimonialsSection />

        {/* 5 & 6. News & Awards (Combined) */}
        <NewsSection />

        {/* Complaint & Suggestion Box Modal */}
        {showFeedback && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(15, 45, 82, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '860px', maxHeight: '94vh', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <ComplaintSuggestion onClose={() => setShowFeedback(false)} />
            </div>
          </div>
        )}

        {/* Book Appointment Modal */}
        {showAppointment && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(15, 45, 82, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAppointment(false); }}
          >
            <div style={{ background: 'var(--bg-primary, #fff)', borderRadius: '20px', width: '100%', maxWidth: '1000px', maxHeight: '98vh', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Close button */}
              <button
                onClick={() => setShowAppointment(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'rgba(15,45,82,0.08)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', color: '#64748B', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(15,45,82,0.08)')}
                aria-label="Close"
              >
                <i className="fas fa-times" />
              </button>
              <div style={{ overflowY: 'auto', flex: 1 }}>
                <AppointmentSection
                  preSelectedDoctor={preSelectedDoctor}
                  initialCancelMode={initialCancelMode}
                  onClose={() => setShowAppointment(false)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onBook={() => handleBookAppointment()} onPortal={() => setShowPortal(true)} />
      <BackToTop />
      <ChatBot />

      {showPortal && <PatientPortal onClose={() => setShowPortal(false)} />}

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 99999 }}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

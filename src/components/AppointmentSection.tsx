import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';
import { Doctor, fetchDoctors, fetchSlots, bookAppointment, searchAppointments, cancelAppointmentRequest, rescheduleAppointment, searchPatient, lockSlot, unlockSlot, requestPatientOTP, verifyPatientOTP, getPatientsByPhone } from '../api';

interface AppointmentSectionProps {
  preSelectedDoctor?: Doctor;
  initialCancelMode?: boolean;
  onClose?: () => void;
}

function AnimCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="fade-in-up">{children}</div>;
}

export default function AppointmentSection({ preSelectedDoctor, initialCancelMode = false }: AppointmentSectionProps) {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>(preSelectedDoctor);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [ageAutoCalculated, setAgeAutoCalculated] = useState(false);
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [village, setVillage] = useState('');
  const [description, setDescription] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [dept, setDept] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [visitType, setVisitType] = useState('Consultation');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [doctorOnLeave, setDoctorOnLeave] = useState(false);
  const [lockToken] = useState(() => Math.random().toString(36).substring(2, 11));
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [confirmedPatientId, setConfirmedPatientId] = useState('');
  const timerRef = useRef<any | null>(null);

  const [manualPatientEntry, setManualPatientEntry] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [isPatientFound, setIsPatientFound] = useState(false);
  const [searchingPatient, setSearchingPatient] = useState(false);

  // OTP Verification State
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [availablePatients, setAvailablePatients] = useState<any[]>([]);
  const [selectedPatientData, setSelectedPatientData] = useState<any>(null);

  // Refs to hold latest flag values - these are readable inside async closures without stale data
  const manualEntryRef = useRef(false);
  const patientFoundRef = useRef(false);
  const [patientSearchResults, setPatientSearchResults] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // OTP Verification Functions
  const handleRequestOTP = async () => {
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setVerifyingOTP(true);
      const response = await requestPatientOTP(phone);
      
      if (response.success) {
        setOtpSent(true);
        setShowOTPVerification(true);
        setMaskedPhone(response.phone_masked);
        toast.success(response.message);
      } else {
        // Patient not found - show as new patient
        setIsNewPatient(true);
        setOtpVerified(true);
        setShowOTPVerification(false);
        toast.info('New patient detected. Please fill in your details.');
      }
    } catch (error: any) {
      console.error('OTP request error:', error);
      if (error.response?.status === 404) {
        // Patient not found - treat as new patient
        setIsNewPatient(true);
        setOtpVerified(true);
        setShowOTPVerification(false);
        toast.info('New patient detected. Please fill in your details.');
      } else {
        toast.error(error.response?.data?.error || 'Failed to send OTP');
      }
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setVerifyingOTP(true);
      const response = await verifyPatientOTP(phone, otpCode);
      
      if (response.success) {
        setOtpVerified(true);
        setShowOTPVerification(false);
        
        // Get all patients for this phone number
        const patientsResponse = await getPatientsByPhone(phone);
        if (patientsResponse.success && patientsResponse.data.length > 0) {
          setAvailablePatients(patientsResponse.data);
          
          if (patientsResponse.data.length === 1) {
            // Auto-select if only one patient
            handleSelectPatient(patientsResponse.data[0]);
          }
          
          toast.success('Phone verified! Please select your profile.');
        } else {
          toast.error('No patient profiles found for this number');
        }
      } else {
        toast.error(response.error || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSelectedPatientData(patient);
    setSelectedPatientId(patient.id);
    setIsPatientFound(true);
    
    // Auto-fill form fields
    setName(patient.full_name || '');
    setAge(patient.age?.toString() || '');
    setAgeAutoCalculated(false); // Reset auto-calculated flag when loading patient data
    setGender(patient.gender || '');
    setEmail(patient.email || '');
    setAddress(patient.address || '');
    setPincode(patient.pincode || '');
    setCity(patient.city || '');
    setStateName(patient.state || '');
    setVillage(patient.village || '');
    
    if (patient.date_of_birth) {
      setDob(patient.date_of_birth);
    }
    
    toast.success(`Welcome back, ${patient.full_name}!`);
  };

  const resetPatientVerification = () => {
    setShowOTPVerification(false);
    setOtpSent(false);
    setOtpCode('');
    setOtpVerified(false);
    setMaskedPhone('');
    setAvailablePatients([]);
    setSelectedPatientData(null);
    setSelectedPatientId(null);
    setIsPatientFound(false);
    setIsNewPatient(false);
    setAgeAutoCalculated(false);
  };

  // Keep refs in sync with state
  useEffect(() => { manualEntryRef.current = manualPatientEntry; }, [manualPatientEntry]);
  useEffect(() => { patientFoundRef.current = !!selectedPatientId || (patientSearchResults.length === 1 && !manualPatientEntry); }, [selectedPatientId, patientSearchResults, manualPatientEntry]);

  // Helper to set manual mode - updates both state AND the ref immediately
  const enterManualMode = () => {
    manualEntryRef.current = true;
    setManualPatientEntry(true);
  };

  // Cancellation Flow State
  const [isCancelMode, setIsCancelMode] = useState(initialCancelMode);
  const [cancelPhone, setCancelPhone] = useState('');
  const [cancelDate, setCancelDate] = useState('');
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);

  // Rescheduling state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Follow-up eligibility state
  const [followupInfo, setFollowupInfo] = useState<{
    has_previous_visit: boolean;
    is_free_followup: boolean;
    is_followup_eligible: boolean;
    days_since_last: number | null;
    followup_count: number;
    max_followup_count: number;
    remaining_followups: number;
    followup_fee: number;
    consultation_fee: number;
  } | null>(null);
  const [checkingFollowup, setCheckingFollowup] = useState(false);

  // Trigger followup check whenever patient + doctor are both known
  useEffect(() => {
    if (!selectedPatientId || !selectedDoctor?.id) {
      setFollowupInfo(null);
      return;
    }
    let cancelled = false;
    const check = async () => {
      setCheckingFollowup(true);
      try {
        const res = await apiClient.get(`/homepage/followup-check?patient_id=${selectedPatientId}&doctor_id=${selectedDoctor.id}`);
        if (cancelled) return;
        const json = res.data;
        if (json.success && !cancelled) {
          const info = json.data;
          setFollowupInfo(info);
          // Auto-set visit type based on eligibility
          if (info.is_followup_eligible) {
            setVisitType('follow_up');
          } else {
            setVisitType('Consultation');
          }
        }
      } catch (e) {
        console.error('Followup check failed:', e);
      } finally {
        if (!cancelled) setCheckingFollowup(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [selectedPatientId, selectedDoctor?.id]);

  // Fetch doctors from database
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const result = await fetchDoctors();
        // Correctly handle the response object { data: Doctor[], success: boolean }
        if (result && Array.isArray(result.data)) {
          setDoctors(result.data);
        } else if (Array.isArray(result)) {
          // Fallback if the API ever returns a direct array
          setDoctors(result);
        } else {
          console.warn('Unexpected doctors data format:', result);
          setDoctors([]);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
      }
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    if (preSelectedDoctor) {
      setSelectedDoctor(preSelectedDoctor);
      setDept(preSelectedDoctor.department);
      if (!isRescheduling) setStep(2);
    }
  }, [preSelectedDoctor, isRescheduling]);

  // Sync isCancelMode with initialCancelMode prop when it changes
  useEffect(() => {
    setIsCancelMode(initialCancelMode);
  }, [initialCancelMode]);

  // Fetch slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const loadSlots = async () => {
        setLoadingSlots(true);
        setDoctorOnLeave(false);
        try {
          const res = await fetchSlots(selectedDoctor.id, selectedDate, lockToken);
          // res is now the full response object
          const slots = res.data || (Array.isArray(res) ? res : []);
          if (res.on_leave) {
            setDoctorOnLeave(true);
            setAvailableSlots([]);
          } else {
            setAvailableSlots(slots);
          }
        } catch (error) {
          console.error('Error fetching slots:', error);
          toast.error('Could not load time slots. Please try again.');
        } finally {
          setLoadingSlots(false);
        }
      };
      loadSlots();
    } else {
      setDoctorOnLeave(false);
    }
  }, [selectedDoctor, selectedDate, lockToken]);

  // Reservation Timer Logic
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      toast.info('Slot selection expired. Please select again.');
      setSelectedSlot('');
      unlockSlot(lockToken).catch(console.error);
      setTimeLeft(null);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, lockToken]);

  const handleSlotSelection = async (time: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    if (selectedSlot === time) return; // Already selected

    const previousSlot = selectedSlot;
    
    // OPTIMISTIC UI UPDATE: Instantly select slot and start timer
    setSelectedSlot(time);
    setTimeLeft(420); // 7 minutes
    setAvailableSlots(prev => prev.map(s => {
      if (s.time === time) return { ...s, is_mine: true, status: 'locked', available: true };
      if (s.time === previousSlot) return { ...s, is_mine: false, status: 'available', available: true };
      return s;
    }));

    try {
      if (selectedDoctor && selectedDate) {
        const res = await lockSlot(selectedDoctor.id, selectedDate, time, lockToken);
        if (res.success) {
          // Success already handled optimistically
        } else {
          // Revert optimistic update
          setSelectedSlot(previousSlot);
          if (!previousSlot) setTimeLeft(null);
          toast.error(res.error || 'Could not lock slot');
          const refreshRes = await fetchSlots(selectedDoctor.id, selectedDate, lockToken);
          setAvailableSlots(refreshRes.data || (Array.isArray(refreshRes) ? refreshRes : []));
        }
      }
    } catch (error: any) {
      console.error('Lock error:', error);
      // Revert optimistic update
      setSelectedSlot(previousSlot);
      if (!previousSlot) setTimeLeft(null);
      toast.error(error.response?.data?.error || 'Failed to lock slot');
      const refreshRes = await fetchSlots(selectedDoctor?.id as any, selectedDate as any, lockToken);
      setAvailableSlots(refreshRes.data || (Array.isArray(refreshRes) ? refreshRes : []));
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Patient search debounce - only re-runs when actual search terms change
  useEffect(() => {
    // Basic guards - don't search if we already chose someone or are rescheduling
    if (patientFoundRef.current || isRescheduling) {
      return;
    }

    let query = '';
    const isPhoneSearch = phone.length >= 10;
    
    // Priority: If phone is 10+ digits, it's a primary identification key
    if (isPhoneSearch) query = phone;
    else if (phone.length > 5) query = phone; // Partial phone search
    else if (email.includes('@')) query = email;
    else if (name.trim().length > 2) query = name.trim();
    else if (age.length > 0) query = age;

    if (!query) {
      setPatientSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      // Final guard check before starting the search
      if (patientFoundRef.current) return;

      setSearchingPatient(true);
      try {
        const results = await searchPatient(query);
        // If results come back, update the selection search results
        if (results && results.length > 0) {
          setPatientSearchResults(results);
          // Ensure we don't auto-set identification until explicitly selected
          setIsPatientFound(false);
          setSelectedPatientId(null);
        } else {
          setPatientSearchResults([]);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setSearchingPatient(false);
      }
    }, 500);

    return () => clearTimeout(timer);
    // Runs when identification fields change
  }, [name, phone, age, email, isRescheduling]);

    // Pincode lookup removed

  const handleDateSelect = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (d < today) return;
    setSelectedDate(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    setSelectedSlot('');
    setLoadingSlots(true); // This will trigger the skeleton/loader instantly
  };

  const handleReschedule = async () => {
    if (!reschedulingId || !selectedDate || !selectedSlot) {
      toast.error('Please select both date and time.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await rescheduleAppointment(reschedulingId, selectedDate, selectedSlot, lockToken);
      if (res.success) {
        toast.success('Appointment rescheduled successfully!');
        setConfirmed(true);
        setIsRescheduling(false);
        setTimeLeft(null);
        unlockSlot(lockToken).catch(console.error);
      }
    } catch (error: any) {
      console.error('Reschedule error:', error);
      toast.error(error.response?.data?.error || 'Failed to reschedule.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone || !age) { 
        toast.error('Please fill all required fields (Name, Phone, Age).'); 
        return; 
    }
    // Phone validation
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
    }
    setSubmitting(true);
    try {
      // Construct address from multiple fields if provided
      const finalAddress = address;

      const bookingData = {
        doctor_id: selectedDoctor?.id,
        patient_id: selectedPatientId,
        patient_name: name,
        patient_phone: phone,
        patient_email: email,
        patient_dob: dob,
        patient_gender: gender,
        patient_address: finalAddress,
        patient_age: parseInt(age),
        description: description,
        visit_type: visitType,
        date: selectedDate,
        time: selectedSlot,
        lock_token: lockToken
      };

      const res = await bookAppointment(bookingData);
      if (res.reference) {
        setRefNumber(res.reference);
        if (res.patient_id) {
          setConfirmedPatientId(res.patient_id);
        }
        setIsNewPatient(res.is_new_patient || false);
        setConfirmed(true);
        toast.success(res.message || 'Appointment booked! 🎉');
      }
      setTimeLeft(null);
      unlockSlot(lockToken).catch(console.error);
    } catch (error: any) {
      console.error('Booking error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Booking failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchCancel = async () => {
    if (!cancelPhone || !cancelDate) {
      toast.error('Please enter both phone number and date.');
      return;
    }
    setSearching(true);
    try {
      const res = await searchAppointments(cancelPhone, cancelDate);
      if (res.success) {
        setSearchResult(res.data);
        if (res.data.length === 0) {
          toast.info('No active appointments found for this phone and date.');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search appointments.');
    } finally {
      setSearching(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!cancellingId || !cancelReason) {
      toast.error('Please provide a reason for cancellation.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await cancelAppointmentRequest(cancellingId, cancelReason);
      if (res.success) {
        toast.success('Appointment cancelled successfully.');
        setSearchResult(searchResult.filter(a => a.id !== cancellingId));
        setShowReasonModal(false);
        setCancelReason('');
        setCancellingId(null);
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error('Failed to cancel appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setDept('');
    setSelectedDoctor(undefined);
    setSelectedDate('');
    setSelectedSlot('');
    setName('');
    setPhone('');
    setAge('');
    setEmail('');
    setDob('');
    setAgeAutoCalculated(false);
    setGender('');
    setAddress('');
    setPincode('');
    setCity('');
    setStateName('');
    setVillage('');
    setDescription('');
    setVisitType('Consultation');
    setConfirmed(false);
    setRefNumber('');
    setConfirmedPatientId('');
    setIsRescheduling(false);
    setReschedulingId(null);
    setIsPatientFound(false);
    setSelectedPatientId(null);
    setPatientSearchResults([]);
    setIsNewPatient(false);
  };

  const whyPoints = [
    { icon: 'fas fa-bolt', title: 'Instant Confirmation', desc: 'Get immediate booking confirmation via SMS & email' },
    { icon: 'fas fa-user-md', title: 'Choose Your Doctor', desc: 'Browse and select from 200+ expert specialists' },
    { icon: 'fas fa-clock', title: 'Flexible Timings', desc: 'Multiple time slots available across all days' },
    { icon: 'fas fa-calendar-alt', title: 'Easy Rescheduling', desc: 'Reschedule or cancel with just a click anytime' },
  ];

  const stepLabels = ['Choose Doctor', 'Select Date & Time', 'Patient Details', 'Confirmation'];

  // Get unique departments from doctors
  const safeDoctors = Array.isArray(doctors) ? doctors : [];
  const departments = ['All', ...new Set(safeDoctors.map(d => d.department).filter(Boolean))];

  // Filter doctors by selected department
  const availableDoctors = dept ? safeDoctors.filter(d => d.department === dept) : safeDoctors;

  const displaySlots = availableSlots;

  return (
    <div id="appointments" style={{ background: 'var(--bg-primary)' }}>
      <div className="container" style={{ padding: '1.25rem 1.5rem' }}>
        <AnimCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', fontWeight: 700, color: 'var(--navy)', margin: '0 0 0.25rem' }}>{isCancelMode ? 'Cancel Your Appointment' : 'Book Your Appointment Online'}</h2>
              <div className="section-divider" style={{ margin: '0.3rem 0' }}></div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                {isCancelMode 
                  ? 'Enter your phone number and appointment date to find and cancel your booking.' 
                  : 'No long queues. Book from the comfort of your home and receive instant confirmation.'}
              </p>
            </div>
          </div>
        </AnimCard>

        {/* Main Form */}
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: 'clamp(1rem, 2vw, 1.25rem)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            {isCancelMode ? (
              /* CANCELLATION VIEW */
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label><i className="fas fa-phone" style={{ marginRight: '0.35rem', color: 'var(--teal)' }}></i>Phone Number</label>
                    <input 
                      value={cancelPhone} 
                      onChange={e => setCancelPhone(e.target.value)} 
                      placeholder="10-digit mobile" 
                      type="tel" 
                    />
                  </div>
                  <div className="form-group">
                    <label><i className="fas fa-calendar-alt" style={{ marginRight: '0.35rem', color: 'var(--teal)' }}></i>Appointment Date</label>
                    <input 
                      value={cancelDate} 
                      onChange={e => setCancelDate(e.target.value)} 
                      type="date" 
                    />
                  </div>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={handleSearchCancel} 
                  disabled={searching}
                  style={{ width: '100%', justifyContent: 'center', marginBottom: '2rem' }}
                >
                  {searching ? <><i className="fas fa-spinner fa-spin"></i> Searching...</> : <><i className="fas fa-search"></i> Search Appointments</>}
                </button>

                {searchResult.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Found Appointments:</h4>
                    {searchResult.map((appt: any) => (
                      <div key={appt.id} style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '15px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1rem' }}>{appt.doctor_name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <i className="fas fa-clock" style={{ marginRight: '0.4rem' }}></i>{appt.time}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--teal)', marginTop: '0.2rem' }}>Ref: {appt.reference_number}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => {
                              const doc = doctors.find(d => d.id === appt.doctor_id);
                              if (doc) {
                                setSelectedDoctor(doc);
                                setReschedulingId(appt.id);
                                setIsRescheduling(true);
                                setIsCancelMode(false);
                                setStep(2);
                                toast.info(`Rescheduling appointment with Dr. ${doc.name}. Please select a new date and time.`);
                              } else {
                                toast.error('Doctor information not found.');
                              }
                            }}
                            className="btn-outline"
                            style={{ borderColor: 'var(--teal)', color: 'var(--teal)', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={() => {
                              setCancellingId(appt.id);
                              setShowReasonModal(true);
                            }}
                            className="btn-outline"
                            style={{ borderColor: '#EF4444', color: '#EF4444', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : !confirmed ? (
              <>
                {/* Step Indicator */}
                <div className="step-indicator" style={{ marginBottom: '0.5rem' }}>
                  {stepLabels.map((label, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                        <div className={`step-dot ${step === i + 1 ? 'active' : step > i + 1 ? 'completed' : 'inactive'}`}>
                          {step > i + 1 ? <i className="fas fa-check"></i> : i + 1}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', display: 'none' }}>{label}</span>
                      </div>
                      {i < stepLabels.length - 1 && <div className={`step-line ${step > i + 1 ? 'completed' : ''}`} style={{ margin: '0 4px' }}></div>}
                    </div>
                  ))}
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '-0.25rem', marginBottom: '0.75rem' }}>
                  Step {step} of {stepLabels.length}: <strong>{stepLabels[step - 1]}</strong>
                </p>

                {/* STEP 1 */}
                {step === 1 && (
                  <div>
                    <div className="form-group">
                      <label><i className="fas fa-hospital" style={{ marginRight: '0.35rem', color: 'var(--teal)' }}></i>Select Department</label>
                      <select value={dept} onChange={e => { setDept(e.target.value); setSelectedDoctor(undefined); }}>
                        <option value="">-- Choose Department --</option>
                        {departments.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    {dept && (
                      <div>
                        <label style={{ fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.75rem' }}>
                          <i className="fas fa-user-md" style={{ marginRight: '0.35rem', color: 'var(--teal)' }}></i>Select Doctor
                        </label>
                        {availableDoctors.length === 0 ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No doctors in this department currently.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                            {availableDoctors.map(doc => {
                              const inactive = doc.is_active === false;
                              return (
                              <div key={doc.id}
                                onClick={() => !inactive && setSelectedDoctor(doc)}
                                style={{
                                  border: `2px solid ${selectedDoctor?.id === doc.id ? 'var(--teal)' : inactive ? '#FCA5A5' : 'var(--border-color)'}`,
                                  borderRadius: '12px', padding: '0.875rem 1rem',
                                  cursor: inactive ? 'not-allowed' : 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                                  background: inactive ? 'rgba(239,68,68,0.04)' : selectedDoctor?.id === doc.id ? 'rgba(20,184,166,0.06)' : 'var(--bg-primary)',
                                  transition: 'all 0.2s', opacity: inactive ? 0.75 : 1,
                                }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: inactive ? '#9CA3AF' : 'linear-gradient(135deg, var(--navy), var(--teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                                  {doc.name.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600, color: inactive ? '#9CA3AF' : 'var(--text-primary)', fontSize: '0.85rem' }}>{doc.name.replace(/^(dr\.|dr)\s+/i, '') ? `Dr. ${doc.name.replace(/^(dr\.|dr)\s+/i, '')}` : doc.name}</div>
                                  <div style={{ fontSize: '0.8rem', color: inactive ? '#9CA3AF' : 'var(--teal)' }}>{doc.specialization} • {doc.experience}y exp</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.timings}</div>
                                  {inactive && (
                                    <div style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 700, marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                      <i className="fas fa-ban" />
                                      Currently inactive — not accepting appointments
                                    </div>
                                  )}
                                </div>
                                {selectedDoctor?.id === doc.id && <i className="fas fa-check-circle" style={{ color: 'var(--teal)', fontSize: '1.25rem' }}></i>}
                              </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                    <button className="btn-primary" onClick={() => setStep(2)} disabled={!selectedDoctor}
                      style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', opacity: !selectedDoctor ? 0.5 : 1 }}>
                      Next: Select Date & Time <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>
                    {selectedDoctor && (
                      <div style={{
                        padding: '0.6rem 0.875rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        marginBottom: '0.875rem'
                      }}>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', background: 'var(--navy)', flexShrink: 0 }}>
                            {selectedDoctor.photo ? (
                              <img src={selectedDoctor.photo} alt={selectedDoctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                                {selectedDoctor.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.05rem' }}>{selectedDoctor.name}</h4>
                            <p style={{ fontSize: '0.68rem', color: 'var(--teal)', fontWeight: 600 }}>{selectedDoctor.specialization}</p>
                          </div>
                          <button onClick={() => setSelectedDoctor(undefined)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div style={{ background: 'white', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.03)' }}>
                            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.05rem' }}>Available Days</p>
                            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedDoctor.available_days}</p>
                          </div>
                          <div style={{ background: 'white', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.03)' }}>
                            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.05rem' }}>Doctor Timings</p>
                            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedDoctor.timings}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Calendar + Slots side by side initially and always */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' }}>

                      {/* Calendar */}
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.4rem 0.75rem', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.4rem 0.75rem', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.3rem 0' }}>{d}</div>
                          ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`}></div>)}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const d = i + 1;
                            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                            const isPast = dateObj < today;
                            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const isSelected = selectedDate === dateStr;
                            const isToday = dateObj.toDateString() === new Date().toDateString();
                            return (
                              <div key={d} onClick={() => !isPast && handleDateSelect(d)}
                                className={`cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'disabled' : ''}`}
                                style={{ fontSize: '0.95rem', minHeight: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isPast ? 'not-allowed' : 'pointer' }}>
                                {d}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots Area */}
                      <div>
                        <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                          <i className="fas fa-clock" style={{ marginRight: '0.4rem', color: 'var(--teal)' }}></i>Available Time Slots
                        </label>

                        {!selectedDate ? (
                          <div style={{
                            background: 'var(--bg-secondary)', border: '1px dashed var(--border-color)',
                            borderRadius: '10px', height: '260px', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)'
                          }}>
                            <i className="fas fa-calendar-day" style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Please select a date to view available slots.</p>
                          </div>
                        ) : (
                          <>
                            {/* Floating Timer */}
                            {timeLeft !== null && (
                              <div style={{ 
                                position: 'fixed', top: '20px', left: '20px', background: '#EF4444', color: 'white', 
                                padding: '0.6rem 1.25rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, 
                                zIndex: 9999, boxShadow: '0 4px 15px rgba(239,68,68,0.4)', display: 'flex',
                                alignItems: 'center', gap: '0.6rem', animation: timeLeft <= 60 ? 'pulse 1s infinite' : 'none'
                              }}>
                                <i className="fas fa-stopwatch fa-spin" style={{ animationDuration: '2s' }}></i>
                                <span>Slot reserved: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
                              </div>
                            )}

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                              {loadingSlots ? (
                                <div style={{ padding: '1.5rem', textAlign: 'center', width: '100%', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i> Loading...
                                </div>
                              ) : doctorOnLeave ? (
                                <div style={{
                                  padding: '1.5rem', width: '100%', borderRadius: '10px',
                                  background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.25)',
                                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem'
                                }}>
                                  <i className="fas fa-calendar-times" style={{ color: '#EF4444', fontSize: '1.2rem', marginTop: '0.1rem', flexShrink: 0 }}></i>
                                  <div>
                                    <p style={{ fontWeight: 700, color: '#EF4444', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                                      Dr. {selectedDoctor?.name} is on leave today
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: '#EF4444' }}>
                                      Please select a different date.
                                    </p>
                                  </div>
                                </div>
                              ) : displaySlots.length === 0 ? (
                                <div style={{ padding: '1.5rem', textAlign: 'center', width: '100%', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                  No slots available for this date.
                                </div>
                              ) : (
                                displaySlots.map((slot: any) => {
                                  const isBooked = slot.status === 'booked';
                                  const isLocked = slot.status === 'locked' && !slot.is_mine;
                                  const isMine = slot.is_mine;
                                  const isPast = slot.status === 'past';
                                  const isDisabled = isBooked || isLocked || isPast;

                                  return (
                                    <button key={slot.time} disabled={isDisabled}
                                      className={`time-slot ${selectedSlot === slot.time ? 'selected' : ''} ${isDisabled ? 'unavailable' : ''} ${isMine ? 'mine' : ''}`}
                                      style={{
                                        position: 'relative',
                                        fontSize: '0.85rem',
                                        padding: '0.55rem 0.85rem',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        ...(isMine ? { border: '2px solid var(--gold)', background: 'rgba(200,169,81,0.1)', color: 'var(--navy)' } : {}),
                                        ...(isLocked ? { opacity: 0.6, background: '#fff3e0' } : {}),
                                        ...(isBooked ? { opacity: 0.6, background: '#ffebee' } : {})
                                      }}
                                      onClick={() => handleSlotSelection(slot.time, !isDisabled)}>
                                      {slot.time}
                                      {isMine && <div style={{ fontSize: '0.55rem', position: 'absolute', top: '-7px', right: '-3px', background: 'var(--gold)', color: 'white', padding: '1px 4px', borderRadius: '3px', fontWeight: 700 }}>MINE</div>}
                                      {isLocked && <div style={{ fontSize: '0.55rem', color: '#e67e22', fontWeight: 600 }}>Locked</div>}
                                      {isBooked && <div style={{ fontSize: '0.55rem', color: '#EF4444', fontWeight: 600 }}>Booked</div>}
                                      {isPast && <div style={{ fontSize: '0.55rem', color: '#95a5a6', fontWeight: 600 }}>Past</div>}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                      <button onClick={() => setStep(1)} style={{ flex: 1, padding: '0.6rem', border: '1.5px solid var(--border-color)', borderRadius: '50px', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
                        <i className="fas fa-arrow-left" style={{ marginRight: '0.35rem' }}></i>Back
                      </button>
                      <button className="btn-primary" onClick={() => setStep(3)} disabled={!selectedDate || !selectedSlot}
                        style={{ flex: 2, justifyContent: 'center', opacity: (!selectedDate || !selectedSlot) ? 0.5 : 1, fontSize: '0.82rem', padding: '0.6rem 1rem' }}>
                        Next: Patient Details <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div>
                    {/* Appointment summary bar - compact */}
                    <div style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '8px', padding: '0.4rem 0.75rem', marginBottom: '0.6rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <strong>Dr. {selectedDoctor?.name}</strong> — {selectedDate} at {selectedSlot}
                    </div>

                    {/* FOLLOW-UP ELIGIBILITY BANNER - compact */}
                    {selectedPatientId && selectedDoctor && (
                      checkingFollowup ? (
                        <div style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '8px', padding: '0.35rem 0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <i className="fas fa-spinner fa-spin" style={{ color: 'var(--teal)', fontSize: '0.75rem' }}></i>
                          <span style={{ fontSize: '0.72rem', color: 'var(--teal)' }}>Checking follow-up eligibility...</span>
                        </div>
                      ) : followupInfo?.has_previous_visit ? (
                        <div style={{
                          background: followupInfo.is_free_followup ? 'rgba(22,163,74,0.08)' : followupInfo.is_followup_eligible ? 'rgba(245,158,11,0.08)' : 'rgba(20,184,166,0.06)',
                          border: `1px solid ${followupInfo.is_free_followup ? 'rgba(22,163,74,0.3)' : followupInfo.is_followup_eligible ? 'rgba(245,158,11,0.3)' : 'rgba(20,184,166,0.2)'}`,
                          borderRadius: '8px', padding: '0.35rem 0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}>
                          <i className={`fas ${followupInfo.is_free_followup ? 'fa-gift' : followupInfo.is_followup_eligible ? 'fa-clock' : 'fa-history'}`}
                            style={{ color: followupInfo.is_free_followup ? '#16A34A' : followupInfo.is_followup_eligible ? '#F59E0B' : 'var(--teal)', fontSize: '0.8rem' }}></i>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: followupInfo.is_free_followup ? '#16A34A' : followupInfo.is_followup_eligible ? '#F59E0B' : 'var(--teal)' }}>
                            {followupInfo.is_free_followup ? `Free Follow-up · ${followupInfo.remaining_followups} remaining · No charge` :
                             followupInfo.is_followup_eligible ? `Follow-up ₹${followupInfo.followup_fee} · ${followupInfo.days_since_last}d ago` :
                             `Returning Patient — New Consultation`}
                          </span>
                        </div>
                      ) : null
                    )}

                    {/* Existing / New Patient banners - compact */}
                    {isPatientFound && selectedPatientData && (
                      <div style={{ background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: '8px', padding: '0.35rem 0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-user-check" style={{ color: '#16A34A', fontSize: '0.85rem' }}></i>
                        <span style={{ color: '#16A34A', fontSize: '0.72rem', fontWeight: 600 }}>Existing patient · ID: {selectedPatientData.id} · Auto-filled</span>
                        <button onClick={resetPatientVerification} style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(22,163,74,0.4)', color: '#16A34A', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', cursor: 'pointer' }}>Change</button>
                      </div>
                    )}
                    {isNewPatient && !isPatientFound && (
                      <div style={{ background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.25)', borderRadius: '8px', padding: '0.35rem 0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-user-plus" style={{ color: 'var(--teal)', fontSize: '0.85rem' }}></i>
                        <span style={{ color: 'var(--teal)', fontSize: '0.72rem', fontWeight: 600 }}>New patient — fill details below · ID will be created</span>
                      </div>
                    )}

                    {/* Patient Selection for Multiple Patients */}
                    {availablePatients.length > 1 && !selectedPatientData && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginBottom: '0.35rem' }}>
                          <i className="fas fa-users" style={{ marginRight: '0.35rem', color: 'var(--teal)' }}></i>Select Your Profile
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {availablePatients.map((patient) => (
                            <div key={patient.id} onClick={() => handleSelectPatient(patient)}
                              style={{ border: '1.5px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', background: 'var(--bg-primary)', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.background = 'rgba(20,184,166,0.04)'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
                            >
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.78rem' }}>{patient.full_name}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Age: {patient.age} · {patient.gender} · ID: {patient.id}</div>
                              </div>
                              <i className="fas fa-chevron-right" style={{ color: 'var(--teal)', fontSize: '0.75rem' }}></i>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── All fields in a compact 3-col grid ── */}
                    <style>{`
                      .compact-form .form-group { margin-bottom: 0.5rem; }
                      .compact-form .form-group label { font-size: 0.85rem; font-weight: 700; color: var(--navy); margin-bottom: 0.25rem; letter-spacing: 0.02em; }
                      .compact-form .form-group input,
                      .compact-form .form-group select,
                      .compact-form .form-group textarea { padding: 0.5rem 0.75rem; font-size: 0.95rem; border-radius: 8px; color: var(--text-primary); font-weight: 500; }
                      .compact-form .form-group input::placeholder,
                      .compact-form .form-group textarea::placeholder { color: #64748B; opacity: 1; }
                      .compact-form .form-group textarea { resize: none; }
                    `}</style>

                    <div className="compact-form">
                      {/* Row 1: Name (full width) */}
                      <div className="form-group">
                        <label><i className="fas fa-user" style={{ marginRight: '0.3rem', color: 'var(--teal)' }}></i>Patient Name *</label>
                        <input value={name} onChange={e => { setName(e.target.value); if (isPatientFound || selectedPatientId || patientFoundRef.current) resetPatientVerification(); }} placeholder="Enter full name" disabled={isPatientFound} />
                      </div>

                      {/* Row 2: Phone | DOB */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div className="form-group">
                          <label><i className="fas fa-phone" style={{ marginRight: '0.3rem', color: 'var(--teal)' }}></i>Phone *</label>
                          <div style={{ position: 'relative' }}>
                            <input value={phone} onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 10); setPhone(v); if (isPatientFound || selectedPatientId || patientFoundRef.current) resetPatientVerification(); }}
                              placeholder="10-digit mobile" type="tel" maxLength={10} disabled={otpVerified}
                              style={{ borderColor: phone.length > 0 && phone.length !== 10 ? '#EF4444' : undefined, paddingRight: phone.length === 10 && !otpVerified ? '56px' : undefined }} />
                            {phone.length === 10 && !otpVerified && (
                              <button type="button" onClick={handleRequestOTP} disabled={verifyingOTP}
                                style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'var(--teal)', color: 'white', border: 'none', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.62rem', cursor: 'pointer', fontWeight: 600 }}>
                                {verifyingOTP ? <i className="fas fa-spinner fa-spin"></i> : 'Verify'}
                              </button>
                            )}
                          </div>
                          {phone.length > 0 && phone.length !== 10 && <div style={{ fontSize: '0.62rem', color: '#EF4444', marginTop: '0.1rem' }}>{phone.length}/10 digits</div>}
                          {otpVerified && <div style={{ fontSize: '0.62rem', color: '#16A34A', marginTop: '0.1rem' }}><i className="fas fa-check-circle"></i> Verified</div>}
                        </div>
                        <div className="form-group">
                          <label><i className="fas fa-calendar-alt" style={{ marginRight: '0.3rem', color: 'var(--teal)' }}></i>Date of Birth</label>
                          <input value={dob} onChange={e => {
                            const dobValue = e.target.value; setDob(dobValue);
                            if (dobValue) {
                              const birthDate = new Date(dobValue); const todayD = new Date();
                              let calcAge = todayD.getFullYear() - birthDate.getFullYear();
                              const md = todayD.getMonth() - birthDate.getMonth();
                              if (md < 0 || (md === 0 && todayD.getDate() < birthDate.getDate())) calcAge--;
                              if (calcAge >= 0 && calcAge <= 150) { setAge(calcAge.toString()); setAgeAutoCalculated(true); }
                            } else { if (ageAutoCalculated) { setAge(''); setAgeAutoCalculated(false); } }
                            if (isPatientFound || selectedPatientId || patientFoundRef.current) { setSelectedPatientId(null); setIsPatientFound(false); patientFoundRef.current = false; }
                          }} type="date" />
                        </div>
                      </div>

                      {/* Row 3: Age | Gender | Visit Type */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <div className="form-group">
                          <label>
                            <i className="fas fa-birthday-cake" style={{ marginRight: '0.3rem', color: 'var(--teal)' }}></i>Age *
                            {ageAutoCalculated && <span style={{ fontSize: '0.6rem', color: '#16A34A', marginLeft: '0.3rem' }}>✓ Auto</span>}
                          </label>
                          <input value={age} onChange={e => { setAge(e.target.value); setAgeAutoCalculated(false); if (isPatientFound || selectedPatientId || patientFoundRef.current) { setSelectedPatientId(null); setIsPatientFound(false); patientFoundRef.current = false; } }}
                            placeholder="Years" type="number" min="0" max="150"
                            style={{ borderColor: ageAutoCalculated ? '#16A34A' : undefined, background: ageAutoCalculated ? 'rgba(22,163,74,0.05)' : undefined }} />
                        </div>
                        <div className="form-group">
                          <label><i className="fas fa-venus-mars" style={{ marginRight: '0.3rem', color: 'var(--teal)' }}></i>Gender</label>
                          <select value={gender} onChange={e => { setGender(e.target.value); if (isPatientFound || selectedPatientId || patientFoundRef.current) { setSelectedPatientId(null); setIsPatientFound(false); patientFoundRef.current = false; } }}>
                            <option value="">-- Select --</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label><i className="fas fa-stethoscope" style={{ marginRight: '0.3rem', color: 'var(--teal)' }}></i>Visit Type</label>
                          <div style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: `1.5px solid ${visitType === 'follow_up' ? 'rgba(22,163,74,0.4)' : 'rgba(20,184,166,0.3)'}`, background: visitType === 'follow_up' ? 'rgba(22,163,74,0.06)' : 'rgba(20,184,166,0.04)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 600, color: visitType === 'follow_up' ? '#16A34A' : 'var(--teal)' }}>
                            <i className={`fas ${visitType === 'follow_up' ? 'fa-redo' : 'fa-stethoscope'}`} style={{ fontSize: '0.7rem' }}></i>
                            {visitType === 'follow_up' ? 'Follow-up' : 'Consultation'}
                            {checkingFollowup && <i className="fas fa-spinner fa-spin" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}></i>}
                            {!checkingFollowup && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 400, opacity: 0.7 }}>{selectedPatientId ? 'Auto' : 'Select patient'}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Address */}
                      <div className="form-group">
                        <label><i className="fas fa-map-marker-alt" style={{ marginRight: '0.3rem', color: 'var(--teal)' }}></i>Address</label>
                        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Full Address" />
                      </div>

                      {/* Row 5: Symptoms textarea */}
                      <div className="form-group">
                        <label><i className="fas fa-sticky-note" style={{ marginRight: '0.3rem', color: 'var(--teal)' }}></i>Reason / Symptoms (optional)</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your health concern briefly..." rows={1} style={{ minHeight: '40px' }}></textarea>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem' }}>
                      <button onClick={() => setStep(2)} style={{ flex: 1, padding: '0.55rem', border: '1.5px solid var(--border-color)', borderRadius: '50px', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>
                        <i className="fas fa-arrow-left" style={{ marginRight: '0.35rem' }}></i>Back
                      </button>
                      <button className="btn-primary"
                        onClick={isRescheduling ? handleReschedule : handleSubmit}
                        disabled={submitting || !name || !phone || !age}
                        style={{ flex: 2, justifyContent: 'center', opacity: (submitting || !name || !phone || !age) ? 0.5 : 1, fontSize: '0.8rem', padding: '0.55rem 1rem' }}>
                        {submitting ? (
                          <><i className="fas fa-spinner fa-spin"></i> {isRescheduling ? 'Rescheduling...' : 'Booking...'}</>
                        ) : (
                          <><i className="fas fa-check-circle"></i> {isRescheduling ? 'Confirm Reschedule' : 'Confirm Appointment'}</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* CONFIRMATION VIEW - Now shown as a floating modal */
              <div className="modal-ov show" style={{ zIndex: 9999 }}>
                <div className="modal-box">
                  <div className="modal-ico">🎉</div>
                  <h3>
                    {isRescheduling ? 'Appointment Rescheduled!' : 'Appointment Confirmed!'}
                  </h3>
                  <p>
                    {isRescheduling 
                      ? 'Your appointment has been successfully updated.' 
                      : `Your appointment has been booked at Haveda Hospital. A confirmation will be sent to ${phone}. Please arrive 15 minutes early.`}
                  </p>
                  {!isRescheduling && (
                    <div className="modal-id">
                      Appointment ID: {refNumber}
                    </div>
                  )}
                  <button className="btn-primary" onClick={resetForm} style={{ width: '100%', justifyContent: 'center' }}>
                    Got it
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '20px', maxWidth: '400px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white', fontSize: '1.5rem' }}>
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--navy)' }}>Verify Your Phone</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                We've sent a 6-digit OTP to {maskedPhone}
              </p>
            </div>
            
            <div className="form-group">
              <label>Enter OTP</label>
              <input 
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                type="text"
                maxLength={6}
                style={{ 
                  textAlign: 'center', 
                  fontSize: '1.2rem', 
                  letterSpacing: '0.5rem',
                  fontWeight: 600
                }}
                autoFocus
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                onClick={() => {
                  setShowOTPVerification(false);
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleVerifyOTP}
                disabled={verifyingOTP || otpCode.length !== 6}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', opacity: (verifyingOTP || otpCode.length !== 6) ? 0.5 : 1 }}
              >
                {verifyingOTP ? (
                  <><i className="fas fa-spinner fa-spin"></i> Verifying...</>
                ) : (
                  <><i className="fas fa-check"></i> Verify</>
                )}
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={handleRequestOTP}
                disabled={verifyingOTP}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--teal)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Reason Modal */}
      {showReasonModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '20px', maxWidth: '400px', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--navy)' }}>Reason for Cancellation</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Please tell us why you are cancelling your appointment.</p>
            <textarea 
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Enter reason..."
              rows={4}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => {
                  setShowReasonModal(false);
                  setCancellingId(null);
                  setCancelReason('');
                }}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Go Back
              </button>
              <button 
                onClick={handleCancelSubmit}
                disabled={submitting || !cancelReason}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', background: '#EF4444', borderColor: '#EF4444' }}
              >
                {submitting ? 'Cancelling...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

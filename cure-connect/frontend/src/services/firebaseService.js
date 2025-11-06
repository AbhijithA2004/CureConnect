// Firebase service functions for Cure Connect
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Authentication functions
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Doctors functions
export const getDoctors = async () => {
  try {
    const doctorsRef = collection(db, 'doctors');
    const q = query(doctorsRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const doctors = [];
    querySnapshot.forEach((doc) => {
      doctors.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: doctors };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addDoctor = async (doctorData) => {
  try {
    const docRef = await addDoc(collection(db, 'doctors'), doctorData);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Appointments functions
export const getAppointments = async (userId) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    // First get all appointments for the user, then sort in memory
    const q = query(appointmentsRef, where('patientId', '==', userId));
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    // Sort by date in memory
    appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
    return { success: true, data: appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const bookAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getAllAppointments = async () => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, orderBy('date'));
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

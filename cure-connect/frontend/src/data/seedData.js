// Seed data for Firebase - run this once to populate your database
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

export const clearDoctors = async () => {
  try {
    const doctorsRef = collection(db, 'doctors');
    const snapshot = await getDocs(doctorsRef);

    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log(`Cleared ${snapshot.docs.length} existing doctors`);
    return { success: true, cleared: snapshot.docs.length };
  } catch (error) {
    console.error('Error clearing doctors:', error);
    return { success: false, error: error.message };
  }
};

export const seedDoctors = async () => {
  const doctors = [
    {
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiology',
      experience: 10,
      email: 'rajesh.kumar@cureconnect.com'
    },
    {
      name: 'Dr. Priya Sharma',
      specialty: 'Dermatology',
      experience: 8,
      email: 'priya.sharma@cureconnect.com'
    },
    {
      name: 'Dr. Amit Patel',
      specialty: 'Orthopedics',
      experience: 12,
      email: 'amit.patel@cureconnect.com'
    },
    {
      name: 'Dr. Meera Singh',
      specialty: 'Pediatrics',
      experience: 6,
      email: 'meera.singh@cureconnect.com'
    },
    {
      name: 'Dr. Vikram Gupta',
      specialty: 'Neurology',
      experience: 15,
      email: 'vikram.gupta@cureconnect.com'
    },
    {
      name: 'Dr. Anjali Verma',
      specialty: 'Gynecology',
      experience: 9,
      email: 'anjali.verma@cureconnect.com'
    }
  ];

  try {
    // Check if we already have the correct doctors (by name)
    const doctorsRef = collection(db, 'doctors');
    const existingSnapshot = await getDocs(doctorsRef);

    // Check if we have exactly 6 doctors with the correct names
    const existingNames = existingSnapshot.docs.map(doc => doc.data().name);
    const expectedNames = doctors.map(doc => doc.name);

    const hasCorrectDoctors = expectedNames.every(name => existingNames.includes(name)) &&
                             existingNames.length === 6;

    if (hasCorrectDoctors) {
      console.log('Correct doctors already exist. No seeding needed.');
      return { success: true, message: 'Doctors already correctly seeded' };
    }

    // Clear existing doctors and seed fresh ones
    await clearDoctors();

    // Seed fresh doctors
    for (const doctor of doctors) {
      await addDoc(collection(db, 'doctors'), doctor);
    }
    console.log('Doctors seeded successfully! (6 unique doctors)');
    return { success: true, message: 'Doctors seeded successfully', count: doctors.length };
  } catch (error) {
    console.error('Error seeding doctors:', error);
    return { success: false, error: error.message };
  }
};

// Call this function once after setting up Firebase
// seedDoctors();

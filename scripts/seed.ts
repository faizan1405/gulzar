import { PrismaClient, Role, AccountStatus, VerificationStatus, ProfileCompletionStatus, PackageType, PaymentStatus, ApprovalStatus } from '@prisma/client';
import { DEFAULT_MASLAKS, DEFAULT_FIQHS, DEFAULT_CASTES, DEFAULT_LOCATIONS } from '../src/lib/masterData';

const prisma = new PrismaClient();


const profilesToSeed = [
  {
    email: 'demo_sarah_khan@shadimubarak.demo',
    name: 'Demo: Dr. Sarah Khan',
    gender: 'Female',
    dob: new Date(1999, 4, 12),
    maritalStatus: 'Single',
    phone: '+919999900001',
    city: 'Mumbai',
    locality: 'Bandra West',
    state: 'Maharashtra',
    education: 'MD, MBBS',
    occupation: 'Pediatrician',
    income: '₹10 LPA - ₹15 LPA',
    family: 'Father is a retired professor. Mother is a homemaker. One younger brother.',
    bio: 'Pious and family-oriented pediatrician looking for a partner who values both religious and professional growth.',
    theme: 'hsl(345, 65%, 28%)', // Royal Crimson
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: true,
    packageType: 'HIGH_PROFILE',
    packagePrice: 21000,
    regDate: new Date('2026-04-10'),
  },
  {
    email: 'demo_aisha_rahman@shadimubarak.demo',
    name: 'Demo: Aisha Rahman',
    gender: 'Female',
    dob: new Date(1995, 8, 20),
    maritalStatus: 'Divorced',
    phone: '+919999900002',
    city: 'Bengaluru',
    locality: 'Indiranagar',
    state: 'Karnataka',
    education: 'M.Tech Computer Science',
    occupation: 'Software Engineer',
    income: '₹15 LPA - ₹25 LPA',
    family: 'Father is an engineer, mother is a teacher. Two sisters, both married.',
    bio: 'Simple, practicing Muslimah. Focuses on daily prayers and family values. Looking for a partner who is clean-hearted and responsible.',
    theme: 'hsl(150, 45%, 18%)', // Emerald
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: true,
    packageType: 'STANDARD',
    packagePrice: 300,
    regDate: new Date('2026-05-15'),
  },
  {
    email: 'demo_adnan_siddiqui@shadimubarak.demo',
    name: 'Demo: Adnan Siddiqui',
    gender: 'Male',
    dob: new Date(1997, 2, 5),
    maritalStatus: 'Single',
    phone: '+919999900003',
    city: 'Delhi',
    locality: 'Karol Bagh',
    state: 'Delhi',
    education: 'MBA',
    occupation: 'Business Owner (Exports)',
    income: 'Above ₹25 LPA',
    family: 'Well-established business family in Delhi. 1 elder brother, 1 younger sister.',
    bio: 'Ambitious yet down-to-earth. I enjoy traveling, studying history, and community service. Looking for a partner with strong moral character.',
    theme: 'hsl(42, 58%, 53%)', // Gold
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: true,
    packageType: 'CURATED',
    packagePrice: 5500,
    regDate: new Date('2026-05-20'),
  },
  {
    email: 'demo_zainab_ahmed@shadimubarak.demo',
    name: 'Demo: Zainab Ahmed',
    gender: 'Female',
    dob: new Date(2002, 1, 14),
    maritalStatus: 'Single',
    phone: '+919999900004',
    city: 'Noida',
    locality: 'Sector 62',
    state: 'Uttar Pradesh',
    education: 'B.A. English literature',
    occupation: 'Content Writer',
    income: '₹3 LPA - ₹5 LPA',
    family: 'Parents are retired government employees. 1 sister, married.',
    bio: 'Avid reader, writer, and tea lover. I balance modern life with traditional values. Seeking a supportive life partner.',
    theme: 'hsl(200, 45%, 18%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-01'),
  },
  {
    email: 'demo_faisal_qureshi@shadimubarak.demo',
    name: 'Demo: Faisal Qureshi',
    gender: 'Male',
    dob: new Date(1994, 6, 25),
    maritalStatus: 'Single',
    phone: '+919999900005',
    city: 'Lucknow',
    locality: 'Hazratganj',
    state: 'Uttar Pradesh',
    education: 'MCA',
    occupation: 'IT Consultant',
    income: '₹10 LPA - ₹15 LPA',
    family: 'Father runs a pharmaceutical business. Mother is a housewife. 1 sister.',
    bio: 'Family-oriented, calm, and practicing Muslim. I love exploring architecture and playing football. Seeking an educated girl with a warm heart.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: true,
    packageType: 'STANDARD',
    packagePrice: 300,
    regDate: new Date('2026-06-05'),
  },
  {
    email: 'demo_yasmin_alvi@shadimubarak.demo',
    name: 'Demo: Yasmin Alvi',
    gender: 'Female',
    dob: new Date(1998, 11, 3),
    maritalStatus: 'Single',
    phone: '+919999900006',
    city: 'Aligarh',
    locality: 'Civil Lines',
    state: 'Uttar Pradesh',
    education: 'M.Sc Chemistry',
    occupation: 'Lecturer',
    income: '₹5 LPA - ₹10 LPA',
    family: 'Father is an AMU professor. Mother is a housewife. 2 brothers.',
    bio: 'Passionate educator, love science and gardening. Strive to maintain a balance of Deen and Dunya. Looking for a partner who is respectful and educated.',
    theme: 'hsl(345, 65%, 28%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-07'),
  },
  {
    email: 'demo_farhan_syed@shadimubarak.demo',
    name: 'Demo: Farhan Syed',
    gender: 'Male',
    dob: new Date(1991, 3, 10),
    maritalStatus: 'Divorced',
    phone: '+919999900007',
    city: 'Mumbai',
    locality: 'Andheri West',
    state: 'Maharashtra',
    education: 'B.Tech Mechanical',
    occupation: 'Tech Lead',
    income: '₹15 LPA - ₹25 LPA',
    family: 'Father is a retired banking officer. Mother is a homemaker. No siblings.',
    bio: 'Tech professional. Seeking a second chance at marriage. Believes in mutual respect and clear communication. Looking for an understanding partner.',
    theme: 'hsl(42, 58%, 53%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: true,
    packageType: 'SECOND_MARRIAGE',
    packagePrice: 11000,
    regDate: new Date('2026-04-20'),
  },
  {
    email: 'demo_mariam_fatimah@shadimubarak.demo',
    name: 'Demo: Mariam Fatimah',
    gender: 'Female',
    dob: new Date(1992, 5, 18),
    maritalStatus: 'Widowed',
    phone: '+919999900008',
    city: 'Jaipur',
    locality: 'C-Scheme',
    state: 'Rajasthan',
    education: 'M.Com',
    occupation: 'Accountant',
    income: '₹5 LPA - ₹10 LPA',
    family: 'Father is a businessman. Mother is a teacher. 1 younger brother.',
    bio: 'Pious, independent widow. Mother of a 4-year-old daughter. Looking for a compassionate partner who can be a loving husband and a guide for my child.',
    theme: 'hsl(345, 65%, 28%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: true,
    packageType: 'STANDARD',
    packagePrice: 300,
    regDate: new Date('2026-05-01'),
  },
  {
    email: 'demo_sameer_deshmukh@shadimubarak.demo',
    name: 'Demo: Sameer Deshmukh',
    gender: 'Male',
    dob: new Date(1998, 7, 22),
    maritalStatus: 'Single',
    phone: '+919999900009',
    city: 'Bhopal',
    locality: 'Arera Colony',
    state: 'Madhya Pradesh',
    education: 'B.E. Civil',
    occupation: 'Civil Servant',
    income: '₹5 LPA - ₹10 LPA',
    family: 'Father is a state government employee, mother is a teacher. 1 sister.',
    bio: 'Sincere, disciplined, and family-oriented government servant. Interested in public service and reading. Looking for an educated girl with standard values.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-08'),
  },
  {
    email: 'demo_tarannum_jehan@shadimubarak.demo',
    name: 'Demo: Tarannum Jehan',
    gender: 'Female',
    dob: new Date(2000, 9, 29),
    maritalStatus: 'Single',
    phone: '+919999900010',
    city: 'Ghaziabad',
    locality: 'Indirapuram',
    state: 'Uttar Pradesh',
    education: 'B.Ed, B.Sc',
    occupation: 'School Teacher',
    income: '₹3 LPA - ₹5 LPA',
    family: 'Father is an accountant. Mother is a homemaker. 2 younger sisters.',
    bio: 'Warm, energetic teacher who loves kids, crafts, and baking. Seeking a gentle and responsible life partner who values education and simple living.',
    theme: 'hsl(200, 45%, 18%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-09'),
  },
  {
    email: 'demo_raza_murad@shadimubarak.demo',
    name: 'Demo: Raza Murad',
    gender: 'Male',
    dob: new Date(2001, 1, 5),
    maritalStatus: 'Single',
    phone: '+919999900011',
    city: 'Noida',
    locality: 'Sector 15',
    state: 'Uttar Pradesh',
    education: 'B.Tech IT',
    occupation: 'QA Engineer',
    income: '₹5 LPA - ₹10 LPA',
    family: 'Father runs an electrical store. Mother is a housewife. 1 brother.',
    bio: 'Tech QA engineer, love gaming and fitness. Looking for a partner who is cheerful, supportive, and shares a positive outlook on life.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-10'),
  },
  {
    email: 'demo_shabana_bano@shadimubarak.demo',
    name: 'Demo: Shabana Bano',
    gender: 'Female',
    dob: new Date(1986, 2, 14),
    maritalStatus: 'Divorced',
    phone: '+919999900012',
    city: 'Lucknow',
    locality: 'Aliganj',
    state: 'Uttar Pradesh',
    education: 'B.A. Urdu',
    occupation: 'Homemaker',
    income: 'Under ₹3 LPA',
    family: 'Father is retired. Mother is a homemaker. 3 brothers, all married.',
    bio: 'Caring and soft-spoken homemaker. Seeking a stable second marriage. Mother of a 10-year-old son. Values family respect above all.',
    theme: 'hsl(345, 65%, 28%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-05-10'),
  },
  {
    email: 'demo_imran_malik@shadimubarak.demo',
    name: 'Demo: Imran Malik',
    gender: 'Male',
    dob: new Date(1984, 8, 30),
    maritalStatus: 'Widowed',
    phone: '+919999900013',
    city: 'Ghaziabad',
    locality: 'Raj Nagar',
    state: 'Uttar Pradesh',
    education: 'B.Sc Chemistry',
    occupation: 'Shop Owner',
    income: '₹5 LPA - ₹10 LPA',
    family: 'Established business family in Ghaziabad. 2 kids (12 and 8).',
    bio: 'Widower seeking a kind, nurturing partner to rebuild a warm home. I run a retail business. Believes in values, piety, and mutual support.',
    theme: 'hsl(42, 58%, 53%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-05-12'),
  },
  {
    email: 'demo_uzma_sheikh@shadimubarak.demo',
    name: 'Demo: Uzma Sheikh',
    gender: 'Female',
    dob: new Date(2004, 6, 17),
    maritalStatus: 'Single',
    phone: '+919999900014',
    city: 'Aligarh',
    locality: 'Zohra Bagh',
    state: 'Uttar Pradesh',
    education: 'B.Sc Final Year',
    occupation: 'Student',
    income: 'Under ₹3 LPA',
    family: 'Father is a lawyer in Aligarh court. Mother is a housewife. 1 brother.',
    bio: 'Pious, family-focused college student. Seeking a partner who will support my higher education and shares sound Islamic values.',
    theme: 'hsl(200, 45%, 18%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-11'),
  },
  {
    email: 'demo_arshad_warsi@shadimubarak.demo',
    name: 'Demo: Arshad Warsi',
    gender: 'Male',
    dob: new Date(1999, 10, 25),
    maritalStatus: 'Single',
    phone: '+919999900015',
    city: 'Jaipur',
    locality: 'Johri Bazar',
    state: 'Rajasthan',
    education: 'B.Arch',
    occupation: 'Architect',
    income: '₹5 LPA - ₹10 LPA',
    family: 'Father is an artisan, mother is a homemaker. 2 brothers.',
    bio: 'Creative, hard-working architect. I enjoy design, coffee, and traveling. Seeking an educated girl who is kind, understanding, and practicing.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'APPROVED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-12'),
  },
  // PENDING VERIFICATION
  {
    email: 'demo_bilal_chishti@shadimubarak.demo',
    name: 'Demo: Bilal Chishti',
    gender: 'Male',
    dob: new Date(2000, 5, 12),
    maritalStatus: 'Single',
    phone: '+919999900016',
    city: 'Delhi',
    locality: 'Okhla',
    state: 'Delhi',
    education: 'M.Tech',
    occupation: 'Research Scholar',
    income: '₹5 LPA - ₹10 LPA',
    family: 'Noble family from Okhla. Father is retired. Mother is a housewife.',
    bio: 'Academic researcher, quiet and thoughtful. Deeply value honesty and prayers. Looking for an educated partner who values simple living.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'PENDING',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-13'),
  },
  {
    email: 'demo_sana_ansari@shadimubarak.demo',
    name: 'Demo: Sana Ansari',
    gender: 'Female',
    dob: new Date(2001, 2, 28),
    maritalStatus: 'Single',
    phone: '+919999900017',
    city: 'Ghaziabad',
    locality: 'Vasundhara',
    state: 'Uttar Pradesh',
    education: 'B.Tech Design',
    occupation: 'Web Designer',
    income: '₹3 LPA - ₹5 LPA',
    family: 'Father has a manufacturing business. Mother is a housewife. 1 sister.',
    bio: 'Creative web designer who loves art, cooking, and reading. Looking for a partner who is respectful, practicing, and well-educated.',
    theme: 'hsl(345, 65%, 28%)',
    verification: 'PENDING',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-13'),
  },
  {
    email: 'demo_javed_jaffrey@shadimubarak.demo',
    name: 'Demo: Javed Jaffrey',
    gender: 'Male',
    dob: new Date(1995, 0, 15),
    maritalStatus: 'Divorced',
    phone: '+919999900018',
    city: 'Mumbai',
    locality: 'Colaba',
    state: 'Maharashtra',
    education: 'MBA Marketing',
    occupation: 'Marketing Manager',
    income: '₹10 LPA - ₹15 LPA',
    family: 'Father is a retired merchant navy captain. Mother is a homemaker. 1 brother.',
    bio: 'Seeking a second marriage. Modern outlook but grounded in values. Loves travel, fitness, and reading. Seeking an understanding life partner.',
    theme: 'hsl(42, 58%, 53%)',
    verification: 'PENDING',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-13'),
  },
  {
    email: 'demo_nida_fatma@shadimubarak.demo',
    name: 'Demo: Nida Fatma',
    gender: 'Female',
    dob: new Date(1997, 8, 9),
    maritalStatus: 'Single',
    phone: '+919999900019',
    city: 'Hyderabad',
    locality: 'Jubilee Hills',
    state: 'Telangana',
    education: 'MBBS',
    occupation: 'Resident Doctor',
    income: '₹10 LPA - ₹15 LPA',
    family: 'Father is an orthopedic surgeon. Mother is a gynecologist. 1 brother (engineer).',
    bio: 'Doctor currently doing PG residency. Balanced, career-oriented, yet values simple family life. Looking for a highly educated partner (Doctor/Engineer/MBA).',
    theme: 'hsl(345, 65%, 28%)',
    verification: 'PENDING',
    completion: 'COMPLETE',
    hasPaid: true,
    packageType: 'HIGH_PROFILE',
    packagePrice: 21000,
    regDate: new Date('2026-06-13'),
  },
  {
    email: 'demo_zafar_iqbal@shadimubarak.demo',
    name: 'Demo: Zafar Iqbal',
    gender: 'Male',
    dob: new Date(1992, 10, 5),
    maritalStatus: 'Single',
    phone: '+919999900020',
    city: 'Aligarh',
    locality: 'Medical Colony',
    state: 'Uttar Pradesh',
    education: 'Ph.D English',
    occupation: 'Assistant Professor',
    income: '₹10 LPA - ₹15 LPA',
    family: 'Father is retired, mother is a teacher. 1 sister, married.',
    bio: 'Professor who loves literature, writing, and traveling. Pious, quiet, and family-oriented. Looking for a simple, educated partner.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'PENDING',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-13'),
  },
  // INCOMPLETE PROFILES (completion: INCOMPLETE)
  {
    email: 'demo_kamran_khan@shadimubarak.demo',
    name: 'Demo: Kamran Khan',
    gender: 'Male',
    dob: new Date(2003, 11, 1),
    maritalStatus: 'Single',
    phone: '+919999900021',
    city: 'Bhopal',
    locality: 'Shahpura',
    state: 'Madhya Pradesh',
    education: 'B.Com',
    occupation: 'Student',
    income: 'Under ₹3 LPA',
    family: 'Details to be updated.',
    bio: 'Student. Just registered.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'PENDING',
    completion: 'INCOMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-13'),
  },
  {
    email: 'demo_rehana_parveen@shadimubarak.demo',
    name: 'Demo: Rehana Parveen',
    gender: 'Female',
    dob: new Date(1998, 3, 20),
    maritalStatus: 'Single',
    phone: '+919999900022',
    city: 'Delhi',
    locality: 'Zakir Nagar',
    state: 'Delhi',
    education: 'B.A. Pass',
    occupation: 'Homemaker',
    income: 'Under ₹3 LPA',
    family: 'Simple family.',
    bio: 'Simple biodata profile.',
    theme: 'hsl(200, 45%, 18%)',
    verification: 'PENDING',
    completion: 'INCOMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-13'),
  },
  {
    email: 'demo_salman_baig@shadimubarak.demo',
    name: 'Demo: Salman Baig',
    gender: 'Male',
    dob: new Date(1990, 1, 15),
    maritalStatus: 'Single',
    phone: '+919999900023',
    city: 'Lucknow',
    locality: 'Aminabad',
    state: 'Uttar Pradesh',
    education: 'High School',
    occupation: 'Self Employed',
    income: 'Under ₹3 LPA',
    family: 'Family lives in Lucknow.',
    bio: 'Looking for marriage partner.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'PENDING',
    completion: 'INCOMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-13'),
  },
  // REJECTED PROFILES
  {
    email: 'demo_gauhar_khan@shadimubarak.demo',
    name: 'Demo: Gauhar Khan',
    gender: 'Female',
    dob: new Date(1999, 5, 23),
    maritalStatus: 'Single',
    phone: '+919999900024',
    city: 'Mumbai',
    locality: 'Juhu',
    state: 'Maharashtra',
    education: 'BBA',
    occupation: 'Model',
    income: '₹8 LPA - ₹12 LPA',
    family: 'Mother is a designer. Father is in imports.',
    bio: 'Model. Looking for modern Muslim match.',
    theme: 'hsl(345, 65%, 28%)',
    verification: 'REJECTED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-05-30'),
  },
  {
    email: 'demo_waseem_akram@shadimubarak.demo',
    name: 'Demo: Waseem Akram',
    gender: 'Male',
    dob: new Date(1996, 6, 12),
    maritalStatus: 'Single',
    phone: '+919999900025',
    city: 'Hyderabad',
    locality: 'Secunderabad',
    state: 'Telangana',
    education: 'High School',
    occupation: 'Driver',
    income: 'Under ₹3 LPA',
    family: 'Father is retired.',
    bio: 'Driver looking for bride.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'REJECTED',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-01'),
  },
  // NEEDS_FOLLOW_UP PROFILES
  {
    email: 'demo_hina_shaheen@shadimubarak.demo',
    name: 'Demo: Hina Shaheen',
    gender: 'Female',
    dob: new Date(1995, 10, 15),
    maritalStatus: 'Divorced',
    phone: '+919999900026',
    city: 'Bhopal',
    locality: 'Jahangirabad',
    state: 'Madhya Pradesh',
    education: 'M.A. Literature',
    occupation: 'Writer',
    income: '₹3 LPA - ₹5 LPA',
    family: 'Father is a retired clerk. Mother is a housewife. 1 sister.',
    bio: 'Writer. Looking for a partner who supports my passion for literature and writing.',
    theme: 'hsl(345, 65%, 28%)',
    verification: 'NEEDS_FOLLOW_UP',
    completion: 'COMPLETE',
    hasPaid: false,
    regDate: new Date('2026-06-12'),
  },
  {
    email: 'demo_mansoor_ali@shadimubarak.demo',
    name: 'Demo: Mansoor Ali',
    gender: 'Male',
    dob: new Date(1997, 8, 20),
    maritalStatus: 'Single',
    phone: '+919999900027',
    city: 'Bengaluru',
    locality: 'Whitefield',
    state: 'Karnataka',
    education: 'M.S. Data Science',
    occupation: 'Data Scientist',
    income: '₹15 LPA - ₹25 LPA',
    family: 'Father is retired, mother is a teacher. 1 brother.',
    bio: 'Data scientist. Modern practitioner of Islamic values. Looking for a partner who is educated, positive, and shares similar values.',
    theme: 'hsl(150, 45%, 18%)',
    verification: 'NEEDS_FOLLOW_UP',
    completion: 'COMPLETE',
    hasPaid: true,
    packageType: 'STANDARD',
    packagePrice: 300,
    regDate: new Date('2026-06-12'),
  },
];

async function main() {
  console.log('Starting demo profiles database seeding...');
  let insertedCount = 0;
  let skippedCount = 0;

  try {
    // 0. Seed Master Data Options if empty
    console.log('Seeding Master Data options if empty...');
    const mCount = await prisma.maslakOption.count();
    if (mCount === 0) {
      await prisma.maslakOption.createMany({
        data: DEFAULT_MASLAKS.map(m => ({ label: m.label, aliases: m.aliases, isDisabled: false }))
      });
      console.log('Seeded Maslak options to DB.');
    }
    const cCount = await prisma.casteOption.count();
    if (cCount === 0) {
      await prisma.casteOption.createMany({
        data: DEFAULT_CASTES.map(c => ({ label: c.label, aliases: c.aliases, isDisabled: false }))
      });
      console.log('Seeded Caste options to DB.');
    }
    const lCount = await prisma.locationOption.count();
    if (lCount === 0) {
      await prisma.locationOption.createMany({
        data: DEFAULT_LOCATIONS.map(l => ({
          state: l.state,
          district: l.district,
          locality: l.locality || null,
          isHighPriority: l.isHighPriority || false,
          isDisabled: false
        }))
      });
      console.log('Seeded Location options to DB.');
    }

    // 1. Create or Find Demo Admin User
    let admin = await prisma.user.findUnique({
      where: { email: 'demo_admin@shadimubarak.demo' },
    });
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: 'Demo Admin',
          email: 'demo_admin@shadimubarak.demo',
          role: Role.ADMIN,
          accountStatus: AccountStatus.ACTIVE,
        },
      });
      console.log('Demo Admin user created.');
    } else {
      console.log('Demo Admin user already exists.');
    }

    // 2. Loop and Create Profiles
    for (const pData of profilesToSeed) {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: pData.email },
      });

      if (existingUser) {
        skippedCount++;
        continue;
      }

      // Create new User
      const user = await prisma.user.create({
        data: {
          name: pData.name,
          email: pData.email,
          role: Role.USER,
          accountStatus: AccountStatus.ACTIVE,
          createdAt: pData.regDate,
          updatedAt: pData.regDate,
        },
      });

      // Create Matrimonial Profile
      const matProfile = await prisma.matrimonialProfile.create({
        data: {
          userId: user.id,
          fullName: pData.name,
          gender: pData.gender,
          dateOfBirth: pData.dob,
          maritalStatus: pData.maritalStatus,
          phoneNumber: pData.phone,
          city: pData.city,
          areaOrLocality: pData.locality,
          state: pData.state,
          country: 'India',
          education: pData.education,
          occupation: pData.occupation,
          annualIncomeRange: pData.income,
          familyInfo: pData.family,
          bio: pData.bio,
          themeColor: pData.theme,
          verificationStatus: pData.verification as VerificationStatus,
          profileCompletionStatus: pData.completion as ProfileCompletionStatus,
          adminApprovalStatus: pData.verification === 'APPROVED' ? 'APPROVED' : (pData.verification === 'REJECTED' ? 'REJECTED' : 'PENDING'),
          hasPaid: pData.hasPaid,
          createdAt: pData.regDate,
          updatedAt: pData.regDate,
          
          // Identity fields:
          maslak: pData.gender === 'Female' ? 'Sunni' : 'Sunni Deobandi',
          fiqh: 'Hanafi',
          biradari: pData.name.includes('Khan') ? 'Khan' : (pData.name.includes('Siddiqui') ? 'Siddiqui' : (pData.name.includes('Syed') ? 'Syed / Sayyid' : (pData.name.includes('Qureshi') ? 'Qureshi' : (pData.name.includes('Ansari') ? 'Ansari' : 'Sheikh / Shaikh')))),
          biradariAliases: [],
          district: pData.city,
          locality: pData.locality,
          preferredLocations: [pData.state],
          sameCastePreference: false,
          sameMaslakPreference: false,
          noCastePreference: true,
          noMaslakPreference: true,
          willingToRelocate: true,
        },
      });


      // Create Verification Request record
      await prisma.verificationRequest.create({
        data: {
          profileId: matProfile.id,
          status: pData.verification as VerificationStatus,
          assignedAdminId: (pData.verification === 'APPROVED' || pData.verification === 'REJECTED') ? admin.id : null,
          notes: pData.verification === 'APPROVED' 
            ? 'Verified call completed. Documents approved.' 
            : (pData.verification === 'REJECTED' ? 'Failed verification call. Invalid number.' : 'New profile registration. Queue check required.'),
          verifiedAt: pData.verification === 'APPROVED' ? new Date() : null,
          createdAt: pData.regDate,
          updatedAt: pData.regDate,
        },
      });

      // If Paid, create Package Purchase
      if (pData.hasPaid && pData.packageType) {
        const gstRate = 0.18;
        const total = Math.round(pData.packagePrice! * (1 + gstRate));
        const purchase = await prisma.packagePurchase.create({
          data: {
            profileId: matProfile.id,
            packageType: pData.packageType as PackageType,
            basePrice: pData.packagePrice!,
            gstRate: gstRate,
            totalAmount: total,
            billingType: pData.packageType === 'STANDARD' ? 'MONTHLY' : 'ONE_TIME',
            successFeeAmount: pData.packageType === 'HIGH_PROFILE' ? 25000 : (pData.packageType === 'CURATED' ? 21000 : 0),
            razorpayOrderId: `order_demo_${matProfile.id}`,
            razorpayPaymentId: `pay_demo_${matProfile.id}`,
            paymentStatus: PaymentStatus.PAID,
            purchaseDate: pData.regDate,
            expiryDate: pData.packageType === 'STANDARD' ? new Date(pData.regDate.getTime() + 30 * 24 * 60 * 60 * 1000) : null,
            accessStatus: 'ACTIVE',
            eligibilityStatus: pData.packageType === 'HIGH_PROFILE' 
              ? (pData.verification === 'APPROVED' ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING) 
              : ApprovalStatus.APPROVED,
            marriageConfirmation: 'PENDING',
            successFeePaymentStatus: PaymentStatus.PENDING,
            internalNotes: 'Automated demo seed payment.',
            createdAt: pData.regDate,
            updatedAt: pData.regDate,
          },
        });

        // Audit Log for payment verification
        await prisma.auditLog.create({
          data: {
            actorUserId: null,
            action: `PAYMENT_VERIFIED_${pData.packageType}`,
            targetType: 'PackagePurchase',
            targetId: purchase.id,
            metadata: JSON.stringify({ orderId: purchase.razorpayOrderId, paymentId: purchase.razorpayPaymentId }),
            createdAt: pData.regDate,
          },
        });
      }

      // Audit Log for verification status change
      await prisma.auditLog.create({
        data: {
          actorUserId: admin.id,
          action: `VERIFICATION_STATUS_CHANGE_${pData.verification}`,
          targetType: 'MatrimonialProfile',
          targetId: matProfile.id,
          metadata: JSON.stringify({ notes: `Demo setup: status set to ${pData.verification}.` }),
          createdAt: pData.regDate,
        },
      });

      insertedCount++;
    }

    // 3. Seed Curated Lead Assignments
    console.log('Seeding curated leads...');
    const adnan = await prisma.user.findFirst({
      where: { email: 'demo_adnan_siddiqui@shadimubarak.demo' },
      include: { profile: true },
    });
    const sarah = await prisma.user.findFirst({
      where: { email: 'demo_sarah_khan@shadimubarak.demo' },
      include: { profile: true },
    });
    const farhan = await prisma.user.findFirst({
      where: { email: 'demo_farhan_syed@shadimubarak.demo' },
      include: { profile: true },
    });
    const mariam = await prisma.user.findFirst({
      where: { email: 'demo_mariam_fatimah@shadimubarak.demo' },
      include: { profile: true },
    });
    const mansoor = await prisma.user.findFirst({
      where: { email: 'demo_mansoor_ali@shadimubarak.demo' },
      include: { profile: true },
    });
    const aisha = await prisma.user.findFirst({
      where: { email: 'demo_aisha_rahman@shadimubarak.demo' },
      include: { profile: true },
    });

    const leadAssignments = [
      { buyer: adnan, lead: sarah },
      { buyer: farhan, lead: mariam },
      { buyer: mansoor, lead: aisha },
    ];

    for (const assignment of leadAssignments) {
      if (assignment.buyer?.profile && assignment.lead?.profile) {
        const buyerId = assignment.buyer.profile.id;
        const leadId = assignment.lead.profile.id;

        const existingLead = await prisma.curatedLeadAssignment.findFirst({
          where: { buyerProfileId: buyerId, leadProfileId: leadId },
        });

        if (!existingLead) {
          await prisma.curatedLeadAssignment.create({
            data: {
              buyerProfileId: buyerId,
              leadProfileId: leadId,
              status: 'PENDING',
            },
          });
          console.log(`Created curated lead assignment: ${assignment.buyer.name} -> ${assignment.lead.name}`);
        }
      }
    }

    console.log('Seeding operation completed successfully!');
    console.log(`Summary: ${insertedCount} profiles created, ${skippedCount} profiles skipped.`);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

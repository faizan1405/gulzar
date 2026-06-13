export interface MaslakOptionRaw {
  label: string;
  aliases: string[];
}

export interface CasteOptionRaw {
  label: string;
  aliases: string[];
}

export interface LocationOptionRaw {
  state: string;
  district: string;
  locality?: string;
  isHighPriority?: boolean;
}

export const DEFAULT_MASLAKS: MaslakOptionRaw[] = [
  { label: "Sunni", aliases: [] },
  { label: "Sunni Barelvi / Ahle Sunnat Wal Jamaat", aliases: ["Bareilvi", "Barelwi", "Ahle Sunnat"] },
  { label: "Sunni Deobandi", aliases: ["Devbandi", "Deobandi"] },
  { label: "Ahl-e-Hadith / Salafi", aliases: ["Ahle Hadees", "Ahle Hadith", "Salafi"] },
  { label: "Shia", aliases: ["Shia"] },
  { label: "Shia Ithna Ashari / Twelver", aliases: [] },
  { label: "Shia Ismaili", aliases: [] },
  { label: "Dawoodi Bohra", aliases: [] },
  { label: "Bohra", aliases: [] },
  { label: "Sufi-oriented", aliases: [] },
  { label: "Hanafi Sunni", aliases: [] },
  { label: "Shafi’i Sunni", aliases: [] },
  { label: "No sect preference", aliases: [] },
  { label: "Prefer not to say", aliases: [] },
  { label: "Other / Not listed", aliases: [] }
];

export const DEFAULT_FIQHS: string[] = [
  "Hanafi",
  "Shafi’i",
  "Maliki",
  "Hanbali",
  "Jafari",
  "Ismaili",
  "Not sure",
  "Prefer not to say",
  "Other"
];

export const DEFAULT_CASTES: CasteOptionRaw[] = [
  { label: "Ansari", aliases: ["Julaha-Momin"] },
  { label: "Momin", aliases: ["Julaha-Momin"] },
  { label: "Julaha", aliases: ["Julaha-Momin"] },
  { label: "Mansuri", aliases: ["Mansoori"] },
  { label: "Dhunia", aliases: [] },
  { label: "Pathan", aliases: [] },
  { label: "Khan", aliases: [] },
  { label: "Malik", aliases: [] },
  { label: "Qureshi", aliases: ["Quraishi", "Kureshi"] },
  { label: "Kasai", aliases: [] },
  { label: "Sheikh / Shaikh", aliases: ["Shaikh", "Sheikh"] },
  { label: "Syed / Sayyid", aliases: ["Sayyid", "Saiyad", "Sayyed", "Syed"] },
  { label: "Siddiqui", aliases: [] },
  { label: "Farooqui", aliases: [] },
  { label: "Usmani", aliases: [] },
  { label: "Hashmi", aliases: [] },
  { label: "Rizvi", aliases: [] },
  { label: "Zaidi", aliases: [] },
  { label: "Naqvi", aliases: [] },
  { label: "Jafri", aliases: [] },
  { label: "Kazmi", aliases: [] },
  { label: "Alvi", aliases: [] },
  { label: "Mughal", aliases: [] },
  { label: "Mirza", aliases: [] },
  { label: "Saifi", aliases: ["Lohar"] },
  { label: "Lohar", aliases: ["Saifi"] },
  { label: "Salmani", aliases: ["Nai"] },
  { label: "Hajjam", aliases: ["Nai"] },
  { label: "Nai", aliases: ["Salmani", "Hajjam"] },
  { label: "Idrisi", aliases: ["Darzi"] },
  { label: "Darzi", aliases: ["Idrisi"] },
  { label: "Rayeen", aliases: [] },
  { label: "Kunjra", aliases: [] },
  { label: "Rangrez", aliases: [] },
  { label: "Abbasi", aliases: [] },
  { label: "Bhishti", aliases: [] },
  { label: "Fakir / Faquir", aliases: [] },
  { label: "Pinjara", aliases: [] },
  { label: "Naddaf", aliases: [] },
  { label: "Gaddi", aliases: [] },
  { label: "Mirasi", aliases: [] },
  { label: "Manihar", aliases: [] },
  { label: "Nalband", aliases: [] },
  { label: "Banjara", aliases: [] },
  { label: "Mukeri", aliases: [] },
  { label: "Makrani", aliases: [] },
  { label: "Mewati / Meo", aliases: [] },
  { label: "Teli", aliases: [] },
  { label: "Chhipa", aliases: [] },
  { label: "Chik", aliases: [] },
  { label: "Churihar", aliases: [] },
  { label: "Dafali", aliases: [] },
  { label: "Dhobi Muslim", aliases: [] },
  { label: "Bhatiyara", aliases: [] },
  { label: "Madari", aliases: [] },
  { label: "Nat Muslim", aliases: [] },
  { label: "Mappila / Moplah", aliases: [] },
  { label: "Dakhani / Dekkani Muslim", aliases: [] },
  { label: "Konkani Muslim", aliases: [] },
  { label: "Navayat", aliases: [] },
  { label: "Memon", aliases: [] },
  { label: "Khoja", aliases: [] },
  { label: "Bohra", aliases: [] },
  { label: "Cutchi Memon", aliases: [] },
  { label: "Kalal / Kalar Muslim", aliases: [] },
  { label: "Saikalgar / Sikligar Muslim", aliases: [] },
  { label: "Shershahbadi", aliases: [] },
  { label: "Kulhaiya", aliases: [] },
  { label: "Surjapuri", aliases: [] },
  { label: "Bengali Muslim", aliases: [] },
  { label: "Assamese Muslim", aliases: [] },
  { label: "Kashmiri Muslim", aliases: [] },
  { label: "Gujjar Muslim", aliases: [] },
  { label: "Bakarwal Muslim", aliases: [] },
  { label: "Other / Not listed", aliases: [] },
  { label: "Prefer not to say", aliases: [] },
  { label: "No caste preference", aliases: [] }
];

export const DEFAULT_LOCATIONS: LocationOptionRaw[] = [
  // Jammu & Kashmir
  { state: "Jammu & Kashmir", district: "Srinagar", isHighPriority: true },
  { state: "Jammu & Kashmir", district: "Anantnag" },
  { state: "Jammu & Kashmir", district: "Baramulla" },
  { state: "Jammu & Kashmir", district: "Pulwama" },
  { state: "Jammu & Kashmir", district: "Budgam" },
  { state: "Jammu & Kashmir", district: "Shopian" },
  { state: "Jammu & Kashmir", district: "Kulgam" },
  { state: "Jammu & Kashmir", district: "Bandipora" },
  { state: "Jammu & Kashmir", district: "Kupwara" },
  { state: "Jammu & Kashmir", district: "Ganderbal" },
  { state: "Jammu & Kashmir", district: "Poonch" },
  { state: "Jammu & Kashmir", district: "Rajouri" },
  { state: "Jammu & Kashmir", district: "Doda" },
  { state: "Jammu & Kashmir", district: "Kishtwar" },
  { state: "Jammu & Kashmir", district: "Ramban" },

  // Ladakh
  { state: "Ladakh", district: "Kargil" },

  // Lakshadweep
  { state: "Lakshadweep", district: "Kavaratti" },
  { state: "Lakshadweep", district: "Andrott" },
  { state: "Lakshadweep", district: "Minicoy" },
  { state: "Lakshadweep", district: "Amini" },
  { state: "Lakshadweep", district: "Agatti" },

  // Assam
  { state: "Assam", district: "Dhubri" },
  { state: "Assam", district: "Barpeta" },
  { state: "Assam", district: "Goalpara" },
  { state: "Assam", district: "Karimganj" },
  { state: "Assam", district: "Nagaon" },
  { state: "Assam", district: "Morigaon" },
  { state: "Assam", district: "Bongaigaon" },
  { state: "Assam", district: "Hailakandi" },
  { state: "Assam", district: "Darrang" },
  { state: "Assam", district: "Cachar" },
  { state: "Assam", district: "Kamrup" },
  { state: "Assam", district: "Kokrajhar" },

  // West Bengal
  { state: "West Bengal", district: "Murshidabad", isHighPriority: true },
  { state: "West Bengal", district: "Malda" },
  { state: "West Bengal", district: "Uttar Dinajpur" },
  { state: "West Bengal", district: "Dakshin Dinajpur" },
  { state: "West Bengal", district: "Birbhum" },
  { state: "West Bengal", district: "South 24 Parganas" },
  { state: "West Bengal", district: "North 24 Parganas" },
  { state: "West Bengal", district: "Howrah" },
  { state: "West Bengal", district: "Kolkata" },
  { state: "West Bengal", district: "Cooch Behar" },
  { state: "West Bengal", district: "Nadia" },

  // Kerala
  { state: "Kerala", district: "Malappuram", isHighPriority: true },
  { state: "Kerala", district: "Kozhikode" },
  { state: "Kerala", district: "Kannur" },
  { state: "Kerala", district: "Kasaragod" },
  { state: "Kerala", district: "Palakkad" },
  { state: "Kerala", district: "Wayanad" },
  { state: "Kerala", district: "Kochi" },
  { state: "Kerala", district: "Ernakulam" },

  // Uttar Pradesh
  { state: "Uttar Pradesh", district: "Rampur", isHighPriority: true },
  { state: "Uttar Pradesh", district: "Moradabad", isHighPriority: true },
  { state: "Uttar Pradesh", district: "Amroha" },
  { state: "Uttar Pradesh", district: "Bijnor" },
  { state: "Uttar Pradesh", district: "Saharanpur" },
  { state: "Uttar Pradesh", district: "Muzaffarnagar" },
  { state: "Uttar Pradesh", district: "Meerut" },
  { state: "Uttar Pradesh", district: "Bareilly" },
  { state: "Uttar Pradesh", district: "Balrampur" },
  { state: "Uttar Pradesh", district: "Bahraich" },
  { state: "Uttar Pradesh", district: "Shravasti" },
  { state: "Uttar Pradesh", district: "Siddharthnagar" },
  { state: "Uttar Pradesh", district: "Sant Kabir Nagar" },
  { state: "Uttar Pradesh", district: "Barabanki" },
  { state: "Uttar Pradesh", district: "Ghaziabad" },
  { state: "Uttar Pradesh", district: "Aligarh" },
  { state: "Uttar Pradesh", district: "Lucknow", isHighPriority: true },
  { state: "Uttar Pradesh", district: "Kanpur" },
  { state: "Uttar Pradesh", district: "Varanasi" },
  { state: "Uttar Pradesh", district: "Azamgarh" },

  // Bihar
  { state: "Bihar", district: "Kishanganj", isHighPriority: true },
  { state: "Bihar", district: "Katihar" },
  { state: "Bihar", district: "Araria" },
  { state: "Bihar", district: "Purnia" },
  { state: "Bihar", district: "Darbhanga" },
  { state: "Bihar", district: "Bhagalpur" },
  { state: "Bihar", district: "Patna" },
  { state: "Bihar", district: "Gaya" },
  { state: "Bihar", district: "Siwan" },
  { state: "Bihar", district: "Madhubani" },

  // Delhi
  { state: "Delhi", district: "North East Delhi", isHighPriority: true },
  { state: "Delhi", district: "Central Delhi" },
  { state: "Delhi", district: "Old Delhi", isHighPriority: true },
  { state: "Delhi", district: "Old Delhi", locality: "Jama Masjid" },
  { state: "Delhi", district: "Old Delhi", locality: "Ballimaran" },
  { state: "Delhi", district: "North East Delhi", locality: "Seelampur" },
  { state: "Delhi", district: "North East Delhi", locality: "Jafrabad" },
  { state: "Delhi", district: "North East Delhi", locality: "Mustafabad" },
  { state: "Delhi", district: "South Delhi", locality: "Okhla", isHighPriority: true },
  { state: "Delhi", district: "South Delhi", locality: "Jamia Nagar" },
  { state: "Delhi", district: "South Delhi", locality: "Zakir Nagar" },
  { state: "Delhi", district: "South Delhi", locality: "Batla House" },
  { state: "Delhi", district: "South Delhi", locality: "Shaheen Bagh" },

  // Jharkhand
  { state: "Jharkhand", district: "Pakur" },
  { state: "Jharkhand", district: "Sahibganj" },
  { state: "Jharkhand", district: "Ranchi" },
  { state: "Jharkhand", district: "Jamshedpur" },

  // Telangana
  { state: "Telangana", district: "Hyderabad", isHighPriority: true },
  { state: "Telangana", district: "Hyderabad", locality: "Old City Hyderabad" },
  { state: "Telangana", district: "Hyderabad", locality: "Charminar" },
  { state: "Telangana", district: "Hyderabad", locality: "Mehdipatnam" },
  { state: "Telangana", district: "Hyderabad", locality: "Tolichowki" },
  { state: "Telangana", district: "Hyderabad", locality: "Nampally" },
  { state: "Telangana", district: "Secunderabad" },

  // Karnataka
  { state: "Karnataka", district: "Bengaluru", isHighPriority: true },
  { state: "Karnataka", district: "Mysuru" },
  { state: "Karnataka", district: "Mangaluru" },
  { state: "Karnataka", district: "Dakshina Kannada" },
  { state: "Karnataka", district: "Gulbarga / Kalaburagi" },
  { state: "Karnataka", district: "Bidar" },
  { state: "Karnataka", district: "Bijapur / Vijayapura" },

  // Maharashtra
  { state: "Maharashtra", district: "Mumbai", isHighPriority: true },
  { state: "Maharashtra", district: "Mumbai", locality: "Mumbai Central" },
  { state: "Maharashtra", district: "Mumbai", locality: "Byculla" },
  { state: "Maharashtra", district: "Mumbai", locality: "Kurla" },
  { state: "Maharashtra", district: "Mumbai", locality: "Mumbra" },
  { state: "Maharashtra", district: "Bhiwandi" },
  { state: "Maharashtra", district: "Malegaon" },
  { state: "Maharashtra", district: "Aurangabad / Chhatrapati Sambhajinagar" },
  { state: "Maharashtra", district: "Pune" },
  { state: "Maharashtra", district: "Nagpur" },
  { state: "Maharashtra", district: "Osmanabad / Dharashiv" },

  // Gujarat
  { state: "Gujarat", district: "Ahmedabad" },
  { state: "Gujarat", district: "Bharuch" },
  { state: "Gujarat", district: "Surat" },
  { state: "Gujarat", district: "Vadodara" },
  { state: "Gujarat", district: "Jamnagar" },
  { state: "Gujarat", district: "Kutch" },
  { state: "Gujarat", district: "Godhra" },

  // Rajasthan
  { state: "Rajasthan", district: "Jaipur" },
  { state: "Rajasthan", district: "Jodhpur" },
  { state: "Rajasthan", district: "Ajmer" },
  { state: "Rajasthan", district: "Tonk" },
  { state: "Rajasthan", district: "Jaisalmer" },
  { state: "Rajasthan", district: "Bharatpur" },
  { state: "Rajasthan", district: "Alwar" },

  // Uttarakhand
  { state: "Uttarakhand", district: "Haridwar" },
  { state: "Uttarakhand", district: "Udham Singh Nagar" },
  { state: "Uttarakhand", district: "Roorkee" },
  { state: "Uttarakhand", district: "Haldwani" },

  // Haryana
  { state: "Haryana", district: "Nuh / Mewat" },
  { state: "Haryana", district: "Gurugram" },
  { state: "Haryana", district: "Faridabad" },
  { state: "Haryana", district: "Palwal" },

  // Madhya Pradesh
  { state: "Madhya Pradesh", district: "Bhopal", isHighPriority: true },
  { state: "Madhya Pradesh", district: "Burhanpur" },
  { state: "Madhya Pradesh", district: "Indore" },
  { state: "Madhya Pradesh", district: "Ujjain" }
];

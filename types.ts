
export type Language = 'am' | 'en';

export interface Guest {
  id: string;
  fullName: string;
  gender: 'ወንድ' | 'ሴት' | 'Male' | 'Female';
  idNumber: string;
  nationality: string;
  phoneNumber: string;
  roomNumber: string;
  hotelName: string;
  location: string;
  stayDuration: string;
  origin: string;
  purpose: string;
  vehiclePlate?: string;
  checkInDate: string;
  idPhoto: string;
  status: 'Clear' | 'Flagged' | 'WANTED_MATCH';
  reportingTime: string;
  aiAnalysis?: string;
  idType: string;
  isAuthentic: boolean;
  receptionistName: string;
  receptionistPhone: string;
}

export interface WantedPerson {
  id: string;
  name: string;
  photo: string;
  reason: string;
  postedDate: string;
  postedBy: string;
}

export type AppView = 'login' | 'reception' | 'police' | 'settings' | 'setup';
export type UserRole = 'RECEPTION' | 'POLICE';

export interface User {
  username: string;
  password?: string;
  role: UserRole;
  hotelName?: string;
  location?: string;
  language?: Language;
}

export const translations = {
  am: {
    title: 'ቤጉ እንግዳ',
    subTitle: 'የቤንሻንጉል ጉምዝ ፖሊስ ሆቴል እንግዶች መቆጣጠሪያ',
    motto: 'በጀግንነት መጠበቅ፣ በሰብዓዊነት ማገልገል',
    login: 'ይግቡ',
    username: 'ተጠቃሚ ስም',
    password: 'ይለፍ ቃል',
    hotelName: 'የሆቴሉ ስም',
    save: 'አስቀምጥ',
    back: 'ተመለስ',
    logout: 'ውጣ',
    settings: 'መቼቶች',
    reception: 'ሪሰፕሽን',
    police: 'ፖሊስ',
    register: 'መመዝገቢያ',
    history: 'ታሪክ',
    report: 'ሪፖርት',
    fullName: 'ሙሉ ስም',
    gender: 'ጾታ',
    phone: 'ስልክ ቁጥር',
    idNumber: 'መታወቂያ ቁጥር',
    roomNumber: 'ክፍል ቁጥር',
    origin: 'የመጣበት ቦታ',
    purpose: 'የጉዞ ዓላማ',
    vehicle: 'መኪና ታርጋ',
    submit: 'መረጃውን መዝግብ',
    export: 'ሪፖርት አውርድ',
    male: 'ወንድ',
    female: 'ሴት',
    setupTitle: 'የመጀመሪያ ዝግጅት',
    setupDesc: 'እባክዎ መጀመሪያ የሆቴሉን ስም እና የሚፈልጉትን ቋንቋ ይምረጡ',
    finishSetup: 'ዝግጅቱን ጨርስ',
    installApp: 'አፑን በኮምፒውተርዎ ላይ ይጫኑ',
    installBtn: 'አሁኑኑ ጫን',
    wanted: 'ተፈላጊዎች',
    nationality: 'ዜግነት',
    share: 'አጋራ',
    print: 'አትም',
    officerSign: 'ተቆጣጣሪ ፖሊስ ስም እና ማዕረግ',
    signature: 'ፊርማ',
    date: 'ቀን'
  },
  en: {
    title: 'Begu Guest',
    subTitle: 'BG Police Hotel Guest Control System',
    motto: 'Protect with Bravery, Serve with Humanity',
    login: 'Login',
    username: 'Username',
    password: 'Password',
    hotelName: 'Hotel Name',
    save: 'Save',
    back: 'Back',
    logout: 'Logout',
    settings: 'Settings',
    reception: 'Reception',
    police: 'Police',
    register: 'Register',
    history: 'History',
    report: 'Report',
    fullName: 'Full Name',
    gender: 'Gender',
    phone: 'Phone Number',
    idNumber: 'ID Number',
    roomNumber: 'Room Number',
    origin: 'Origin',
    purpose: 'Purpose of Visit',
    vehicle: 'Vehicle Plate',
    submit: 'Register Guest',
    export: 'Download Report',
    male: 'Male',
    female: 'Female',
    setupTitle: 'Initial Setup',
    setupDesc: 'Please register your hotel name and choose your preferred language',
    finishSetup: 'Finish Setup',
    installApp: 'Install App on Your Computer',
    installBtn: 'Install Now',
    wanted: 'Wanted Persons',
    nationality: 'Nationality',
    share: 'Share',
    print: 'Print',
    officerSign: 'Supervising Police Officer Name & Rank',
    signature: 'Signature',
    date: 'Date'
  }
};

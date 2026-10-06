export interface District {
  name: string;
  nameBn: string;
  isDhaka: boolean;
  division: string;
}

export const BANGLADESH_DISTRICTS: District[] = [
  // Dhaka Division
  { name: 'Dhaka', nameBn: 'ঢাকা (সিটি)', isDhaka: true, division: 'Dhaka' },
  { name: 'Dhaka Suburbs (Savar, Keraniganj)', nameBn: 'ঢাকা উপশহর (সাভার, কেরানীগঞ্জ)', isDhaka: true, division: 'Dhaka' },
  { name: 'Gazipur', nameBn: 'গাজীপুর', isDhaka: false, division: 'Dhaka' },
  { name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', isDhaka: false, division: 'Dhaka' },
  { name: 'Narsingdi', nameBn: 'নরসিংদী', isDhaka: false, division: 'Dhaka' },
  { name: 'Tangail', nameBn: 'টাঙ্গাইল', isDhaka: false, division: 'Dhaka' },
  { name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', isDhaka: false, division: 'Dhaka' },
  { name: 'Manikganj', nameBn: 'মানিকগঞ্জ', isDhaka: false, division: 'Dhaka' },
  { name: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', isDhaka: false, division: 'Dhaka' },
  { name: 'Rajbari', nameBn: 'রাজবাড়ী', isDhaka: false, division: 'Dhaka' },
  { name: 'Madaripur', nameBn: 'মাদারীপুর', isDhaka: false, division: 'Dhaka' },
  { name: 'Gopalganj', nameBn: 'গোপালগঞ্জ', isDhaka: false, division: 'Dhaka' },
  { name: 'Faridpur', nameBn: 'ফরিদপুর', isDhaka: false, division: 'Dhaka' },
  { name: 'Shariatpur', nameBn: 'শরীয়তপুর', isDhaka: false, division: 'Dhaka' },

  // Chattogram Division
  { name: 'Chattogram', nameBn: 'চট্টগ্রাম', isDhaka: false, division: 'Chattogram' },
  { name: "Cox's Bazar", nameBn: 'কক্সবাজার', isDhaka: false, division: 'Chattogram' },
  { name: 'Cumilla', nameBn: 'কুমিল্লা', isDhaka: false, division: 'Chattogram' },
  { name: 'Feni', nameBn: 'ফেনী', isDhaka: false, division: 'Chattogram' },
  { name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', isDhaka: false, division: 'Chattogram' },
  { name: 'Noakhali', nameBn: 'নোয়াখালী', isDhaka: false, division: 'Chattogram' },
  { name: 'Chandpur', nameBn: 'চাঁদপুর', isDhaka: false, division: 'Chattogram' },
  { name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', isDhaka: false, division: 'Chattogram' },
  { name: 'Bandarban', nameBn: 'বান্দরবান', isDhaka: false, division: 'Chattogram' },
  { name: 'Rangamati', nameBn: 'রাঙ্গামাটি', isDhaka: false, division: 'Chattogram' },
  { name: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', isDhaka: false, division: 'Chattogram' },

  // Sylhet Division
  { name: 'Sylhet', nameBn: 'সিলেট', isDhaka: false, division: 'Sylhet' },
  { name: 'Moulvibazar', nameBn: 'মৌলভীবাজার', isDhaka: false, division: 'Sylhet' },
  { name: 'Habiganj', nameBn: 'হবিগঞ্জ', isDhaka: false, division: 'Sylhet' },
  { name: 'Sunamganj', nameBn: 'সুনামগঞ্জ', isDhaka: false, division: 'Sylhet' },

  // Rajshahi Division
  { name: 'Rajshahi', nameBn: 'রাজশাহী', isDhaka: false, division: 'Rajshahi' },
  { name: 'Bogura', nameBn: 'বগুড়া', isDhaka: false, division: 'Rajshahi' },
  { name: 'Pabna', nameBn: 'পাবনা', isDhaka: false, division: 'Rajshahi' },
  { name: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', isDhaka: false, division: 'Rajshahi' },
  { name: 'Naogaon', nameBn: 'নওগাঁ', isDhaka: false, division: 'Rajshahi' },
  { name: 'Natore', nameBn: 'নাটোর', isDhaka: false, division: 'Rajshahi' },
  { name: 'Chapai Nawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', isDhaka: false, division: 'Rajshahi' },
  { name: 'Joypurhat', nameBn: 'জয়পুরহাট', isDhaka: false, division: 'Rajshahi' },

  // Khulna Division
  { name: 'Khulna', nameBn: 'খুলনা', isDhaka: false, division: 'Khulna' },
  { name: 'Jashore', nameBn: 'যশোর', isDhaka: false, division: 'Khulna' },
  { name: 'Kushtia', nameBn: 'কুষ্টিয়া', isDhaka: false, division: 'Khulna' },
  { name: 'Jhenaidah', nameBn: 'ঝিনাইদহ', isDhaka: false, division: 'Khulna' },
  { name: 'Satkhira', nameBn: 'সাতক্ষীরা', isDhaka: false, division: 'Khulna' },
  { name: 'Bagerhat', nameBn: 'বাগেরহাট', isDhaka: false, division: 'Khulna' },
  { name: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', isDhaka: false, division: 'Khulna' },
  { name: 'Meherpur', nameBn: 'মেহেরপুর', isDhaka: false, division: 'Khulna' },
  { name: 'Magura', nameBn: 'মাগুরা', isDhaka: false, division: 'Khulna' },
  { name: 'Narail', nameBn: 'নড়াইল', isDhaka: false, division: 'Khulna' },

  // Barishal Division
  { name: 'Barishal', nameBn: 'বরিশাল', isDhaka: false, division: 'Barishal' },
  { name: 'Patuakhali', nameBn: 'পটুয়াখালী', isDhaka: false, division: 'Barishal' },
  { name: 'Bhola', nameBn: 'ভোলা', isDhaka: false, division: 'Barishal' },
  { name: 'Pirojpur', nameBn: 'পিরোজপুর', isDhaka: false, division: 'Barishal' },
  { name: 'Barguna', nameBn: 'বরগুনা', isDhaka: false, division: 'Barishal' },
  { name: 'Jhalokati', nameBn: 'ঝালকাঠি', isDhaka: false, division: 'Barishal' },

  // Rangpur Division
  { name: 'Rangpur', nameBn: 'রংপুর', isDhaka: false, division: 'Rangpur' },
  { name: 'Dinajpur', nameBn: 'দিনাজপুর', isDhaka: false, division: 'Rangpur' },
  { name: 'Gaibandha', nameBn: 'গাইবান্ধা', isDhaka: false, division: 'Rangpur' },
  { name: 'Kurigram', nameBn: 'কুড়িগ্রাম', isDhaka: false, division: 'Rangpur' },
  { name: 'Lalmonirhat', nameBn: 'লালমনিরহাট', isDhaka: false, division: 'Rangpur' },
  { name: 'Nilphamari', nameBn: 'নীলফামারী', isDhaka: false, division: 'Rangpur' },
  { name: 'Panchagarh', nameBn: 'পঞ্চগড়', isDhaka: false, division: 'Rangpur' },
  { name: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', isDhaka: false, division: 'Rangpur' },

  // Mymensingh Division
  { name: 'Mymensingh', nameBn: 'ময়মনসিংহ', isDhaka: false, division: 'Mymensingh' },
  { name: 'Jamalpur', nameBn: 'জামালপুর', isDhaka: false, division: 'Mymensingh' },
  { name: 'Netrokona', nameBn: 'নেত্রকোণা', isDhaka: false, division: 'Mymensingh' },
  { name: 'Sherpur', nameBn: 'শেরপুর', isDhaka: false, division: 'Mymensingh' }
];

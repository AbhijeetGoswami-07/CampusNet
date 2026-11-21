// Pune-specific real data for CampusNet modules with authentic Indian student living & Pune campus imagery

export type PuneListing = {
  id: string;
  title: string;
  category: string;
  locality: string;
  city: string;
  latitude: number;
  longitude: number;
  price: number;
  foodCost: number | null;
  electricityCost: number | null;
  wifiCost: number | null;
  laundryCost: number | null;
  maintenanceCost: number | null;
  travelCost: number | null;
  securityDeposit: number | null;
  distance: number | null;
  rating: number | null;
  lastVerifiedAt: string;
  available: number;
  total: number;
  roomType: string;
  genderPreference: string;
  image: string;
  images?: string[];
  hasRealPhotos?: boolean;
  mapsUrl?: string;
  phoneNumber?: string;
  address?: string;
  userRatingCount?: number;
  verified: boolean;
  food: boolean;
  laundry: boolean;
  wifi: boolean;
  collegeName: string;
  source?: string;
}

export type Service = {
  id: string;
  name: string;
  category: 'mess' | 'laundry' | 'medical' | 'grocery' | 'salon' | 'library';
  address: string;
  locality: string;
  timing: string;
  phone: string;
  rating: number;
  latitude: number;
  longitude: number;
  priceRange: string;
  description: string;
  image?: string;
  collegeName?: string;
  source?: string;
}

export type College = {
  id: string;
  name: string;
  shortName: string;
  area: string;
  type: string;
  affiliated: string;
  latitude: number;
  longitude: number;
  established: number;
  students: number;
  image: string;
  website: string;
}

export type FlatmateProfile = {
  id: string;
  name: string;
  age: number;
  college: string;
  course: string;
  year: number;
  budget: number;
  locality: string;
  gender: 'Male' | 'Female' | 'Any';
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';
  sleepTime: 'Early bird (before 10pm)' | 'Night owl (after midnight)' | 'Flexible';
  studyHours: number;
  cleanliness: 'Very tidy' | 'Moderate' | 'Relaxed';
  hobbies: string[];
  lookingFor: string;
  moveInDate: string;
  avatar: string;
}

import realListingsJson from './data/listings.json';

export const puneListings: PuneListing[] = realListingsJson as PuneListing[];

export const puneServices: Service[] = [
  // Mess & Tiffin Services
  {
    id: 'annapurna-mess',
    image: '/services/annapurna-maharashtrian-thali.jpg',
    name: 'Annapurna Veg Mess',
    category: 'mess',
    address: '47, FC Road, Shivajinagar',
    locality: 'Shivajinagar',
    timing: '7:00 AM – 10:00 PM',
    phone: '+91 98220 11234',
    rating: 4.6,
    latitude: 18.5270,
    longitude: 73.8460,
    priceRange: '₹1,500–2,500/month',
    description: 'Unlimited Maharashtrian vegetarian thali, freshly prepared chapati and bhaji, daily evening dal bati option.'
  },
  {
    id: 'vaishali-restaurant',
    image: '/services/vaishali-masala-dosa.jpg',
    name: 'Café Vaishali',
    category: 'mess',
    address: '1200/A, Fergusson College Road',
    locality: 'Shivajinagar',
    timing: '7:00 AM – 11:00 PM',
    phone: '+91 20 2553 5333',
    rating: 4.8,
    latitude: 18.5240,
    longitude: 73.8420,
    priceRange: '₹150–350/meal',
    description: 'Legendary Pune college student hangout since 1968. Famous for SPDP, filter coffee, Mysore Masala Dosa.'
  },
  {
    id: 'roopali-restaurant',
    image: '/services/roopali-idli-sambar.jpg',
    name: 'Hotel Roopali',
    category: 'mess',
    address: 'FC Road, Deccan Gymkhana',
    locality: 'Deccan',
    timing: '7:30 AM – 11:00 PM',
    phone: '+91 20 2553 6789',
    rating: 4.5,
    latitude: 18.5193,
    longitude: 73.8401,
    priceRange: '₹100–280/meal',
    description: 'Iconic open-air restaurant. Quick student breakfasts, Idli Vada, and evening snacks near COEP and FC.'
  },
  {
    id: 'durga-tiffin',
    image: '/services/durga-tiffin-dabba.jpg',
    name: 'Durga Homemade Tiffin Service',
    category: 'mess',
    address: '12, Prabhat Road, Lane 4, Kothrud',
    locality: 'Kothrud',
    timing: '8:00 AM – 9:00 PM',
    phone: '+91 94220 45678',
    rating: 4.4,
    latitude: 18.5070,
    longitude: 73.8110,
    priceRange: '₹2,000–3,000/month',
    description: 'Fresh tiffin delivery to student PGs in Kothrud & Karve Nagar. Free door delivery twice daily.'
  },
  {
    id: 'spice-garden-mess',
    image: '/services/spice-garden-paneer.jpg',
    name: 'Spice Garden Student Mess',
    category: 'mess',
    address: '8, Karve Road, Near Dashabhuja Ganpati',
    locality: 'Kothrud',
    timing: '7:30 AM – 9:30 PM',
    phone: '+91 94005 78901',
    rating: 4.3,
    latitude: 18.4940,
    longitude: 73.8180,
    priceRange: '₹1,800–2,800/month',
    description: 'Both North & South Indian meals. Sunday special paneer & sweet dish included in monthly card.'
  },
  // Additional Authentic Student Messes around Pune Campuses
  {
    id: 'shreyas-dining-mess',
    image: '/services/shreyas-pune-thali.jpg',
    name: 'Shreyas Dining Hall & Student Mess',
    category: 'mess',
    address: 'Apte Road, Deccan Gymkhana, Near FC Road',
    locality: 'Deccan',
    timing: '11:00 AM – 3:30 PM & 7:00 PM – 10:30 PM',
    phone: '+91 20 2553 1221',
    rating: 4.7,
    latitude: 18.5200,
    longitude: 73.8435,
    priceRange: '₹2,200–3,200/month',
    description: 'Renowned authentic Maharashtrian unlimited thali & monthly student meal passes. Near COEP and Fergusson.'
  },
  {
    id: 'mathura-veg-mess',
    image: '/services/badshahi-indian-thali.jpg',
    name: 'Mathura Pure Veg Student Mess',
    category: 'mess',
    address: '112, FC Road, Opposite Fergusson College Main Gate',
    locality: 'Shivajinagar',
    timing: '7:30 AM – 10:00 PM',
    phone: '+91 98224 55678',
    rating: 4.6,
    latitude: 18.5255,
    longitude: 73.8445,
    priceRange: '₹1,900–2,600/month',
    description: 'Daily fresh thali, 4 rotis, 2 vegetables, dal, rice, and buttermilk. Special Sunday feast near COEP & FC.'
  },
  {
    id: 'mayur-thali-kothrud',
    image: '/services/gujarati-thali-pune.jpg',
    name: 'Mayur Maharashtrian Mess',
    category: 'mess',
    address: '14, Paud Road, Opposite MIT World Peace University Gate',
    locality: 'Kothrud',
    timing: '11:30 AM – 3:00 PM & 7:30 PM – 10:00 PM',
    phone: '+91 98901 23456',
    rating: 4.6,
    latitude: 18.5055,
    longitude: 73.8095,
    priceRange: '₹2,100–3,000/month',
    description: 'Student favorite right opposite MIT campus. Unlimited chapati, seasonal veggies, and hygienic dining.'
  },
  {
    id: "jd-abhiruchi-mess-coep",
    name: "Abhiruchi Student Mess & Dining",
    category: "mess",
    address: "Narveer Tanaji Wadi, Opp. COEP Hostel Gate, Shivajinagar",
    locality: "Shivajinagar",
    timing: "11:30 AM - 3:00 PM, 7:00 PM - 10:30 PM",
    phone: "+91 98234 11201",
    rating: 4.6,
    latitude: 18.5305,
    longitude: 73.856,
    priceRange: "₹2,600/month",
    description: "Authentic Maharashtrian unlimited thali with chapati, bhakri, two sabzis, dal, rice, and Sunday sweet.",
    collegeName: "COEP Technological University",
    source: "Justdial Verified",
    image: '/services/dabbawala-tiffin-service.jpg'
  },
  {
    id: "sulekha-swaraj-veg-mess-fc",
    name: "Swaraj Veg Mess & Thali House",
    category: "mess",
    address: "Lane 4, FC Road, Deccan Gymkhana (Near Fergusson College)",
    locality: "FC Road",
    timing: "12:00 PM - 3:30 PM, 7:30 PM - 10:30 PM",
    phone: "+91 98221 44512",
    rating: 4.7,
    latitude: 18.5215,
    longitude: 73.8415,
    priceRange: "₹2,800/month",
    description: "Clean, student-friendly dining hall serving fresh hot rotis, daily variety of vegetables, and curd.",
    collegeName: "Fergusson College",
    source: "Sulekha Verified",
    image: '/services/mess-dining-hall.jpg'
  },
  {
    id: "im-puneri-dabbawale-mit",
    name: "Puneri Dabbawale Student Tiffin Service",
    category: "mess",
    address: "MIT College Road, Rambag Colony, Kothrud",
    locality: "Kothrud",
    timing: "8:00 AM - 10:00 PM (Doorstep Delivery)",
    phone: "+91 98905 33219",
    rating: 4.8,
    latitude: 18.515,
    longitude: 73.817,
    priceRange: "₹2,400/month",
    description: "Home-style tiffin delivered directly to student PGs and hostels around MIT-WPU. Flexible skip-meal policy.",
    collegeName: "MIT World Peace University",
    source: "IndiaMART / Justdial Verified",
    image: '/services/tiffin-delivery.jpg'
  },
  {
    id: "jd-sanjayas-mess-mit",
    name: "Sanjayas Student Mess",
    category: "mess",
    address: "Lane 2, Rambag Colony, Back gate of MIT-WPU, Kothrud",
    locality: "Kothrud",
    timing: "11:30 AM - 3:00 PM, 7:00 PM - 10:30 PM",
    phone: "+91 97632 88104",
    rating: 4.5,
    latitude: 18.5168,
    longitude: 73.8162,
    priceRange: "₹2,700/month",
    description: "Spacious dining facility with unlimited wholesome lunch and dinner for MIT engineering & design students.",
    collegeName: "MIT World Peace University",
    source: "Justdial Verified",
    image: '/services/punjabi-chole-bhature.jpg'
  },
  {
    id: "sulekha-rutuja-tiffins-mit",
    name: "Rutuja Tiffin & Catering Services",
    category: "mess",
    address: "Paud Road, Ideal Colony near MIT College, Kothrud",
    locality: "Kothrud",
    timing: "9:00 AM - 9:00 PM",
    phone: "+91 98813 66723",
    rating: 4.6,
    latitude: 18.513,
    longitude: 73.813,
    priceRange: "₹2,500/month",
    description: "Hygienic packed tiffins with options for both North Indian and Maharashtrian diets. Free hostel delivery.",
    collegeName: "MIT World Peace University",
    source: "Sulekha Verified",
    image: '/services/sukanta-rajasthani-thali.jpg'
  },
  {
    id: "jd-krushna-bhojnalay-pict",
    name: "Krushna Bhojnalay & Student Mess",
    category: "mess",
    address: "Mohan Nagar, Dhankawadi (Walking to PICT Campus)",
    locality: "Dhankawadi",
    timing: "11:30 AM - 3:30 PM, 7:00 PM - 10:30 PM",
    phone: "+91 99220 55198",
    rating: 4.6,
    latitude: 18.4575,
    longitude: 73.852,
    priceRange: "₹2,300/month",
    description: "Affordable and filling student meals right behind PICT. Includes unlimited dal, rice, chapatis, and pickle.",
    collegeName: "Pune Institute of Computer Technology",
    source: "Justdial Verified",
    image: '/services/south-indian-bhojanam.jpg'
  },
  {
    id: "sulekha-saisagar-mess-pict",
    name: "Sai Sagar Student Thali & Mess",
    category: "mess",
    address: "Trimurti Chowk, Dhankawadi near Bharati Vidyapeeth & PICT",
    locality: "Dhankawadi",
    timing: "11:45 AM - 3:15 PM, 7:15 PM - 10:15 PM",
    phone: "+91 98501 22934",
    rating: 4.5,
    latitude: 18.4595,
    longitude: 73.851,
    priceRange: "₹2,400/month",
    description: "Clean dining hall popular among computer science and engineering hostellers. Unlimited lunch and dinner coupons.",
    collegeName: "Pune Institute of Computer Technology",
    source: "Sulekha Verified",
    image: '/services/sagar-dal-makhani.jpg'
  },
  {
    id: "jd-samarth-mess-mitaoe",
    name: "Shree Swami Samarth Student Mess",
    category: "mess",
    address: "Alandi Markal Road, 150m from MIT AOE Main Gate, Alandi",
    locality: "Alandi",
    timing: "11:30 AM - 3:00 PM, 7:00 PM - 10:00 PM",
    phone: "+91 94223 77109",
    rating: 4.6,
    latitude: 18.676,
    longitude: 73.8995,
    priceRange: "₹2,200/month",
    description: "Economical, fresh homestyle meals serving MIT AOE engineering students daily. Monthly coupon books available.",
    collegeName: "MIT Academy of Engineering",
    source: "Justdial Verified",
    image: '/services/wadeshwar-pav-bhaji.jpg'
  },
  {
    id: "quikr-tasty-tiffins-symbiosis",
    name: "Tasty Homely Tiffins & Mess",
    category: "mess",
    address: "Clover Park, Viman Nagar (Behind Symbiosis Law School)",
    locality: "Viman Nagar",
    timing: "12:00 PM - 3:30 PM, 7:30 PM - 10:30 PM",
    phone: "+91 98230 99450",
    rating: 4.7,
    latitude: 18.5635,
    longitude: 73.914,
    priceRange: "₹3,200/month",
    description: "North Indian & Continental hygienic meals prepared especially for Symbiosis law, management and design students.",
    collegeName: "Symbiosis Law School",
    source: "Quikr / Justdial Verified",
    image: '/services/shreyas-pune-thali.jpg'
  },
  {
    id: "jd-student-laundromat-mit",
    name: "Student Laundromat & Dry Cleaners",
    category: "laundry",
    address: "Rambag Colony, Paud Road near MIT-WPU, Kothrud",
    locality: "Kothrud",
    timing: "8:00 AM - 9:30 PM",
    phone: "+91 98224 88310",
    rating: 4.8,
    latitude: 18.5158,
    longitude: 73.8165,
    priceRange: "₹40/kg wash & fold",
    description: "Express 24-hr wash, fold, and steam iron services. Special monthly unlimited subscription packs for hostellers.",
    collegeName: "MIT World Peace University",
    source: "Justdial Verified",
    image: '/services/laundromat.jpg'
  },
  {
    id: "jd-laundry-depot-pict",
    name: "The Laundry Depot & Ironing Express",
    category: "laundry",
    address: "Mohan Nagar, Dhankawadi near PICT Gate",
    locality: "Dhankawadi",
    timing: "8:30 AM - 9:30 PM",
    phone: "+91 97665 12043",
    rating: 4.6,
    latitude: 18.4582,
    longitude: 73.8528,
    priceRange: "₹45/kg wash & iron",
    description: "Convenient drop-and-pick laundry with fabric softener and steam pressing for college uniforms and regular wear.",
    collegeName: "Pune Institute of Computer Technology",
    source: "Justdial Verified",
    image: '/services/laundry-care.jpg'
  },
  {
    id: "sulekha-speedwash-coep",
    name: "SpeedWash Student Laundry",
    category: "laundry",
    address: "Narveer Tanaji Wadi, Shivajinagar near COEP Hostels",
    locality: "Shivajinagar",
    timing: "8:00 AM - 9:00 PM",
    phone: "+91 98902 44901",
    rating: 4.5,
    latitude: 18.5308,
    longitude: 73.8545,
    priceRange: "₹50/kg",
    description: "Quick turnaround laundry with computerized weight billing and student delivery to COEP hostel gates.",
    collegeName: "COEP Technological University",
    source: "Sulekha Verified",
    image: '/services/laundromat.jpg'
  },
  {
    id: "im-campus-cleaners-mitaoe",
    name: "Campus Cleaners Laundromat",
    category: "laundry",
    address: "Kate Colony, Alandi near MIT AOE",
    locality: "Alandi",
    timing: "8:00 AM - 8:30 PM",
    phone: "+91 94210 33887",
    rating: 4.6,
    latitude: 18.675,
    longitude: 73.8985,
    priceRange: "₹35/kg",
    description: "Affordable wash-and-fold service catering to students living in Alandi and Charholi hostels.",
    collegeName: "MIT Academy of Engineering",
    source: "IndiaMART / Justdial Verified",
    image: '/services/laundry-care.jpg'
  },
  {
    id: "jd-maharashtra-abhyasika-mit",
    name: "Maharashtra 24hr Abhyasika & Study Library",
    category: "library",
    address: "Ideal Colony, Paud Road near MIT-WPU, Kothrud",
    locality: "Kothrud",
    timing: "24 Hours Open",
    phone: "+91 98229 11450",
    rating: 4.9,
    latitude: 18.5145,
    longitude: 73.8135,
    priceRange: "₹900/month",
    description: "Sound-proof air-conditioned study hall with individual carrels, ergonomic chairs, 300 Mbps Wi-Fi, and power backup.",
    collegeName: "MIT World Peace University",
    source: "Justdial / Sulekha Verified",
    image: '/services/abhyasika-study-hall.jpg'
  },
  {
    id: "sulekha-shivajinagar-library-coep",
    name: "Shivajinagar Central Study Library & Reading Hall",
    category: "library",
    address: "Near Sambhaji Park / JM Road, Shivajinagar (Near COEP)",
    locality: "Shivajinagar",
    timing: "6:00 AM - 12:00 Midnight",
    phone: "+91 98220 88912",
    rating: 4.8,
    latitude: 18.5285,
    longitude: 73.848,
    priceRange: "₹850/month",
    description: "Peaceful reading hall popular among engineering and civil service aspirants. Personal locker facility available.",
    collegeName: "COEP Technological University",
    source: "Sulekha Verified",
    image: '/services/digital-library.jpg'
  },
  {
    id: "jd-dnyanraj-abhyasika-pict",
    name: "Dnyanraj 24x7 Abhyasika & Digital Library",
    category: "library",
    address: "Mohan Nagar, Dhankawadi near PICT Campus",
    locality: "Dhankawadi",
    timing: "24 Hours Open",
    phone: "+91 98604 77231",
    rating: 4.8,
    latitude: 18.457,
    longitude: 73.8515,
    priceRange: "₹800/month",
    description: "Fully air-conditioned 24-hour study hall equipped with high-speed internet, silent study cabins, and charging points.",
    collegeName: "Pune Institute of Computer Technology",
    source: "Justdial Verified",
    image: '/services/library-1.jpg'
  },
  {
    id: "jd-pradnya-study-hall-mitaoe",
    name: "Pradnya Student Study Hall & Library",
    category: "library",
    address: "Dehu Phata Road, Alandi (200m from MIT AOE)",
    locality: "Alandi",
    timing: "6:00 AM - 11:30 PM",
    phone: "+91 98901 66524",
    rating: 4.7,
    latitude: 18.6765,
    longitude: 73.8975,
    priceRange: "₹700/month",
    description: "Quiet study environment with individual lights, charging sockets, and reference books for engineering students.",
    collegeName: "MIT Academy of Engineering",
    source: "Justdial Verified",
    image: '/services/abhyasika-study-hall.jpg'
  },
  {
    id: "jd-apollo-247-coep",
    name: "Apollo Pharmacy 24/7 (Student Care)",
    category: "medical",
    address: "FC Road, Deccan Gymkhana (Walking from COEP & Fergusson)",
    locality: "Shivajinagar",
    timing: "24 Hours Open",
    phone: "+91 20 2567 8901",
    rating: 4.8,
    latitude: 18.523,
    longitude: 73.842,
    priceRange: "Standard MRP (10% Student Discount)",
    description: "Full-service 24/7 chemist with certified pharmacists, first-aid supplies, and doctor consultation on call.",
    collegeName: "COEP Technological University",
    source: "Justdial Verified",
    image: '/services/pharmacy.jpg'
  },
  {
    id: "jd-medplus-247-mit",
    name: "MedPlus 24x7 Chemist & Student Clinic",
    category: "medical",
    address: "Paud Road, Kothrud near MIT-WPU Back Gate",
    locality: "Kothrud",
    timing: "24 Hours Open",
    phone: "+91 20 2544 3210",
    rating: 4.7,
    latitude: 18.5125,
    longitude: 73.815,
    priceRange: "Standard MRP (15% Student Discount)",
    description: "Round-the-clock student pharmacy stocking essential generic medicines, bandages, fever kits, and health drinks.",
    collegeName: "MIT World Peace University",
    source: "Justdial Verified",
    image: '/services/medical-chemist-store.jpg'
  },
  {
    id: "jd-sanjeevani-chemist-pict",
    name: "Sanjeevani Medical & Emergency Chemist",
    category: "medical",
    address: "Mohan Nagar, Dhankawadi near PICT Gate",
    locality: "Dhankawadi",
    timing: "7:00 AM - 12:00 Midnight",
    phone: "+91 98223 99881",
    rating: 4.6,
    latitude: 18.4585,
    longitude: 73.8522,
    priceRange: "Standard MRP",
    description: "Emergency medicine dispensary, student first aid, and basic diagnostic equipment (BP, oximeter, blood sugar).",
    collegeName: "Pune Institute of Computer Technology",
    source: "Justdial Verified",
    image: '/services/emergency-clinic.jpg'
  },
  {
    id: "im-alandi-care-medical-mitaoe",
    name: "Alandi Care Medical & Healthcare Store",
    category: "medical",
    address: "Opposite MIT AOE Gate, Alandi Markal Road",
    locality: "Alandi",
    timing: "8:00 AM - 11:30 PM",
    phone: "+91 94220 11993",
    rating: 4.7,
    latitude: 18.6752,
    longitude: 73.8992,
    priceRange: "Standard MRP",
    description: "Trusted campus medical store stocking prescribed pharmaceuticals, protein supplements, and student healthcare kits.",
    collegeName: "MIT Academy of Engineering",
    source: "IndiaMART / Justdial Verified",
    image: '/services/medical-chemist-store.jpg'
  }
];

export const puneColleges: College[] = [
  {
    id: 'coep',
    name: 'COEP Technological University',
    shortName: 'COEP',
    area: 'Shivajinagar',
    type: 'Engineering & Technology',
    affiliated: 'Unitary Public State University (Est. 1854)',
    latitude: 18.5306,
    longitude: 73.8568,
    established: 1854,
    students: 5200,
    image: '/colleges/coep.jpg',
    website: 'https://www.coep.org.in'
  },
  {
    id: 'symbiosis-sit',
    name: 'Symbiosis Institute of Technology',
    shortName: 'SIT Pune',
    area: 'Lavale, Mulshi',
    type: 'Engineering & Technology',
    affiliated: 'Symbiosis International (Deemed University)',
    latitude: 18.5414,
    longitude: 73.7282,
    established: 2008,
    students: 4500,
    image: '/colleges/symbiosis-sit.jpg',
    website: 'https://www.sitpune.edu.in'
  },
  {
    id: 'vit-pune',
    name: 'Vishwakarma Institute of Technology',
    shortName: 'VIT Pune',
    area: 'Bibwewadi',
    type: 'Engineering & Technology',
    affiliated: 'Autonomous Institute affiliated to SPPU',
    latitude: 18.4638,
    longitude: 73.8682,
    established: 1983,
    students: 6200,
    image: '/colleges/vit-pune.jpg',
    website: 'https://www.vit.edu'
  },
  {
    id: 'mit-wpu',
    name: 'MIT World Peace University',
    shortName: 'MIT-WPU',
    area: 'Kothrud',
    type: 'Multi-Disciplinary University',
    affiliated: 'State Private University',
    latitude: 18.5184,
    longitude: 73.8155,
    established: 1983,
    students: 16000,
    image: '/colleges/mit-wpu.jpg',
    website: 'https://mitwpu.edu.in'
  },
  {
    id: 'fergusson',
    name: 'Fergusson College',
    shortName: 'FC Pune',
    area: 'Shivajinagar',
    type: 'Arts & Science College',
    affiliated: 'Autonomous College affiliated to SPPU (Est. 1885)',
    latitude: 18.5241,
    longitude: 73.8386,
    established: 1885,
    students: 8500,
    image: '/colleges/fergusson.jpg',
    website: 'https://fergusson.edu'
  },
  {
    id: 'sppu',
    name: 'Savitribai Phule Pune University',
    shortName: 'SPPU',
    area: 'Ganeshkhind',
    type: 'State Research University',
    affiliated: 'Oxford of the East',
    latitude: 18.5528,
    longitude: 73.8266,
    established: 1948,
    students: 650000,
    image: '/colleges/sppu.jpg',
    website: 'https://www.unipune.ac.in'
  },
  {
    id: 'pict',
    name: 'Pune Institute of Computer Technology',
    shortName: 'PICT',
    area: 'Dhankawadi',
    type: 'Computer Engineering & AI',
    affiliated: 'Affiliated to SPPU, NBA Accredited',
    latitude: 18.4576,
    longitude: 73.8507,
    established: 1983,
    students: 3800,
    image: '/colleges/pict.jpg',
    website: 'https://pict.edu'
  },
  {
    id: 'symbiosis-law',
    name: 'Symbiosis Law School',
    shortName: 'SLS Pune',
    area: 'Viman Nagar',
    type: 'Law School',
    affiliated: 'Symbiosis International University',
    latitude: 18.5755,
    longitude: 73.9080,
    established: 1977,
    students: 2600,
    image: '/colleges/symbiosis-law.jpg',
    website: 'https://www.symlaw.ac.in'
  },
  {
    id: 'ait-dighi',
    name: 'Army Institute of Technology',
    shortName: 'AIT Pune',
    area: 'Dighi',
    type: 'Engineering Institute',
    affiliated: 'Affiliated to SPPU, Army Welfare Org',
    latitude: 18.6069,
    longitude: 73.8755,
    established: 1994,
    students: 2200,
    image: '/colleges/ait-pune.jpg',
    website: 'https://aitpune.edu.in'
  },
  {
    id: 'mit-aoe',
    name: 'MIT Academy of Engineering',
    shortName: 'MIT AOE',
    area: 'Alandi',
    type: 'Autonomous Engineering Institute',
    affiliated: 'Autonomous Institute affiliated to SPPU (Est. 1999)',
    latitude: 18.67474,
    longitude: 73.89201,
    established: 1999,
    students: 4800,
    image: '/colleges/mit-aoe.jpg',
    website: 'https://mitaoe.ac.in'
  },
  {
    id: 'mit-acsc',
    name: 'MIT Arts, Commerce and Science College',
    shortName: 'MIT ACSC',
    area: 'Alandi',
    type: 'Autonomous Science & Commerce',
    affiliated: 'Affiliated to SPPU, NAAC Grade A (Est. 2007)',
    latitude: 18.67318,
    longitude: 73.88935,
    established: 2007,
    students: 3600,
    image: '/colleges/mit-acsc.jpg',
    website: 'https://mitacsc.ac.in'
  },
  {
    id: 'adypu',
    name: 'Ajeenkya DY Patil University',
    shortName: 'ADYPU',
    area: 'Charholi Budruk, Alandi Road',
    type: 'Innovation & Technology University',
    affiliated: 'State Private University (Est. 2015)',
    latitude: 18.62154,
    longitude: 73.91085,
    established: 2015,
    students: 5500,
    image: '/colleges/adypu.jpg',
    website: 'https://adypu.edu.in'
  },
  {
    id: 'dvcoe',
    name: 'Dnyanvilas College of Engineering',
    shortName: 'DVCOE',
    area: 'Gat No. 76, Dudulgaon, Pimpri-Chinchwad',
    type: 'Engineering & Technology',
    affiliated: 'Approved by AICTE & DTE (16354), Affiliated to SPPU',
    latitude: 18.6775,
    longitude: 73.8816,
    established: 2008,
    students: 1800,
    image: '/colleges/dvcoe.jpg',
    website: 'https://www.dvcoe.com'
  },
  {
    id: 'saint-dnyaneshwar-bed',
    name: "MAEER's Saint Dnyaneshwar B.Ed. College",
    shortName: 'St. Dnyaneshwar B.Ed',
    area: 'Opp. Gajanan Maharaj Mandir, Dehu Phata, Alandi',
    type: 'Teacher Education Institute (B.Ed)',
    affiliated: 'NCTE Approved, Affiliated to SPPU (Est. 2005)',
    latitude: 18.67248,
    longitude: 73.88939,
    established: 2005,
    students: 600,
    image: '/colleges/mit-acsc.jpg',
    website: 'https://mitalandicampus.edu.in'
  }
]

export const flatmateProfiles: FlatmateProfile[] = [
  {
    id: 'fm-1',
    name: 'Priya Sharma',
    age: 21,
    college: 'Fergusson College',
    course: 'BSc Computer Science',
    year: 2,
    budget: 9000,
    locality: 'Shivajinagar',
    gender: 'Female',
    diet: 'Vegetarian',
    sleepTime: 'Early bird (before 10pm)',
    studyHours: 6,
    cleanliness: 'Very tidy',
    hobbies: ['Reading', 'Yoga', 'Cooking'],
    lookingFor: 'Looking for a quiet, studious female flatmate near FC Road. Strictly non-smoker.',
    moveInDate: 'Nov 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'fm-2',
    name: 'Rahul Patil',
    age: 22,
    college: 'COEP Technological University',
    course: 'BTech Civil Engineering',
    year: 3,
    budget: 8500,
    locality: 'Deccan Gymkhana',
    gender: 'Male',
    diet: 'Non-Vegetarian',
    sleepTime: 'Night owl (after midnight)',
    studyHours: 4,
    cleanliness: 'Moderate',
    hobbies: ['Gaming', 'Cricket', 'Guitar'],
    lookingFor: 'Easygoing flatmate, preferably COEP or FC student. Sharing 2BHK near Goodluck Chowk.',
    moveInDate: 'Dec 2025',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'fm-3',
    name: 'Sneha Joshi',
    age: 20,
    college: 'MIT World Peace University',
    course: 'BBA',
    year: 1,
    budget: 10000,
    locality: 'Kothrud',
    gender: 'Female',
    diet: 'Vegetarian',
    sleepTime: 'Flexible',
    studyHours: 5,
    cleanliness: 'Moderate',
    hobbies: ['Dance', 'Badminton', 'Photography'],
    lookingFor: 'Friendly flatmate near MIT WPU. Looking to split a furnished 2BHK flat.',
    moveInDate: 'Nov 2025',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'fm-4',
    name: 'Arjun Mehta',
    age: 23,
    college: 'Symbiosis Institute of Technology',
    course: 'BTech Computer Science',
    year: 4,
    budget: 12000,
    locality: 'Hinjawadi',
    gender: 'Male',
    diet: 'Non-Vegetarian',
    sleepTime: 'Flexible',
    studyHours: 7,
    cleanliness: 'Very tidy',
    hobbies: ['Gym', 'Coding', 'Podcasts'],
    lookingFor: 'Tech-focused flatmate near Hinjawadi Phase 1. High-speed broadband a must.',
    moveInDate: 'Jan 2026',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'fm-5',
    name: 'Kavya Reddy',
    age: 21,
    college: 'Symbiosis Law School',
    course: 'BA LLB',
    year: 2,
    budget: 14000,
    locality: 'Viman Nagar',
    gender: 'Female',
    diet: 'Vegetarian',
    sleepTime: 'Night owl (after midnight)',
    studyHours: 8,
    cleanliness: 'Very tidy',
    hobbies: ['Moot Court', 'Running', 'Coffee Brewing'],
    lookingFor: 'Disciplined student flatmate. Quiet study atmosphere is very important.',
    moveInDate: 'Nov 2025',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'fm-6',
    name: 'Vishal Kulkarni',
    age: 22,
    college: 'Pune Institute of Computer Technology',
    course: 'BTech Information Technology',
    year: 3,
    budget: 8000,
    locality: 'Dhankawadi',
    gender: 'Male',
    diet: 'Non-Vegetarian',
    sleepTime: 'Flexible',
    studyHours: 5,
    cleanliness: 'Relaxed',
    hobbies: ['Football', 'Anime', 'Cooking'],
    lookingFor: 'Friendly and chill flatmate near PICT. I cook great weekend dinners!',
    moveInDate: 'Dec 2025',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'fm-7',
    name: 'Ananya Deshmukh',
    age: 20,
    college: 'Savitribai Phule Pune University',
    course: 'MSc Data Science',
    year: 1,
    budget: 11000,
    locality: 'Aundh',
    gender: 'Female',
    diet: 'Vegetarian',
    sleepTime: 'Early bird (before 10pm)',
    studyHours: 9,
    cleanliness: 'Very tidy',
    hobbies: ['Chess', 'Cycling', 'Classical Music'],
    lookingFor: 'Academic-minded student flatmate. Peaceful, organized home in Aundh.',
    moveInDate: 'Nov 2025',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'fm-8',
    name: 'Dev Naik',
    age: 24,
    college: 'MIT World Peace University',
    course: 'MBA Marketing',
    year: 1,
    budget: 15000,
    locality: 'Baner',
    gender: 'Male',
    diet: 'Non-Vegetarian',
    sleepTime: 'Flexible',
    studyHours: 6,
    cleanliness: 'Moderate',
    hobbies: ['Squash', 'Investing', 'Travel'],
    lookingFor: 'MBA or working professional flatmate. Clean society flat in Baner/Balewadi.',
    moveInDate: 'Jan 2026',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
  }
]

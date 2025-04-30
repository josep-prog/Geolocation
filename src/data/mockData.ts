import { Hospital, LocationOption } from '../types';

// Mock districts in Rwanda
export const districts: LocationOption[] = [
  { label: 'Gasabo', value: 'gasabo' },
  { label: 'Kicukiro', value: 'kicukiro' },
  { label: 'Nyarugenge', value: 'nyarugenge' },
  { label: 'Burera', value: 'burera' },
  { label: 'Musanze', value: 'musanze' },
  { label: 'Gakenke', value: 'gakenke' },
  { label: 'Gicumbi', value: 'gicumbi' },
  { label: 'Rulindo', value: 'rulindo' },
  { label: 'Kayonza', value: 'kayonza' },
  { label: 'Kirehe', value: 'kirehe' },
  { label: 'Ngoma', value: 'ngoma' },
  { label: 'Bugesera', value: 'bugesera' },
  { label: 'Gatsibo', value: 'gatsibo' },
  { label: 'Nyagatare', value: 'nyagatare' },
  { label: 'Rwamagana', value: 'rwamagana' },
  { label: 'Karongi', value: 'karongi' },
  { label: 'Ngororero', value: 'ngororero' },
  { label: 'Nyabihu', value: 'nyabihu' },
  { label: 'Nyamasheke', value: 'nyamasheke' },
  { label: 'Rubavu', value: 'rubavu' },
  { label: 'Rusizi', value: 'rusizi' },
  { label: 'Rutsiro', value: 'rutsiro' },
  { label: 'Gisagara', value: 'gisagara' },
  { label: 'Huye', value: 'huye' },
  { label: 'Kamonyi', value: 'kamonyi' },
  { label: 'Muhanga', value: 'muhanga' },
  { label: 'Nyamagabe', value: 'nyamagabe' },
  { label: 'Nyanza', value: 'nyanza' },
  { label: 'Nyaruguru', value: 'nyaruguru' },
  { label: 'Ruhango', value: 'ruhango' }
];

// Mock sectors by district
export const sectors: Record<string, LocationOption[]> = {
  gasabo: [
    { label: 'Bumbogo', value: 'bumbogo' },
    { label: 'Gatsata', value: 'gatsata' },
    { label: 'Gikomero', value: 'gikomero' },
    { label: 'Gisozi', value: 'gisozi' },
    { label: 'Jabana', value: 'jabana' },
    { label: 'Jali', value: 'jali' },
    { label: 'Kacyiru', value: 'kacyiru' },
    { label: 'Kimihurura', value: 'kimihurura' },
    { label: 'Kimironko', value: 'kimironko' },
    { label: 'Kinyinya', value: 'kinyinya' },
    { label: 'Ndera', value: 'ndera' },
    { label: 'Nduba', value: 'nduba' },
    { label: 'Remera', value: 'remera' },
    { label: 'Rusororo', value: 'rusororo' },
    { label: 'Rutunga', value: 'rutunga' }
  ],
  kicukiro: [
    { label: 'Gahanga', value: 'gahanga' },
    { label: 'Gatenga', value: 'gatenga' },
    { label: 'Gikondo', value: 'gikondo' },
    { label: 'Kagarama', value: 'kagarama' },
    { label: 'Kanombe', value: 'kanombe' },
    { label: 'Kicukiro', value: 'kicukiro' },
    { label: 'Kigarama', value: 'kigarama' },
    { label: 'Masaka', value: 'masaka' },
    { label: 'Niboye', value: 'niboye' },
    { label: 'Nyarugunga', value: 'nyarugunga' }
  ],
  nyarugenge: [
    { label: 'Gitega', value: 'gitega' },
    { label: 'Kanyinya', value: 'kanyinya' },
    { label: 'Kigali', value: 'kigali' },
    { label: 'Kimisagara', value: 'kimisagara' },
    { label: 'Mageragere', value: 'mageragere' },
    { label: 'Muhima', value: 'muhima' },
    { label: 'Nyakabanda', value: 'nyakabanda' },
    { label: 'Nyamirambo', value: 'nyamirambo' },
    { label: 'Nyarugenge', value: 'nyarugenge' },
    { label: 'Rwezamenyo', value: 'rwezamenyo' }
  ],
  rusizi: [
    { label: 'Bugarama', value: 'bugarama' },
    { label: 'Butare', value: 'butare' },
    { label: 'Bweyeye', value: 'bweyeye' },
    { label: 'Gashonga', value: 'gashonga' },
    { label: 'Giheke', value: 'giheke' },
    { label: 'Gihundwe', value: 'gihundwe' },
    { label: 'Gikundamvura', value: 'gikundamvura' },
    { label: 'Gitambi', value: 'gitambi' },
    { label: 'Kamembe', value: 'kamembe' },
    { label: 'Muganza', value: 'muganza' },
    { label: 'Mururu', value: 'mururu' },
    { label: 'Nkanka', value: 'nkanka' },
    { label: 'Nkombo', value: 'nkombo' },
    { label: 'Nkungu', value: 'nkungu' },
    { label: 'Nyakabuye', value: 'nyakabuye' },
    { label: 'Nyakarenzo', value: 'nyakarenzo' },
    { label: 'Nzahaha', value: 'nzahaha' },
    { label: 'Rwimbogo', value: 'rwimbogo' }
  ]
};

// Mock cells by sector
export const cells: Record<string, LocationOption[]> = {
  remera: [
    { label: 'Nyabisindu', value: 'nyabisindu' },
    { label: 'Rukiri I', value: 'rukiri_i' },
    { label: 'Rukiri II', value: 'rukiri_ii' },
    { label: 'Runyonza', value: 'runyonza' },
    { label: 'Rwimbogo', value: 'rwimbogo' }
  ],
  kimironko: [
    { label: 'Bibare', value: 'bibare' },
    { label: 'Kibagabaga', value: 'kibagabaga' },
    { label: 'Kimironko', value: 'kimironko' },
    { label: 'Nyagatovu', value: 'nyagatovu' }
  ],
  kacyiru: [
    { label: 'Kamatamu', value: 'kamatamu' },
    { label: 'Kamutwa', value: 'kamutwa' },
    { label: 'Kinyinya', value: 'kinyinya' }
  ],
  kamembe: [
    { label: 'Cyangugu', value: 'cyangugu' },
    { label: 'Gihundwe', value: 'gihundwe' },
    { label: 'Kamembe', value: 'kamembe' },
    { label: 'Rwimbogo', value: 'rwimbogo' }
  ],
  gihundwe: [
    { label: 'Burunga', value: 'burunga' },
    { label: 'Cyaruhogo', value: 'cyaruhogo' },
    { label: 'Gihundwe', value: 'gihundwe' },
    { label: 'Murangi', value: 'murangi' }
  ]
};

// Mock hospitals data
export const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'Kigali University Teaching Hospital (CHUK)',
    availableSlots: 8,
    coordinates: {
      latitude: -1.9441,
      longitude: 30.0619
    },
    district: 'nyarugenge',
    sector: 'gitega',
    cell: 'kigali',
    address: 'KN 4 Ave, Kigali'
  },
  {
    id: '2',
    name: 'King Faisal Hospital',
    availableSlots: 5,
    coordinates: {
      latitude: -1.9563,
      longitude: 30.0911
    },
    district: 'gasabo',
    sector: 'kacyiru',
    cell: 'kamatamu',
    address: 'KG 544 St, Kigali'
  },
  {
    id: '3',
    name: 'Rwanda Military Hospital',
    availableSlots: 3,
    coordinates: {
      latitude: -1.9824,
      longitude: 30.0427
    },
    district: 'kicukiro',
    sector: 'kanombe',
    cell: 'nyarugunga',
    address: 'KK 15 Ave, Kigali'
  },
  {
    id: '4',
    name: 'Gihundwe Hospital',
    availableSlots: 5,
    coordinates: {
      latitude: -2.4845,
      longitude: 28.9087
    },
    district: 'rusizi',
    sector: 'gihundwe',
    cell: 'gihundwe',
    address: 'Rusizi District Hospital Road'
  },
  {
    id: '5',
    name: 'Kamembe Clinic',
    availableSlots: 3,
    coordinates: {
      latitude: -2.4839,
      longitude: 28.9077
    },
    district: 'rusizi',
    sector: 'kamembe',
    cell: 'kamembe',
    address: 'Main Street, Kamembe'
  },
  {
    id: '6',
    name: 'Rusizi Medical Center',
    availableSlots: 2,
    coordinates: {
      latitude: -2.4865,
      longitude: 28.9067
    },
    district: 'rusizi',
    sector: 'kamembe',
    cell: 'cyangugu',
    address: 'Hospital Road, Rusizi'
  },
  {
    id: '7',
    name: 'Remera Health Center',
    availableSlots: 4,
    coordinates: {
      latitude: -1.9505,
      longitude: 30.1127
    },
    district: 'gasabo',
    sector: 'remera',
    cell: 'rukiri_i',
    address: 'KG 11 Ave, Remera'
  },
  {
    id: '8',
    name: 'Kimironko Medical Plaza',
    availableSlots: 7,
    coordinates: {
      latitude: -1.9395,
      longitude: 30.1195
    },
    district: 'gasabo',
    sector: 'kimironko',
    cell: 'kibagabaga',
    address: 'KG 8 Ave, Kimironko'
  }
];
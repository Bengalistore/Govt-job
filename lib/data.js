// Static reference data used for home page filters and admin forms.
// Feel free to edit/expand these lists any time — no database migration needed.

export const CATEGORIES = [
  "Railway",
  "Banking",
  "SSC",
  "UPSC",
  "State Govt",
  "Police & Defence",
  "Teaching",
  "PSU",
  "Medical & Health",
  "Court & Judiciary",
  "Engineering",
  "Private Jobs"
];

export const JOB_TYPES = [
  "Government",
  "Private",
  "Bank",
  "Railway",
  "PSU",
  "Defence"
];

// State => district list (major states expanded; smaller states/UTs listed with
// their core districts — extend anytime by editing this file).
export const STATES = {
  "All India": [],
  "West Bengal": [
    "Kolkata", "Howrah", "Hooghly", "North 24 Parganas", "South 24 Parganas",
    "Nadia", "Murshidabad", "Purba Bardhaman", "Paschim Bardhaman", "Birbhum",
    "Malda", "Darjeeling", "Jalpaiguri", "Cooch Behar", "Purulia",
    "Bankura", "Paschim Medinipur", "Purba Medinipur", "Alipurduar", "Kalimpong"
  ],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur",
    "Kolhapur", "Amravati", "Nanded", "Jalgaon", "Akola", "Latur", "Satara"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Prayagraj", "Ghaziabad",
    "Noida", "Bareilly", "Gorakhpur", "Aligarh", "Moradabad", "Jhansi", "Saharanpur"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia",
    "Begusarai", "Katihar", "Munger", "Chapra", "Nalanda", "Rohtas"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer",
    "Alwar", "Bharatpur", "Sikar", "Bhilwara"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar",
    "Rewa", "Satna", "Ratlam"
  ],
  "Karnataka": [
    "Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi",
    "Kalaburagi", "Ballari", "Shivamogga"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"
  ],
  "Assam": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"
  ],
  "Punjab": [
    "Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"
  ],
  "Haryana": [
    "Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Karnal"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur"
  ],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Haldwani"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Solan", "Kangra"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
  "Goa": ["North Goa", "South Goa"],
  "Tripura": ["Agartala", "Udaipur"],
  "Manipur": ["Imphal East", "Imphal West"],
  "Meghalaya": ["Shillong", "Tura"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Mizoram": ["Aizawl"],
  "Sikkim": ["Gangtok"],
  "Arunachal Pradesh": ["Itanagar"],
  "Chandigarh (UT)": ["Chandigarh"],
  "Puducherry": ["Puducherry", "Karaikal"]
};

export const STATE_NAMES = Object.keys(STATES);

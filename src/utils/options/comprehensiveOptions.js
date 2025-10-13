export const RELIGION_CASTE_MAPPING = {
  hindu: {
    castes: [
      { value: 'brahmin', label: 'Brahmin' },
      { value: 'kshatriya', label: 'Kshatriya' },
      { value: 'vaishya', label: 'Vaishya' },
      { value: 'shudra', label: 'Shudra' },
      { value: 'other', label: 'Other' }
    ],
    subcastes: {
      brahmin: [
        { value: 'iyer', label: 'Iyer' },
        { value: 'iyengar', label: 'Iyengar' },
        { value: 'bhatt', label: 'Bhatt' },
        { value: 'pandit', label: 'Pandit' },
        { value: 'other', label: 'Other' }
      ],
      kshatriya: [
        { value: 'rajput', label: 'Rajput' },
        { value: 'thakur', label: 'Thakur' },
        { value: 'khatri', label: 'Khatri' },
        { value: 'other', label: 'Other' }
      ],
      vaishya: [
        { value: 'baniya', label: 'Baniya' },
        { value: 'marwari', label: 'Marwari' },
        { value: 'jain', label: 'Jain' },
        { value: 'other', label: 'Other' }
      ],
      shudra: [
        { value: 'yadav', label: 'Yadav' },
        { value: 'kurmi', label: 'Kurmi' },
        { value: 'other', label: 'Other' }
      ],
      other: [
        { value: 'other', label: 'Other' }
      ]
    }
  },
  muslim: {
    castes: [
      { value: 'syed', label: 'Syed' },
      { value: 'sheikh', label: 'Sheikh' },
      { value: 'pathan', label: 'Pathan' },
      { value: 'moghul', label: 'Moghul' },
      { value: 'other', label: 'Other' }
    ],
    subcastes: {
      syed: [
        { value: 'syed_zaidi', label: 'Syed Zaidi' },
        { value: 'syed_rizvi', label: 'Syed Rizvi' },
        { value: 'other', label: 'Other' }
      ],
      sheikh: [
        { value: 'sheikh_ansari', label: 'Sheikh Ansari' },
        { value: 'sheikh_qureshi', label: 'Sheikh Qureshi' },
        { value: 'other', label: 'Other' }
      ],
      pathan: [
        { value: 'pathan_afridi', label: 'Pathan Afridi' },
        { value: 'pathan_khattak', label: 'Pathan Khattak' },
        { value: 'other', label: 'Other' }
      ],
      moghul: [
        { value: 'moghul_chughtai', label: 'Moghul Chughtai' },
        { value: 'moghul_timurid', label: 'Moghul Timurid' },
        { value: 'other', label: 'Other' }
      ],
      other: [
        { value: 'other', label: 'Other' }
      ]
    }
  },
  christian: {
    castes: [
      { value: 'syrian_christian', label: 'Syrian Christian' },
      { value: 'latin_christian', label: 'Latin Christian' },
      { value: 'protestant', label: 'Protestant' },
      { value: 'other', label: 'Other' }
    ],
    subcastes: {
      syrian_christian: [
        { value: 'syrian_orthodox', label: 'Syrian Orthodox' },
        { value: 'syrian_catholic', label: 'Syrian Catholic' },
        { value: 'other', label: 'Other' }
      ],
      latin_christian: [
        { value: 'latin_catholic', label: 'Latin Catholic' },
        { value: 'other', label: 'Other' }
      ],
      protestant: [
        { value: 'anglican', label: 'Anglican' },
        { value: 'methodist', label: 'Methodist' },
        { value: 'other', label: 'Other' }
      ],
      other: [
        { value: 'other', label: 'Other' }
      ]
    }
  },
  sikh: {
    castes: [
      { value: 'jat', label: 'Jat' },
      { value: 'khatri', label: 'Khatri' },
      { value: 'arora', label: 'Arora' },
      { value: 'ramgarhia', label: 'Ramgarhia' },
      { value: 'other', label: 'Other' }
    ],
    subcastes: {
      jat: [
        { value: 'jat_sikh', label: 'Jat Sikh' },
        { value: 'other', label: 'Other' }
      ],
      khatri: [
        { value: 'khatri_sikh', label: 'Khatri Sikh' },
        { value: 'other', label: 'Other' }
      ],
      arora: [
        { value: 'arora_sikh', label: 'Arora Sikh' },
        { value: 'other', label: 'Other' }
      ],
      ramgarhia: [
        { value: 'ramgarhia_sikh', label: 'Ramgarhia Sikh' },
        { value: 'other', label: 'Other' }
      ],
      other: [
        { value: 'other', label: 'Other' }
      ]
    }
  },
  jain: {
    castes: [
      { value: 'digambar', label: 'Digambar' },
      { value: 'shwetambar', label: 'Shwetambar' },
      { value: 'terapanth', label: 'Terapanth' },
      { value: 'other', label: 'Other' }
    ],
    subcastes: {
      digambar: [
        { value: 'digambar_bispanth', label: 'Digambar Bispanth' },
        { value: 'digambar_terapanth', label: 'Digambar Terapanth' },
        { value: 'other', label: 'Other' }
      ],
      shwetambar: [
        { value: 'shwetambar_murtipujak', label: 'Shwetambar Murtipujak' },
        { value: 'shwetambar_sthanakvasi', label: 'Shwetambar Sthanakvasi' },
        { value: 'other', label: 'Other' }
      ],
      terapanth: [
        { value: 'terapanth_samaj', label: 'Terapanth Samaj' },
        { value: 'other', label: 'Other' }
      ],
      other: [
        { value: 'other', label: 'Other' }
      ]
    }
  },
  buddhist: {
    castes: [
      { value: 'theravada', label: 'Theravada' },
      { value: 'mahayana', label: 'Mahayana' },
      { value: 'vajrayana', label: 'Vajrayana' },
      { value: 'other', label: 'Other' }
    ],
    subcastes: {
      theravada: [
        { value: 'theravada_sri_lankan', label: 'Theravada Sri Lankan' },
        { value: 'theravada_thai', label: 'Theravada Thai' },
        { value: 'other', label: 'Other' }
      ],
      mahayana: [
        { value: 'mahayana_zen', label: 'Mahayana Zen' },
        { value: 'mahayana_pure_land', label: 'Mahayana Pure Land' },
        { value: 'other', label: 'Other' }
      ],
      vajrayana: [
        { value: 'vajrayana_tibetan', label: 'Vajrayana Tibetan' },
        { value: 'other', label: 'Other' }
      ],
      other: [
        { value: 'other', label: 'Other' }
      ]
    }
  },
  other: {
    castes: [
      { value: 'other', label: 'Other' }
    ],
    subcastes: {
      other: [
        { value: 'other', label: 'Other' }
      ]
    }
  }
};

// Education-Field of Study mappings
export const EDUCATION_FIELD_MAPPING = {
  high_school: {
    fields: [
      { value: 'science', label: 'Science' },
      { value: 'commerce', label: 'Commerce' },
      { value: 'arts', label: 'Arts' },
      { value: 'other', label: 'Other' }
    ]
  },
  diploma: {
    fields: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'medical', label: 'Medical' },
      { value: 'management', label: 'Management' },
      { value: 'computer_science', label: 'Computer Science' },
      { value: 'other', label: 'Other' }
    ]
  },
  graduate: {
    fields: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'medical', label: 'Medical' },
      { value: 'management', label: 'Management' },
      { value: 'computer_science', label: 'Computer Science' },
      { value: 'commerce', label: 'Commerce' },
      { value: 'arts', label: 'Arts' },
      { value: 'science', label: 'Science' },
      { value: 'law', label: 'Law' },
      { value: 'pharmacy', label: 'Pharmacy' },
      { value: 'nursing', label: 'Nursing' },
      { value: 'other', label: 'Other' }
    ]
  },
  post_graduate: {
    fields: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'medical', label: 'Medical' },
      { value: 'management', label: 'Management' },
      { value: 'computer_science', label: 'Computer Science' },
      { value: 'commerce', label: 'Commerce' },
      { value: 'arts', label: 'Arts' },
      { value: 'science', label: 'Science' },
      { value: 'law', label: 'Law' },
      { value: 'pharmacy', label: 'Pharmacy' },
      { value: 'nursing', label: 'Nursing' },
      { value: 'education', label: 'Education' },
      { value: 'psychology', label: 'Psychology' },
      { value: 'other', label: 'Other' }
    ]
  },
  doctorate: {
    fields: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'medical', label: 'Medical' },
      { value: 'management', label: 'Management' },
      { value: 'computer_science', label: 'Computer Science' },
      { value: 'science', label: 'Science' },
      { value: 'arts', label: 'Arts' },
      { value: 'law', label: 'Law' },
      { value: 'pharmacy', label: 'Pharmacy' },
      { value: 'education', label: 'Education' },
      { value: 'psychology', label: 'Psychology' },
      { value: 'other', label: 'Other' }
    ]
  }
};

// Comprehensive Industry Options
export const COMPREHENSIVE_INDUSTRY_OPTIONS = [
  { value: 'it_software', label: 'IT & Software' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'construction', label: 'Construction' },
  { value: 'logistics', label: 'Logistics & Transportation' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'government', label: 'Government & Public Sector' },
  { value: 'non_profit', label: 'Non-Profit' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'research', label: 'Research & Development' },
  { value: 'sports', label: 'Sports & Fitness' },
  { value: 'fashion', label: 'Fashion & Textiles' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'other', label: 'Other' }
];

// State-City mappings (comprehensive list)
export const STATE_CITY_MAPPING = {
  andhra_pradesh: [
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'visakhapatnam', label: 'Visakhapatnam' },
    { value: 'vijayawada', label: 'Vijayawada' },
    { value: 'guntur', label: 'Guntur' },
    { value: 'tirupati', label: 'Tirupati' },
    { value: 'other', label: 'Other' }
  ],
  bihar: [
    { value: 'patna', label: 'Patna' },
    { value: 'gaya', label: 'Gaya' },
    { value: 'bhagalpur', label: 'Bhagalpur' },
    { value: 'muzaffarpur', label: 'Muzaffarpur' },
    { value: 'darbhanga', label: 'Darbhanga' },
    { value: 'other', label: 'Other' }
  ],
  delhi: [
    { value: 'new_delhi', label: 'New Delhi' },
    { value: 'central_delhi', label: 'Central Delhi' },
    { value: 'east_delhi', label: 'East Delhi' },
    { value: 'west_delhi', label: 'West Delhi' },
    { value: 'north_delhi', label: 'North Delhi' },
    { value: 'south_delhi', label: 'South Delhi' },
    { value: 'other', label: 'Other' }
  ],
  gujarat: [
    { value: 'ahmedabad', label: 'Ahmedabad' },
    { value: 'surat', label: 'Surat' },
    { value: 'vadodara', label: 'Vadodara' },
    { value: 'rajkot', label: 'Rajkot' },
    { value: 'bhavnagar', label: 'Bhavnagar' },
    { value: 'other', label: 'Other' }
  ],
  karnataka: [
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'mysore', label: 'Mysore' },
    { value: 'hubli', label: 'Hubli' },
    { value: 'mangalore', label: 'Mangalore' },
    { value: 'belgaum', label: 'Belgaum' },
    { value: 'other', label: 'Other' }
  ],
  kerala: [
    { value: 'thiruvananthapuram', label: 'Thiruvananthapuram' },
    { value: 'kochi', label: 'Kochi' },
    { value: 'kozhikode', label: 'Kozhikode' },
    { value: 'thrissur', label: 'Thrissur' },
    { value: 'kollam', label: 'Kollam' },
    { value: 'other', label: 'Other' }
  ],
  maharashtra: [
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'pune', label: 'Pune' },
    { value: 'nagpur', label: 'Nagpur' },
    { value: 'nashik', label: 'Nashik' },
    { value: 'aurangabad', label: 'Aurangabad' },
    { value: 'other', label: 'Other' }
  ],
  tamil_nadu: [
    { value: 'chennai', label: 'Chennai' },
    { value: 'coimbatore', label: 'Coimbatore' },
    { value: 'madurai', label: 'Madurai' },
    { value: 'tiruchirapalli', label: 'Tiruchirapalli' },
    { value: 'salem', label: 'Salem' },
    { value: 'other', label: 'Other' }
  ],
  uttar_pradesh: [
    { value: 'lucknow', label: 'Lucknow' },
    { value: 'kanpur', label: 'Kanpur' },
    { value: 'agra', label: 'Agra' },
    { value: 'varanasi', label: 'Varanasi' },
    { value: 'meerut', label: 'Meerut' },
    { value: 'other', label: 'Other' }
  ],
  west_bengal: [
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'asansol', label: 'Asansol' },
    { value: 'siliguri', label: 'Siliguri' },
    { value: 'durgapur', label: 'Durgapur' },
    { value: 'bardhaman', label: 'Bardhaman' },
    { value: 'other', label: 'Other' }
  ]
};

// Physical Attributes Options
export const HEIGHT_OPTIONS = [
  { value: '4ft_0in', label: '4\'0"' },
  { value: '4ft_1in', label: '4\'1"' },
  { value: '4ft_2in', label: '4\'2"' },
  { value: '4ft_3in', label: '4\'3"' },
  { value: '4ft_4in', label: '4\'4"' },
  { value: '4ft_5in', label: '4\'5"' },
  { value: '4ft_6in', label: '4\'6"' },
  { value: '4ft_7in', label: '4\'7"' },
  { value: '4ft_8in', label: '4\'8"' },
  { value: '4ft_9in', label: '4\'9"' },
  { value: '4ft_10in', label: '4\'10"' },
  { value: '4ft_11in', label: '4\'11"' },
  { value: '5ft_0in', label: '5\'0"' },
  { value: '5ft_1in', label: '5\'1"' },
  { value: '5ft_2in', label: '5\'2"' },
  { value: '5ft_3in', label: '5\'3"' },
  { value: '5ft_4in', label: '5\'4"' },
  { value: '5ft_5in', label: '5\'5"' },
  { value: '5ft_6in', label: '5\'6"' },
  { value: '5ft_7in', label: '5\'7"' },
  { value: '5ft_8in', label: '5\'8"' },
  { value: '5ft_9in', label: '5\'9"' },
  { value: '5ft_10in', label: '5\'10"' },
  { value: '5ft_11in', label: '5\'11"' },
  { value: '6ft_0in', label: '6\'0"' },
  { value: '6ft_1in', label: '6\'1"' },
  { value: '6ft_2in', label: '6\'2"' },
  { value: '6ft_3in', label: '6\'3"' },
  { value: '6ft_4in', label: '6\'4"' },
  { value: '6ft_5in', label: '6\'5"' },
  { value: '6ft_6in', label: '6\'6"' },
  { value: '6ft_7in', label: '6\'7"' },
  { value: '6ft_8in', label: '6\'8"' },
  { value: '6ft_9in', label: '6\'9"' },
  { value: '6ft_10in', label: '6\'10"' },
  { value: '6ft_11in', label: '6\'11"' },
  { value: '7ft_0in', label: '7\'0"' }
];

export const BODY_TYPE_OPTIONS = [
  { value: 'slim', label: 'Slim' },
  { value: 'athletic', label: 'Athletic' },
  { value: 'average', label: 'Average' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'muscular', label: 'Muscular' },
  { value: 'petite', label: 'Petite' },
  { value: 'curvy', label: 'Curvy' },
  { value: 'other', label: 'Other' }
];

export const COMPLEXION_OPTIONS = [
  { value: 'very_fair', label: 'Very Fair' },
  { value: 'fair', label: 'Fair' },
  { value: 'wheatish', label: 'Wheatish' },
  { value: 'wheatish_brown', label: 'Wheatish Brown' },
  { value: 'dark', label: 'Dark' },
  { value: 'other', label: 'Other' }
];

export const FITNESS_LEVEL_OPTIONS = [
  { value: 'very_active', label: 'Very Active' },
  { value: 'active', label: 'Active' },
  { value: 'moderately_active', label: 'Moderately Active' },
  { value: 'lightly_active', label: 'Lightly Active' },
  { value: 'sedentary', label: 'Sedentary' }
];

// Family Details Options
export const FATHER_OCCUPATION_OPTIONS = [
  { value: 'government_job', label: 'Government Job' },
  { value: 'private_job', label: 'Private Job' },
  { value: 'business', label: 'Business' },
  { value: 'retired', label: 'Retired' },
  { value: 'not_working', label: 'Not Working' },
  { value: 'deceased', label: 'Deceased' },
  { value: 'other', label: 'Other' }
];

export const MOTHER_OCCUPATION_OPTIONS = [
  { value: 'government_job', label: 'Government Job' },
  { value: 'private_job', label: 'Private Job' },
  { value: 'business', label: 'Business' },
  { value: 'homemaker', label: 'Homemaker' },
  { value: 'retired', label: 'Retired' },
  { value: 'not_working', label: 'Not Working' },
  { value: 'deceased', label: 'Deceased' },
  { value: 'other', label: 'Other' }
];

export const FAMILY_INCOME_OPTIONS = [
  { value: '0-2_lpa', label: '0-2 LPA' },
  { value: '2-5_lpa', label: '2-5 LPA' },
  { value: '5-10_lpa', label: '5-10 LPA' },
  { value: '10-20_lpa', label: '10-20 LPA' },
  { value: '20-50_lpa', label: '20-50 LPA' },
  { value: '50+_lpa', label: '50+ LPA' }
];

// Age Range Options for Partner Preferences
export const AGE_OPTIONS = [
  { value: 18, label: '18' },
  { value: 19, label: '19' },
  { value: 20, label: '20' },
  { value: 21, label: '21' },
  { value: 22, label: '22' },
  { value: 23, label: '23' },
  { value: 24, label: '24' },
  { value: 25, label: '25' },
  { value: 26, label: '26' },
  { value: 27, label: '27' },
  { value: 28, label: '28' },
  { value: 29, label: '29' },
  { value: 30, label: '30' },
  { value: 31, label: '31' },
  { value: 32, label: '32' },
  { value: 33, label: '33' },
  { value: 34, label: '34' },
  { value: 35, label: '35' },
  { value: 36, label: '36' },
  { value: 37, label: '37' },
  { value: 38, label: '38' },
  { value: 39, label: '39' },
  { value: 40, label: '40' },
  { value: 41, label: '41' },
  { value: 42, label: '42' },
  { value: 43, label: '43' },
  { value: 44, label: '44' },
  { value: 45, label: '45' },
  { value: 46, label: '46' },
  { value: 47, label: '47' },
  { value: 48, label: '48' },
  { value: 49, label: '49' },
  { value: 50, label: '50' },
  { value: 51, label: '51' },
  { value: 52, label: '52' },
  { value: 53, label: '53' },
  { value: 54, label: '54' },
  { value: 55, label: '55' },
  { value: 56, label: '56' },
  { value: 57, label: '57' },
  { value: 58, label: '58' },
  { value: 59, label: '59' },
  { value: 60, label: '60' }
];

// Height Range Options for Partner Preferences (same as personal height options)
export const PARTNER_HEIGHT_OPTIONS = HEIGHT_OPTIONS;

// Marital Status Options
export const MARITAL_STATUS_OPTIONS = [
  'Never Married',
  'Awaiting Divorce',
  'Divorced',
  'Widowed',
  'Annulled',
  'Married'
];

// Religion Options
export const RELIGION_OPTIONS = [
  'Hindu',
  'Muslim',
  'Sikh',
  'Christian',
  'Buddhist',
  'Jain',
  'Parsi',
  'Jewish',
  'Bahai'
];

// Mother Tongue Options
export const MOTHER_TONGUE_OPTIONS = [
  'Hindi',
  'English',
  'Bengali',
  'Telugu',
  'Marathi',
  'Tamil',
  'Urdu',
  'Gujarati',
  'Kannada',
  'Odia',
  'Punjabi',
  'Malayalam',
  'Assamese',
  'Maithili',
  'Santali',
  'Kashmiri',
  'Nepali',
  'Sindhi',
  'Konkani',
  'Dogri',
  'Manipuri',
  'Bodo',
  'Sanskrit',
  'French',
  'Spanish',
  'German',
  'Chinese',
  'Japanese',
  'Arabic',
  'Russian',
  'Portuguese',
  'Italian'
];

// Education Options
export const EDUCATION_OPTIONS = [
  'High School',
  'Diploma',
  'Graduate',
  'Post Graduate',
  'Doctorate',
  'Other'
];

// Country Options
export const COUNTRY_OPTIONS = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'United Arab Emirates',
  'Singapore',
  'Germany',
  'France',
  'Japan',
  'Other'
];

// State Options
export const STATE_OPTIONS = Object.keys(STATE_CITY_MAPPING).map(state => ({
  value: state,
  label: state.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}));

// Helper functions for dependent dropdowns
export const getCasteOptions = (religion) => {
  return RELIGION_CASTE_MAPPING[religion]?.castes || [];
};

export const getSubCasteOptions = (religion, caste) => {
  return RELIGION_CASTE_MAPPING[religion]?.subcastes?.[caste] || [];
};

export const getFieldOfStudyOptions = (education) => {
  return EDUCATION_FIELD_MAPPING[education]?.fields || [];
};

export const getCityOptions = (state) => {
  return STATE_CITY_MAPPING[state] || [];
};

// Export all options as default object
export default {
  RELIGION_CASTE_MAPPING,
  EDUCATION_FIELD_MAPPING,
  COMPREHENSIVE_INDUSTRY_OPTIONS,
  STATE_CITY_MAPPING,
  HEIGHT_OPTIONS,
  BODY_TYPE_OPTIONS,
  COMPLEXION_OPTIONS,
  FITNESS_LEVEL_OPTIONS,
  FATHER_OCCUPATION_OPTIONS,
  MOTHER_OCCUPATION_OPTIONS,
  FAMILY_INCOME_OPTIONS,
  AGE_OPTIONS,
  PARTNER_HEIGHT_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  RELIGION_OPTIONS,
  MOTHER_TONGUE_OPTIONS,
  EDUCATION_OPTIONS,
  COUNTRY_OPTIONS,
  STATE_OPTIONS,
  getCasteOptions,
  getSubCasteOptions,
  getFieldOfStudyOptions,
  getCityOptions
};
// Profile Test Utility for abinash@yopmail.com
// This file contains test functions to verify profile data and functionality

export const testUserCredentials = {
  email: "abinash@yopmail.com",
  password: "Abinash@123"
};

// Mock profile data for testing (this would come from your actual database)
export const mockAbinashProfile = {
  _id: "abinash_user_id",
  name: "Abinash",
  email: "abinash@yopmail.com",
  phoneNumber: "9876543210",
  customId: "ABIN1234",
  profileFor: "self",
  gender: "male",
  dob: "1995-06-15T00:00:00.000Z", // June 15, 1995
  state: "Maharashtra",
  city: "Mumbai",
  location: "Mumbai, Maharashtra",
  religion: "Hindu",
  caste: "Brahmin",
  subCaste: "Brahmin - Traditional",
  motherTongue: ["Hindi", "English"],
  maritalStatus: "never_married",
  highestQualification: "B.Tech",
  fieldOfStudy: "Computer Science",
  occupation: "Software Engineer",
  industry: "Technology",
  annualIncome: "10-15 Lakh",
  education: "B.Tech",
  height: "5'8\"",
  weight: "70 kg",
  bodyType: "Average",
  complexion: "Wheatish",
  diet: "Vegetarian",
  drinkingHabits: "Never",
  smokingHabits: "Never",
  fitnessLevel: "Moderately Active",
  hobbies: ["Coding", "Reading", "Gaming", "Traveling"],
  interests: ["Technology", "Music", "Movies", "Fitness"],
  languagesKnown: ["Hindi", "English", "Marathi"],
  petPreferences: "Dog Lover",
  fatherOccupation: "Business Owner",
  motherOccupation: "Teacher",
  brothers: 1,
  brothersMarried: true,
  sisters: 0,
  sistersMarried: false,
  familyType: "Nuclear",
  familyIncome: "15-25 Lakh",
  nativePlace: "Mumbai",
  familyStatus: "Upper Middle Class",
  about: "I am a software engineer from Mumbai, passionate about technology and looking for a life partner who shares similar values and interests. I believe in traditional values and am looking for someone who understands the importance of family.",
  photos: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  ],
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  agreeToTerms: true,
  role: "user",
  isOtpVerified: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  isIdVerified: true,
  isPhotoVerified: true,
  isVerified: true,
  isActive: true,
  isOnline: true,
  lastSeen: "Online",
  profileCompletion: 95,
  hasShownInterest: false,
  hasShownSuperInterest: false,
  isShortlisted: false,
  matchScore: 85,
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-20T15:45:00.000Z",
  
  // Partner preferences
  preferences: {
    ageRange: {
      min: 25,
      max: 30
    },
    heightRange: {
      min: "5'2\"",
      max: "5'8\""
    },
    maritalStatus: "never_married",
    religion: "Hindu",
    education: "B.Tech",
    profession: "Software Engineer",
    location: "Mumbai",
    diet: "Vegetarian",
    qualities: ["Family Oriented", "Career Focused", "Good Looking", "Well Educated"],
    dealBreakers: ["Smoking", "Drinking", "Non-Vegetarian"],
    educationPref: "B.Tech",
    occupationPref: ["Software Engineer", "Doctor", "Teacher"],
    annualIncomePref: "5-15 Lakh",
    lifestyleExpectations: {
      diet: "Vegetarian",
      drinking: "Never",
      smoking: "Never"
    },
    religionCastePref: "Hindu",
    locationPref: "Mumbai",
    relocation: "No",
    familyOrientation: "Traditional",
    maritalStatusPref: "never_married"
  }
};

// Test functions to verify profile data
export const testProfileData = {
  // Test basic information
  testBasicInfo: (profile) => {
    const tests = [
      { field: 'name', expected: 'Abinash', actual: profile.name },
      { field: 'email', expected: 'abinash@yopmail.com', actual: profile.email },
      { field: 'customId', expected: 'ABIN1234', actual: profile.customId },
      { field: 'gender', expected: 'male', actual: profile.gender },
      { field: 'city', expected: 'Mumbai', actual: profile.city },
      { field: 'state', expected: 'Maharashtra', actual: profile.state }
    ];
    
    return tests.map(test => ({
      ...test,
      passed: test.actual === test.expected,
      status: test.actual === test.expected ? '✅ PASS' : '❌ FAIL'
    }));
  },

  // Test professional information
  testProfessionalInfo: (profile) => {
    const tests = [
      { field: 'occupation', expected: 'Software Engineer', actual: profile.occupation },
      { field: 'education', expected: 'B.Tech', actual: profile.education },
      { field: 'industry', expected: 'Technology', actual: profile.industry },
      { field: 'annualIncome', expected: '10-15 Lakh', actual: profile.annualIncome },
      { field: 'fieldOfStudy', expected: 'Computer Science', actual: profile.fieldOfStudy }
    ];
    
    return tests.map(test => ({
      ...test,
      passed: test.actual === test.expected,
      status: test.actual === test.expected ? '✅ PASS' : '❌ FAIL'
    }));
  },

  // Test personal details
  testPersonalDetails: (profile) => {
    const tests = [
      { field: 'height', expected: "5'8\"", actual: profile.height },
      { field: 'weight', expected: '70 kg', actual: profile.weight },
      { field: 'bodyType', expected: 'Average', actual: profile.bodyType },
      { field: 'complexion', expected: 'Wheatish', actual: profile.complexion },
      { field: 'diet', expected: 'Vegetarian', actual: profile.diet },
      { field: 'maritalStatus', expected: 'never_married', actual: profile.maritalStatus }
    ];
    
    return tests.map(test => ({
      ...test,
      passed: test.actual === test.expected,
      status: test.actual === test.expected ? '✅ PASS' : '❌ FAIL'
    }));
  },

  // Test religious and cultural background
  testReligiousInfo: (profile) => {
    const tests = [
      { field: 'religion', expected: 'Hindu', actual: profile.religion },
      { field: 'caste', expected: 'Brahmin', actual: profile.caste },
      { field: 'motherTongue', expected: ['Hindi', 'English'], actual: profile.motherTongue },
      { field: 'languagesKnown', expected: ['Hindi', 'English', 'Marathi'], actual: profile.languagesKnown }
    ];
    
    return tests.map(test => ({
      ...test,
      passed: JSON.stringify(test.actual) === JSON.stringify(test.expected),
      status: JSON.stringify(test.actual) === JSON.stringify(test.expected) ? '✅ PASS' : '❌ FAIL'
    }));
  },

  // Test family information
  testFamilyInfo: (profile) => {
    const tests = [
      { field: 'familyType', expected: 'Nuclear', actual: profile.familyType },
      { field: 'familyStatus', expected: 'Upper Middle Class', actual: profile.familyStatus },
      { field: 'fatherOccupation', expected: 'Business Owner', actual: profile.fatherOccupation },
      { field: 'motherOccupation', expected: 'Teacher', actual: profile.motherOccupation },
      { field: 'brothers', expected: 1, actual: profile.brothers },
      { field: 'sisters', expected: 0, actual: profile.sisters }
    ];
    
    return tests.map(test => ({
      ...test,
      passed: test.actual === test.expected,
      status: test.actual === test.expected ? '✅ PASS' : '❌ FAIL'
    }));
  },

  // Test verification status
  testVerificationStatus: (profile) => {
    const tests = [
      { field: 'isEmailVerified', expected: true, actual: profile.isEmailVerified },
      { field: 'isPhoneVerified', expected: true, actual: profile.isPhoneVerified },
      { field: 'isIdVerified', expected: true, actual: profile.isIdVerified },
      { field: 'isPhotoVerified', expected: true, actual: profile.isPhotoVerified },
      { field: 'isVerified', expected: true, actual: profile.isVerified },
      { field: 'isActive', expected: true, actual: profile.isActive }
    ];
    
    return tests.map(test => ({
      ...test,
      passed: test.actual === test.expected,
      status: test.actual === test.expected ? '✅ PASS' : '❌ FAIL'
    }));
  },

  // Test profile completion
  testProfileCompletion: (profile) => {
    const tests = [
      { field: 'profileCompletion', expected: '>= 90', actual: profile.profileCompletion, condition: 'gte' },
      { field: 'about', expected: 'not empty', actual: profile.about, condition: 'notEmpty' },
      { field: 'hobbies', expected: 'array with items', actual: profile.hobbies, condition: 'array' },
      { field: 'interests', expected: 'array with items', actual: profile.interests, condition: 'array' },
      { field: 'photos', expected: 'array with items', actual: profile.photos, condition: 'array' }
    ];
    
    return tests.map(test => {
      let passed = false;
      if (test.condition === 'gte') {
        passed = test.actual >= 90;
      } else if (test.condition === 'notEmpty') {
        passed = test.actual && test.actual.length > 0;
      } else if (test.condition === 'array') {
        passed = Array.isArray(test.actual) && test.actual.length > 0;
      }
      
      return {
        ...test,
        passed,
        status: passed ? '✅ PASS' : '❌ FAIL'
      };
    });
  },

  // Test partner preferences
  testPartnerPreferences: (profile) => {
    const preferences = profile.preferences;
    const tests = [
      { field: 'ageRange.min', expected: 25, actual: preferences.ageRange.min },
      { field: 'ageRange.max', expected: 30, actual: preferences.ageRange.max },
      { field: 'religion', expected: 'Hindu', actual: preferences.religion },
      { field: 'maritalStatus', expected: 'never_married', actual: preferences.maritalStatus },
      { field: 'location', expected: 'Mumbai', actual: preferences.location },
      { field: 'diet', expected: 'Vegetarian', actual: preferences.diet }
    ];
    
    return tests.map(test => ({
      ...test,
      passed: test.actual === test.expected,
      status: test.actual === test.expected ? '✅ PASS' : '❌ FAIL'
    }));
  }
};

// Calculate age from date of birth
export const calculateAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Run all tests
export const runAllTests = (profile) => {
  const results = {
    basicInfo: testProfileData.testBasicInfo(profile),
    professionalInfo: testProfileData.testProfessionalInfo(profile),
    personalDetails: testProfileData.testPersonalDetails(profile),
    religiousInfo: testProfileData.testReligiousInfo(profile),
    familyInfo: testProfileData.testFamilyInfo(profile),
    verificationStatus: testProfileData.testVerificationStatus(profile),
    profileCompletion: testProfileData.testProfileCompletion(profile),
    partnerPreferences: testProfileData.testPartnerPreferences(profile)
  };
  
  const totalTests = Object.values(results).flat().length;
  const passedTests = Object.values(results).flat().filter(test => test.passed).length;
  const failedTests = totalTests - passedTests;
  
  return {
    results,
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate: Math.round((passedTests / totalTests) * 100)
    }
  };
};

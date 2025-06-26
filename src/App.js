import React, { useState, useEffect } from "react";
import {
  Users,
  BookUser,
  PhoneCall,
  History,
  LayoutDashboard,
  Sun,
  Moon,
  Pencil,
  Trash2,
  ArrowLeft,
  Phone,
  ChevronLeft,
  ChevronRight,
  Upload,
  CircleX,
  LogOut,
  LogIn,
} from "lucide-react";

// Firebase imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// AuthModal component defined directly within this file
function AuthModal({
  auth,
  showModal,
  onClose,
  setUserId,
  setLoadingAuth,
  translations,
}) {
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setAuthError("Firebase Auth not initialized.");
      return;
    }
    try {
      setLoadingAuth(true); // Indicate loading in App.js
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUserId(result.user.uid); // Pass userId back to App.js
      onClose(); // Close modal on successful sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setAuthError(error.message || translations.loginFailed);
    } finally {
      setLoadingAuth(false); // Stop loading in App.js
    }
  };

  const handleEmailAuth = async () => {
    if (!auth) {
      setAuthError("Firebase Auth not initialized.");
      return;
    }
    if (!email || !password) {
      setAuthError("Please enter both email and password.");
      return;
    }
    setAuthError(""); // Clear previous errors
    setLoadingAuth(true); // Indicate loading in App.js

    try {
      if (authMode === "login") {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUserId(result.user.uid);
      } else {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUserId(result.user.uid);
      }
      onClose(); // Close modal on successful auth
    } catch (error) {
      console.error(`Error during ${authMode}:`, error);
      let userMessage = translations.loginFailed;
      if (error.code === "auth/invalid-email") {
        userMessage = "Invalid email format.";
      } else if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        userMessage = "Invalid email or password.";
      } else if (error.code === "auth/email-already-in-use") {
        userMessage =
          "Email already in use. Try logging in or use a different email.";
      } else if (error.code === "auth/weak-password") {
        userMessage =
          "Password is too weak. It should be at least 6 characters.";
      }
      setAuthError(userMessage);
    } finally {
      setLoadingAuth(false); // Stop loading in App.js
    }
  };

  if (!showModal) return null; // Don't render if modal is not shown

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-auto rounded-lg shadow-lg p-6 animate-fadeIn">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
          {authMode === "login"
            ? translations.loginToContinue
            : translations.signup}
        </h3>
        {authError && (
          <p className="text-red-500 text-sm mb-4 text-center">{authError}</p>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {translations.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {translations.password}
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="********"
            autoComplete={
              authMode === "login" ? "current-password" : "new-password"
            }
          />
        </div>
        <button
          onClick={handleEmailAuth}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 mb-4"
        >
          {authMode === "login" ? translations.login : translations.signup}
        </button>

        <div className="flex items-center justify-center my-4">
          <div className="border-b border-gray-300 dark:border-gray-600 flex-grow"></div>
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">
            {translations.or}
          </span>
          <div className="border-b border-gray-300 dark:border-gray-600 flex-grow"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.26H12v4.51h6.59c-.31 1.57-1.14 2.83-2.39 3.67v3.66h4.71c2.76-2.53 4.36-6.26 4.36-10.37z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.48-1.01 7.31-2.73l-4.71-3.66c-1.3 1.01-2.92 1.6-4.6 1.6-3.53 0-6.44-2.3-7.48-5.42H2.33v3.74c1.94 3.79 5.86 6.46 10 6.46z"
              fill="#34A853"
            />
            <path
              d="M4.52 14.01c-.13-.4-.2-1.05-.2-1.76s.07-1.36.2-1.76V7.47H2.33c-.56 1.18-.88 2.53-.88 3.99s.32 2.81.88 3.99L4.52 14.01z"
              fill="#FBBC05"
            />
            <path
              d="M12 4.19c1.64 0 3.12.65 4.29 1.69l3.58-3.58C17.48 1.49 14.97 0 12 0 7.86 0 3.94 2.67 2 6.46l2.54 1.95c1.04-3.12 3.95-5.42 7.46-5.42z"
              fill="#EA4335"
            />
          </svg>
          {translations.signInWithGoogle}
        </button>

        <p className="text-center text-sm mt-5 text-gray-600 dark:text-gray-300">
          {authMode === "login" ? (
            <>
              {translations.dontHaveAccount}
              <span
                className="text-blue-600 dark:text-blue-400 cursor-pointer font-medium ml-1 hover:underline"
                onClick={() => {
                  setAuthMode("signup");
                  setAuthError("");
                  setEmail("");
                  setPassword("");
                }}
              >
                {translations.signup}
              </span>
            </>
          ) : (
            <>
              {translations.alreadyHaveAccount}
              <span
                className="text-blue-600 dark:text-blue-400 cursor-pointer font-medium ml-1 hover:underline"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                  setEmail("");
                  setPassword("");
                }}
              >
                {translations.login}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  // --- Firebase & Auth States ---
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- App-specific States (now persisted locally) ---
  const [activeTab, setActiveTab] = useState("profiles");
  const [profiles, setProfiles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showPostCallModal, setShowPostCallModal] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedNotes, setUpdatedNotes] = useState("");
  const [callHistory, setCallHistory] = useState([]);
  const [historyFilterStatus, setHistoryFilterStatus] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [profileToDeleteId, setProfileToDeleteId] = useState(null);
  const [postCallModalError, setPostCallModalError] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState("");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("language");
    return savedLang || "en";
  });

  // --- Translations Object ---
  const translations = {
    en: {
      profiles: "Profiles",
      contacts: "Contacts",
      toCall: "To Call",
      history: "History",
      dashboard: "Dashboard",
      lightMode: "Switch to Light Mode",
      darkMode: "Switch to Dark Mode",
      english: "English",
      burmese: "Burmese",
      backToProfiles: "Back to Profiles",
      contactsFor: "Contacts",
      noContacts: "No contacts in this profile.",
      noProfileSelected: "No profile selected.",
      goToProfiles: "Go to Profiles",
      name: "Name",
      typeOfShop: "Type of Shop",
      number: "Number",
      status: "Status",
      noContactSelected: "No contact selected.",
      backToContacts: "Back to Contacts",
      callNow: "Call Now",
      notes: "Notes",
      addNotes: "Add notes about this contact...",
      updateCallStatus: "Update Call Status",
      selectCallStatus: "Please select a call status.",
      callStatus: "Call Status",
      answered: "Answered",
      noAnswer: "No Answer",
      busy: "Busy",
      voicemail: "Voicemail",
      ordered: "Ordered (Conversion)",
      notInterested: "Not Interested",
      followUpNeeded: "Follow-up Needed",
      wrongNumber: "Wrong Number",
      doNotCall: "Do Not Call",
      save: "Save",
      cancel: "Cancel",
      contactToCall: "Contact to Call",
      previous: "Previous",
      next: "Next",
      contactOf: "Contact",
      allContactsCalled: "All contacts in this profile have been called.",
      callHistoryFor: "Call History for",
      noCallHistory: "No call history for this profile yet.",
      totalCallsMade: "Total Calls Made",
      callsAnswered: "Calls Answered",
      conversionRate: "Conversion Rate",
      pendingCalls: "Pending Calls",
      chartsAppearHere: "Charts would appear here in full version",
      editProfileName: "Edit Profile Name",
      newProfileName: "New Profile Name",
      enterNewProfileName: "Enter new profile name",
      confirmDeletion: "Confirm Deletion",
      deleteConfirmation:
        "Are you sure you want to delete this profile? All associated contacts will also be deleted.",
      delete: "Delete",
      noProfilesYet: "No profiles yet.",
      uploadVcfFile: "Upload VCF File",
      uploadAnotherVcfFile: "Upload Another Vcf File",
      contactsCount: "contacts",
      profileExists: "A profile with the name",
      alreadyExists:
        "already exists. Please upload a VCF file with a different name.",
      selectValidVcf: "Please select a valid .vcf file.",
      pleaseSelectProfileForHistory:
        "Please select a profile to view its call history.",
      pleaseSelectProfileFirst: "Please select a profile first.",
      goBackToProfiles: "Go back to Profiles",
      filterByStatus: "Filter by Status",
      all: "All",
      missedCalls: "Missed Calls (No Answer, Busy, Voicemail)",
      error: "Error",
      info: "Information",
      ok: "OK",
      vcfUploadSuccess: "VCF file uploaded successfully and contacts imported!",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      email: "Email",
      password: "Password",
      signInWithGoogle: "Sign in with Google",
      or: "OR",
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      loginToContinue: "Login to continue",
      pleaseLogin: "Please log in to use the application.",
      loginFailed: "Login failed. Please check your credentials.",
      signupFailed: "Sign up failed. Please try again.",
    },
    my: {
      profiles: "ပရိုဖိုင်",
      contacts: "ဖုန်းနံပါတ်များ",
      toCall: "ခေါ်ဆိုရန်",
      history: "လုပ်ဆောင်ပြီး",
      dashboard: "စာရင်းချုပ်",
      lightMode: "အလင်းမုဒ်သို့ ပြောင်းရန်",
      darkMode: "အမှောင်မုဒ်သို့ ပြောင်းရန်",
      english: "အင်္ဂလိပ်",
      burmese: "မြန်မာ",
      backToProfiles: "ပရိုဖိုင်များသို့ ပြန်သွားရန်",
      contactsFor: "အဆက်အသွယ်များ",
      noContacts: "ဤပရိုဖိုင်တွင် အဆက်အသွယ်များ မရှိပါ။",
      noProfileSelected: "ပရိုဖိုင်ရွေးချယ်ထားခြင်း မရှိပါ။",
      goToProfiles: "ပရိုဖိုင်များသို့ သွားရန်",
      name: "အမည်",
      typeOfShop: "ဆိုင်အမျိုးအစား",
      number: "နံပါတ်",
      status: "အခြေအနေ",
      noContactSelected: "အဆက်အသွယ်ရွေးချယ်ထားခြင်း မရှိပါ။",
      backToContacts: "အဆက်အသွယ်များသို့ ပြန်သွားရန်",
      callNow: "အခုခေါ်ပါ",
      notes: "မှတ်စုများ",
      addNotes: "ဤအဆက်အသွယ်နှင့်ပတ်သက်၍ မှတ်စုများထည့်ပါ...",
      updateCallStatus: "ခေါ်ဆိုမှုအခြေအနေ အပ်ဒိတ်လုပ်ရန်",
      selectCallStatus: "ခေါ်ဆိုမှုအခြေအနေကို ရွေးချယ်ပါ။",
      callStatus: "ခေါ်ဆိုမှုအခြေအနေ",
      answered: "ဖြေကြားပြီး",
      noAnswer: "အဖြေမရှိ",
      busy: "အလုပ်များ",
      voicemail: "အသံမေးလ်",
      ordered: "မှာယူပြီး (ပြောင်းလဲခြင်း)",
      notInterested: "စိတ်မဝင်စား",
      followUpNeeded: "နောက်ဆက်တွဲ လိုအပ်",
      wrongNumber: "မှားယွင်းသော နံပါတ်",
      doNotCall: "မခေါ်ရ",
      save: "သိမ်းဆည်းရန်",
      cancel: "ဖျက်သိမ်းရန်",
      contactToCall: "ခေါ်ရန်အဆက်အသွယ်",
      previous: "ယခင်",
      next: "နောက်",
      contactOf: "အဆက်အသွယ်",
      allContactsCalled: "ဤပရိုဖိုင်ရှိ အဆက်အသွယ်အားလုံးကို ခေါ်ဆိုပြီးပါပြီ။",
      callHistoryFor: "ခေါ်ဆိုမှုမှတ်တမ်း",
      noCallHistory: "ဤပရိုဖိုင်အတွက် ခေါ်ဆိုမှုမှတ်တမ်း မရှိသေးပါ။",
      totalCallsMade: "စုစုပေါင်း ခေါ်ဆိုမှုများ",
      callsAnswered: "ဖြေကြားပြီးသော ခေါ်ဆိုမှုများ",
      conversionRate: "ပြောင်းလဲမှုနှုန်း",
      pendingCalls: "မပြီးသေးသော ခေါ်ဆိုမှုများ",
      chartsAppearHere: "ဇယားများကို ဤနေရာတွင် ပြသပါမည်",
      editProfileName: "ပရိုဖိုင်အမည် ပြင်ဆင်ရန်",
      newProfileName: "ပရိုဖိုင်အမည်အသစ်",
      enterNewProfileName: "ပရိုဖိုင်အမည်အသစ်ထည့်ပါ",
      confirmDeletion: "ဖျက်မည်ကို အတည်ပြုပါ",
      deleteConfirmation:
        "ဤပရိုဖိုင်ကို ဖျက်ရန် သေချာပါသလား။ ဆက်စပ်အဆက်အသွယ်များအားလုံးလည်း ဖျက်သွားပါမည်။",
      delete: "ဖျက်ရန်",
      noProfilesYet: "ပရိုဖိုင်များ မရှိသေးပါ။",
      uploadVcfFile: "VCF ဖိုင် အပ်လုဒ်လုပ်ရန်",
      uploadAnotherVcfFile: "VCF ဖိုင် အခြားတစ်ခု ထပ်မံအပ်လုဒ်လုပ်ရန်",
      contactsCount: "အဆက်အသွယ်",
      profileExists: "အမည်ရှိ ပရိုဖိုင်တစ်ခု",
      alreadyExists:
        "ရှိပြီးသားဖြစ်ပါသည်။ ကျေးဇူးပြု၍ VCF ဖိုင်ကို အခြားအမည်ဖြင့် အပ်လုဒ်လုပ်ပါ။",
      selectValidVcf: "ကျေးဇူးပြု၍ တရားဝင် .vcf ဖိုင်ကို ရွေးချယ်ပါ။",
      pleaseSelectProfileForHistory:
        "ကျေးဇူးပြု၍ ခေါ်ဆိုမှုမှတ်တမ်းကို ကြည့်ရှုရန် ပရိုဖိုင်တစ်ခုကို ရွေးချယ်ပါ။",
      pleaseSelectProfileFirst:
        "ကျေးဇူးပြု၍ ပရိုဖိုင်တစ်ခုကို ဦးစွာရွေးချယ်ပါ။",
      goBackToProfiles: "ပရိုဖိုင်များသို့ ပြန်သွားရန်",
      filterByStatus: "အခြေအနေအလိုက် စစ်ထုတ်ရန်",
      all: "အားလုံး",
      missedCalls:
        "လွဲချော်ခဲ့သော ခေါ်ဆိုမှုများ (အဖြေမရှိ၊ အလုပ်များ၊ အသံမေးလ်)",
      error: "အမှား",
      info: "သတင်းအချက်အလက်",
      ok: "အိုကေ",
      vcfUploadSuccess:
        "VCF ဖိုင် အပ်လုဒ်အောင်မြင်ပြီး အဆက်အသွယ်များ တင်သွင်းပြီးပါပြီ။",
      login: "လော့ဂ်အင်",
      signup: "အကောင့်ဖွင့်ပါ",
      logout: "ထွက်ရန်",
      email: "အီးမေးလ်",
      password: "စကားဝှက်",
      signInWithGoogle: "Google ဖြင့် ဝင်ရောက်ပါ",
      or: "သို့မဟုတ်",
      dontHaveAccount: "အကောင့်မရှိဘူးလား။",
      alreadyHaveAccount: "အကောင့်ရှိပြီးသားလား။",
      loginToContinue: "ဆက်လက်ဆောင်ရွက်ရန် လော့ဂ်အင်ဝင်ပါ",
      pleaseLogin: "အပလီကေးရှင်းကို အသုံးပြုရန် လော့ဂ်အင်ဝင်ပါ။",
      loginFailed: "လော့ဂ်အင် မအောင်မြင်ပါ။ အထောက်အထားများကို စစ်ဆေးပါ။",
      signupFailed: "အကောင့်ဖွင့်ခြင်း မအောင်မြင်ပါ။ ထပ်ကြိုးစားပါ။",
    },
  };

  // --- Firebase Initialization and Auth State Management ---
  useEffect(() => {
    // IMPORTANT: Replace the placeholder values below with your actual Firebase project configuration.
    // Get these from your Firebase Console -> Project settings -> Your apps -> Config snippet.
    const firebaseConfig = {
      apiKey: "AIzaSyBUN5GfVgtvs1LdfxhD7ZbEzdGkeb78lGc",
      authDomain: "mycoldcallmanager.firebaseapp.com",
      projectId: "mycoldcallmanager",
      storageBucket: "mycoldcallmanager.firebasestorage.app",
      messagingSenderId: "435558073229",
      appId: "1:435558073229:web:5b5f705a188950278cf3c4",
      measurementId: "G-NM4YJQY080",
      // measurementId: "YOUR_MEASUREMENT_ID" // Uncomment and add if you have Measurement ID
    };

    // Note: The previous check for placeholder values has been removed to prevent the console error.
    // You MUST still replace the placeholder values above with your actual Firebase configuration
    // for authentication to function correctly. If you don't, Firebase authentication calls
    // will likely fail silently or with Firebase-specific errors within the AuthModal itself.

    const app = initializeApp(firebaseConfig);
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, user => {
      if (user) {
        setUserId(user.uid);
        setLoadingAuth(false);
        setShowAuthModal(false); // Hide auth modal on successful login
      } else {
        setUserId(null);
        setLoadingAuth(false);
        // In a local sandbox, if no user is found, always show the auth modal
        setShowAuthModal(true);
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array means it runs once on mount

  // --- Persistence: Load App State from Local Storage on Mount ---
  useEffect(() => {
    const loadState = key => {
      try {
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) {
          return undefined;
        }
        return JSON.parse(serializedState);
      } catch (error) {
        console.error(
          `Error loading state from localStorage for ${key}:`,
          error
        );
        return undefined;
      }
    };

    const loadedProfiles = loadState("profiles");
    if (loadedProfiles) setProfiles(loadedProfiles);

    const loadedContacts = loadState("contacts");
    if (loadedContacts) setContacts(loadedContacts);

    const loadedCallHistory = loadState("callHistory");
    if (loadedCallHistory) setCallHistory(loadedCallHistory);

    const loadedActiveTab = loadState("activeTab");
    if (loadedActiveTab) setActiveTab(loadedActiveTab);

    const loadedCurrentIndex = loadState("currentIndex");
    if (loadedCurrentIndex !== undefined) setCurrentIndex(loadedCurrentIndex);

    const loadedSelectedProfileId = localStorage.getItem("selectedProfileId");
    if (loadedSelectedProfileId && loadedProfiles) {
      const foundProfile = loadedProfiles.find(
        p => p.id === loadedSelectedProfileId
      );
      if (foundProfile) {
        setSelectedProfile(foundProfile);
      }
    }

    const loadedSelectedContactId = localStorage.getItem("selectedContactId");
    if (loadedSelectedContactId && loadedContacts) {
      const foundContact = loadedContacts.find(
        c => c.id === loadedSelectedContactId
      );
      if (foundContact) {
        setSelectedContact(foundContact);
      }
    }
  }, []); // Run once on mount

  // --- Persistence: Save App State to Local Storage on State Change ---
  useEffect(() => {
    localStorage.setItem("profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("callHistory", JSON.stringify(callHistory));
  }, [callHistory]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("currentIndex", currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (selectedProfile) {
      localStorage.setItem("selectedProfileId", selectedProfile.id);
    } else {
      localStorage.removeItem("selectedProfileId");
    }
  }, [selectedProfile]);

  useEffect(() => {
    if (selectedContact) {
      localStorage.setItem("selectedContactId", selectedContact.id);
    } else {
      localStorage.removeItem("selectedContactId");
    }
  }, [selectedContact]);

  // --- Theme and Language Persistence (already using localStorage) ---
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Call Handling on Visibility Change ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && userId) {
        // Check userId for active session
        const pendingCallContactId = localStorage.getItem(
          "pendingCallContactId"
        );
        if (pendingCallContactId) {
          const calledContact = contacts.find(
            c => c.id === pendingCallContactId
          );
          if (calledContact) {
            setSelectedContact(calledContact);
            setUpdatedStatus(calledContact.status || "Answered");
            setUpdatedNotes(calledContact.notes || "");
            setPostCallModalError("");
            setShowPostCallModal(true);
          }
          localStorage.removeItem("pendingCallContactId");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [contacts, userId]);

  // --- Auth Functions ---
  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        setUserId(null); // Clear userId state
        // Data stays in localStorage for next login on this device
        setShowAuthModal(true); // Show auth modal after logout
      } catch (error) {
        console.error("Error during logout:", error);
        showCustomModal("Error logging out. Please try again.", "error");
      }
    }
  };

  // --- Utility Functions ---
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === "en" ? "my" : "en"));
  };

  const showCustomModal = (message, type = "info") => {
    setInfoModalMessage({ message, type });
    setShowInfoModal(true);
  };

  const totalCalls = callHistory.length;
  const answeredCalls = callHistory.filter(
    call => call.status === "Answered"
  ).length;
  const orderedCalls = callHistory.filter(
    call => call.status === "Ordered"
  ).length;
  const conversionRate =
    totalCalls > 0 ? ((orderedCalls / totalCalls) * 100).toFixed(1) : 0;

  const parseVcfFile = content => {
    const lines = content.split("\n");
    const contactsList = [];
    let name = "";
    let phone = "";
    let nickname = "";
    let typeOfShop = "";

    lines.forEach(line => {
      if (line.startsWith("FN:")) {
        name = line.replace("FN:", "").trim();
      }

      if (line.startsWith("TEL;") && !phone) {
        phone = line.split(":")[1].trim();
      }

      if (line.startsWith("NICKNAME:")) {
        nickname = line.replace("NICKNAME:", "").trim();
      }
      if (line.startsWith("X-SHOP-TYPE:")) {
        typeOfShop = line.replace("X-SHOP-TYPE:", "").trim();
      }

      if (line.startsWith("END:VCARD")) {
        if (name || phone) {
          contactsList.push({
            id: crypto.randomUUID(), // Local ID for localStorage
            shopName: name || "Unnamed Contact",
            nickname: nickname || "N/A",
            typeOfShop: typeOfShop || nickname || "Unknown",
            phone: phone || "No Phone",
            status: "To Call",
            notes: "",
            profileId: selectedProfile?.id,
          });
          name = "";
          phone = "";
          nickname = "";
          typeOfShop = "";
        }
      }
    });
    return contactsList;
  };

  // --- CRUD Operations (now using localStorage) ---
  const handleVcfUpload = () => {
    if (!userId) {
      // Check for authentication
      showCustomModal(translations[language].pleaseLogin, "info");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".vcf";
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file || !file.name.endsWith(".vcf")) {
        showCustomModal(translations[language].selectValidVcf, "error");
        return;
      }

      const profileNameFromVcf = file.name.replace(".vcf", "");

      const isDuplicate = profiles.some(
        profile => profile.name === profileNameFromVcf
      );
      if (isDuplicate) {
        showCustomModal(
          `${translations[language].profileExists} "${profileNameFromVcf}" ${translations[language].alreadyExists}`,
          "error"
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;

        const newProfile = {
          id: crypto.randomUUID(), // Generate local ID
          name: profileNameFromVcf,
          contactsCount: 0,
        };

        setSelectedProfile(newProfile);
        const parsedContacts = parseVcfFile(fileContent);

        newProfile.contactsCount = parsedContacts.length;
        setProfiles([...profiles, newProfile]);

        const contactsWithProfileId = parsedContacts.map(contact => ({
          ...contact,
          profileId: newProfile.id,
        }));

        setContacts([...contacts, ...contactsWithProfileId]);
        setActiveTab("contacts");
        setCurrentIndex(0);
        showCustomModal(translations[language].vcfUploadSuccess, "info");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleEditProfileClick = (e, profile) => {
    e.stopPropagation();
    setProfileToEdit(profile);
    setNewProfileName(profile.name);
    setShowEditProfileModal(true);
  };

  const handleCancelProfileEdit = () => {
    setShowEditProfileModal(false);
    setProfileToEdit(null);
    setNewProfileName("");
  };

  const handleSaveProfileEdit = () => {
    if (!userId) return; // Ensure authenticated
    if (profileToEdit && newProfileName.trim() !== "") {
      const isDuplicate = profiles.some(
        p => p.name === newProfileName.trim() && p.id !== profileToEdit.id
      );
      if (isDuplicate) {
        showCustomModal(
          `${translations[language].profileExists} "${newProfileName.trim()}" ${
            translations[language].alreadyExists
          }`,
          "error"
        );
        return;
      }

      setProfiles(
        profiles.map(p =>
          p.id === profileToEdit.id ? { ...p, name: newProfileName.trim() } : p
        )
      );
      if (selectedProfile && selectedProfile.id === profileToEdit.id) {
        setSelectedProfile(prev => ({ ...prev, name: newProfileName.trim() }));
      }
      setShowEditProfileModal(false);
      setProfileToEdit(null);
      setNewProfileName("");
    }
  };

  const openDeleteConfirmationModal = (e, profileId) => {
    e.stopPropagation();
    setProfileToDeleteId(profileId);
    setShowDeleteConfirmationModal(true);
  };

  const handleConfirmDeleteProfile = () => {
    if (!userId) return; // Ensure authenticated

    const updatedProfiles = profiles.filter(p => p.id !== profileToDeleteId);
    setProfiles(updatedProfiles);

    const updatedContacts = contacts.filter(
      c => c.profileId !== profileToDeleteId
    );
    setContacts(updatedContacts);

    const updatedCallHistory = callHistory.filter(
      call => call.profileId !== profileToDeleteId
    );
    setCallHistory(updatedCallHistory);

    if (selectedProfile && selectedProfile.id === profileToDeleteId) {
      setSelectedProfile(null);
      setActiveTab("profiles");
    }

    setShowDeleteConfirmationModal(false);
    setProfileToDeleteId(null);
  };

  const handleCancelDeleteProfile = () => {
    setShowDeleteConfirmationModal(false);
    setProfileToDeleteId(null);
  };

  const getStatusClasses = status => {
    switch (status) {
      case "Ordered":
        return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
      case "Answered":
        return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
      case "To Call":
        return "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100";
      case "No Answer":
      case "Busy":
      case "Voicemail":
      case "Follow-up Needed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100";
      case "Not Interested":
      case "Wrong Number":
      case "Do Not Call":
        return "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100";
    }
  };

  const handleCallNowClick = contact => {
    if (!contact) return;
    window.location.href = "tel:" + contact.phone;
    localStorage.setItem("pendingCallContactId", contact.id);
  };

  const saveCallStatus = () => {
    if (!selectedContact || !selectedProfile || !userId) return; // Ensure authenticated

    if (!updatedStatus || updatedStatus === "Select Status") {
      setPostCallModalError(translations[language].selectCallStatus);
      return;
    } else {
      setPostCallModalError("");
    }

    const updatedContact = {
      ...selectedContact,
      status: updatedStatus,
      notes: updatedNotes,
    };

    const updatedContacts = contacts.map(c =>
      c.id === selectedContact.id ? updatedContact : c
    );
    setContacts(updatedContacts);
    setSelectedContact(updatedContact);

    const newCallEntry = {
      id: crypto.randomUUID(), // Local ID for history
      contactName: updatedContact.shopName,
      phone: updatedContact.phone,
      date: new Date().toISOString(),
      status: updatedStatus,
      notes: updatedNotes,
      profileId: updatedContact.profileId,
    };
    setCallHistory([newCallEntry, ...callHistory]);

    setShowPostCallModal(false);
    localStorage.removeItem("pendingCallContactId");

    const profileContacts = updatedContacts.filter(
      c => c.profileId === selectedProfile.id
    );
    let newIndexFound = false;

    for (let i = currentIndex + 1; i < profileContacts.length; i++) {
      if (profileContacts[i].status === "To Call") {
        setCurrentIndex(i);
        newIndexFound = true;
        break;
      }
    }

    if (!newIndexFound) {
      for (let i = 0; i < currentIndex; i++) {
        if (profileContacts[i].status === "To Call") {
          setCurrentIndex(i);
          newIndexFound = true;
          break;
        }
      }
    }
  };

  const cancelPostCallModal = () => {
    setShowPostCallModal(false);
    localStorage.removeItem("pendingCallContactId");
  };

  // --- Render Modals ---
  const renderPostCallModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-auto rounded-lg shadow-lg p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {translations[language].updateCallStatus}
        </h3>
        {postCallModalError && (
          <p className="text-red-500 text-sm mb-3">{postCallModalError}</p>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {translations[language].callStatus}
          </label>
          <select
            value={updatedStatus}
            onChange={e => setUpdatedStatus(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option>{translations[language].answered}</option>
            <option>{translations[language].noAnswer}</option>
            <option>{translations[language].busy}</option>
            <option>{translations[language].voicemail}</option>
            <option>{translations[language].ordered}</option>
            <option>{translations[language].notInterested}</option>
            <option>{translations[language].followUpNeeded}</option>
            <option>{translations[language].wrongNumber}</option>
            <option>{translations[language].doNotCall}</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {translations[language].notes}
          </label>
          <textarea
            value={updatedNotes}
            onChange={e => setUpdatedNotes(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            rows={3}
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={saveCallStatus}
            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {translations[language].save}
          </button>
          <button
            onClick={cancelPostCallModal}
            className="flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            {translations[language].cancel}
          </button>
        </div>
      </div>
    </div>
  );

  const renderInfoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-auto rounded-lg shadow-lg p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-lg font-semibold ${
              infoModalMessage.type === "error"
                ? "text-red-600"
                : "text-blue-600"
            } dark:${
              infoModalMessage.type === "error"
                ? "text-red-400"
                : "text-blue-400"
            }`}
          >
            {infoModalMessage.type === "error"
              ? translations[language].error
              : translations[language].info}
          </h3>
          <button
            onClick={() => setShowInfoModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <CircleX size={20} />
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {infoModalMessage.message}
        </p>
        <button
          onClick={() => setShowInfoModal(false)}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {translations[language].ok}
        </button>
      </div>
    </div>
  );

  const renderEditProfileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-auto rounded-lg shadow-lg p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {translations[language].editProfileName}
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {translations[language].newProfileName}
          </label>
          <input
            type="text"
            value={newProfileName}
            onChange={e => setNewProfileName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder={translations[language].enterNewProfileName}
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveProfileEdit}
            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {translations[language].save}
          </button>
          <button
            onClick={handleCancelProfileEdit}
            className="flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            {translations[language].cancel}
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md mx-auto rounded-lg shadow-lg p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {translations[language].confirmDeletion}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {translations[language].deleteConfirmation}
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleConfirmDeleteProfile}
            className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {translations[language].delete}
          </button>
          <button
            onClick={handleCancelDeleteProfile}
            className="flex-1 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            {translations[language].cancel}
          </button>
        </div>
      </div>
    </div>
  );

  // --- Render Components for Tabs ---
  const renderProfiles = () => (
    <div className="p-4 font-sans">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {translations[language].profiles}
      </h2>

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow text-center p-4">
          <Upload size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {translations[language].noProfilesYet}
          </p>
          <button
            onClick={handleVcfUpload}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {translations[language].uploadVcfFile}
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handleVcfUpload}
            className="w-full py-3 bg-blue-600 text-white rounded-lg mb-6 hover:bg-blue-700 transition"
          >
            {translations[language].uploadAnotherVcfFile}
          </button>

          <div className="space-y-3">
            {profiles.map(profile => (
              <div
                key={profile.id}
                onClick={() => {
                  setSelectedProfile(profile);
                  setActiveTab("contacts");
                  setCurrentIndex(0);
                }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center cursor-pointer"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {profile.contactsCount}{" "}
                    {translations[language].contactsCount}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={e => handleEditProfileClick(e, profile)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                    title={translations[language].editProfileName}
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={e => openDeleteConfirmationModal(e, profile.id)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
                    title={translations[language].delete}
                  >
                    <Trash2 size={20} />
                  </button>
                  <ChevronRight size={24} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderContacts = () => {
    if (!selectedProfile) {
      return (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center bg-gray-100 dark:bg-gray-900 font-sans">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
            {translations[language].pleaseSelectProfileFirst}
          </p>
          <button
            onClick={() => setActiveTab("profiles")}
            className="text-blue-600 underline dark:text-blue-400"
          >
            {translations[language].goToProfiles}
          </button>
        </div>
      );
    }

    const profileContacts = contacts.filter(
      contact => contact.profileId === selectedProfile.id
    );

    return (
      <div className="p-4 font-sans">
        <button
          onClick={() => setActiveTab("profiles")}
          className="mb-4 text-blue-600 flex items-center dark:text-blue-400"
        >
          <ArrowLeft size={18} className="mr-1" />
          {translations[language].backToProfiles}
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {selectedProfile.name} {translations[language].contactsFor}
        </h2>

        {profileContacts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-300 py-8">
            {translations[language].noContacts}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    {translations[language].name}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    {translations[language].typeOfShop}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    {translations[language].number}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                  >
                    {translations[language].status}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {profileContacts.map(contact => (
                  <tr
                    key={contact.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => openContactDetails(contact)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {contact.shopName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {contact.typeOfShop}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {contact.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                          contact.status
                        )}`}
                      >
                        {contact.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const openContactDetails = contact => {
    setSelectedContact(contact);
    setActiveTab("contactDetail");
  };

  const renderContactDetail = () => {
    if (!selectedContact)
      return (
        <div className="text-gray-800 dark:text-white font-sans">
          {translations[language].noContactSelected}
        </div>
      );
    return (
      <div className="p-4 font-sans">
        <button
          onClick={() => setActiveTab("contacts")}
          className="mb-4 text-blue-600 flex items-center dark:text-blue-400"
        >
          <ArrowLeft size={18} className="mr-1" />
          {translations[language].backToContacts}
        </button>
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
          {selectedContact.shopName}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {selectedContact.typeOfShop}
        </p>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
          <div className="flex items-center mb-4">
            <Phone
              size={20}
              className="text-green-600 dark:text-green-400 mr-2"
            />
            <span className="text-lg text-gray-900 dark:text-white">
              {selectedContact.phone}
            </span>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {translations[language].notes}
            </label>
            <textarea
              value={selectedContact.notes || ""}
              onChange={e => {
                const updated = contacts.map(c =>
                  c.id === selectedContact.id
                    ? { ...c, notes: e.target.value }
                    : c
                );
                setContacts(updated);
                setSelectedContact(prev => ({
                  ...prev,
                  notes: e.target.value,
                }));
              }}
              placeholder={translations[language].addNotes}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows={4}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderToCall = () => {
    if (!selectedProfile) {
      return (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center bg-gray-100 dark:bg-gray-900 font-sans">
          <PhoneCall size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {translations[language].noProfileSelected}
          </p>
          <button
            onClick={() => setActiveTab("profiles")}
            className="mt-4 text-blue-600 underline dark:text-blue-400"
          >
            {translations[language].goBackToProfiles}
          </button>
        </div>
      );
    }

    const profileContacts = contacts.filter(
      contact => contact.profileId === selectedProfile.id
    );

    let contactToDisplay = null;
    let actualContactIndex = currentIndex;

    for (let i = currentIndex; i < profileContacts.length; i++) {
      if (profileContacts[i].status === "To Call") {
        contactToDisplay = profileContacts[i];
        actualContactIndex = i;
        break;
      }
    }

    if (!contactToDisplay && currentIndex > 0) {
      for (let i = 0; i < currentIndex; i++) {
        if (profileContacts[i].status === "To Call") {
          contactToDisplay = profileContacts[i];
          actualContactIndex = i;
          if (currentIndex !== i) {
            setCurrentIndex(i);
          }
          break;
        }
      }
    }

    if (!contactToDisplay) {
      return (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center bg-gray-100 dark:bg-gray-900 font-sans">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {translations[language].allContactsCalled}
          </p>
          <button
            onClick={() => setActiveTab("contacts")}
            className="mt-4 text-blue-600 underline dark:text-blue-400"
          >
            {translations[language].backToContacts}
          </button>
        </div>
      );
    }

    const goToPrevious = () => {
      let newIndex = actualContactIndex;
      let foundPrevious = false;
      while (newIndex > 0) {
        newIndex--;
        if (profileContacts[newIndex].status === "To Call") {
          setCurrentIndex(newIndex);
          foundPrevious = true;
          return;
        }
      }
      if (!foundPrevious && profileContacts[0]?.status === "To Call") {
        setCurrentIndex(0);
      }
    };

    const goToNext = () => {
      let newIndex = actualContactIndex;
      let foundNext = false;
      while (newIndex < profileContacts.length - 1) {
        newIndex++;
        if (profileContacts[newIndex].status === "To Call") {
          setCurrentIndex(newIndex);
          foundNext = true;
          return;
        }
      }
    };

    return (
      <div className="p-4 font-sans">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          {translations[language].contactToCall}
        </h2>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
          <h3 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            {contactToDisplay.shopName}
          </h3>
          <p className="text-3xl text-gray-600 dark:text-gray-300 mb-6">
            {contactToDisplay.phone}
          </p>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              disabled={profileContacts
                .slice(0, actualContactIndex)
                .every(c => c.status !== "To Call")}
              className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center min-w-0 ${
                profileContacts
                  .slice(0, actualContactIndex)
                  .every(c => c.status !== "To Call")
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
              }`}
            >
              <ChevronLeft size={20} className="mr-1" />
              <span className="hidden sm:inline">
                {translations[language].previous}
              </span>
            </button>

            <button
              onClick={() => handleCallNowClick(contactToDisplay)}
              className="flex-shrink-0 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center whitespace-nowrap"
            >
              <PhoneCall size={20} className="mr-2" />
              {translations[language].callNow}
            </button>

            <button
              onClick={goToNext}
              disabled={profileContacts
                .slice(actualContactIndex + 1)
                .every(c => c.status !== "To Call")}
              className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center min-w-0 ${
                profileContacts
                  .slice(actualContactIndex + 1)
                  .every(c => c.status !== "To Call")
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
              }`}
            >
              <span className="hidden sm:inline">
                {translations[language].next}
              </span>
              <ChevronRight size={20} className="ml-1" />
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {translations[language].contactOf} {actualContactIndex + 1} of{" "}
            {profileContacts.length}
          </div>
        </div>
      </div>
    );
  };

  const renderCallHistory = () => {
    if (!selectedProfile) {
      return (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center bg-gray-100 dark:bg-gray-900 font-sans">
          <History size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {translations[language].pleaseSelectProfileForHistory}
          </p>
          <button
            onClick={() => setActiveTab("profiles")}
            className="mt-4 text-blue-600 underline dark:text-blue-400"
          >
            {translations[language].goToProfiles}
          </button>
        </div>
      );
    }

    let currentProfileCallHistory = callHistory.filter(
      call => call.profileId === selectedProfile.id
    );

    if (historyFilterStatus !== "All") {
      if (historyFilterStatus === "Missed Calls") {
        currentProfileCallHistory = currentProfileCallHistory.filter(call =>
          ["No Answer", "Busy", "Voicemail"].includes(call.status)
        );
      } else {
        currentProfileCallHistory = currentProfileCallHistory.filter(
          call => call.status === historyFilterStatus
        );
      }
    }

    return (
      <div className="p-4 font-sans">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {translations[language].callHistoryFor} {selectedProfile.name}
        </h2>

        <div className="mb-4">
          <label
            htmlFor="historyFilter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {translations[language].filterByStatus}
          </label>
          <select
            id="historyFilter"
            value={historyFilterStatus}
            onChange={e => setHistoryFilterStatus(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="All">{translations[language].all}</option>
            <option value="Answered">{translations[language].answered}</option>
            <option value="Missed Calls">
              {translations[language].missedCalls}
            </option>
            <option value="Ordered">{translations[language].ordered}</option>
            <option value="Not Interested">
              {translations[language].notInterested}
            </option>
            <option value="Follow-up Needed">
              {translations[language].followUpNeeded}
            </option>
            <option value="Wrong Number">
              {translations[language].wrongNumber}
            </option>
            <option value="Do Not Call">
              {translations[language].doNotCall}
            </option>
          </select>
        </div>

        <div className="space-y-3">
          {currentProfileCallHistory.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-300 py-8">
              {translations[language].noCallHistory}
            </div>
          ) : (
            currentProfileCallHistory.map((entry, index) => (
              <div
                key={entry.id || index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {entry.contactName}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                      entry.status
                    )}`}
                  >
                    {entry.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {entry.phone}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(entry.date).toLocaleString()}
                </p>
                {entry.notes && (
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 italic">
                    {entry.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="p-4 font-sans">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        {translations[language].dashboard}
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <h3 className="text-sm text-gray-500 dark:text-gray-300">
            {translations[language].totalCallsMade}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {totalCalls}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <h3 className="text-sm text-gray-500 dark:text-gray-300">
            {translations[language].callsAnswered}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {answeredCalls}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <h3 className="text-sm text-gray-500 dark:text-gray-300">
            {translations[language].conversionRate}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {conversionRate}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <h3 className="text-sm text-gray-500 dark:text-gray-300">
            {translations[language].pendingCalls}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {
              contacts.filter(contact =>
                [
                  "To Call",
                  "Follow-up Needed",
                  "No Answer",
                  "Busy",
                  "Voicemail",
                ].includes(contact.status)
              ).length
            }
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-40 flex items-center justify-center text-gray-400 dark:text-gray-600">
        {translations[language].chartsAppearHere}
      </div>
    </div>
  );

  // --- Main Tab Content Rendering ---
  const renderTabContent = () => {
    if (!userId && !loadingAuth) {
      return (
        <div className="p-4 flex flex-col items-center justify-center h-full text-center bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-80px)] font-sans">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
            {translations[language].pleaseLogin}
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {translations[language].login} / {translations[language].signup}
          </button>
        </div>
      );
    }
    if (loadingAuth) {
      return (
        <div className="flex items-center justify-center h-screen font-sans">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "profiles":
        return renderProfiles();
      case "contacts":
        return renderContacts();
      case "contactDetail":
        return renderContactDetail();
      case "toCall":
        return renderToCall();
      case "callHistory":
        return renderCallHistory();
      case "dashboard":
        return renderDashboard();
      default:
        return renderProfiles();
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } text-gray-900 dark:text-gray-100 font-sans`}
    >
      {/* Top Bar for Theme, Language, and Auth Toggles */}
      <div className="flex justify-end p-2 space-x-2">
        {userId && ( // Show user ID if logged in
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mr-2">
            User ID: {userId.substring(0, 8)}...
          </div>
        )}
        <button
          onClick={toggleLanguage}
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition text-xs font-semibold"
          title={
            language === "en"
              ? translations.en.burmese
              : translations.my.english
          }
        >
          {language === "en" ? "EN" : "MY"}
        </button>
        <button
          onClick={toggleTheme}
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title={
            theme === "dark"
              ? translations[language].lightMode
              : translations[language].darkMode
          }
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {userId ? (
          <button
            onClick={handleLogout}
            className="p-1 rounded-full bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200 shadow-md hover:bg-red-300 dark:hover:bg-red-600 transition"
            title={translations[language].logout}
          >
            <LogOut size={20} />
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="p-1 rounded-full bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 shadow-md hover:bg-green-300 dark:hover:bg-green-600 transition"
            title={translations[language].login}
          >
            <LogIn size={20} />
          </button>
        )}
      </div>

      <main className="pb-20 max-w-lg mx-auto">{renderTabContent()}</main>

      {/* Bottom Navigation */}
      {userId && ( // Only show bottom navigation if authenticated
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab("profiles")}
              className={`py-3 px-4 flex flex-col items-center ${
                activeTab === "profiles"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              <Users size={20} />
              <span className="text-xs mt-1">
                {translations[language].profiles}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`py-3 px-4 flex flex-col items-center ${
                activeTab === "contacts"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              <BookUser size={20} />
              <span className="text-xs mt-1">
                {translations[language].contacts}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("toCall")}
              className={`py-3 px-4 flex flex-col items-center ${
                activeTab === "toCall"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              <PhoneCall size={20} />
              <span className="text-xs mt-1">
                {translations[language].toCall}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("callHistory")}
              className={`py-3 px-4 flex flex-col items-center ${
                activeTab === "callHistory"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              <History size={20} />
              <span className="text-sm mt-1">
                {translations[language].history}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-3 px-4 flex flex-col items-center ${
                activeTab === "dashboard"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="text-xs mt-1">
                {translations[language].dashboard}
              </span>
            </button>
          </div>
        </nav>
      )}

      {/* Modals */}
      {showPostCallModal && renderPostCallModal()}
      {showEditProfileModal && renderEditProfileModal()}
      {showDeleteConfirmationModal && renderDeleteConfirmationModal()}
      {showInfoModal && renderInfoModal()}
      <AuthModal
        auth={auth}
        showModal={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        setUserId={setUserId}
        setLoadingAuth={setLoadingAuth}
        translations={translations[language]}
      />
    </div>
  );
}

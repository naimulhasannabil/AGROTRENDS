import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      about: "About",
      blogs: "Blogs",
      categories: "Categories",
      crops: "Crops",
      livestock: "Livestock",
      fisheries: "Fisheries",
      technologies: "Technologies",
      products: "Products",
      courses: "Courses",
      qa: "Q&A",
      events: "Events",
      aiAssistant: "AI Assistant",
      signIn: "Sign In",
      signUp: "Sign Up",

      // Common
      welcome: "Welcome",
      language: "Language",
      search: "Search",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      create: "Create",
      update: "Update",
      loading: "Loading...",
      error: "Error",
      success: "Success",

      // Hero Section
      heroTitle: "Welcome to AgroTrends",
      heroSubtitle: "Your Gateway to Modern Agriculture",

      // Footer
      footerAbout: "About AgroTrends",
      footerLinks: "Quick Links",
      footerContact: "Contact Us",
      allRightsReserved: "All rights reserved",

      // Blog
      readMore: "Read More",
      writeBlog: "Write Blog",
      blogTitle: "Blog Title",
      blogContent: "Blog Content",

      // Authentication
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      username: "Username",
      login: "Login",
      register: "Register",
      logout: "Logout",

      // Weather
      weather: "Weather",
      temperature: "Temperature",
      humidity: "Humidity",

      // Newsletter
      subscribeNewsletter: "Subscribe to Newsletter",
      enterEmail: "Enter your email",
      subscribe: "Subscribe",
    },
  },
  bn: {
    translation: {
      // Navigation
      home: "হোম",
      about: "সম্পর্কে",
      blogs: "ব্লগ",
      categories: "বিভাগ",
      crops: "ফসল",
      livestock: "পশুপালন",
      fisheries: "মৎস্য চাষ",
      technologies: "প্রযুক্তি",
      products: "পণ্য",
      courses: "কোর্স",
      qa: "প্রশ্ন ও উত্তর",
      events: "ইভেন্ট",
      aiAssistant: "এআই সহায়ক",
      signIn: "সাইন ইন",
      signUp: "সাইন আপ",

      // Common
      welcome: "স্বাগতম",
      language: "ভাষা",
      search: "খুঁজুন",
      submit: "জমা দিন",
      cancel: "বাতিল",
      save: "সংরক্ষণ",
      edit: "সম্পাদনা",
      delete: "মুছুন",
      create: "তৈরি করুন",
      update: "আপডেট",
      loading: "লোড হচ্ছে...",
      error: "ত্রুটি",
      success: "সফল",

      // Hero Section
      heroTitle: "এগ্রোট্রেন্ডস এ স্বাগতম",
      heroSubtitle: "আধুনিক কৃষির প্রবেশদ্বার",

      // Footer
      footerAbout: "এগ্রোট্রেন্ডস সম্পর্কে",
      footerLinks: "দ্রুত লিংক",
      footerContact: "যোগাযোগ করুন",
      allRightsReserved: "সর্বস্বত্ব সংরক্ষিত",

      // Blog
      readMore: "আরও পড়ুন",
      writeBlog: "ব্লগ লিখুন",
      blogTitle: "ব্লগ শিরোনাম",
      blogContent: "ব্লগ বিষয়বস্তু",

      // Authentication
      email: "ইমেইল",
      password: "পাসওয়ার্ড",
      confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      username: "ব্যবহারকারীর নাম",
      login: "লগইন",
      register: "নিবন্ধন",
      logout: "লগআউট",

      // Weather
      weather: "আবহাওয়া",
      temperature: "তাপমাত্রা",
      humidity: "আর্দ্রতা",

      // Newsletter
      subscribeNewsletter: "নিউজলেটার সাবস্ক্রাইব করুন",
      enterEmail: "আপনার ইমেইল লিখুন",
      subscribe: "সাবস্ক্রাইব",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    lng: "en", // default language
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;

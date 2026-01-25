import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const currentLang = i18n.language;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          currentLang === 'en'
            ? 'bg-green-600 text-white shadow-lg scale-105'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-label="Switch to English"
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('bn')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          currentLang === 'bn'
            ? 'bg-green-600 text-white shadow-lg scale-105'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-label="Switch to Bangla"
      >
        বাংলা
      </button>
    </div>
  );
};

export default LanguageSwitcher;

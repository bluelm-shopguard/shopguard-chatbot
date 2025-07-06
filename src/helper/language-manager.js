/**
 * Language Manager for BlueLM Shopguard
 * Handles internationalization and language switching
 */

// Import language files
import enUS from './i18n/en-US'
import zhCN from './i18n/zh-CN'

// LanguageManager constructor
function LanguageManager() {
  this.languages = {
    'en-US': enUS,
    'zh-CN': zhCN
  };
  
  // Default language
  this.currentLang = 'zh-CN';
}

/**
 * Set the current language
 * @param {string} langCode - Language code (e.g., 'en-US', 'zh-CN')
 */
LanguageManager.prototype.setLanguage = function(langCode) {
  if (this.languages[langCode]) {
    this.currentLang = langCode;
    return true;
  }
  console.error('Language not supported:', langCode);
  return false;
};

/**
 * Get a translated string
 * @param {string} key - Translation key
 * @param {Object} params - Parameters for string interpolation
 * @returns {string} - Translated string
 */
LanguageManager.prototype.getString = function(key, params) {
  var langData = this.languages[this.currentLang];
  
  if (!langData) {
    console.error('Language data not found for:', this.currentLang);
    return key;
  }
  
  // Get the string from language data
  var text = this.getValueByPath(langData, key);
  
  // If string not found, return the key
  if (!text) {
    return key;
  }
  
  // Replace parameters if provided
  if (params) {
    for (var prop in params) {
      if (params.hasOwnProperty(prop)) {
        text = text.replace(new RegExp('\\{' + prop + '\\}', 'g'), params[prop]);
      }
    }
  }
  
  return text;
};

/**
 * Get a value from an object by dot notation path
 * @param {Object} obj - Object to search in
 * @param {string} path - Path in dot notation (e.g., 'home.welcome')
 * @returns {*} - Value at the path or undefined
 */
LanguageManager.prototype.getValueByPath = function(obj, path) {
  if (!obj || !path) {
    return undefined;
  }
  
  var parts = path.split('.');
  var current = obj;
  
  for (var i = 0; i < parts.length; i++) {
    if (current[parts[i]] === undefined) {
      return undefined;
    }
    current = current[parts[i]];
  }
  
  return current;
};

/**
 * Get the currently active language code
 * @returns {string} - Current language code
 */
LanguageManager.prototype.getCurrentLanguage = function() {
  return this.currentLang;
};
  
/**
 * Get all available languages
 * @returns {Object} - Available languages
 */
LanguageManager.prototype.getAvailableLanguages = function() {
  var result = [];
  
  for (var code in this.languages) {
    if (this.languages.hasOwnProperty(code)) {
      result.push({
        code: code,
        name: this.languages[code].meta.name || code
      });
    }
  }
  
  return result;
};

// Export the LanguageManager class
export { LanguageManager };

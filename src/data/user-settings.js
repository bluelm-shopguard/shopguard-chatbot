// User preferences settings
// These settings can be modified by users through the UI

export let UserSettings = {
  theme: {
    default: "light",
    options: [
      { id: "light", name: "浅色模式" },
      { id: "dark", name: "深色模式" },
      { id: "system", name: "跟随系统" },
    ],
  },
  language: {
    default: "zh-CN",
    options: [
      { id: "zh-CN", name: "简体中文" },
      { id: "en-US", name: "English" },
      // TODO Ensglish language support
    ],
  },
  chat: {
    history: {
      save: true,
    },
  },
};

export function getUserSetting(key) {
  if (!key) return undefined;
  const keys = key.split(".");
  let result = UserSettings;
  for (const k of keys) {
    if (result === undefined || result === null || typeof result !== "object") {
      return undefined;
    }
    result = result[k];
  }
  return result;
}

export function setUserSetting(key, value) {
  if (!key) return;
  const keys = key.split(".");
  let setting = UserSettings;
  for (let i = 0; i < keys.length - 1; i++) {
    if (
      setting[keys[i]] === undefined ||
      typeof setting[keys[i]] !== "object"
    ) {
      setting[keys[i]] = {};
    }
    setting = setting[keys[i]];
  }
  setting[keys[keys.length - 1]] = value;
  console.log("User settings updated:", UserSettings);

  // Save to localStorage
  try {
    localStorage.setItem(
      "shopguard-user-settings",
      JSON.stringify(UserSettings)
    );

    // If theme setting changed, trigger theme update
    if (key === "theme.default") {
      // Import theme manager dynamically to avoid circular dependencies
      import("../js/theme-manager.js")
        .then(({ applyTheme }) => {
          applyTheme();
        })
        .catch((error) => {
          console.warn("Failed to apply theme:", error);
        });
    }
  } catch (error) {
    console.warn("Failed to save user settings to localStorage:", error);
  }
}

// Load user settings from localStorage on initialization
export function loadUserSettings() {
  try {
    const saved = localStorage.getItem("shopguard-user-settings");
    if (saved) {
      const savedSettings = JSON.parse(saved);
      // Merge saved settings with defaults
      Object.assign(UserSettings, savedSettings);
    }
  } catch (error) {
    console.warn("Failed to load user settings from localStorage:", error);
  }
}

// Initialize user settings
loadUserSettings();

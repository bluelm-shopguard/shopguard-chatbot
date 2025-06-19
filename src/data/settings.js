export let AppSettings = {
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
    ],
  },
  chat: {
    history: {
      save: true,
    },
  },
};

export function getSetting(key) {
  if (!key) return undefined;
  const keys = key.split(".");
  let result = AppSettings;
  for (const k of keys) {
    if (result === undefined || result === null || typeof result !== "object") {
      return undefined;
    }
    result = result[k];
  }
  return result;
}

export function setSetting(key, value) {
  if (!key) return;
  const keys = key.split(".");
  let setting = AppSettings;
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
  console.log("Settings updated:", AppSettings);
}

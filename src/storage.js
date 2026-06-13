import {NativeModules, Platform} from 'react-native';

const {NewsHanipNative} = NativeModules;

const memoryStore = {};

export const NativeStore = {
  async set(key, value) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (Platform.OS === 'android' && NewsHanipNative?.saveString) {
      return NewsHanipNative.saveString(key, stringValue);
    }
    memoryStore[key] = stringValue;
    return true;
  },

  async get(key, fallback = null) {
    if (Platform.OS === 'android' && NewsHanipNative?.getString) {
      const value = await NewsHanipNative.getString(key);
      return value ?? fallback;
    }
    return memoryStore[key] ?? fallback;
  },

  async getJson(key, fallback) {
    const value = await this.get(key, null);
    if (!value) {
      return fallback;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      return fallback;
    }
  },
};


export async function requestNotificationPermission() {
  if (Platform.OS === 'android' && NewsHanipNative?.requestNotificationPermission) {
    return NewsHanipNative.requestNotificationPermission();
  }
  return true;
}

export async function scheduleMorningNotification(hour, minute, message) {
  if (Platform.OS === 'android' && NewsHanipNative?.scheduleDailyNotification) {
    return NewsHanipNative.scheduleDailyNotification(
      Number(hour),
      Number(minute),
      '뉴스한입',
      message,
    );
  }
  return false;
}

export async function cancelMorningNotification() {
  if (Platform.OS === 'android' && NewsHanipNative?.cancelDailyNotification) {
    return NewsHanipNative.cancelDailyNotification();
  }
  return false;
}

export async function openArticleUrl(url) {
  if (Platform.OS === 'android' && NewsHanipNative?.openUrl) {
    return NewsHanipNative.openUrl(url);
  }
  return false;
}

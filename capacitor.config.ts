import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'www.cupidtide.com',
  appName: 'cupid',
  webDir: 'dist'
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true
  },

  ios: {
    infoPlist: {
      NSContactsUsageDescription: '需要通讯录权限才能正常使用应用'
    }
  },

  plugins: {
    Contacts: {}
  }
};

export default config;

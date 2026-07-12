import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'www.cupidtide.com',
  appName: 'cupid',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true
  },

  ios: {
    // 关键：强制设置 iOS 最低部署目标为 15.0，解决 Capacitor 依赖问题
    minVersion: '15.0',
    infoPlist: {
      NSContactsUsageDescription: '需要通讯录权限才能正常使用应用'
    }
  },

  plugins: {
    Contacts: {}
  }
};

export default config;
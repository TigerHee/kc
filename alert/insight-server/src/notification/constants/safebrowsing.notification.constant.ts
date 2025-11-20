import { PlatformType, ThreatType } from 'src/safebrowsing/safebrowsing.types';

export const ThreatTypeItem: Record<ThreatType, string> = {
  [ThreatType.THREAT_TYPE_UNSPECIFIED]: '未知类型', // THREAT_TYPE_UNSPECIFIED
  [ThreatType.MALWARE]: '恶意软件', // MALWARE
  [ThreatType.SOCIAL_ENGINEERING]: '社会工程学', // SOCIAL_ENGINEERING
  [ThreatType.UNWANTED_SOFTWARE]: '垃圾软件', // UNWANTED_SOFTWARE
  [ThreatType.POTENTIALLY_HARMFUL_APPLICATION]: '可能有害应用', // POTENTIALLY_HARMFUL_APPLICATION
};
export const PlatformTypeItem: Record<PlatformType, string> = {
  [PlatformType.PLATFORM_TYPE_UNSPECIFIED]: '未知平台', // PLATFORM_TYPE_UNSPECIFIED
  [PlatformType.WINDOWS]: 'Windows 构成威胁', // WINDOWS
  [PlatformType.LINUX]: 'Linux 构成威胁', // LINUX
  [PlatformType.ANDROID]: 'Android 构成威胁', // ANDROID
  [PlatformType.OSX]: 'macOS (OS X) 构成威胁', // OSX
  [PlatformType.IOS]: 'iOS 构成威胁', // IOS
  [PlatformType.ANY_PLATFORM]: '至少一个指定平台构成威胁', // ANY_PLATFORM
  [PlatformType.ALL_PLATFORMS]: '所有定义的平台构成威胁', // ALL_PLATFORMS
  [PlatformType.CHROME]: 'Chrome 构成威胁', // CHROME
};

/**
 * 威胁类型的枚举值
 */
export enum ThreatType {
  THREAT_TYPE_UNSPECIFIED = 'THREAT_TYPE_UNSPECIFIED', // 未知类型
  MALWARE = 'MALWARE', // 恶意软件
  SOCIAL_ENGINEERING = 'SOCIAL_ENGINEERING', // 社会工程学
  UNWANTED_SOFTWARE = 'UNWANTED_SOFTWARE', // 垃圾软件
  POTENTIALLY_HARMFUL_APPLICATION = 'POTENTIALLY_HARMFUL_APPLICATION', // 可能有害应用
}

/**
 * 平台类型的枚举值
 */
export enum PlatformType {
  PLATFORM_TYPE_UNSPECIFIED = 'PLATFORM_TYPE_UNSPECIFIED', // 未知平台
  WINDOWS = 'WINDOWS', // 对 Windows 构成威胁
  LINUX = 'LINUX', // 对 Linux 构成威胁
  ANDROID = 'ANDROID', // 对 Android 构成威胁
  OSX = 'OSX', // 对 macOS (OS X) 构成威胁
  IOS = 'IOS', // 对 iOS 构成威胁
  ANY_PLATFORM = 'ANY_PLATFORM', // 对至少一个指定平台构成威胁
  ALL_PLATFORMS = 'ALL_PLATFORMS', // 对所有定义的平台构成威胁
  CHROME = 'CHROME', // 对 Chrome 构成威胁
}

/**
 * 威胁条目类型的枚举值
 */
export enum ThreatEntryType {
  UNSPECIFIED = 'THREAT_ENTRY_TYPE_UNSPECIFIED', // 未指定
  URL = 'URL', // 网址
  EXECUTABLE = 'EXECUTABLE', // 可执行程序
}

/**
 * ThreatEntry 类型，表示单个威胁条目。
 */
export interface ThreatEntry {
  /**
   * 哈希前缀，由 SHA256 哈希的最有效 4-32 个字节组成。
   * Base64 编码的字符串。
   */
  hash?: string;

  /**
   * 恶意的网址。
   */
  url?: string;

  /**
   * SHA256 格式的可执行文件摘要。
   * 支持 Base64 编码。
   */
  digest?: string;
}

/**
 * 表示一个元数据条目 (MetadataEntry)。
 */
export interface MetadataEntry {
  /**
   * 元数据条目的键，Base64 编码的字符串。
   */
  key: string;

  /**
   * 元数据条目的值，Base64 编码的字符串。
   */
  value: string;
}

/**
 * 表示与特定威胁条目关联的元数据 (ThreatEntryMetadata)。
 */
export interface ThreatEntryMetadata {
  /**
   * 包含多个元数据条目的数组。
   */
  entries: MetadataEntry[];
}

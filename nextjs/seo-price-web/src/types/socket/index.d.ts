declare module "@kc/socket" {
  import KCSocket from "@/types/socket/KcSocket";


  class Topic {
    // Static topic templates
    static MARKET_SNAPSHOT: string;
    static MARKET_TICKER: string;
    static MARKET_LEVEL2: string;
    static MARKET_LEVEL2_APP: string;
    static MARKET_LEVEL2_WEB: string;
    static MARKET_MATCH: string;
    static MARKET_LEVEL3: string;
    static MARKET_CANDLES: string;
    static ACCOUNT_BALANCE: string;
    static ACCOUNT_BALANCE_SNAPSHOT: string;
    static NOTICE_CENTER: string;
  
    /**
     * Generates a topic string by replacing placeholders in the template.
     * @param topicTpl The topic template string.
     * @param vars An object containing `SYMBOLS` and/or `SYMBOL_TYPES` arrays.
     * @returns The generated topic string.
     */
    static get(topicTpl: string, vars: { SYMBOLS?: string[]; SYMBOL_TYPES?: string[] }): string;
  }

  /**
   * Sets the storage prefix.
   * @param prefix The prefix to set.
   */
  export function setStoragePrefix(prefix: string): void;

  /**
   * Sets the delay for data processing.
   * @param delay The delay in milliseconds.
   */
  export function setDelay(delay: number): void;

  /**
   * Toggles the visibility of QPS (queries per second).
   * @param show Whether to show QPS.
   */
  export function toggleShowQps(show: boolean): void;

  /**
   * Sets the host for the application.
   * @param host The host URL.
   */
  export function setHost(host: string): void;

  /**
   * Sets the CSRF token.
   * @param csrf The CSRF token.
   */
  export function setCsrf(csrf: string): void;

  /**
   * Sets the X-Version header.
   * @param version The version string.
   */
  export function setXVersion(version: string): void;

  /**
   * Sets the RN cookie.
   * @param cookie The cookie string.
   */
  export function setRnCookie(cookie: string): void;

  /**
   * Returns the singleton instance of KCSocket.
   * @returns The KCSocket instance.
   */
  export function getInstance(): KCSocket;

  /**
   * Topic模块，Topic class for managing websocket topics.
   */
  export const Topic = Topic;

  /**
   * Enables debug mode for the logger.
   */
  export function debug(): void;

  

}


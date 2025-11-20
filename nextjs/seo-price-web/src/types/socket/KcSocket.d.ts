/**
 * Owner: borden@kupotech.com
 */

import { EventEmitter } from 'event-emitter';
import { DebouncedFunc } from 'lodash-es';

export default class KCSocket {
  // Resource types
  static RESOURCE_H5: 'h5';
  static RESOURCE_WEB: 'web';

  // BULLET URLs
  static BULLET_URL_PUBLIC: string;
  static BULLET_URL_PRIVATE: string;

  // Key => data map
  dataMap: Record<string, any>;

  // Private session mode (based on user login state)
  sessionPrivate: boolean;

  // Token for connection
  token: string | null;

  // List of connection node instances
  instanceServers: string[];

  // Resource type
  resource: 'h5' | 'web';

  // Current user UID (can be empty if not logged in)
  uid: string;

  // Topic subscription states
  static TOPIC_STATE: {
    WAIT_SUB: 0;
    SUBSCRIBED: 1;
    WAIT_UNSUB: 2;
  };

  // Topic state map
  topicState: Record<string, number>;

  // Constructor
  constructor();

  // Add other methods and properties as needed
  /**
   * Subscribes to a topic.
   * @param topic The topic to subscribe to (default is an empty string).
   * @param callback The callback function to handle messages for the topic.
   * @param privateChannel Whether the subscription is for a private channel.
   * @returns A promise that resolves when the subscription is successful.
   */
  subscribe(topic?: string, callback?: (message: any) => void, privateChannel?: boolean): Promise<void>;

  /**
   * Unsubscribes from a topic.
   * @param topic The topic to unsubscribe from (default is an empty string).
   * @param callback The callback function to execute after unsubscribing.
   * @param privateChannel Whether the unsubscription is for a private channel.
   * @returns A promise that resolves when the unsubscription is successful.
   */
  unsubscribe(topic?: string, callback?: (topic: string) => void, privateChannel?: boolean): Promise<void>;


  connected(): boolean;

  socket: any | null

  connect: (options: any) => DebouncedFunc<(opt?: any) => Promise<void>>;

  topicMessage: (_topic: any, _subject: any, isPrivate?: boolean) => (hook: any, throttleHookMs?: number, notUseRaf?: boolean) => void;
}
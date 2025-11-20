/**
 * Owner: garuda@kupotech.com
 */

export interface DeferredOperation {
  promise: Promise<void>;
  resolve: () => void;
  reject: (err?: any) => void;
}

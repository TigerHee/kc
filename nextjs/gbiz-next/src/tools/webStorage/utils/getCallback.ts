/**
 * Owner: garuda@kupotech.com
 */
export default function getCallback(...args: any) {
  if (args.length && typeof args[args.length - 1] === 'function') {
    return args[args.length - 1];
  }
}

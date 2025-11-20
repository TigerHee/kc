/**
 * Owner: will.wang@kupotech.com
 */

type Props = {
  when: boolean;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export default ({ when, children, fallback = null }: Props) => {
  if (when === true) {
    return children || null;
  }

  return fallback;
};

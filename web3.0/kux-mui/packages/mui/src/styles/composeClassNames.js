/**
 * Owner: victor.ren@kupotech.com
 */
export default function composeClassNames(slots, getUtilityClass) {
  const output = {};
  Object.keys(slots).forEach((slot) => {
    output[slot] = slots[slot]
      .reduce((acc, key) => {
        if (key) {
          acc.push(getUtilityClass(key));
        }
        return acc;
      }, [])
      .join(' ');
  });
  return output;
}

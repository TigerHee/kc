/**
 * Owner: tiger@kupotech.com
 */

export const getSelectOptions = (options) => {
  if (options.some((i) => i.group)) {
    const groupList = Object.values(
      options.reduce((acc, item) => {
        const { group, optionId, title } = item;
        if (!acc[group]) {
          acc[group] = {
            label: group,
            title: group,
            options: [],
          };
        }
        acc[group].options.push({ value: optionId, label: title, name: title });
        return acc;
      }, {}),
    );
    return groupList;
  }
  return options.map(({ optionId, title }) => {
    return {
      value: optionId,
      label: title,
      name: title,
    };
  });
};

/**
 * 生产名字的英文名头像字符串
 * @param name
 * @returns
 */
export const generateAvatarEnglishNameString = (name: string) => {
  const first = name.charAt(0).toLocaleUpperCase();
  const second = (
    name.split(' ')?.[1] ??
    name.split('.')?.[1] ??
    name.split('-')?.[1] ??
    name.split('_')?.[1]
  )
    ?.charAt(0)
    .toLocaleUpperCase();
  return `${first}${second || ''}`;
};

/**
 * 根据名字，生成随机匹配一个颜色
 * 在colors中随机匹配一个颜色
 * 名字不变，颜色不变
 * @returns
 */
export const generateEnglishNameColor = (
  name: string,
): {
  name: string;
  color: string;
} => {
  // 浅色系
  // const colors = [
  //   '#A8C8E0', // 浅蓝色
  //   '#BFD3C1', // 浅灰绿色
  //   '#D9C7B8', // 浅米色
  //   '#E2BEBE', // 浅粉色
  //   '#C1D8C2', // 浅绿
  //   '#D3E3F6', // 浅天空蓝
  //   '#C4B4D4', // 淡紫色
  //   '#B7C9B1', // 浅草绿色
  //   '#D1D6D9', // 浅灰色
  //   '#E0D4C9', // 浅杏色
  //   '#B5C9E6', // 浅青色
  //   '#F0E1D4', // 米白色
  //   '#B8D5E8', // 浅青蓝
  //   '#C5C9D9', // 清色灰
  //   '#E7E9E7', // 近白色
  //   '#D8D0C8', // 浅棕色
  //   '#C0DFE9', // 浅雾蓝
  //   '#A5C6A5', // 淡绿
  //   '#E6D5C0', // 浅沙色
  //   '#C8E1E6', // 浅薄荷蓝
  //   '#D7E7C9', // 浅绿色
  //   '#D2A6D4', // 浅薰衣草色
  //   '#C0C8C2', // 浅石灰色
  //   '#B9C5D5', // 浅雾灰蓝
  //   '#D9D0C6', // 浅肉桂色
  // ];
  // 亮色系
  const colors = [
    '#FF6F61', // 亮珊瑚红
    '#6B5B93', // 亮紫灰色
    '#88B04B', // 亮青绿色
    // '#F7CAC9', // 亮浅红色
    '#92A8D1', // 亮蓝灰色
    '#955251', // 亮红褐色
    '#B9E2D2', // 亮薄荷色
    // '#F6EB61', // 亮柠檬黄
    '#80C3D0', // 亮青蓝色
    '#F2B632', // 亮金黄
    '#D98DA3', // 亮玫瑰色
    '#FFDAB9', // 亮杏色
    '#FF6F20', // 亮橘色
    '#A3D48D', // 亮绿色
    '#F77B7A', // 亮鲜红
    '#D2B4E1', // 亮紫色
    '#F3CFC3', // 亮淡粉色
    // '#FFFED6', // 亮米色
    '#A1D3E0', // 亮天蓝色
    '#C3DAB4', // 亮薄荷绿
    '#FDDA6C', // 亮沙色
    '#E0A3EB', // 亮淡紫色
    '#FB961C', // 亮金橙色
    '#B8E1F3', // 亮青色
    // '#F1CD2A', // 亮黄橙色
    '#B2D6E9', // 亮水蓝色
    '#FF4F4F', // 亮鲜红色
    '#5D9CEC', // 亮春蓝色
    '#FECE5B', // 亮金色
    '#A2DFF7', // 亮海洋蓝
    '#FCD0A8', // 亮染色金
    // '#F9E8BA', // 亮黄米色
    '#D2E6B5', // 亮轻绿
    '#FFA07A', // 亮浅橙色
    '#FFB3E6', // 亮浅紫红色
    // '#FFDDDB', // 亮淡红色
    '#B6EFC5', // 亮翠绿
    '#E8DDDE', // 亮浅灰色
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }

  // 使用哈希值来获取 colors 数组中的索引
  const index = Math.abs(hash) % colors.length;
  const color = colors[index];

  return {
    name: name,
    color: color,
  };
};

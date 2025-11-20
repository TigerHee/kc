/*
 * Owner: jesse.shao@kupotech.com
 */
var a = {
  channel: 'telegram-运营自定义参数',
  answers: [
    // 题目 id 1013; 单选题；  选中了第 0项且选项有输入内容
    {
      options: [{ sort: '0', selected: true, content: '产品玩法很新颖' }],
      questionId: 1013,
      questionType: 0,
    },
    // 题目 id 1018; 单选量表题；  选中了第8项且选项无输入内容
    {
      options: [{ sort: '8', selected: true }],
      questionId: 1018,
      questionType: 0,
    },
    // 题目 id 1019; 单选量表题；  选中了第0项
    {
      options: [{ sort: '0', selected: true }],
      questionId: 1019,
      questionType: 0,
    },
    // 题目 id 1014; 开放式问答
    {
      optionContent: '开放式问答的答案',
      questionId: 1014,
      questionType: 1,
    },
    // 题目 id 1015; 多选题； 选中了第 0和8项；第0项有输入内容，但第8项无内容
    {
      options: [
        { sort: '0', selected: true, content: '产品玩法很新颖' },
        { sort: '8', selected: true },
      ],
      questionId: 1015,
      questionType: 2,
    },
  ],
  deliverNo: 0,
  deliverId: 300013,
  surveyId: 200013,
  userId: 'string',
  userType: 'string',
};

// / 问题1, 2,3,4,5,6,7,8
// 1,  2,4,7,8 将2 换选项， 走 1, 2,3,4,

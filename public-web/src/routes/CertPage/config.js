/**
 * Owner: brick.fan@kupotech.com
 */

import discord from 'static/cert/certType/discord.svg';
import email from 'static/cert/certType/email.svg';
import facebook from 'static/cert/certType/facebook.svg';
import instagram from 'static/cert/certType/instagram.svg';
import line from 'static/cert/certType/line.svg';
import linked from 'static/cert/certType/linked.svg';
import medium from 'static/cert/certType/medium.svg';
import note from 'static/cert/certType/note.svg';
import panews from 'static/cert/certType/panews.svg';
import phone from 'static/cert/certType/phone.svg';
import reddit from 'static/cert/certType/reddit.svg';
import skype from 'static/cert/certType/skype.svg';
import slack from 'static/cert/certType/slack.svg';
import telegram from 'static/cert/certType/telegram.svg';
import tiktok from 'static/cert/certType/tiktok.svg';
import vk from 'static/cert/certType/vk.svg';
import wallet from 'static/cert/certType/wallet.svg';
import website from 'static/cert/certType/website.svg';
import whatsapp from 'static/cert/certType/whatsapp.svg';
import xlogo from 'static/cert/certType/xlogo.svg';
import youtube from 'static/cert/certType/youtube.svg';

export const typeList = [
  {
    label: '8t1v51VhACHQx7HYH7oR9a', // 官方网站
    value: '0',
    icon: website,
  },
  {
    label: '16hAanzi9pkajQ6yUofbib', // Telegram
    value: 7,
    icon: telegram,
  },
  {
    label: '2AYabw64YYJtDAYPQkgXFn', // 邮箱
    value: 2,
    icon: email,
  },
  {
    label: 'X', // Twitter
    // label: 'h7k5PZy3rtYQFo4YdunNjZ', // Twitter
    noTranslate: true,
    value: 4,
    icon: xlogo,
  },
  {
    label: 'rRifidjmcV7RHHf5EoiAoM', // 电话
    value: 1,
    icon: phone,
  },
  {
    label: 'rYXLXuWeTdWmC1LGZPSYVt', // 官方商用钱包地址
    value: 23,
    icon: wallet,
  },
  {
    label: 'ar8gyeGsx4q7z28swP5Gim', // Facebook
    value: 6,
    icon: facebook,
  },
  {
    label: '27tEh3TpyZVwTV4ocj2qHW', // Reddit
    value: 10,
    icon: reddit,
  },
  {
    label: '6MfLFZuTaUF5vU3gVpLyeD', // WhatsApp
    value: 18,
    icon: whatsapp,
  },
  {
    label: '6ZJHMDWoxJz8VVKWtX6ARB', // Medium
    value: 9,
    icon: medium,
  },
  {
    label: 'kh84CGCE2hvfQ4BwHc7eei', // Instagram
    value: 12,
    icon: instagram,
  },
  {
    label: 'qTKC5f3FYA2rCdHtui76fo', // YouTube
    value: 8,
    icon: youtube,
  },
  {
    label: 'bc1x2UygZBJCPxdgpa3Gks', // Linkedin
    value: 11,
    icon: linked,
  },
  {
    label: 'qnaHP63dRsna9Jt1svi7oX', // Discord
    value: 24,
    icon: discord,
  },
  {
    label: '3pnoHktev9Bje2TSvYZuap', // TikTok
    value: 25,
    icon: tiktok,
  },
  {
    label: '7ZNNF9LBzfzGgNJuBx2JWV', // Skype
    value: 16,
    icon: skype,
  },
  {
    label: 'nEmth8rq7yXK3fz4kogrS8', // VK
    value: 14,
    icon: vk,
  },

  {
    label: 'Note', // Note
    noTranslate: true,
    value: 30,
    icon: note,
  },
  {
    label: 'Slack', // Slack
    noTranslate: true,
    value: 31,
    icon: slack,
  },
  {
    label: 'Line', // Line
    noTranslate: true,
    value: 32,
    icon: line,
  },
  {
    label: 'PANews', // Panewslab
    noTranslate: true,
    value: 33,
    icon: panews,
  },
];

export const typeConfig = {
  0: 'cert.official.site',
  1: 'cert.phone',
  2: 'cert.email',
  3: 'cert.wechat',
  4: 'cert.twitter',
  5: 'cert.skype',
  6: 'cert.facebook',
  7: 'cert.telegram',
  8: 'cert.youtube',
  9: 'cert.medium',
  10: 'cert.reddit',
  11: 'cert.linkedin',
  12: 'cert.instagram',
  13: 'cert.weibo',
  14: 'cert.vk',
  15: 'cert.slack',
  16: 'cert.skype',
  17: 'cert.wz',
  18: 'cert.whatsApp',
  19: 'cert.line',
  20: 'cert.zoom',
  21: 'cert.qq',
  22: 'cert.authenticationCode',
  23: 'mG3UQsAN5axCRz4UwmAAPX', // KuCoin官方商业钱包地址
};

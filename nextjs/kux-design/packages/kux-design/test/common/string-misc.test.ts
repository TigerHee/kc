// string-misc.test.ts
import { formatNickName, hasFullWidthChar } from '@/common/string-misc';


describe('formatNickName', () => {

  it('非中文返回前两个字母', () => {
    console.log('formatNickName 999', formatNickName('John Doe'));
    expect(formatNickName('')).toBe('');
    expect(formatNickName('John Doe')).toBe('JO');
    expect(formatNickName('Alice')).toBe('AL');
    expect(formatNickName('محمد أحمد')).toBe('مح');
    expect(formatNickName('лександр Пушкин')).toBe('ЛЕ');
  });

  it('中文名只显示第一个汉字', () => {
    expect(formatNickName('张三')).toBe('张');
    expect(formatNickName('高橋健太')).toBe('高');
    expect(formatNickName('たなか')).toBe('た');
    expect(formatNickName('佐々木')).toBe('佐');
  });

  it('开头特殊字符', () => {
    expect(formatNickName('@lucy')).toBe('@L');
    expect(formatNickName('#hello')).toBe('#H');
  });

  it('有数字情况', () => {
    expect(formatNickName('123456')).toBe('12');
    expect(formatNickName('A1')).toBe('A1');
  });

  it('空输入返回空字符串', () => {
    expect(formatNickName(null as any)).toBe('');
    expect(formatNickName(undefined as any)).toBe('');
  });

  it('正确处理 Emoji 名字', () => {
    expect(formatNickName('😀😃😄')).toBe('😀');
  });

  it('中间有特殊字符', () => {
    expect(formatNickName('Jean-Paul Sartre')).toBe('JE');
  });

  it('第二个字符是特殊字符时只保留第一个', () => {
    expect(formatNickName('$Lucy')).toBe('$L');
    expect(formatNickName('L$ucy')).toBe('L$');
  });
});

describe('hasFullWidthChar', () => {
  it('中文', () => {
    expect(hasFullWidthChar('你好')).toBe(true);
    expect(hasFullWidthChar('你好world')).toBe(true); 
  });

  it('非中文', () => {
    expect(hasFullWidthChar('hello')).toBe(false);
    expect(hasFullWidthChar('123')).toBe(false);
    expect(hasFullWidthChar('!@#')).toBe(false);
    expect(hasFullWidthChar('محمد أحمد')).toBe(false); 
    expect(hasFullWidthChar('Александр Пушкин')).toBe(false); 
  });

  it('空字符串', () => {
    expect(hasFullWidthChar('')).toBe(false);
  });
});
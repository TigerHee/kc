import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { noTopLevelBoot } from 'kc-next/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-this-alias': 'off',
      'kc-next/no-top-level-boot': 'error',
      '@next/next/no-img-element': 'off', // 关闭 next/image 检查
      '@next/next/no-css-tags': 'off', // 动态css
      '@typescript-eslint/no-explicit-any': 'off', // 关闭 any 类型的检查
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/no-anonymous-default-export': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/display-name': 'off',
      indent: ['error', 2, { SwitchCase: 1 }],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
    },
    plugins: {
      'kc-next': noTopLevelBoot,
    },
  },
];

export default eslintConfig;

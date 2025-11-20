import { transform } from '@svgr/core'
import jsx from '@svgr/plugin-jsx'
import svgo from '@svgr/plugin-svgo'
import prettier from '@svgr/plugin-prettier'

const attributeWithColor = [
  'fill',
  'stroke',
]

// 👇 注意这里我们显式强断言 plugin 类型
const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          // removeDimensions: true,
          cleanupIds: {
            remove: true,
          }
        },
      },
    },
    'removeDimensions',
    {
      name: 'customFillToCurrentColor',
      type: 'visitor', // ✅ 必须使用 visitor 而不是 perItem
      fn: () => ({
        element: {
          enter: (node: any) => {
            attributeWithColor.forEach((attr) => {
              if (
                node.attributes?.[attr] &&
                node.attributes[attr] !== 'none'
              ) {
                node.attributes[attr] = 'currentColor'
              }
            })
          },
        },
      }),
    }
  ],
}



export async function convertSvg2react(svgCode: string): Promise<string> {
  const componentCode = await transform(
    svgCode,
    {
      "dimensions": true,
      "icon": false,
      "native": false,
      "typescript": true,
      "ref": false,
      "memo": false,
      "titleProp": false,
      "descProp": false,
      "expandProps": "end",
      "replaceAttrValues": {},
      "svgProps": {},
      "exportType": "default",
      "namedExport": "ReactComponent",
      "jsxRuntime": "automatic",
      "svgo": true,
      // @ts-expect-error ignore svgoConfig type
      "svgoConfig": svgoConfig,
      plugins:[ svgo, jsx,  prettier ],
      "prettier": true,
      template: (variables, { tpl }) => {
        return tpl`
import type { SVGProps } from 'react';
import { type IIconProps, KuxIcon } from '../kc-icon';

function SvgIcon(${variables.props}) {
  return ${variables.jsx};
}

export default function ${variables.componentName}(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}
`
      },
      "prettierConfig": {
        "semi": false
      }
  }
  )
  return componentCode
}

import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12.006 1.5c4.22 0 7.826 2.613 9.295 6.306l.136.361.03.098a1 1 0 0 1-1.877.663l-.039-.095-.108-.288a8.003 8.003 0 0 0-14.982.288 1 1 0 0 1-1.943-.331l-.012-5 .005-.102a1 1 0 0 1 1.99-.004l.005.102.003 1.385A9.98 9.98 0 0 1 12.006 1.5M11.994 22.5c-4.22 0-7.826-2.613-9.295-6.306l-.136-.361-.029-.098a1 1 0 0 1 1.876-.663l.039.095.108.288a8.003 8.003 0 0 0 14.982-.288 1 1 0 0 1 1.943.331l.012 5-.005.102a1 1 0 0 1-1.99.005l-.005-.103-.003-1.385a9.97 9.97 0 0 1-7.497 3.383" />
        <path d="m12.506 6.667.128.01a.83.83 0 0 1 .652.53l3 8 .027.082a.834.834 0 0 1-1.553.582l-.034-.078-2.72-7.253-2.72 7.253a.834.834 0 0 1-1.56-.586l3-8 .055-.116a.83.83 0 0 1 .725-.424z" />
        <path d="M14.673 11.5v1.666H9.256V11.5z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

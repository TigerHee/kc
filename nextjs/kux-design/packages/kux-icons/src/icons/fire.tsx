import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M10.51 20.993s4.281-1.345 2.39-7.148c0 0-.918.57-1.24 1.202 0 0-1.109-1.582.012-4.62 0 0-6.702 4.328-3.068 10.566 0 0-9.108-2.45-.205-13.782 0 0-.233 1.44.07 2.023 0 0 1.681-4.559 8.237-5.307 0 0-3.525 4.204-.947 8.68 0 0 .69-.956 1.512-1.738 0 0 .4 2.668.531 3.829.391 3.463-1.99 6.36-7.291 6.295"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

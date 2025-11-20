import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M13.131 16.63c.058-.056.306-.27.51-.468 1.283-1.165 3.383-4.204 4.024-5.795.103-.242.321-.853.335-1.179q0-.469-.218-.895a1.87 1.87 0 0 0-.904-.795c-.263-.1-1.05-.256-1.064-.256-.861-.156-2.26-.242-3.806-.242-1.473 0-2.815.086-3.689.213-.014.015-.992.17-1.327.341A1.79 1.79 0 0 0 6 9.132v.056c.015.426.395 1.321.409 1.321.642 1.505 2.639 4.474 3.966 5.668 0 0 .341.336.554.482.306.228.685.341 1.064.341.423 0 .817-.128 1.138-.37"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

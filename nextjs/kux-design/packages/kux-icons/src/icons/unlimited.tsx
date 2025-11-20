import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M.99 12a5.554 5.554 0 0 1 5.55-5.55c1.85 0 3.453.91 4.45 2.283a1 1 0 1 1-1.62 1.174A3.47 3.47 0 0 0 6.54 8.45 3.554 3.554 0 0 0 2.99 12a3.554 3.554 0 0 0 3.55 3.55 3.82 3.82 0 0 0 3.273-1.855l1.329-2.208.001-.003 1.32-2.209A5.82 5.82 0 0 1 17.45 6.45 5.554 5.554 0 0 1 23 12a5.554 5.554 0 0 1-5.55 5.55c-1.843 0-3.442-.912-4.446-2.278a1 1 0 0 1 1.612-1.184c.656.894 1.677 1.462 2.834 1.462A3.554 3.554 0 0 0 21 12a3.554 3.554 0 0 0-3.55-3.55 3.82 3.82 0 0 0-3.272 1.854l-1.32 2.209-.001.003-1.33 2.209A5.82 5.82 0 0 1 6.54 17.55 5.554 5.554 0 0 1 .99 12"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

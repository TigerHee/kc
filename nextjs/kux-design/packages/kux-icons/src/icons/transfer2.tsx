import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M13.707 6.086A1 1 0 1 0 12.293 7.5l1.793 1.793H7.5a1 1 0 0 0 0 2h7.793c1.336 0 2.006-1.616 1.06-2.56zM8.707 12.569c-1.336 0-2.006 1.616-1.06 2.56l2.646 2.647a1 1 0 0 0 1.414-1.414l-1.793-1.793H16.5a1 1 0 1 0 0-2z" />
        <path
          fillRule="evenodd"
          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

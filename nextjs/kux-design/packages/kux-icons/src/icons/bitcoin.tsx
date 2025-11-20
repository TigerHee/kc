import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M13.277 6.5a1 1 0 1 0-2 0v.88h-.342V6.5a1 1 0 1 0-2 0v.88H7.5a1 1 0 1 0 0 2H8v5.5h-.5a1 1 0 1 0 0 2h1.348q.043.007.087.01v.872a1 1 0 1 0 2 0v-.87h.342v.87a1 1 0 1 0 2 0v-.87h1.077c1.614 0 3.146-1.17 3.146-2.88 0-1.01-.535-1.832-1.305-2.336.236-.418.37-.9.37-1.415 0-1.466-1.259-2.88-2.88-2.88h-.408zm-2.5 8.38q.078 0 .152.012h1.196a1 1 0 0 1 .304 0h1.925c.763 0 1.146-.513 1.146-.88 0-.368-.383-.881-1.146-.881h-.41a3 3 0 0 1-.26.011H10v1.739zM10 9.38v1.75h3.828a.88.88 0 0 0 .737-.869c0-.425-.425-.88-.88-.88H10" />
        <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

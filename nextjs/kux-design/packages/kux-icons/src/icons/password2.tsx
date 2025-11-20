import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M2.75 6.65a10.55 10.55 0 0 1 9.095-5.202h.31a10.551 10.551 0 1 1 0 21.104h-.31A10.551 10.551 0 0 1 2.75 6.65m9.095-3.202a8.552 8.552 0 1 0 0 17.104h.31a8.552 8.552 0 0 0 0-17.104z" />
        <path d="M12 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0" />
        <path d="M12 12a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

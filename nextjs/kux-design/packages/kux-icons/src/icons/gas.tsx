import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M6 6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zm2 0h5v3H8z" />
        <path d="M5.8 1A2.8 2.8 0 0 0 3 3.8v16.4A2.8 2.8 0 0 0 5.8 23h9.4a2.8 2.8 0 0 0 2.8-2.8v-4.066c.315.454.999.866.999.866s.79.692 2.203.692 2.691-1.023 2.797-2.395V10.9a1 1 0 1 0-2 0v3.967c0 .56-.46.798-.93.798s-.832-.282-1.046-.458a50 50 0 0 0-1.187-.938c-.406-.314-.73-.566-.836-.674V3.8A2.8 2.8 0 0 0 15.2 1zm9.4 2H5.8a.8.8 0 0 0-.8.8v16.4a.8.8 0 0 0 .8.8h9.4a.8.8 0 0 0 .8-.8V3.8a.8.8 0 0 0-.8-.8" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

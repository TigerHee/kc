import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M13.345 2.858c-.553-1.114-2.143-1.11-2.69.007L8.275 7.72l-5.42.786c-1.229.178-1.721 1.688-.833 2.557l3.93 3.84-.934 5.309c-.217 1.231 1.08 2.171 2.183 1.584l4.797-2.557 4.798 2.557c1.103.588 2.398-.35 2.184-1.581l-.927-5.31 3.924-3.843c.886-.869.395-2.377-.834-2.556l-5.387-.785z"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

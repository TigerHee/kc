import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M4.804 18.159a1.5 1.5 0 0 1 1.5-1.5h11.34a1.5 1.5 0 0 1 1.5 1.5v3.172a1.5 1.5 0 0 1-1.5 1.5H6.304a1.5 1.5 0 0 1-1.5-1.5zm2 .5v2.172h10.34v-2.172z" />
        <path d="M12 .75C5.823.75 2.201 5.015 1.79 9.408c-.1 1.061.771 1.842 1.71 1.842h2.338l1.44 5.485h2.068l-1.44-5.485h3.083v5.485h2V11.25h3.038l-1.44 5.485h2.068l1.44-5.485H20.5c.939 0 1.81-.781 1.71-1.842C21.8 5.015 18.178.75 12 .75m0 2c4.929 0 7.708 3.207 8.179 6.5H3.822c.47-3.293 3.25-6.5 8.178-6.5" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 .5a1 1 0 0 1 .783.378l7.5 9.438a1 1 0 0 1 .056 1.166l-7.5 11.562a1 1 0 0 1-1.678 0l-7.5-11.562a1 1 0 0 1 .056-1.166l7.5-9.438A1 1 0 0 1 12 .5M7.171 13.219l4.423 1.964a1 1 0 0 0 .812 0l4.423-1.964L12 20.663zm10.742-2.67L12 13.175 6.087 10.55 12 3.107z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

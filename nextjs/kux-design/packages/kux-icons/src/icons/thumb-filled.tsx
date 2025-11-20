import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11.1 2a1 1 0 0 0-.914.594L6.895 10h-1.79c-1.622-.023-2.896 1.288-3.096 2.766A1 1 0 0 0 2 12.9v6.3a1 1 0 0 0 .009.134A3.08 3.08 0 0 0 5.105 22h12.89c1.421.013 2.546-1.03 2.752-2.379v-.001l1.241-8.099v-.001a2.8 2.8 0 0 0-2.793-3.22H14.8V5.7A3.7 3.7 0 0 0 11.1 2m-2.6 9.312 3.201-7.203a1.7 1.7 0 0 1 1.1 1.59v3.6a1 1 0 0 0 1 1h5.41a.8.8 0 0 1 .8.92L18.77 19.32c-.064.423-.387.684-.758.68H8.5z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M8.617 2h6.766l.675 5.403a4.09 4.09 0 1 1-8.116 0zm1.766 2-.457 3.651a2.09 2.09 0 1 0 4.148 0L13.617 4z" />
        <path d="M1.727 5.12A3.56 3.56 0 0 1 5.261 2h5.372l-.788 6.3A4.225 4.225 0 1 1 1.461 7.25zM5.261 4a1.56 1.56 0 0 0-1.55 1.367L3.446 7.5a2.225 2.225 0 0 0 4.416.552L8.367 4zM22.273 5.12A3.56 3.56 0 0 0 18.739 2h-5.372l.788 6.3a4.225 4.225 0 0 0 8.384-1.049zM18.739 4a1.56 1.56 0 0 1 1.55 1.367l.266 2.132a2.225 2.225 0 1 1-4.416.552L15.633 4z" />
        <path d="M4 10v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7h2v7a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-7z" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

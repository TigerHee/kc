import type { SVGProps } from 'react'
import { type IIconProps, KuxIcon } from '../kc-icon'
function SvgIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M7.732 11.435a.9.9 0 0 1 1.516.97l-1.535 2.398A3.66 3.66 0 0 1 8.95 17.55a3.677 3.677 0 0 1-3.487 3.67l-.188.005-.19-.005a3.675 3.675 0 1 1 1.024-7.25zm-2.457 4.239a1.876 1.876 0 1 0 .903.232 1 1 0 0 1-.103-.042l-.08-.046a1.9 1.9 0 0 0-.72-.144M18.727 13.874a3.676 3.676 0 0 1 .188 7.345l-.188.005-.19-.005a3.67 3.67 0 0 1-3.37-2.769H12a.9.9 0 0 1 0-1.8h3.162a3.68 3.68 0 0 1 3.565-2.776m0 1.8a1.875 1.875 0 1 0 0 3.75 1.875 1.875 0 0 0 0-3.75M12 2.777a3.675 3.675 0 0 1 3.675 3.675c0 .97-.379 1.849-.993 2.506l1.586 2.476a.9.9 0 0 1-1.516.972l-1.583-2.473c-.367.123-.76.194-1.169.194h-.001A3.675 3.675 0 0 1 12 2.777m0 1.8a1.875 1.875 0 0 0 0 3.75c.362 0 .698-.105.984-.282l.03-.024.044-.023A1.875 1.875 0 0 0 12 4.578" />
      </g>
    </svg>
  )
}
export default function SvgComponent(props: IIconProps) {
  return <KuxIcon {...props} icon={SvgIcon} />
}

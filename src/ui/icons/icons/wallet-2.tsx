import React from 'react';
import type { IconProps } from '../types';

export function Wallet2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path d="M18 21H4V19H18V21ZM4 19H2V5H4V19ZM20 7H22V17H20V19H18V17H12V15H20V9H12V7H18V5H20V7ZM12 15H10V9H12V15ZM16 13H14V11H16V13ZM18 5H4V3H18V5Z" fill={color}/>
    </svg>
  );
}

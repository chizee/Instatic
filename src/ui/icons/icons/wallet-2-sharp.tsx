import React from 'react';
import type { IconProps } from '../types';

export function Wallet2SharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M20 7H22V17H20V21H2V3H20V7ZM4 19H18V17H10V7H18V5H4V19ZM12 15H20V9H12V15ZM16 13H14V11H16V13Z" fill={color}/>
    </svg>
  );
}

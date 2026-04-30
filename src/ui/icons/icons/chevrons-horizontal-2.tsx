import React from 'react';
import type { IconProps } from '../types';

export function ChevronsHorizontal2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M8 15H6V13H4V11H6V9H8V7H10V17H8V15ZM16 9H18V11H20V13H18V15H16V17H14V7H16V9Z" fill={color}/>
    </svg>
  );
}

import React from 'react';
import type { IconProps } from '../types';

export function ChevronsHorizontalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M10 15V17H8V15H10ZM16 17H14V15H16V17ZM8 15H6V13H8V15ZM18 15H16V13H18V15ZM6 13H4V11H6V13ZM20 13H18V11H20V13ZM8 11H6V9H8V11ZM18 11H16V9H18V11ZM10 9H8V7H10V9ZM16 9H14V7H16V9Z" fill={color}/>
    </svg>
  );
}

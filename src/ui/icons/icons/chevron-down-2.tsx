import React from 'react';
import type { IconProps } from '../types';

export function ChevronDown2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M17 9V11H15V13H13V15H11V13H9V11H7V9H17Z" fill={color}/>
    </svg>
  );
}

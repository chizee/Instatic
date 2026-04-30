import React from 'react';
import type { IconProps } from '../types';

export function ChevronUp2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M17 15V13H15V11H13V9H11V11H9V13H7V15H17Z" fill={color}/>
    </svg>
  );
}

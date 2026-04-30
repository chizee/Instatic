import React from 'react';
import type { IconProps } from '../types';

export function ChevronsVertical2Icon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M15 16L15 18L13 18L13 20L11 20L11 18L9 18L9 16L7 16L7 14L17 14L17 16L15 16ZM9 8L9 6L11 6L11 4L13 4L13 6L15 6L15 8L17 8L17 10L7 10L7 8L9 8Z" fill={color}/>
    </svg>
  );
}

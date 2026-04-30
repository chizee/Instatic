import React from 'react';
import type { IconProps } from '../types';

export function GifSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M9 9H3V15H7V13H5V11H9V17H1V7H9V9ZM13 17H11V7H13V17ZM23 9H17V11H21V13H17V17H15V7H23V9Z" fill={color}/>
    </svg>
  );
}

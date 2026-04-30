import React from 'react';
import type { IconProps } from '../types';

export function ClosedCaptionSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <path d="M4 7H2V17H4V7Z" fill={color}/>
      <path d="M15 7H13V17H15V7Z" fill={color}/>
      <path d="M22 7H15V9H22V7Z" fill={color}/>
      <path d="M11 7H4V9H11V7Z" fill={color}/>
      <path d="M11 15H4V17H11V15Z" fill={color}/>
      <path d="M22 15H15V17H22V15Z" fill={color}/>
    </svg>
  );
}

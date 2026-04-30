import React from 'react';
import type { IconProps } from '../types';

export function TextCursorIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="5" y="2" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 5 22)" fill={color}/>
      <rect x="9" y="4" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 9 20)" fill={color}/>
      <rect x="13" y="4" width="2" height="2" fill={color}/>
      <rect width="2" height="2" transform="matrix(1 0 0 -1 13 20)" fill={color}/>
      <rect x="15" y="2" width="4" height="2" fill={color}/>
      <rect width="4" height="2" transform="matrix(1 0 0 -1 15 22)" fill={color}/>
      <rect x="11" y="6" width="2" height="12" fill={color}/>
    </svg>
  );
}

import React from 'react';
import type { IconProps } from '../types';

export function BulletlistSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="10" y="5" width="12" height="2" fill={color}/>
      <rect x="10" y="9" width="8" height="2" fill={color}/>
      <rect x="10" y="13" width="12" height="2" fill={color}/>
      <rect x="10" y="17" width="8" height="2" fill={color}/>
      <path d="M4 7V9H6V7H4ZM8 11H2V5H8V11Z" fill={color}/>
      <rect x="2" y="13" width="6" height="2" fill={color}/>
      <rect x="2" y="17" width="6" height="2" fill={color}/>
      <rect x="2" y="17" width="2" height="2" transform="rotate(-90 2 17)" fill={color}/>
      <rect x="6" y="17" width="2" height="2" transform="rotate(-90 6 17)" fill={color}/>
    </svg>
  );
}

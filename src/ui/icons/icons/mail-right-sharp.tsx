import React from 'react';
import type { IconProps } from '../types';

export function MailRightSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect opacity="0.1" x="6" y="8" width="2" height="2" fill={color}/>
      <rect opacity="0.1" x="8" y="10" width="2" height="2" fill={color}/>
      <rect opacity="0.1" width="2" height="2" transform="matrix(-1 0 0 1 18 8)" fill={color}/>
      <rect opacity="0.1" width="2" height="2" transform="matrix(-1 0 0 1 16 10)" fill={color}/>
      <rect opacity="0.1" x="10" y="12" width="4" height="2" fill={color}/>
      <rect x="2" y="4" width="20" height="2" fill={color}/>
      <rect x="2" y="18" width="10" height="2" fill={color}/>
      <rect x="2" y="6" width="2" height="12" fill={color}/>
      <rect x="20" y="6" width="2" height="6" fill={color}/>
      <rect x="6" y="8" width="2" height="2" fill={color}/>
      <rect x="8" y="10" width="2" height="2" fill={color}/>
      <rect x="14" y="10" width="2" height="2" fill={color}/>
      <rect x="16" y="8" width="2" height="2" fill={color}/>
      <rect x="10" y="12" width="4" height="2" fill={color}/>
      <rect x="22" y="18" width="2" height="2" fill={color}/>
      <rect x="14" y="18" width="4" height="2" fill={color}/>
      <rect x="20" y="16" width="2" height="6" fill={color}/>
      <rect x="18" y="14" width="2" height="10" fill={color}/>
    </svg>
  );
}

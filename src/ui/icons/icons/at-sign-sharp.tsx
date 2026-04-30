import React from 'react';
import type { IconProps } from '../types';

export function AtSignSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="9" y="8" width="6" height="2" fill={color}/>
      <rect x="9" y="14" width="8" height="2" fill={color}/>
      <rect x="7" y="16" width="8" height="2" transform="rotate(-90 7 16)" fill={color}/>
      <rect x="13" y="14" width="6" height="2" transform="rotate(-90 13 14)" fill={color}/>
      <rect x="17" y="4" width="2" height="12" fill={color}/>
      <rect x="3" y="4" width="14" height="2" fill={color}/>
      <rect x="3" y="6" width="2" height="12" fill={color}/>
      <rect x="3" y="18" width="16" height="2" fill={color}/>
    </svg>
  );
}

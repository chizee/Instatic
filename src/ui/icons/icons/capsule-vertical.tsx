import React from 'react';
import type { IconProps } from '../types';

export function CapsuleVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="5" y="18" width="12" height="2" transform="rotate(-90 5 18)" fill={color}/>
      <rect x="7" y="20" width="2" height="2" transform="rotate(-90 7 20)" fill={color}/>
      <rect x="7" y="6" width="2" height="2" transform="rotate(-90 7 6)" fill={color}/>
      <rect x="15" y="20" width="2" height="2" transform="rotate(-90 15 20)" fill={color}/>
      <rect x="15" y="6" width="2" height="2" transform="rotate(-90 15 6)" fill={color}/>
      <rect x="17" y="18" width="12" height="2" transform="rotate(-90 17 18)" fill={color}/>
      <rect x="9" y="22" width="2" height="6" transform="rotate(-90 9 22)" fill={color}/>
      <rect x="9" y="4" width="2" height="6" transform="rotate(-90 9 4)" fill={color}/>
    </svg>
  );
}

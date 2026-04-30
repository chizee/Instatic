import React from 'react';
import type { IconProps } from '../types';

export function AlignStartVerticalIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="22" y="5" width="4" height="2" transform="rotate(90 22 5)" fill={color}/>
      <rect x="20" y="3" width="2" height="12" transform="rotate(90 20 3)" fill={color}/>
      <rect x="8" y="5" width="4" height="2" transform="rotate(90 8 5)" fill={color}/>
      <rect x="20" y="9" width="2" height="12" transform="rotate(90 20 9)" fill={color}/>
      <rect x="15" y="15" width="4" height="2" transform="rotate(90 15 15)" fill={color}/>
      <rect x="13" y="13" width="2" height="5" transform="rotate(90 13 13)" fill={color}/>
      <rect x="8" y="15" width="4" height="2" transform="rotate(90 8 15)" fill={color}/>
      <rect x="13" y="19" width="2" height="5" transform="rotate(90 13 19)" fill={color}/>
      <rect x="4" y="2" width="20" height="2" transform="rotate(90 4 2)" fill={color}/>
    </svg>
  );
}

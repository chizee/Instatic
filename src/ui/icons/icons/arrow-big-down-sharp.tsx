import React from 'react';
import type { IconProps } from '../types';

export function ArrowBigDownSharpIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="8" y="3" width="8" height="2" fill={color}/>
      <rect x="8" y="5" width="2" height="8" fill={color}/>
      <rect x="3" y="11" width="5" height="2" fill={color}/>
      <rect x="3" y="13" width="2" height="2" fill={color}/>
      <rect x="5" y="15" width="2" height="2" fill={color}/>
      <rect x="7" y="17" width="2" height="2" fill={color}/>
      <rect x="9" y="19" width="2" height="2" fill={color}/>
      <rect x="11" y="21" width="2" height="2" fill={color}/>
      <rect x="13" y="19" width="2" height="2" fill={color}/>
      <rect x="15" y="17" width="2" height="2" fill={color}/>
      <rect x="17" y="15" width="2" height="2" fill={color}/>
      <rect x="19" y="11" width="2" height="4" fill={color}/>
      <rect x="16" y="11" width="3" height="2" fill={color}/>
      <rect x="14" y="5" width="2" height="8" fill={color}/>
    </svg>
  );
}

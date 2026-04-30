import React from 'react';
import type { IconProps } from '../types';

export function TurtleIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="1" y="9" width="2" height="4" fill={color}/>
      <rect x="3" y="7" width="2" height="2" fill={color}/>
      <rect x="5" y="5" width="10" height="2" fill={color}/>
      <rect x="15" y="7" width="2" height="2" fill={color}/>
      <rect x="17" y="9" width="2" height="4" fill={color}/>
      <rect x="19" y="9" width="2" height="2" fill={color}/>
      <rect x="21" y="11" width="2" height="2" fill={color}/>
      <rect x="1" y="13" width="20" height="2" fill={color}/>
      <rect x="1" y="15" width="2" height="2" fill={color}/>
      <rect x="3" y="17" width="2" height="2" fill={color}/>
      <rect x="5" y="15" width="2" height="2" fill={color}/>
      <rect x="13" y="15" width="2" height="2" fill={color}/>
      <rect x="15" y="17" width="2" height="2" fill={color}/>
      <rect x="17" y="15" width="2" height="2" fill={color}/>
      <rect x="5" y="9" width="2" height="2" fill={color}/>
      <rect x="7" y="11" width="2" height="2" fill={color}/>
      <rect x="13" y="9" width="2" height="2" fill={color}/>
      <rect x="9" y="9" width="2" height="2" fill={color}/>
      <rect x="11" y="11" width="2" height="2" fill={color}/>
    </svg>
  );
}

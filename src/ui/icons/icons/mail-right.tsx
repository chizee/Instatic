import React from 'react';
import type { IconProps } from '../types';

export function MailRightIcon({ size = 24, color = 'currentColor', className, style }: IconProps): React.ReactElement {
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
      <rect x="3" y="3" width="8" height="2" fill={color}/>
      <rect x="3" y="9" width="8" height="2" fill={color}/>
      <rect x="3" y="5" width="2" height="4" fill={color}/>
      <rect x="9" y="5" width="2" height="4" fill={color}/>
      <rect x="13" y="3" width="8" height="2" fill={color}/>
      <rect x="13" y="9" width="8" height="2" fill={color}/>
      <rect x="13" y="5" width="2" height="4" fill={color}/>
      <rect x="19" y="5" width="2" height="4" fill={color}/>
      <rect x="3" y="13" width="8" height="2" fill={color}/>
      <rect x="3" y="19" width="8" height="2" fill={color}/>
      <rect x="3" y="15" width="2" height="4" fill={color}/>
      <rect x="9" y="15" width="2" height="4" fill={color}/>
      <rect x="15" y="13" width="4" height="2" fill={color}/>
      <rect x="13" y="15" width="2" height="4" fill={color}/>
      <rect x="15" y="19" width="4" height="2" fill={color}/>
      <rect x="19" y="15" width="2" height="4" fill={color}/>
    </svg>
  );
}

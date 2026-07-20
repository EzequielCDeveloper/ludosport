import * as React from "react";

export default function AutocontrolIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M10 44V20l14-12 14 12v24" stroke="#ffe81f" strokeWidth={2} />
      <circle cx="24" cy="30" r="6" stroke="#ffe81f" strokeWidth={2} />
      <path d="M18 38l-4 6h20l-4-6" stroke="#ffe81f" strokeWidth={2} />
    </svg>
  );
}

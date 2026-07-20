import * as React from "react";

export default function DisciplinaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 4L8 44h32L24 4z" stroke="#ffe81f" strokeWidth={2} />
      <path d="M24 16l-6 16h12L24 16z" fill="#ffe81f" />
    </svg>
  );
}

import * as React from "react";

interface EllipsisProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  color?: string;
}

export function Ellipsis({
  size = 6,
  color = "var(--color-primary)",
  className,
  ...props
}: EllipsisProps) {
  const dotSize = size;
  return (
    <div className={className} {...props} aria-hidden>
      <style jsx>{`
        .ellipsis {
          display: inline-flex;
          gap: ${dotSize / 2}px;
          align-items: center;
        }
        .ellipsis div {
          width: ${dotSize}px;
          height: ${dotSize}px;
          background: ${color};
          border-radius: 9999px;
          opacity: 0.3;
          transform: translateY(0);
          animation: ellipsis 1s infinite;
        }
        .ellipsis div:nth-child(2) {
          animation-delay: 0.16s;
        }
        .ellipsis div:nth-child(3) {
          animation-delay: 0.32s;
        }
        @keyframes ellipsis {
          0% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-6px);
          }
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="ellipsis">
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

export default Ellipsis;

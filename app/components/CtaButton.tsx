import { forwardRef, type AnchorHTMLAttributes } from "react";

interface CtaButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: "cyan" | "white" | "blue" | "whatsapp";
}

const variantClasses: Record<CtaButtonProps["variant"], string> = {
  cyan: "inline-block font-display uppercase tracking-wider text-[var(--color-cyan)] bg-transparent border-2 border-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-black cta-btn--cyan transition-[color,background-color,transform,box-shadow] duration-300 hover:scale-[1.05] active:scale-[0.97]",
  white:
    "inline-block font-display uppercase tracking-wider text-white border-2 border-white hover:bg-white hover:text-black transition-[color,background-color,transform] duration-300 hover:scale-[1.05] active:scale-[0.97]",
  blue: "text-white bg-[var(--color-blue,#0a58ca)] hover:bg-[var(--color-red-dark)] transition-colors duration-200",
  whatsapp:
    "group fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 md:w-15 md:h-15 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 hover:shadow-[0_6px_24px_rgba(37,211,102,0.5)] transition-all duration-200 whatsapp-float--entry",
};

const CtaButton = forwardRef<HTMLAnchorElement, CtaButtonProps>(
  function CtaButton({ variant, className, children, ...rest }, ref) {
    return (
      <a
        ref={ref}
        className={`${variantClasses[variant]}${className ? ` ${className}` : ""}`}
        {...rest}
      >
        {children}
      </a>
    );
  },
);

export default CtaButton;

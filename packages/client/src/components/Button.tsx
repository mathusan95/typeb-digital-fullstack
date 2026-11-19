import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: string;
};

export function Button({
  icon,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} {...props}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </button>
  );
}

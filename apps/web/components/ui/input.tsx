import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @defaultValue "input"
   */
  asChild?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { asChild = true, ...inputProps } = props;

  const Compose = asChild ? React.Fragment : "input";

  return (
    <Compose
      ref={ref}
      {...inputProps}
    />
  );
});
Input.displayName = "Input";

export { Input };
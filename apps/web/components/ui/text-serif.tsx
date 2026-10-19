import * as React from "react";

interface TSerifProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * When true, the element is dropped and children render unwrapped.
   * @defaultValue false
   */
  asChild?: boolean;
}

const TSerif = React.forwardRef<HTMLElement, TSerifProps>((props, ref) => {
  const { asChild = false, children, ...textProps } = props;

  if (asChild) {
    return <>{children}</>;
  }

  return (
    <span ref={ref} {...textProps}>
      {children}
    </span>
  );
});
TSerif.displayName = "TSerif";

export { TSerif };

import * as React from "react";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * When true, the element is dropped and children render unwrapped, so a
   * caller can pass a single child through as the rendered node.
   * @defaultValue false
   */
  asChild?: boolean;
}

const T = React.forwardRef<HTMLElement, TextProps>((props, ref) => {
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
T.displayName = "T";

export { T };
export { T as Text };

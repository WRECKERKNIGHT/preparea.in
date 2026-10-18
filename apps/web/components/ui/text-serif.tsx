import * as React from "react";

interface TSerifProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @defaultValue "span"
   */
  asChild?: boolean;
}

const TSerif = React.forwardRef<HTMLElement, TSerifProps>((props, ref) => {
  const { asChild = true, ...textProps } = props;

  const Compose = asChild ? React.Fragment : "span";

  return (
    <Compose
      ref={ref}
      {...textProps}
    />
  );
});
TSerif.displayName = "TSerif";

export { TSerif };
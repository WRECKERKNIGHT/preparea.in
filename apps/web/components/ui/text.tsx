import * as React from "react";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @defaultValue "span"
   */
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLElement, TextProps>((props, ref) => {
  const { asChild = true, ...textProps } = props;

  const Compose = asChild ? React.Fragment : "span";

  return (
    <Compose
      ref={ref}
      {...textProps}
    />
  );
});
Text.displayName = "Text";

export { Text };
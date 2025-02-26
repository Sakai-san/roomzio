import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { ListItemButton, ListItemButtonProps } from "@mui/material";

interface MUILinkProps extends Omit<ListItemButtonProps, "href"> {
  // Add any additional props you want to pass to the button
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>((props, ref) => {
  return <ListItemButton component="a" ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(MUILinkComponent);

export const ButtonLink: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent {...props} />;
};

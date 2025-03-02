import { Fragment } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Link, useMatch } from "@tanstack/react-router";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const BreadcrumbNav = () => {
  const deviceMatch = useMatch({ from: "/rooms/$roomId/devices/$deviceId", shouldThrow: false });
  const roomMatch = useMatch({ from: "/rooms/$roomId/", shouldThrow: false });

  const items = deviceMatch
    ? [
        { label: "Home", href: "/" },
        { label: "Room", href: `/rooms/${deviceMatch.params.roomId}` },
        { label: deviceMatch.loaderData?.name },
      ]
    : roomMatch
      ? [{ label: "Home", href: "/" }, { label: roomMatch.loaderData?.name }]
      : [{ label: "Home", href: "/" }];

  return (
    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {item?.href ? (
            <Link to={item.href}>{item.label}</Link>
          ) : (
            <Typography sx={{ color: "text.primary" }}>{item.label}</Typography>
          )}
        </Fragment>
      ))}
    </Breadcrumbs>
  );
};

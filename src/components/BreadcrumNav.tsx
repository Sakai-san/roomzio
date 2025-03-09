import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, MatchRoute, useMatch, useMatchRoute } from "@tanstack/react-router";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export const BreadcrumbNav = () => {
  const deviceMatch = useMatch({
    from: "/rooms/$roomId/devices/$deviceId",
    shouldThrow: false,
  });
  const roomMatch = useMatch({ from: "/rooms/$roomId/", shouldThrow: false });
  const matchRoute = useMatchRoute();

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
        <Link key={index} disabled={!item?.href} to={item.href}>
          {item.label}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

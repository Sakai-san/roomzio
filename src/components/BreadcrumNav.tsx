import Box from "@mui/material/Box";
import { Link, useMatch } from "@tanstack/react-router";

export const BreadcrumbNav = () => {
  const roomMatch = useMatch({ from: "/rooms/$roomId/", shouldThrow: false });
  const deviceMatch = useMatch({ from: "/rooms/$roomId/devices/$deviceId", shouldThrow: false });

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
    <div>
      <Box component="ul" sx={{ listStyleType: "none", display: "flex", gap: 5 }}>
        {items.map((item, index) => (
          <li key={index}>{item?.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}</li>
        ))}
      </Box>
    </div>
  );
};

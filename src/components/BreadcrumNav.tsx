import Box from "@mui/material/Box";
import { Link, useMatch, useMatches } from "@tanstack/react-router";

export const BreadcrumbNav = () => {
  const roomMatch = useMatch({ from: "/rooms/$roomId/", shouldThrow: false });
  const deviceMatch = useMatch({ from: "/rooms/$roomId/devices/$deviceId", shouldThrow: false });

  const items = deviceMatch
    ? [{ label: "Room", href: `/rooms/${deviceMatch.params.roomId}` }].concat(
        [deviceMatch].map(({ loaderData }) => {
          return {
            label: loaderData?.name,
          };
        })
      )
    : roomMatch
      ? [roomMatch].map(({ loaderData }) => ({
          label: loaderData?.name,
        }))
      : [{ label: "Home", href: "/" }];

  return (
    <div>
      <Box component="ul" sx={{ listStyleType: "none", display: "flex", gap: 5 }}>
        <li>
          <Link to="/">Home</Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            {item?.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}

            {/*index < items.length - 1 && <span>{">"}</span> */}
          </li>
        ))}
      </Box>
    </div>
  );
};

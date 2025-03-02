import Box from "@mui/material/Box";
import { Link, useMatch, useMatches } from "@tanstack/react-router";

export const BreadcrumbNav = () => {
  const rootMatch = useMatch({ from: "/", shouldThrow: false });
  const roomMatch = useMatch({ from: "/rooms/$roomId/", shouldThrow: false });
  const deviceMatch = useMatch({ from: "/rooms/$roomId/devices/$deviceId", shouldThrow: false });

  const paths = [deviceMatch, roomMatch, rootMatch] as const;
  const links = [
    (routeMatching: (typeof paths)[0]) => ({
      href: routeMatching?.pathname,
      label: routeMatching?.loaderData?.name,
    }),

    (routeMatching: (typeof paths)[1]) => ({
      href: routeMatching?.pathname,
      label: "Room",
    }),

    (routeMatching: (typeof paths)[2]) => ({
      href: routeMatching?.pathname,
      label: "Home",
    }),
  ];

  const indexStart = paths.findIndex((path) => path);
  const its = paths.slice(indexStart).sort();

  const items = deviceMatch
    ? [{ label: "room", href: `/rooms/${deviceMatch.params.roomId}` }].concat(
        [deviceMatch].map(({ loaderData }) => {
          return {
            label: loaderData?.name,
          };
        })
      )
    : (roomMatch ? [roomMatch] : []).map(({ loaderData }) => {
        return {
          label: loaderData?.name,
        };
      });

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

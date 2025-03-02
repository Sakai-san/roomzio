import Box from "@mui/material/Box";
import { isMatch, Link, useMatches, useMatchRoute, useMatch, rootRouteId } from "@tanstack/react-router";

export const BreadcrumbNav = () => {
  const match = useMatch({ from: rootRouteId });
  const matches = useMatches();
  const matchRoute = useMatchRoute();

  const roomRoute = matches.filter((match) => match.fullPath === "/rooms/$roomId/");
  const bookingRoute = matches.filter((match) => match.fullPath === "/rooms/$roomId/devices/$deviceId");

  const items =
    bookingRoute.length > 0
      ? [{ label: "room", href: `/rooms/${match.params.roomId}` }].concat(
          bookingRoute.map(({ pathname, loaderData }) => {
            return {
              label: loaderData?.name,
            };
          })
        )
      : roomRoute.map(({ pathname, loaderData }) => {
          return {
            label: loaderData?.name,
          };
        });

  console.group("BreadcrumbNav");
  console.log("match", match);
  console.groupEnd();

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

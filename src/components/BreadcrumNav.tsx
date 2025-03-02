import Box from "@mui/material/Box";
import { Link, useMatch } from "@tanstack/react-router";

export const BreadcrumbNav = () => {
  const roomMatch = useMatch({ from: "/rooms/$roomId/", shouldThrow: false });
  const bookMatch = useMatch({ from: "/rooms/$roomId/devices/$deviceId", shouldThrow: false });

  const items = bookMatch
    ? [{ label: "room", href: `/rooms/${bookMatch.params.roomId}` }].concat(
        [bookMatch].map(({ loaderData }) => {
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

  console.group("BreadcrumbNav");
  console.log("roomMatch", roomMatch);
  console.log("bookMatch", bookMatch);
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

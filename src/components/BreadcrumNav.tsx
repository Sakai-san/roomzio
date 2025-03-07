import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useMatch, useRouter } from "@tanstack/react-router";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const BreadcrumbNav = () => {
  const router = useRouter();
  const deviceMatch = useMatch({ from: "/rooms/$roomId/devices/$deviceId", shouldThrow: false });
  const roomMatch = useMatch({ from: "/rooms/$roomId/", shouldThrow: false });

  const onClick = () => (history.length > 1 ? router.history.back() : {});

  const items = deviceMatch
    ? [
        { label: "Home", href: "/", onClick },
        { label: "Room", href: `/rooms/${deviceMatch.params.roomId}` },
        { label: deviceMatch.loaderData?.name },
      ]
    : roomMatch
      ? [{ label: "Home", href: "/", onClick }, { label: roomMatch.loaderData?.name }]
      : [{ label: "Home", href: "/", onClick }];

  console.log("router", router);
  return (
    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
      {items.map((item, index) => {
        const { href, ...rest } = item;
        return (
          <Link key={index} disabled={!href} to={href} {...rest}>
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

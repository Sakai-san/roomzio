import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getRooms } from "../api";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import { ButtonLink } from "../components/ButtonLink";
import { Avatar } from "../components/Avatar";

export const Route = createFileRoute("/")({
  loader: getRooms,
  component: Index,
});

function Index() {
  const rooms = Route.useLoaderData();

  return (
    <List
      dense
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
      component="nav"
    >
      {rooms.map((room, index) => (
        <Fragment key={room.id}>
          <ButtonLink
            to="/rooms/$roomId"
            params={{
              roomId: room.id,
            }}
          >
            <ListItemAvatar>
              <Avatar id={room.id} name={room.name} type="Room" />
            </ListItemAvatar>
            <ListItemText primary={room.name} />
            <ListItemIcon>
              {room.busy ? <DoNotDisturbAltIcon color="error" /> : <CheckCircleOutlineIcon color="success" />}
            </ListItemIcon>
          </ButtonLink>
          {index !== rooms.length - 1 && <Divider variant="inset" component="li" />}
        </Fragment>
      ))}
    </List>
  );
}

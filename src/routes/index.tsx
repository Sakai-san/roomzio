import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getRooms } from "../api";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import { ButtonLink } from "../components/ButtonLink";
import { Avatar } from "../components/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { IconButton } from "@mui/material";

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
              <Avatar uuid={room.id} alias={room.name} kind="Room" />
            </ListItemAvatar>
            <ListItemText primary={room.name} />
            <ListItemIcon>
              {room.busy ? <EventBusyIcon color="error" /> : <EventAvailableIcon color="success" />}
            </ListItemIcon>

            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <Fragment>
                  <IconButton>
                    <Button variant="contained" {...bindTrigger(popupState)}>
                      Dashboard
                    </Button>
                  </IconButton>
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem onClick={popupState.close}>Profile</MenuItem>
                    <MenuItem onClick={popupState.close}>My account</MenuItem>
                    <MenuItem onClick={popupState.close}>Logout</MenuItem>
                  </Menu>
                </Fragment>
              )}
            </PopupState>
          </ButtonLink>
          {index !== rooms.length - 1 && <Divider variant="inset" component="li" />}
        </Fragment>
      ))}
    </List>
  );
}

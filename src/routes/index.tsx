import { Fragment, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { deleteRoom, getRooms, patchRoom } from "../api";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import { ButtonLink } from "../components/ButtonLink";
import { Avatar } from "../components/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { useMutation } from "@tanstack/react-query";
import Alert, { AlertProps } from "@mui/material/Alert/Alert";
import { TransitionGroup } from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import Pagination from "@mui/material/Pagination";

export const Route = createFileRoute("/")({
  loader: ({
    location: {
      search: { page },
    },
  }) => getRooms(page),
  component: Index,
});

function Index() {
  const router = useRouter();
  const data = Route.useLoaderData();
  const [notification, setNotification] = useState<{
    message?: string;
    severity?: AlertProps["severity"];
    open: boolean;
  }>({ open: false });
  const { mutate: mutateDeletion, isPending: isPendingDelete } = useMutation({ mutationFn: deleteRoom });
  const { mutate: mutateRename, isPending: isPendingPatch } = useMutation({ mutationFn: patchRoom });

  const mutationOption = {
    onSuccess: async (response: Response) => {
      if (response.ok) {
        const { message } = await response.json();
        setNotification({ message, open: true });
        router.invalidate();
      } else {
        const { error } = await response.json();
        setNotification({ message: error, severity: "error", open: true });
      }
    },
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setNotification({ open: false });
  };

  return (
    <>
      <List
        dense
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
        component="nav"
      >
        <TransitionGroup>
          {data.rooms.map((room, index) => (
            <Collapse key={room.id}>
              <ListItem
                disablePadding
                secondaryAction={
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <Fragment>
                        <IconButton edge="end" aria-label="more" {...bindTrigger(popupState)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu {...bindMenu(popupState)}>
                          <MenuItem
                            onClick={() => {
                              mutateDeletion(room.id, mutationOption);
                              popupState.close();
                            }}
                          >
                            Delete
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              mutateRename(
                                {
                                  roomId: room.id,
                                  body: {
                                    name: "morge",
                                  },
                                },
                                mutationOption
                              );
                              popupState.close();
                            }}
                          >
                            Rename
                          </MenuItem>
                        </Menu>
                      </Fragment>
                    )}
                  </PopupState>
                }
              >
                <ButtonLink
                  disabled={isPendingDelete}
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
                </ButtonLink>
                {/*index !== rooms.length - 1 && <Divider variant="inset" component="li" />
                 */}
              </ListItem>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        key={JSON.stringify(notification)}
      >
        <Alert onClose={handleClose} severity={notification.severity} variant="filled" sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Pagination
        count={data.count}
        color="primary"
        renderItem={(item) => <ButtonLink to={`/rooms${item.page === 1 ? "" : `?page=${item.page}`}`} {...item} />}
      />
    </>
  );
}

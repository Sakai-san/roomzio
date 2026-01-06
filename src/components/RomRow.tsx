import { FC, Fragment, Dispatch, SetStateAction } from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Menu from "@mui/material/Menu";
import { ButtonLink } from "./ButtonLink";
import { Avatar } from "./Avatar";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import { RenameRoomForm } from "./RenameRoomForm";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";

type RoomRowProps = {
  room: {
    id: string;
    name: string;
    booker_id: string | null;
  };
  editingRoomId: string | null;
  onRename: (data: { name: string }) => void;
  onDelete: () => void;
  setEditingRoomId: Dispatch<SetStateAction<string | null>>;
  loading?: boolean;
};

export const RoomRow: FC<RoomRowProps> = ({
  room,
  editingRoomId,
  onRename,
  onDelete,
  setEditingRoomId,
  loading,
}) => {
  const isRoomBooked = !!room.booker_id;
  return (
    <ListItem
      disablePadding
      secondaryAction={
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <Fragment>
              <IconButton
                edge="end"
                aria-label="more"
                {...bindTrigger(popupState)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu {...bindMenu(popupState)}>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    onDelete();
                  }}
                >
                  Delete
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    popupState.close();
                    setEditingRoomId(room.id);
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
      {room.id === editingRoomId ? (
        <ClickAwayListener onClickAway={() => setEditingRoomId(null)}>
          <Box
            sx={{
              paddingLeft: "16px",
              paddingRight: "48px",
              paddingTop: "4px",
              paddingBottom: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ListItemAvatar>
              <Avatar uuid={room.id} alias={room.name} kind="Room" />
            </ListItemAvatar>
            <ListItemText
              sx={{ marginRight: "10px" }}
              primary={
                <RenameRoomForm
                  defaultValues={{ name: room.name }}
                  onClose={() => setEditingRoomId(null)}
                  onSubmit={(data) => {
                    onRename(data);
                    setEditingRoomId(null);
                  }}
                />
              }
            />
            <ListItemIcon>
              {isRoomBooked ? (
                <EventBusyIcon color="error" />
              ) : (
                <EventAvailableIcon color="success" />
              )}
            </ListItemIcon>
          </Box>
        </ClickAwayListener>
      ) : (
        <ButtonLink
          disabled={loading}
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
            {isRoomBooked ? (
              <EventBusyIcon color="error" />
            ) : (
              <EventAvailableIcon color="success" />
            )}
          </ListItemIcon>
        </ButtonLink>
      )}
    </ListItem>
  );
};

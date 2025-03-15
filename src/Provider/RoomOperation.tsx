import { Fragment, createContext, PropsWithChildren, useContext, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { RoomType } from "../api";

interface RoomOperations {
  deleteRoom: (room: RoomType) => Promise<void>;
  renameRoom: (room: RoomType) => Promise<void>;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const RoomOperationsContext = createContext<RoomOperations>({} as RoomOperations);

function RoomOperationsProvider({ children }: PropsWithChildren) {
  const [pendingRoom, setPendingRoom] = useState<RoomType | undefined>(undefined);

  const handleOpen = (room: RoomType) => {
    setPendingRoom(room);
  };

  const handleClose = () => {
    setPendingRoom(undefined);
  };

  const deleteRoom = (room: RoomType) => {
    return Promise.resolve(undefined);
  };

  const renameRoom = (room: RoomType) => {
    setPendingRoom(room);
    return Promise.resolve(undefined);
  };

  const providerValue: RoomOperations = {
    handleOpen,
    deleteRoom,
    renameRoom,
  };

  return (
    <Fragment>
      <RoomOperationsContext.Provider value={providerValue}>{children}</RoomOperationsContext.Provider>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={!!pendingRoom}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Modal title
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget
            quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
          </Typography>
          <Typography gutterBottom>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet
            rutrum faucibus dolor auctor.
          </Typography>
          <Typography gutterBottom>
            Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl
            consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Fragment>
  );
}

const useRoomOperations = () => {
  const context = useContext(RoomOperationsContext);
  if (!Object.keys(context).length) {
    throw new TypeError(
      "Attempted to use `useRoomOperations` without its context. Did you forget to wrap the application in `RoomOperationsProvider`?"
    );
  }
  return context;
};

export { RoomOperationsContext, RoomOperationsProvider, useRoomOperations };

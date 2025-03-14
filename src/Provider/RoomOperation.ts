import { Fragment, createContext, PropsWithChildren, useContext, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { RoomType } from '../api';

interface RoomOperations {
  deleteRoom: (room:RoomType) => Promise<void>;
  renameRoom: (room: RoomType) => Promise<void>;
}

const RoomOperationsContext = createContext<RoomOperations>({} as RoomOperations);


function RoomOperationsProvider({ children }: PropsWithChildren) {
  const [pendingRoom, setPendingRoom] = useState<RoomType |undefined>(undefined);


  const handleClose = () => {
    setPendingRoom(undefined);
  };

  const deleteRoom = (room: RoomType) => {
    return Promise.resolve(undefined);
  };

  const renameRoom = (room: RoomType) => {
    return Promise.resolve(undefined);
  };

  const providerValue: RoomOperations = {
    deleteRoom,
    renameRoom,
  };

  return (

    <Fragment>
    <RoomOperationsContext.Provider value={providerValue}>{children}</RoomOperationsContext.Provider>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Use Google's location service?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
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

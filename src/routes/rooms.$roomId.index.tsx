import { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getRoom } from "../api";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import { ButtonLink } from "../components/ButtonLink";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import { useMutation } from "@tanstack/react-query";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert/Alert";
import Stack from "@mui/material/Stack/Stack";
import { Avatar as MUIAvatar } from "@mui/material";
import { Avatar } from "../components/Avatar";

export const Route = createFileRoute("/rooms/$roomId/")({
  loader: ({ params: { roomId } }) => getRoom(roomId),
  component: RoomDetail,
});

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

function RoomDetail() {
  const router = useRouter();
  const room = Route.useLoaderData();
  const { roomId } = Route.useParams();
  const [notification, setNotification] = useState<{
    message?: string;
    severity?: AlertProps["severity"];
    open: boolean;
  }>({ open: false });

  const releaseRoom = useMutation({
    mutationFn: (roomId: string) => {
      return fetch(`http://localhost:3000/rooms/${roomId}/release`, {
        method: "POST",
      });
    },
    onSuccess: async (response) => {
      if (response.ok) {
        const { message } = await response.json();
        setNotification({ message, open: true });
        router.invalidate();
      } else {
        const { error } = await response.json();
        setNotification({ message: error, severity: "error", open: true });
      }
    },
  });

  const bookRoom = useMutation({
    mutationFn: (roomId: string) => {
      return fetch(`http://localhost:3000/rooms/${roomId}/book`, {
        method: "POST",
      });
    },
    onSuccess: async (response) => {
      if (response.ok) {
        const { message } = await response.json();
        setNotification({ message, open: true });
        router.invalidate();
      } else {
        const { error } = await response.json();
        setNotification({ message: error, severity: "error", open: true });
      }
    },
  });

  const isRoomOccupied = !!room.booking;

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [isRoomOccupied]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setNotification({ open: false });
  };

  return (
    <>
      <Stack alignItems="center" width="100%">
        <Card sx={{ width: 345 }}>
          <CardHeader
            avatar={<Avatar id={room.id} name={room.name} type="Room" />}
            title={room.name}
            subheader={isRoomOccupied ? <EventBusyIcon color="error" /> : <EventAvailableIcon color="success" />}
          />
          <CardContent sx={{ mx: 5 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              <DevicesOtherIcon />
              {room.devices.map((device) => (
                <ButtonLink
                  key={device.id}
                  to="/rooms/$roomId/devices/$deviceId"
                  params={{
                    roomId,
                    deviceId: device.id,
                  }}
                >
                  {device.name}
                </ButtonLink>
              ))}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              aria-label="book a room"
              onClick={() => {
                bookRoom.mutate(roomId);
              }}
            >
              <EditCalendarIcon />
            </IconButton>

            <IconButton
              aria-label="release a room"
              onClick={() => {
                releaseRoom.mutate(roomId);
              }}
            >
              <AutoDeleteIcon />
            </IconButton>

            {isRoomOccupied && (
              <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                <ExpandMoreIcon />
              </ExpandMore>
            )}
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography sx={{ marginBottom: 2 }}> Booked by:</Typography>
              <Stack sx={{ marginBottom: 2 }} direction="row" alignItems="center" gap={3}>
                <MUIAvatar alt={room.booking?.fullName} src={room.booking?.avatar}></MUIAvatar>
                <Typography>{room.booking?.fullName}</Typography>
              </Stack>
            </CardContent>
          </Collapse>
        </Card>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={!!notification.message && notification.open}
          autoHideDuration={3000}
          onClose={handleClose}
          key={JSON.stringify(notification)}
        >
          <Alert onClose={handleClose} severity={notification.severity} variant="filled" sx={{ width: "100%" }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Stack>
    </>
  );
}

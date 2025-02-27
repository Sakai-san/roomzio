import { useState } from "react";
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
import { Avatar } from "../components/Avatar";
import { ButtonLink } from "../components/ButtonLink";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import { useMutation } from "@tanstack/react-query";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert/Alert";

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
      <Card sx={{ maxWidth: 345 }}>
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

          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography sx={{ marginBottom: 2 }}>Method:</Typography>
            <Typography sx={{ marginBottom: 2 }}>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high heat. Add chicken,
              shrimp and chorizo, and cook, stirring occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp
              to a large plate and set aside, leaving chicken and chorizo in the pan. Add pimentón, bay leaves, garlic,
              tomatoes, onion, salt and pepper, and cook, stirring often until thickened and fragrant, about 10 minutes.
              Add saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook without stirring,
              until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
              mussels, tucking them down into the rice, and cook again without stirring, until mussels have opened and
              rice is just tender, 5 to 7 minutes more. (Discard any mussels that don&apos;t open.)
            </Typography>
            <Typography>Set aside off of the heat to let rest for 10 minutes, and then serve.</Typography>
          </CardContent>
        </Collapse>
      </Card>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={!!notification.message && notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        key={notification.message}
      >
        <Alert onClose={handleClose} severity={notification.severity} variant="filled" sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

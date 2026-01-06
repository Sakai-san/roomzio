import { useState, useEffect } from "react";
import { Result } from "@swan-io/boxed";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { type AlertProps } from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { getRoom, postBooking } from "../api";
import { ButtonLink } from "../components/ButtonLink";
import { Avatar as MUIAvatar } from "@mui/material";
import { useAuth } from "../providers";
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
  const { user } = useAuth();
  const router = useRouter();
  const room = Route.useLoaderData();
  const { roomId } = Route.useParams();
  const [notification, setNotification] = useState<{
    message?: string;
    severity?: AlertProps["severity"];
    open: boolean;
  }>({ open: false });

  const { mutate: mutateBook, isPending: isPendingBook } = useMutation({
    mutationFn: postBooking,
  });
  const { mutate: mutateRelease, isPending: isPendingRelease } = useMutation({
    mutationFn: postBooking,
  });

  const mutationOption = {
    onSuccess: async (result: Result<unknown>) => {
      return result.match({
        Ok: (value) => {
          setNotification({
            message:
              value?.booker_id === null
                ? "Room successfully released"
                : "Room successfully booked",
            open: true,
          });
          router.invalidate();
        },
        Error: (error) => {
          console.error(error);
          setNotification({
            message: "Operation has failed",
            severity: "error",
            open: true,
          });
        },
      });
    },
  };

  const isRoomOccupied = !!room.booker_id;

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [isRoomOccupied]);

  const handleExpandClick = () => setExpanded(!expanded);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
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
            avatar={<Avatar uuid={room.id} alias={room.name} kind="Room" />}
            title={room.name}
            subheader={
              isRoomOccupied ? (
                <EventBusyIcon color="error" />
              ) : (
                <EventAvailableIcon color="success" />
              )
            }
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
            {!isRoomOccupied && (
              <Tooltip title="Book this room">
                <IconButton
                  disabled={isPendingBook}
                  aria-label="book a room"
                  onClick={() =>
                    user
                      ? mutateBook({ roomId, userId: user.id }, mutationOption)
                      : null
                  }
                >
                  <LockIcon />
                </IconButton>
              </Tooltip>
            )}
            {isRoomOccupied && (
              <Tooltip title="Release this room">
                <IconButton
                  disabled={isPendingRelease}
                  aria-label="release a room"
                  onClick={() =>
                    mutateRelease({ roomId, userId: null }, mutationOption)
                  }
                >
                  <LockOpenIcon />
                </IconButton>
              </Tooltip>
            )}

            {isRoomOccupied && (
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            )}
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography sx={{ marginBottom: 2 }} variant="body2">
                Booked by:
              </Typography>
              <Stack
                sx={{ marginBottom: 2 }}
                direction="row"
                alignItems="center"
                gap={3}
              >
                <MUIAvatar
                  alt={`${room.users?.first_name} ${room.users?.last_name}`}
                  src={room.users?.avatarpath}
                ></MUIAvatar>
                <Typography>{`${room.users?.first_name} ${room.users?.last_name}`}</Typography>
              </Stack>
            </CardContent>
          </Collapse>
        </Card>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        key={JSON.stringify(notification)}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

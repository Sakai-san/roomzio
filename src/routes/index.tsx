import React, { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  retainSearchParams,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { z } from "zod";
import { match, P } from "ts-pattern";
import { Result } from "@swan-io/boxed";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { type AlertProps } from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Collapse from "@mui/material/Collapse";
import { RoomRow } from "../components/RomRow";
import { deleteRoom, getRooms, patchRoom } from "../api";

export const Route = createFileRoute("/")({
  validateSearch: z.object({
    page: z.number().catch(1),
  }).parse,
  search: {
    // Retain the usersView search param while navigating
    // within or to this route (or it's children!)
    middlewares: [retainSearchParams(["page"])],
  },
  loaderDeps: ({ search }) => ({
    page: search.page,
  }),

  loader: (opts) => getRooms(opts.deps.page),
  component: Index,
});

function Index() {
  const router = useRouter();
  const data = Route.useLoaderData();
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message?: string;
    severity?: AlertProps["severity"];
    open: boolean;
  }>({ open: false });
  const { mutate: mutateDeletion, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteRoom,
  });
  const { mutate: mutateRename, isPending: isRenamingPending } = useMutation({
    mutationFn: patchRoom,
  });
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();

  const goTo = (_, value: number) =>
    navigate({
      search: (old) => {
        return {
          ...old,
          page: value,
        };
      },
      replace: true,
    });

  const mutationOption = (kind: "deletion" | "renaming") => ({
    onSuccess: async (result: Result<unknown>) => {
      return result.match({
        Ok: (value) => {
          setNotification({
            message:
              kind === "deletion"
                ? "Room successfully deleted"
                : "Room successfully renamed",
            open: true,
          });
          router.invalidate();
        },
        Error: (error) => {
          console.error(error);
          setNotification({
            message:
              kind === "deletion"
                ? "Failed to delete room"
                : "Failed to rename room",
            severity: "error",
            open: true,
          });
        },
      });
    },
  });

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
    <Stack>
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
          {match(data)
            .with(Result.P.Ok(P.select()), (value) =>
              value.rooms.map((room) => (
                <Collapse key={room.id}>
                  <RoomRow
                    room={room}
                    editingRoomId={editingRoomId}
                    onRename={({ name }) => {
                      mutateRename(
                        {
                          roomId: room.id,
                          name,
                        },
                        mutationOption("renaming")
                      );
                    }}
                    onDelete={() => {
                      mutateDeletion(room.id, mutationOption("deletion"));
                    }}
                    setEditingRoomId={setEditingRoomId}
                    loading={isRenamingPending || isPendingDelete}
                  />
                </Collapse>
              ))
            )
            .with(Result.P.Error(P.select()), (error) => {
              console.error(error);
              return null;
            })
            .exhaustive()}
        </TransitionGroup>
      </List>
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

      {match(data)
        .with(Result.P.Ok(P.select()), (value) => (
          <Pagination
            sx={{
              paddingTop: "8px",
              paddingBottom: "8px",
              backfaceVisibility: "hidden",
              backdropFilter: "blur(20px)",
              transform: "translateZ(0px)",
              position: "fixed",
              left: 0,
              zIndex: 1125,
              width: "100%",
              bottom: 0,
              display: "flex",
              justifyContent: "center",
            }}
            count={value.count}
            page={search.page}
            color="primary"
            onChange={goTo}
          />
        ))
        .with(Result.P.Error(P.select()), (error) => {
          console.error(error);
          return null;
        })
        .exhaustive()}
    </Stack>
  );
}

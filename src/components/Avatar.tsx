import { Avatar as MUIAvatar } from "@mui/material";
import { words } from "lodash";
import { FC } from "react";
import uniqolor from "uniqolor";

type AvtarProps = {
  id: string;
  name: string;
  type: "Device" | "Room";
};

export const Avatar: FC<AvtarProps> = ({ id, name, type }) => {
  const names = words(name);
  return (
    <MUIAvatar
      sx={{
        bgcolor: uniqolor(id).color,
      }}
      alt={`${type} avatar ${name}`}
      aria-label={type}
    >
      {`${names[0].at(0)} ${names[1].at(0)}`}
    </MUIAvatar>
  );
};

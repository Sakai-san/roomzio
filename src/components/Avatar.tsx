import { Avatar as MUIAvatar } from "@mui/material";
import { words } from "lodash";
import { FC } from "react";
import uniqolor from "uniqolor";

type AvtarProps = {
  uuid: string;
  alias: string;
  kind: "Device" | "Room";
};

export const Avatar: FC<AvtarProps> = ({ uuid, alias, kind }) => {
  const names = words(alias);
  return (
    <MUIAvatar
      sx={{
        bgcolor: uniqolor(uuid).color,
      }}
      alt={`${kind} avatar ${alias}`}
      aria-label={kind}
    >
      {`${names[0].at(0)} ${names[1].at(0)}`}
    </MUIAvatar>
  );
};

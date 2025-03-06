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
  const aliases = words(alias);
  return (
    <MUIAvatar
      sx={{
        bgcolor: uniqolor(uuid).color,
      }}
      alt={`${kind} avatar ${alias}`}
      aria-label={kind}
    >
      {`${aliases?.[0]?.at(0)} ${aliases?.[1]?.at(0)}`}
    </MUIAvatar>
  );
};

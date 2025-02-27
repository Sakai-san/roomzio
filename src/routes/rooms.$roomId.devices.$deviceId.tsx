import { createFileRoute } from "@tanstack/react-router";
import { getDevice } from "..//api";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Avatar } from "../components/Avatar";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import Battery1BarIcon from "@mui/icons-material/Battery1Bar";
import Battery2BarIcon from "@mui/icons-material/Battery2Bar";
import Battery3BarIcon from "@mui/icons-material/Battery3Bar";
import Battery4BarIcon from "@mui/icons-material/Battery4Bar";
import Battery5BarIcon from "@mui/icons-material/Battery5Bar";
import Battery6BarIcon from "@mui/icons-material/Battery6Bar";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";

export const Route = createFileRoute("/rooms/$roomId/devices/$deviceId")({
  loader: ({ params: { deviceId } }) => getDevice(deviceId),
  component: DeviceDetail,
});

const getBatteryIcon = (level: number) => {
  switch (true) {
    case level < 2:
      return <Battery0BarIcon />;
    case level >= 2 && level < 15:
      return <Battery1BarIcon />;
    case level >= 15 && level < 35:
      return <Battery2BarIcon />;
    case level >= 35 && level < 55:
      return <Battery3BarIcon />;
    case level >= 55 && level < 75:
      return <Battery4BarIcon />;
    case level >= 75 && level < 85:
      return <Battery5BarIcon />;
    case level >= 95 && level < 100:
      return <Battery6BarIcon />;
    default:
      return <BatteryFullIcon />;
  }
};

function DeviceDetail() {
  const device = Route.useLoaderData();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader avatar={<Avatar id={device.id} name={device.name} type="Device" />} title={device.name} />
      <CardContent>
        {getBatteryIcon(2 || device.battery)}
        <Typography>{device.battery}</Typography>
      </CardContent>
    </Card>
  );
}

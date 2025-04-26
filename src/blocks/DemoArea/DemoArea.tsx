import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import DataObjectIcon from "@mui/icons-material/DataObject";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import { isValidHex } from "../../utils/validation";
import Preview from "../Preview";
import PreviewError from "../PreviewError";
import { ZoomSlider } from "../../components/ZoomSlider";
import { useAtom } from "jotai";
import * as atoms from "../../store";

const DemoArea: React.FC = () => {
  const [zoom, setZoom] = React.useState(75);
  const [zoomActive, setZoomActive] = React.useState(false);
  const [palette] = useAtom(atoms.palette);
  const [hex] = useAtom(atoms.hex);
  const theme = useTheme();
  const containerRef = React.useRef(null);
  const demoAreaRef = React.useRef<HTMLDivElement>(null);
  const [, startTransition] = React.useTransition();

  const handleSlideChange = (
    event: Event,
    value: number | number[],
    activeThumb: number,
  ) => {
    setZoom(value as number);
  };

  const handleSlideStart = () => {
    if (!zoomActive) {
      setZoomActive(true);
    }
  };

  const handleSlideStop = () => {
    setZoomActive(false);
  };

  const error = !hex || !isValidHex(hex);

  // should be renamed – x and y are used to translate position of demo area
  const [mousePos, setMousePos] = React.useState({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    if (!demoAreaRef.current) return;

    demoAreaRef.current.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      if (!demoAreaRef.current) return;
      demoAreaRef.current.removeEventListener("wheel", handleWheel);
    };
  });

  const handleWheel = (event: WheelEvent) => {
    startTransition(() => {
      setMousePos((lastMousePos) => {
        const { x, y } = lastMousePos;
        const newX = x - event.deltaX;
        const newY = y - event.deltaY;
        return { x: newX, y: newY };
      });
    });
  };

  const handleDrag = (event: MouseEvent) => {
    setMousePos((lastMousePos) => {
      return {
        x: lastMousePos.x + event.movementX,
        y: lastMousePos.y + event.movementY,
      };
    });
  };

  const handleDragStart = (event: MouseEvent) => {
    if (!demoAreaRef.current) return;

    demoAreaRef.current.addEventListener("mousemove", handleDrag, true);
  };

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    // prevent dragging while adjusting zoom
    if (zoomActive || !demoAreaRef.current) {
      return;
    }

    handleDragStart(event.nativeEvent);
    demoAreaRef.current.addEventListener("mouseup", handleDragEnd, true);
  };

  const handleDragEnd = () => {
    if (!demoAreaRef.current) return;

    demoAreaRef.current.removeEventListener("mousemove", handleDrag, true);
    demoAreaRef.current.removeEventListener("mousedown", handleDragStart, true);
    demoAreaRef.current.removeEventListener("mouseup", handleDragEnd, true);
  };

  if (!palette) {
    return <p>Palette is undefined</p>;
  }

  return (
    <Box
      ref={demoAreaRef}
      sx={{
        position: "relative",
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleDragEnd}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: theme.zIndex.drawer,
          height: 500,
        }}
        ref={containerRef}
      >
        <ButtonGroup variant="outlined" size="small">
          <Tooltip title="View as JSON" placement="bottom">
            <Button>
              <DataObjectIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Center" placement="bottom">
            <Button
              onClick={() =>
                setMousePos({
                  x: 0,
                  y: 0,
                })
              }
            >
              <CenterFocusStrongIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <ZoomSlider
          value={zoom}
          onChange={handleSlideChange}
          onMouseOver={handleSlideStart}
          onMouseLeave={handleSlideStop}
        />
      </Box>

      {error ? (
        <PreviewError />
      ) : (
        <Box
          sx={{
            height: "100%",
            position: "relative",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              height: "100%",
              transform: `scale(${zoom / 100}) translate(${mousePos.x}px, ${
                mousePos.y
              }px)`,
              transformOrigin: "center",
            }}
          >
            <Preview />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DemoArea;

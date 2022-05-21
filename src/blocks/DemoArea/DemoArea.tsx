import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import { isValidHex } from "../../utils/validation";
import Preview from "../Preview";
import PreviewError from "../PreviewError";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import { useAtom } from "jotai";
import * as atoms from "../../store";

const MOUSE_ACC = 2;

const Main: React.FC = () => {
  const [zoom, setZoom] = React.useState(75);
  const [zoomActive, setZoomActive] = React.useState(false);
  const [palette] = useAtom(atoms.paletteAtom);
  const [hex] = useAtom(atoms.hexAtom);
  const theme = useTheme();
  const containerRef = React.useRef();
  const demoAreaRef = React.useRef<HTMLDivElement>();
  const [, startTransition] = React.useTransition();

  const handleSlideChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
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

  const error = !palette || !hex || !isValidHex(hex);

  // should be renamed – x and y are used to translate position of demo area
  const [mousePos, setMousePos] = React.useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
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
        return { ...lastMousePos, x: newX, y: newY };
      });
    });
  };

  const handleDrag = (event: MouseEvent) => {
    setMousePos((lastMousePos) => {
      if (lastMousePos.startX === 0 && lastMousePos.startY === 0) {
        return {
          ...lastMousePos,
          startX: event.clientX,
          startY: event.clientY,
        };
      }

      return {
        ...lastMousePos,
        x:
          -(lastMousePos.startX - event.clientX) * MOUSE_ACC +
          lastMousePos.endX,
        y:
          -(lastMousePos.startY - event.clientY) * MOUSE_ACC +
          lastMousePos.endY,
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

  const handleDragEnd = (event: MouseEvent) => {
    if (!demoAreaRef.current) return;

    setMousePos((lastMousePos) => {
      return {
        ...lastMousePos,
        startX: 0,
        startY: 0,
        endX: lastMousePos.x,
        endY: lastMousePos.y,
      };
    });

    demoAreaRef.current.removeEventListener("mousemove", handleDrag, true);
    demoAreaRef.current.removeEventListener("mousedown", handleDragStart, true);
    demoAreaRef.current.removeEventListener("mouseup", handleDragEnd, true);
  };

  return (
    <Box
      ref={demoAreaRef}
      sx={{
        position: "relative",
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
      }}
      onMouseDown={handleMouseDown}
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
        <Tooltip title="Center" placement="bottom">
          <ToggleButton
            value="center"
            onChange={() =>
              setMousePos({
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0,
                x: 0,
                y: 0,
              })
            }
          >
            <CenterFocusStrongIcon />
          </ToggleButton>
        </Tooltip>

        <Slider
          sx={{
            m: 0,
            mt: 2,
            ml: "44px",

            "& .MuiSlider-markLabel": {
              left: -36, // inversed
            },

            position: "absolute",
            right: 8,
            top: 64,
            opacity: 0.1,
            transition: `opacity ${theme.transitions.duration.shorter}ms ease`,

            "&:hover": {
              opacity: 1,
            },
          }}
          orientation="vertical"
          value={zoom}
          min={25}
          max={100}
          onChange={handleSlideChange}
          onMouseOver={handleSlideStart}
          onMouseLeave={handleSlideStop}
          valueLabelDisplay="auto"
          marks={[
            {
              value: 25,
              label: "25%",
            },
            {
              value: 100,
              label: "100%",
            },
          ]}
        />
      </Box>

      {error ? (
        <PreviewError />
      ) : (
        <Box
          sx={{
            height: "100%",
            maxHeight: 598,
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

export default Main;

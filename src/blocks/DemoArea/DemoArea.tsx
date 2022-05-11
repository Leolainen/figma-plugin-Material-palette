import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import { isValidHex } from "../../utils/validation";
import Preview from "../Preview";
import PreviewError from "../PreviewError";
import Popover from "@mui/material/Popover";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import { useAtom } from "jotai";
import * as atoms from "../../store";

const MOUSE_ACC = 2;

const Main: React.FC = () => {
  const [zoom, setZoom] = React.useState(75);
  const [toggleZoom, setToggleZoom] = React.useState<HTMLElement | null>();
  const [palette] = useAtom(atoms.paletteAtom);
  const [hex] = useAtom(atoms.hexAtom);
  const theme = useTheme();
  const containerRef = React.useRef();

  const handleSlideChange = (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    setZoom(value as number);
  };

  const error = !palette || !hex || !isValidHex(hex);

  const handleZoomChange = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setToggleZoom(event.currentTarget);
  };

  const [mousePos, setMousePos] = React.useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    x: 0,
    y: 0,
  });

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
    console.log({ target: event.target, currentTarget: event.currentTarget });

    window.addEventListener("mousemove", handleDrag, true);
  };

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    // prevent dragging while adjusting zoom
    if (Boolean(toggleZoom)) {
      return;
    }

    handleDragStart(event.nativeEvent);
    window.addEventListener("mouseup", handleDragEnd, true);
  };

  const handleDragEnd = (event: MouseEvent) => {
    setMousePos((lastMousePos) => {
      return {
        ...lastMousePos,
        startX: 0,
        startY: 0,
        endX: lastMousePos.x,
        endY: lastMousePos.y,
      };
    });

    window.removeEventListener("mousemove", handleDrag, true);
    window.removeEventListener("mousedown", handleDragStart, true);
    window.removeEventListener("mouseup", handleDragEnd, true);
  };

  return (
    <Box
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

        <Tooltip title="Zoom" placement="bottom">
          <ToggleButton
            value="zoom"
            selected={Boolean(toggleZoom)}
            onChange={handleZoomChange}
          >
            <ZoomInIcon />
          </ToggleButton>
        </Tooltip>

        <Popover
          anchorEl={toggleZoom}
          container={containerRef.current}
          open={Boolean(toggleZoom)}
          onClose={() => setToggleZoom(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            "& .MuiPopover-paper": {
              p: 1,
              pb: 5,
              height: 500,
            },
          }}
        >
          <Slider
            sx={{
              m: 0,
              mt: 2,
              ml: "44px",

              "& .MuiSlider-markLabel": {
                left: -36, // inversed
              },
            }}
            orientation="vertical"
            value={zoom}
            min={25}
            max={100}
            onChange={handleSlideChange}
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
        </Popover>
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
              transition: `transform ${theme.transitions.duration.shortest}ms ease-out`,
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

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

const TabPanelRoot = styled("div", {
  name: "TabPanel-root",
  slot: "Root",
})({
  height: "100%",
  display: "grid",
  gridTemplateRows: "min-content 1fr",
});

const TabPanelTabs = styled(Tabs, {
  name: "TabPanel-tabs",
  slot: "Tabs",
})<{ tabCount: number }>(({ tabCount, theme }) => ({
  flex: `calc(100% / ${tabCount})`,
  marginBottom: theme.spacing(2),
}));

const TabPanelTab = styled(Tab, {
  name: "TabPanel-tab",
  slot: "Tab",
})({
  minHeight: "auto",
});

const TabPanelPanel = styled("div", {
  name: "TabPanel-panel",
  slot: "Panel",
})();

export type TabPanelProps = {
  tabs: {
    label: string;
    icon: React.ReactElement;
    content: React.ReactNode | ((activeTab: number) => React.ReactNode);
  }[];
};

const TabPanel = (props: TabPanelProps) => {
  const { tabs } = props;
  const [activeTab, setActiveTab] = React.useState(0);
  const lastTab = React.useRef(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    lastTab.current = activeTab;
    setActiveTab(newValue);
  };

  const determineDirection = (tabIndex: number) => {
    const isActiveTab = activeTab === tabIndex;

    if (isActiveTab) {
      return lastTab.current < activeTab ? "left" : "right";
    } else {
      return lastTab.current < activeTab ? "right" : "left";
    }
  };

  return (
    <TabPanelRoot ref={containerRef}>
      <TabPanelTabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        tabCount={tabs.length}
      >
        {tabs.map((tab, index) => (
          <TabPanelTab
            key={`tabpanel-tab-${index}`}
            iconPosition="start"
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </TabPanelTabs>

      <TabPanelPanel>
        {tabs.map((tab, index) => (
          <Slide
            appear={lastTab.current !== activeTab}
            direction={determineDirection(index)}
            // direction={activeTab > lastTab.current ? "left" : "right"}
            in={activeTab === index}
            mountOnEnter
            unmountOnExit
            container={containerRef.current}
            easing={theme.transitions.easing.easeOut}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
              }}
            >
              {typeof tab.content === "function"
                ? tab.content(activeTab)
                : tab.content}
            </Box>
          </Slide>
        ))}
      </TabPanelPanel>
    </TabPanelRoot>
  );
};

export default TabPanel;

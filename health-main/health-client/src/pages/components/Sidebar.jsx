import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  MedicalServices as MedicalServicesIcon,
  Article as ArticleIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ open, width, userData }) => {
  const navigate = useNavigate();

  return (
    <Drawer
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
          backgroundColor: "#212529",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItemButton onClick={() => navigate("/user-dashboard")}>
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Patient Dashboard" sx={{ color: "white" }} />
          </ListItemButton>
          {userData && (
            <ListItemButton
              onClick={() =>
                navigate(
                  userData.role === "doctor"
                    ? "/doctor-dashboard"
                    : "/user-dashboard"
                )
              }
            >
              <ListItemIcon>
                <AccountCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={`Logged As ${userData.username}`}
                sx={{ color: "white" }}
              />
            </ListItemButton>
          )}
        </List>
        <Divider />
        {userData?.role === "doctor" ? (
          <>
            <ListItemButton onClick={() => navigate("/drug")}>
              <ListItemIcon>
                <ArticleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Diagnosis Results"
                sx={{ color: "white" }}
              />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/appointment-doctor")}>
              <ListItemIcon>
                <CalendarTodayIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Appointment" sx={{ color: "white" }} />
            </ListItemButton>
          </>
        ) : userData?.profileCreated ? (
          <>
            <ListItemButton onClick={() => navigate("/diagonosis")}>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Make Diagonosis" sx={{ color: "white" }} />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/result")}>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Diagonosis Result"
                sx={{ color: "white" }}
              />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/appointment")}>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Start Appointment"
                sx={{ color: "white" }}
              />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/create-profile")}>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="User Profile" sx={{ color: "white" }} />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton onClick={() => navigate("/create-profile")}>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="User Profile" sx={{ color: "white" }} />
          </ListItemButton>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;

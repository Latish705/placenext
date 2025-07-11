"use client";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  Button,
  Tooltip,
} from "@mui/material";
import useThemeStore from "@/store/store";
import { useState, useEffect } from "react";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import { BiCategoryAlt } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { BiMessageSquareMinus } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { FaClipboardList } from "react-icons/fa";
import { color, motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter, usePathname } from "next/navigation";
import HelpCard from "./HelpCard";
import LogoText from "./LogoText";
import { getAuth, signOut } from "firebase/auth";
import { logout } from "@/config/firebase-config";
import { toast } from "react-toastify";

interface Option {
  name: string;
  path: string;
  icon: JSX.Element;
}

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const options: Option[] = [
  {
    name: "Dashboard",
    path: "/student/dashboard",
    icon: <ImportContactsTwoToneIcon />,
  },
  {
    name: "Apply for Jobs",
    path: "/student/applyjob",
    icon: <BiCategoryAlt />,
  },
  {
    name: "Job Offers",
    path: "/student/offers",
    icon: <FaClipboardList />,
  },
  {
    name: "Messages",
    path: "/student/messages/inbox",
    icon: <BiMessageSquareMinus />,
  },
  {
    name: "Profile",
    path: "/student/profile",
    icon: <FaUserDoctor />,
  },
  {
    name: "Settings",
    path: "/student/settings",
    icon: <CiSettings />,
  },
];

export default function StudentSidebar({ isIcon }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode }: any = useThemeStore();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(isLargeScreen);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isLargeScreen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isLargeScreen]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const auth = getAuth();
    try {
      await logout();
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("email");

      toast.success("Logged out successfully");
      router.push("/authentication/studentLogin");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActiveRoute = (path: string) => {
    return pathname === path;
  };

  const DrawerList = (
    <Box
      sx={{ width: isLargeScreen ? 240 : 260 }}
      role="presentation"
      className="h-full flex flex-col bg-white dark:bg-dark_main_background"
    >
      <div className="p-4 mb-4">
        <LogoText />
      </div>
      <div className="flex flex-col justify-between items-center h-full dark:bg-dark_main_background dark:text-white">
        <div className="w-full">
          <List className="px-2">
            {options.map((option) => {
              const isActive = isActiveRoute(option.path);

              return (
                <ListItem key={option.name} disablePadding className="mb-2">
                  <Tooltip title={isIcon ? option.name : ""} placement="right">
                    <ListItemButton
                      sx={{
                        borderRadius: "10px",
                        padding: "10px 16px",
                        transition: "all 0.3s ease",
                        backgroundColor: isActive
                          ? darkMode
                            ? "rgba(6, 174, 213, 0.1)"
                            : "rgba(6, 174, 213, 0.08)"
                          : "transparent",
                        border: isActive
                          ? "1px solid #06AED5"
                          : darkMode
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "1px solid rgba(0, 0, 0, 0.05)",
                        color: isActive ? "#06AED5" : "",
                        ":hover": {
                          color: "#06AED5",
                          border: "1px solid #06AED5",
                          backgroundColor: darkMode
                            ? "rgba(6, 174, 213, 0.1)"
                            : "rgba(6, 174, 213, 0.05)",
                        },
                      }}
                      onClick={() => {
                        router.push(option.path);
                        if (!isLargeScreen) setOpen(false);
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: isActive
                            ? "#06AED5"
                            : darkMode
                            ? "white"
                            : "rgba(0, 0, 0, 0.6)",
                          minWidth: isIcon ? "24px" : "40px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {option.icon}
                      </ListItemIcon>
                      {!isIcon && (
                        <ListItemText
                          primary={option.name}
                          primaryTypographyProps={{
                            fontWeight: isActive ? 600 : 400,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        </div>

        <div className="p-4 w-full mt-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6"
          >
            <HelpCard />
          </motion.div>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogout}
            disabled={loggingOut}
            sx={{
              borderColor: darkMode ? "white" : "#06AED5",
              color: darkMode ? "white" : "#06AED5",
              "&:hover": {
                backgroundColor: "rgba(255, 59, 59, 0.1)",
                borderColor: "#ff3b3b",
                color: "#ff3b3b",
              },
              padding: "10px",
              fontWeight: "medium",
            }}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </Box>
  );

  return (
    <div className="flex overflow-hidden">
      {!isLargeScreen && (
        <IconButton
          onClick={toggleDrawer(!open)}
          className="text-primary dark:text-white"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        variant={isLargeScreen ? "persistent" : "temporary"}
        sx={{
          width: isLargeScreen ? 240 : 260,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isLargeScreen ? 240 : 260,
            boxSizing: "border-box",
            border: "none",
            boxShadow: darkMode
              ? "none"
              : "0px 0px 15px rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        <motion.div
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          variants={drawerVariants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            height: "100%",
            width: isLargeScreen ? 240 : 260,
            overflow: "hidden",
          }}
        >
          {DrawerList}
        </motion.div>
      </Drawer>
    </div>
  );
}


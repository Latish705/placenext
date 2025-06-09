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
} from "@mui/material";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import { BiCategoryAlt, BiMessageSquareMinus } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { logout } from "@/config/firebase-config";

import HelpCard from "./HelpCard";
import LogoText from "./LogoText";

interface Option {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const companyOptions: Option[] = [
  {
    name: "Dashboard",
    path: "/company/dashboard",
    icon: <ImportContactsTwoToneIcon />,
  },
  {
    name: "Post Jobs",
    path: "/company/job_postings",
    icon: <BiCategoryAlt />,
  },
  {
    name: "Applications",
    path: "/company/applications",
    icon: <FaUserDoctor />,
  },
  {
    name: "Messages",
    path: "/company/messages/inbox",
    icon: <BiMessageSquareMinus />,
  },
  {
    name: "Settings",
    path: "/company/settings",
    icon: <CiSettings />,
  },
];

export default function CompanySidebar({ isIcon }: any) {
  const router = useRouter();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(isLargeScreen);

  useEffect(() => {
    setOpen(isLargeScreen);
  }, [isLargeScreen]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      logout();
      console.log("Company user signed out");
      router.push("/authentication/companyLogin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const DrawerList = (
    <Box
      sx={{ width: isLargeScreen ? 210 : 240 }}
      role="presentation"
      className="h-full flex flex-col"
    >
      <LogoText />
      <div className="flex flex-col justify-between items-center h-full">
        <div className="px-2">
          <List>
            {companyOptions.map((option) => (
              <ListItem key={option.name} disablePadding>
                <ListItemButton
                  className="rounded-xl"
                  onClick={() => router.push(option.path)}
                >
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  {!isIcon && <ListItemText primary={option.name} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>

        <div className="p-2 flex flex-col items-center gap-3">
          <HelpCard />
          <Button onClick={handleLogout} variant="outlined" color="error">
            Logout
          </Button>
        </div>
      </div>
    </Box>
  );

  return (
    <div className="flex overflow-hidden z-40">
      {!isLargeScreen && (
        <IconButton
          onClick={toggleDrawer(!open)}
          sx={{ position: "fixed", top: 15, left: 0, zIndex: 50 }}
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
          width: isLargeScreen ? 210 : 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isLargeScreen ? 210 : 240,
            boxSizing: "border-box",
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
            width: isLargeScreen ? 210 : 240,
            overflow: "hidden",
          }}
        >
          {DrawerList}
        </motion.div>
      </Drawer>
    </div>
  );
}

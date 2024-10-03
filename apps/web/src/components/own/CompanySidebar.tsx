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
import ImportContactsTwoToneIcon from "@mui/icons-material/ImportContactsTwoTone";
import { BiCategoryAlt } from "react-icons/bi";
import { FaUserDoctor } from "react-icons/fa6";
import { BiMessageSquareMinus } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import HelpCard from "./HelpCard";
import LogoText from "./LogoText";
import { getAuth, signOut } from "firebase/auth";
import { logout } from "@/config/firebase-config";

interface Option {
  name: string;
  path: string;
}

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
};

const options: Option[] = [
  { name: "Dashboard", path: "/student/dashboard" },
  { name: "Apply for Jobs", path: "/student/applyjob" },
  { name: "Messages", path: "/messages/inbox" },
  { name: "Profile", path: "/student/profile" },
  { name: "Settings", path: "/settings" },
];

const OptionsIcon = [
  <ImportContactsTwoToneIcon key="import-contacts" />,
  <BiCategoryAlt key="category-alt" />,
  <FaUserDoctor key="user-doctor" />,
  <BiMessageSquareMinus key="message-square-minus" />,
  <CiSettings key="settings" />,
];

export default function CompanySidebar({ isIcon }: any) {
  const router = useRouter();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(isLargeScreen);

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
    const auth = getAuth();
    try {
      logout();
      console.log("User signed out");
      router.push("/authentication/studentLogin");
    } catch (error) {
      console.error("Error during logout:", error);
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
            {options.map((option, index) => (
              <ListItem key={option.name} disablePadding>
                <ListItemButton
                  className="rounded-xl"
                  onClick={() => router.push(option.path)}
                >
                  <ListItemIcon>{OptionsIcon[index]}</ListItemIcon>
                  {!isIcon && <ListItemText primary={option.name} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
        <div className="p-2 h-full flex items-center justify-center">
          <HelpCard />
        </div>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </Box>
  );

  return (
    <div className="flex overflow-hidden">
      {!isLargeScreen && (
        <IconButton onClick={toggleDrawer(!open)}>
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

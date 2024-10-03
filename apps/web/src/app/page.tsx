"use client";
import LandingNav from "@/components/own/Nav/LandingNav";
import { useEffect, useState } from "react";
import { ToastContainer, Bounce } from "react-toastify";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures rendering happens only on the client-side
  }, []);

  return (
    <>
      {isClient && (
        <div>
          <LandingNav />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </div>
      )}
    </>
  );
}

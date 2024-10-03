"use client";
import ApplicationCards from "@/components/own/Dashboard/ApplicationCards";
import { usePathname } from "next/navigation";

export default function CollegeJob() {
  return (
    <div className="bg-primary_background h-full">
      <ApplicationCards />
    </div>
  );
}

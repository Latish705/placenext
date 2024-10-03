"use client";

import { BackendUrl } from "@/utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import StudentStatisticsChart from "@/components/own/Dashboard/StudentStatisticsChart";
import JobCreationForm from "@/components/own/Form/JobCreationForm";

export default function CompanyDashboard() {
  return;
  <div>
    <h1>Company Dashboard</h1>
    <JobCreationForm />
  </div>;
}

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function JobById() {
  const { job_id } = useParams();
  useEffect(() => {
    console.log(job_id);
    const fetchJobById = async () => {
      try {
        const res = await axios(`/api/collge/get_jobs/${job_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (res.data.success) {
          console.log(res.data.job);
        } else {
          console.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
  }, [job_id]);
  return <div>JobById</div>;
}

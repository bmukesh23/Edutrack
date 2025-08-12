import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { DashboardUserDetails } from '@/utils/types';

const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<DashboardUserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axiosInstance.get("/api/me");
        setUserDetails(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  return { userDetails, loading };
};

export default useUserDetails;
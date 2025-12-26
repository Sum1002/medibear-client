import { useEffect } from "react";
import { useNavigate } from "react-router";
import PharmacyDashboard from "./pharmacy-owner/PharmacyDashboard";
import UserHomeView from "./UserHomeView";

export default function Home() {
  const navigate = useNavigate();

  const getLoggedInUserType = () => {
    const userInfo = localStorage.getItem('logged_in_user');
    if (!userInfo) return null;
    const user = JSON.parse(userInfo);
    if (user.register_as === 'admin' || user.role === 'admin') return 'admin';
    return user.register_as == "pharmacy" ? "pharmacy" : "user";
  }

  useEffect(() => {
    const type = getLoggedInUserType();
    if (type === 'admin') {
      navigate('/admin/dashboard');
    }
  }, []);

  return (
    <div>
      {getLoggedInUserType() === "pharmacy" ? <PharmacyDashboard /> : <UserHomeView />}
    </div>
  )
}
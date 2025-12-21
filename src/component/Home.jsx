import PharmacyDashboard from "./pharmacy-owner/PharmacyDashboard";
import UserHomeView from "./UserHomeView";

export default function Home() {
  const getLoggedInUserType = () => {
    const userInfo = localStorage.getItem('logged_in_user');
    if (!userInfo) return null;
    const user = JSON.parse(userInfo);
    return user.register_as == "pharmacy" ? "pharmacy" : "user";
  }
  return (
    <div>
      {getLoggedInUserType() === "pharmacy" ? <PharmacyDashboard /> : <UserHomeView />}
    </div>
  )
}
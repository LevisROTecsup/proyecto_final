import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../context/authContext"

const UserLayout = () => {

  return (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  );
};

export default UserLayout;

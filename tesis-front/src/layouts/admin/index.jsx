import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../context/adminContext"

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

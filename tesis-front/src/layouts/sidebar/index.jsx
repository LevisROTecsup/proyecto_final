import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "../../context/adminContext"

const Sidebar = () => {

  const { user } = useAuth();

  return (
    <>
      {
        user
          ? <div className="flex flex-wrap min-h-screen">
            <aside className="w-64" aria-label="Sidebar">
              <div className="overflow-y-auto h-full py-4 px-3 bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-2">
                  <li>
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Administrador</span>
                  </li>
                  <li>
                    <NavLink
                      end
                      to="/admin"
                      className={({ isActive }) =>
                        isActive
                          ? "flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-teal-400 hover:bg-red-500 dark:hover:bg-gray-700"
                          : "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    >
                      Inicio
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      end
                      to="/admin/create"
                      className={({ isActive }) =>
                        isActive
                          ? "flex items-center p-2 text-base font-normal text-gray-100 rounded-lg dark:text-teal-400 hover:bg-red-500 dark:hover:bg-gray-700"
                          : "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    >
                      Nueva tesis
                    </NavLink>
                  </li>
                </ul>
              </div>
            </aside>
            <main className="p-4" style={{ width: "calc(100% - 16rem)" }}>
              <Outlet />
            </main>
          </div>
          : <Navigate to="/admin/login" />
      }
    </>
  );
};

export default Sidebar;

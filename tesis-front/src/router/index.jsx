import { BrowserRouter, Routes, Route } from "react-router-dom";

import * as utils from "../utils/routeConstants";

import { HomeView, LoginView } from "../views/user";
import { AdminLayout, NavbarLayout, SidebarLayout, UserLayout } from "../layouts";
import { AdminLoginView, CreateThesisView, DashboardView, UpdateThesisView } from "../views/admin";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route element={<NavbarLayout />}>
            <Route path={utils.HOME} element={<HomeView />} />
          </Route>
          <Route path={utils.LOGIN} element={<LoginView />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route element={<SidebarLayout />}>
            <Route path={utils.THESIS_LIST} element={<DashboardView />} />
            <Route path={utils.THESIS_CREATE} element={<CreateThesisView />} />
            <Route path={utils.THESIS_DETAIL} element={<UpdateThesisView />} />
          </Route>
          <Route path={utils.ADMIN_LOGIN} element={<AdminLoginView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

import { Outlet } from "@remix-run/react";
import React from "react";
import { Media } from "~/components";
import {
  GreaterThanMobileLayout,
  MobileLayout,
  SidebarProvider,
} from "~/components/scoped/authenticated";

export default function AuthenticatedRoute() {
  return (
    <SidebarProvider>
      <Media greaterThan="mobile">
        <GreaterThanMobileLayout>
          <Outlet />
        </GreaterThanMobileLayout>
      </Media>

      <Media at="mobile">
        <MobileLayout>
          <Outlet />
        </MobileLayout>
      </Media>
    </SidebarProvider>
  );
}

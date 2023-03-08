import { Sidebar, Menu, Image, Icon } from "semantic-ui-react";
import { SidebarLinks } from "../SidebarLinks";
import { useSidebar } from "./context";

function MobileLayout({ children }: { children: React.ReactNode }) {
  const {
    state: { visible },
  } = useSidebar();
  return (
    <Sidebar.Pushable style={{ minHeight: "100vh" }}>
      <MobileSidebar />

      <Sidebar.Pusher>
        <Header />

        <div style={{ display: visible ? "none" : undefined, marginTop: 0 }}>
          {children}
        </div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

function MobileSidebar() {
  const {
    state: { visible },
  } = useSidebar();
  return (
    <Sidebar
      as="aside"
      animation={"overlay"}
      direction={"left"}
      visible={visible}
      style={{ width: "100vw" }}
    >
      <Header />
      <SidebarLinks />
    </Sidebar>
  );
}

function Header() {
  const {
    state: { visible },
    actions: { open, close },
  } = useSidebar();

  return (
    <Menu as="header" borderless size="large" style={{ margin: 0 }}>
      <Menu.Item position="left" style={{ padding: "0 1em" }}>
        <Image
          src={require("../../../../../public/images/Logo/HorizontalLogo.png")}
          size="tiny"
        />
      </Menu.Item>

      <Menu.Item position="right" onClick={visible ? close : open}>
        <Icon name={visible ? "close" : "list alternate outline"} />
      </Menu.Item>
    </Menu>
  );
}

export { MobileLayout };

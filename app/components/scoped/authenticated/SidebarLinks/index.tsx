import { useLocation, useNavigate, useSubmit } from "@remix-run/react";
import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Confirm } from "~/components/addons/Confirm";
import { useSidebar } from "../MobileLayout";

function SidebarLinks() {
  const {
    actions: { close },
  } = useSidebar();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function createOnClickHandler(to: string) {
    return function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
      event.preventDefault();
      close();
      if (to !== pathname) {
        navigate(to);
      }
    };
  }

  return (
    <Menu vertical style={{ width: "100%", marginTop: 0 }}>
      <Menu.Item
        active={pathname.includes("/dashboard")}
        onClick={createOnClickHandler("/dashboard")}
      >
        <Icon name="dashboard" />
        Dashboard
      </Menu.Item>

      <Menu.Item
        active={pathname.includes("/processes")}
        onClick={createOnClickHandler("/processes")}
      >
        <Icon name="tree" />
        Processos
      </Menu.Item>

      <Menu.Item
        active={pathname.includes("/settings")}
        onClick={createOnClickHandler("/settings/profile")}
      >
        <Icon name="setting" />
        Configurações
      </Menu.Item>

      <SignOutMenuItem>
        <Icon name="sign out alternate" />
        Sair
      </SignOutMenuItem>
    </Menu>
  );
}

function SignOutMenuItem({ children }: { children: React.ReactNode }) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const submit = useSubmit();

  async function onConfirm() {
    submit(null, { method: "post", action: "/signout" });
    setIsConfirming(false);
  }

  return (
    <React.Fragment>
      <Menu.Item onClick={() => setIsConfirming(true)} active={isConfirming}>
        {children}
      </Menu.Item>

      <Confirm
        size="large"
        open={isConfirming}
        header={"Saindo"}
        message="Tem certeza que deseja realizar o logout do sistema?"
        cancelButton="Não"
        confirmButton="Sim"
        onCancel={() => setIsConfirming(false)}
        onConfirm={onConfirm}
        closeOnEscape
        closeOnDimmerClick
      />
    </React.Fragment>
  );
}

export { SidebarLinks };

import { SidebarLinks } from "../SidebarLinks";
import { Image } from "semantic-ui-react";

const SIDEBAR_VW_WIDTH = 20;

function GreaterThanMobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <FixedSidebarContainer>
        <SidebarHeader />
        <SidebarLinks />
      </FixedSidebarContainer>

      <Main>{children}</Main>
    </div>
  );
}

function FixedSidebarContainer({ children }: { children: React.ReactNode }) {
  return (
    <aside
      style={{
        width: `${SIDEBAR_VW_WIDTH}vw`,
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        overflowY: "auto",
      }}
    >
      {children}
    </aside>
  );
}

function SidebarHeader() {
  return (
    <header>
      <Image
        src={require("../../../../../public/images/Logo/HorizontalLogo.png")}
        size="medium"
      />
    </header>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        width: `${100 - SIDEBAR_VW_WIDTH}vw`,
        marginLeft: `${SIDEBAR_VW_WIDTH}vw`,
        overflowY: "auto",
      }}
    >
      {children}
    </main>
  );
}

export { GreaterThanMobileLayout };

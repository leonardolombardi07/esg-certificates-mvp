import React from "react";

interface ISidebarContext {
  state: { visible: boolean };
  actions: {
    open: () => void;
    close: () => void;
  };
}

const SidebarContext = React.createContext<ISidebarContext | null>(null);

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  const open = React.useCallback(() => setVisible(true), []);
  const close = React.useCallback(() => setVisible(false), []);

  const value = React.useMemo(
    () => ({
      state: { visible },
      actions: { open, close },
    }),
    [visible, open, close]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (context === null) {
    throw new Error("useSidebar must be used within an SidebarProvider");
  }
  return context;
}

export { SidebarProvider, useSidebar };

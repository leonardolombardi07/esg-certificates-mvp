import { useTransition } from "@remix-run/react";
import React from "react";
import { Icon, Message } from "semantic-ui-react";
import { useSpinDelay } from "~/utils/hooks";
import { Media } from "~/components";

const LOADER_WORDS = [
  "loading",
  "checking cdn",
  "checking cache",
  "fetching from db",
  "compiling mdx",
  "updating cache",
  "transfer",
];

const ACTION_WORDS = [
  "packaging",
  "zapping",
  "validating",
  "processing",
  "calculating",
  "computing",
  "computering",
];

let firstRender = true;

function PageLoadingMessage() {
  const transition = useTransition();
  const [words, setWords] = React.useState<Array<string>>([]);
  const [pendingPath, setPendingPath] = React.useState("");
  const showLoader = useSpinDelay(Boolean(transition.state !== "idle"), {
    delay: 400,
    minDuration: 1000,
  });

  React.useEffect(() => {
    if (firstRender) return;
    if (transition.state === "idle") return;
    if (transition.state === "loading") setWords(LOADER_WORDS);
    if (transition.state === "submitting") setWords(ACTION_WORDS);

    const interval = setInterval(() => {
      setWords(([first, ...rest]) => [...rest, first] as Array<string>);
    }, 2000);

    return () => clearInterval(interval);
  }, [pendingPath, transition.state]);

  React.useEffect(() => {
    if (firstRender) return;
    if (transition.state === "idle") return;
    setPendingPath(transition.location.pathname);
  }, [transition]);

  React.useEffect(() => {
    firstRender = false;
  }, []);

  if (!showLoader) return null;

  const word = words[0];
  return (
    <React.Fragment>
      <Media at="mobile">
        <MobileMessageContainer>
          <MessageContent word={word} />
        </MobileMessageContainer>
      </Media>

      <Media greaterThan="mobile">
        <DesktopMessageContainer>
          <MessageContent word={word} />
        </DesktopMessageContainer>
      </Media>
    </React.Fragment>
  );
}

interface MessageContainerProps {
  children: React.ReactNode;
}

function MobileMessageContainer({ children }: MessageContainerProps) {
  return (
    <Message
      icon
      style={{
        position: "fixed",
        bottom: 25,
        width: "90vw",
        left: "50%",
        marginLeft: "-45vw",
      }}
      info
      size="big"
    >
      {children}
    </Message>
  );
}

function DesktopMessageContainer({ children }: MessageContainerProps) {
  return (
    <Message
      icon
      style={{ position: "fixed", bottom: 25, right: 25, width: 500 }}
      info
      size="big"
    >
      {children}
    </Message>
  );
}

function MessageContent({ word }: { word: string }) {
  return (
    <React.Fragment>
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header>{word}</Message.Header>
        We are fetching that content for you.
      </Message.Content>
    </React.Fragment>
  );
}

export { PageLoadingMessage };

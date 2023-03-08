import type { MessageProps } from "semantic-ui-react";
import { Icon, Message, Segment } from "semantic-ui-react";

interface ErrorBoundaryProps extends MessageProps {
  header: string;
  message: string;
  children: React.ReactNode;
  segmentStyle?: React.CSSProperties;
}

function ErrorBoundary({
  header,
  message,
  children,
  segmentStyle,
  ...props
}: ErrorBoundaryProps) {
  return (
    <Segment style={{ height: "100%", display: "flex", ...segmentStyle }}>
      <Segment style={{ flex: 1 }}>
        <Message icon negative size="massive" {...props}>
          <Icon name="warning sign" />
          <Message.Content>
            <Message.Header>{header}</Message.Header>
            <Message.List>
              <Message.Item> {message}</Message.Item>
            </Message.List>

            {children}
          </Message.Content>
        </Message>
      </Segment>
    </Segment>
  );
}

export { ErrorBoundary };

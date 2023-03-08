import { createMedia } from "@artsy/fresnel";

const { Media, MediaContextProvider, createMediaStyle } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

// Make styles for SSR injection
const mediaStyle = createMediaStyle();

export { Media, MediaContextProvider, mediaStyle };

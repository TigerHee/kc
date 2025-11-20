import { NAMESPACE } from "../../config";

function reportResourceLoadException() {
  // 资源上报异常
  window.addEventListener(
    "error",
    (event) => {
      if (!event || !event.target) return;
      let message = "";
      if (event.target.tagName === "IMG") {
        message = `Failed to load image: ${event.target.src}`;
      } else if (event.target.tagName === "LINK" && event.target.href) {
        message = `Failed to load css: ${event.target.href}`;
      } else if (event.target.tagName === "SCRIPT") {
        message = `Failed to load script: ${event.target.src}`;
      }
      if (!message) return;

      window[NAMESPACE]?.captureEvent({
        message,
        level: "warning",
        tags: {
          assetsError: event.target.tagName,
        },
        fingerprint: [
          "{{ default }}",
          event.target.tagName === "LINK"
            ? event.target.href
            : event.target.src,
        ],
      });
    },
    true
  );
}
export default reportResourceLoadException;

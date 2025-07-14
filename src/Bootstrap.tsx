import { Theme } from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";
import App from "./pages/App";

const Bootstrap = () => {
  return (
    <div>
      <Theme>
        <App />
      </Theme>
    </div>
  )
}

export default Bootstrap

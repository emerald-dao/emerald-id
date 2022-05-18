import FlowProvider from "../context/FlowContext";
import DiscordProvider from "../context/DiscordContext";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <DiscordProvider>
      <FlowProvider>
        <Component {...pageProps} />
      </FlowProvider>
    </DiscordProvider>
  )
}

export default MyApp;
import FlowProvider from "../context/FlowContext";
import DiscordProvider from "../context/DiscordContext";
import "../styles/globals.css";
import Nav from "../components/Nav/Nav";
import Footer from "../components/Layout/Footer";

const MyApp = ({ Component, pageProps }) => {
  return (
    <DiscordProvider>
      <FlowProvider>
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </FlowProvider>
    </DiscordProvider>
  )
}

export default MyApp;
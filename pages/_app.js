import FlowProvider from "../context/FlowContext";
import DiscordProvider from "../context/DiscordContext";
import "../styles/globals.css";
import Nav from "../components/Nav/Nav";
import Footer from "../components/Layout/Footer";
import TransactionProvider from "../context/TransactionContext";
import Transaction from "../components/Transaction";

const MyApp = ({ Component, pageProps }) => {
  return (
    <DiscordProvider>
      <TransactionProvider>
        <FlowProvider>
          <Nav />
          <Component {...pageProps} />
          <Footer />
          <Transaction />
        </FlowProvider>
      </TransactionProvider>
    </DiscordProvider>
  )
}

export default MyApp;
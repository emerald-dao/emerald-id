import FlowProvider from "../context/FlowContext";
import "../styles/globals.css";

const MyApp = ({Component, pageProps}) => {
  return (
    <FlowProvider>
      <Component {...pageProps} />
    </FlowProvider>
  )
}

export default MyApp;
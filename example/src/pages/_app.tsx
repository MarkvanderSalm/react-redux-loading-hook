import { AppProps } from "next/dist/next-server/lib/router/router";
import { Provider } from "react-redux";
import { store } from "../state/store";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;

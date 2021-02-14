import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useLoading } from "../hooks/useLoading";
import {
  fetchNonExistentCreator,
  fetchPostCreator,
  getData,
} from "../state/state";
import styles from "../styles/Index.module.css";
import {
  errorsLoadingModule,
  postsLoadingModule,
} from "../utils/loadingModules";

const Index = () => {
  const dispatch = useDispatch();

  const handleLoadClick = () => {
    dispatch(fetchPostCreator());
  };

  const handleLoadErrorClick = () => {
    dispatch(fetchNonExistentCreator());
  };

  const state = useSelector(getData);

  const isLoadingPosts = useLoading(postsLoadingModule);
  const isLoadingErrors = useLoading(errorsLoadingModule);

  return (
    <div className={styles.container}>
      <Head>
        <title>react-redux-loading-hook demo</title>
      </Head>

      <h1 className={styles.title}>react-redux-loading-hook demo</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <LoadingSpinner loadingModule={postsLoadingModule} />
          <button onClick={handleLoadClick}>Fetch data</button>
          <span>
            {isLoadingPosts
              ? null
              : state.data !== undefined
              ? state.data.title
              : "No data fetched"}
          </span>
        </div>
        <div className={styles.card}>
          <LoadingSpinner loadingModule={errorsLoadingModule} />
          <button onClick={handleLoadErrorClick}>Fetch data with error</button>
          <span>
            {isLoadingErrors ? null : state.error ? (
              <>
                <span>status: {state.error.status}</span>
                <br />
                <span>message: {state.error.message}</span>
              </>
            ) : (
              "No errors caught"
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;

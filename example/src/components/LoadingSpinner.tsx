import React, { FC } from "react";
import { LoadingModule } from "react-redux-loading-hook";
import { ClipLoader } from "react-spinners";
import { useLoading } from "../hooks/useLoading";
import styles from "../styles/LoadingSpinner.module.css";

interface Props {
  loadingModule: LoadingModule;
}

export const LoadingSpinner: FC<Props> = (props) => {
  const isLoading = useLoading(props.loadingModule);

  return isLoading ? (
    <div className={styles.loadingSpinner}>
      <ClipLoader size="50px" />
    </div>
  ) : null;
};

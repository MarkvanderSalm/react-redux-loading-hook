import { LoadingModule } from "react-redux-loading-hook";
import {
  fetchNonExistentCreator,
  fetchNonExistentErrorCreator,
  fetchNonExistentSuccessCreator,
  fetchPostCreator,
  fetchPostErrorCreator,
  fetchPostSuccessCreator,
} from "../state/state";

export const postsLoadingModule = new LoadingModule({
  name: "posts",
  actionTriplets: [
    [
      fetchPostCreator.type,
      fetchPostSuccessCreator.type,
      fetchPostErrorCreator.type,
    ],
  ],
});

export const errorsLoadingModule = new LoadingModule({
  name: "errors",
  actionTriplets: [
    [
      fetchNonExistentCreator.type,
      fetchNonExistentSuccessCreator.type,
      fetchNonExistentErrorCreator.type,
    ],
  ],
});

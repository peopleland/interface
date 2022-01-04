import {
  configureStore,
} from '@reduxjs/toolkit';
import walletModal from "./walletModal";
import signAction from "./signAction";

export const store = configureStore({
  reducer: {
    walletModal,
    signAction
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;


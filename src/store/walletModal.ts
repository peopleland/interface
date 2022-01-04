import {createSlice} from "@reduxjs/toolkit";

export interface WalletModalState  {
  readonly visible: boolean
}

const initialState: WalletModalState = {
  visible: false,
}

export const walletModal = createSlice({
  name: 'walletModal',
  initialState,
  reducers: {
    actionModal(state, action) {
      state.visible = action.payload
    }
  }
})

export const {actionModal} = walletModal.actions
export default walletModal.reducer

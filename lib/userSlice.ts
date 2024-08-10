import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
  role: string;
}

const initialState: IUserState = {
  role: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
  },
});

export const { setRole } = userSlice.actions;
export const roleReducer = userSlice.reducer;

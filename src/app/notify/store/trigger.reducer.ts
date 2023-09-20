import { createReducer, on } from "@ngrx/store";
import { update } from "./trigger.actions";

export const initialState = {
    updateTime: 0,
}

export const triggerReducer = createReducer(
    initialState,
    on(update, (state, { trigger }) => ({ ...state, trigger }))
);

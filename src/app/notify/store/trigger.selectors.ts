import { createSelector } from "@ngrx/store";

export const selectTrigger = createSelector(
    (state: any) => state.trigger,
    (trigger) => trigger
);

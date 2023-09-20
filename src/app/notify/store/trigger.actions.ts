import { createAction } from '@ngrx/store';

export const update = createAction(
    '[Trigger] Update',
    () => ({ trigger: { updateTime: Date.now() }})
);
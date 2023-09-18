import { createReducer, on } from '@ngrx/store';

import { TopChartSettingsActions } from './top-chart-settings.action';
import { TopChartSettings } from '../top-panel/top-chart-settings.model';

export const initialState: TopChartSettings = {
  leafDepth: 7,
}

export const topChartSettingsReducer = createReducer(
  initialState,
  on(TopChartSettingsActions.setTopChartSettings, (_state, { topChartSettings }) => topChartSettings)
);

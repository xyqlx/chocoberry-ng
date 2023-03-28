import { createActionGroup, props } from '@ngrx/store';
import { TopChartSettings } from '../top-panel/top-chart-settings.model';

export const TopChartSettingsActions = createActionGroup({
  source: 'TopChartSettings',
  events: {
    'Set TopChartSettings': props<{ topChartSettings: TopChartSettings }>(),
  },
});

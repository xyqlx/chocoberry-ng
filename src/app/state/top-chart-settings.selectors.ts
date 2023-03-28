import { createActionGroup, createFeatureSelector, props } from '@ngrx/store';
import { TopChartSettings } from '../top-panel/top-chart-settings.model';

export const selectTopChartSettings = createFeatureSelector<TopChartSettings>('topChartSettings');

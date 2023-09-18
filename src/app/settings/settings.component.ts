import { Component } from '@angular/core';
import { ProcessColorService } from '../color-generator/process-color.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { createSelector, createFeatureSelector, Store } from '@ngrx/store';
import { TopChartSettings } from '../top-panel/top-chart-settings.model';
import { selectTopChartSettings } from '../state/top-chart-settings.selectors';
import { TopChartSettingsActions } from '../state/top-chart-settings.action';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  router: Router;
  constructor(
    private processColorService: ProcessColorService,
    public dialogRef: DialogRef<string>,
    private _router: Router,
    private store: Store,
  ) {
    this.router = _router;
  }
  topChartSettings$ = this.store.select(selectTopChartSettings);
  setLeafDepth(value: number) {
    this.store.dispatch(TopChartSettingsActions.setTopChartSettings({topChartSettings: {leafDepth: value}}));
  }
  setTopChartSettings(settings: TopChartSettings) {
    this.store.dispatch(TopChartSettingsActions.setTopChartSettings({topChartSettings: settings}));
  }
  get saturation () {
    return this.processColorService.colorGenerator.saturation;
  }
  get lightness () {
    return this.processColorService.colorGenerator.lightness;
  }
  set saturation (value: number) {
    this.processColorService.colorGenerator.saturation = value;
    this.processColorService.saveToLocalStorage();
  }
  set lightness (value: number) {
    this.processColorService.colorGenerator.lightness = value;
    this.processColorService.saveToLocalStorage();
  }
  refreshColor() {
    this.processColorService.colorGenerator.regenerate();
  }
  close(){
    this.dialogRef.close();
  }
}

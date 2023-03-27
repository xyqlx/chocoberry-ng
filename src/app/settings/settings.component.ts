import { Component } from '@angular/core';
import { ProcessColorService } from '../color-generator/process-color.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(
    private processColorService: ProcessColorService,
    public dialogRef: DialogRef<string>
  ) {
    
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

import { Injectable } from '@angular/core';
import { ColorGenerator } from './ColorGenerator';

@Injectable({
  providedIn: 'root'
})
export class ProcessColorService {

  constructor() {
    this.loadFromLocalStorage();
  }
  public colorGenerator: ColorGenerator = new ColorGenerator();
  tryGetColor(key: string | number): string {
    if (this.colorGenerator.exists(key)) {
      return this.colorGenerator.get(key);
    }
    return '#ffffff';
  }

  saveToLocalStorage() {
    localStorage.setItem('colorGenerator', JSON.stringify({
      saturation: this.colorGenerator.saturation,
      lightness: this.colorGenerator.lightness,
    }));
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem('colorGenerator');
    if (data) {
      const obj = JSON.parse(data);
      this.colorGenerator.saturation = obj.saturation;
      this.colorGenerator.lightness = obj.lightness;
    }
  }

}

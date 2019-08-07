import { DataFromForm } from './main-form/formData';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class DataService {

  private data: DataFromForm[] = [];
  saveEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);
  saveDataReady: BehaviorSubject<any> = new BehaviorSubject(0);
  loadEvent:BehaviorSubject<boolean> = new BehaviorSubject(false);
  getFullJson: BehaviorSubject<boolean> = new BehaviorSubject(false);
  activData: DataFromForm;

  serverResponse;
  response: BehaviorSubject<boolean> = new BehaviorSubject(false);

  getData(): DataFromForm[] {
    return this.data;
  }
  
  addData(formData: DataFromForm){
    this.data.push(formData);
  }
}

import { DataFromForm } from './main-form/formData';
import { BehaviorSubject } from 'rxjs';

export class DataService{

  private data: DataFromForm[] = [];
  saveEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);

  getData(): DataFromForm[] {

    return this.data;
  }
  addData(formData: DataFromForm){

    this.data.push(formData);
  }
}

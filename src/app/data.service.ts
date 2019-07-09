import { DataFromForm } from './main-form/formData';
import { BehaviorSubject } from 'rxjs';

export class DataService{

  private data: DataFromForm[] = [];
  jsonToPrint: string = '';
  saveEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loadEvent:BehaviorSubject<boolean> = new BehaviorSubject(false);
  getFullJson: BehaviorSubject<boolean> = new BehaviorSubject(false);
  activData: DataFromForm;

  getData(): DataFromForm[] {
    return this.data;
  }
  addData(formData: DataFromForm){
    this.data.push(formData);
  }

  findJsonByIndex( jsonIndex: number ){
    let jsonPart: string = this.data[jsonIndex].fullJSONpart;
    this.jsonToPrint = jsonPart;
    this.activData = this.data[jsonIndex];

  }
}

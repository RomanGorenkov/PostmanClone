import { DataFromForm } from './main-form/formData';
import { BehaviorSubject } from 'rxjs';

export class DataService{

  private data: DataFromForm[] = [];
  jsonToPrint: string = '';
  saveEvent: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loadEvent:BehaviorSubject<boolean> = new BehaviorSubject(false);
  getFullJson: BehaviorSubject<boolean> = new BehaviorSubject(false);

  getData(): DataFromForm[] {

    return this.data;
  }
  addData(formData: DataFromForm){

    this.data.push(formData);
  }

  findJsonByIndex( jsonIndex: number ){
    let jsonPart: string = this.data[jsonIndex].fullJSONpart;
    console.log(jsonIndex);
    this.jsonToPrint = jsonPart;
  }
}

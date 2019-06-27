import { DataFromForm } from './main-form/formData';

export class DataService{

  private data: DataFromForm[] = [];

  getData(): DataFromForm[] {

      return this.data;
  }
  addData(formData: DataFromForm){

      this.data.push(formData);
  }
}

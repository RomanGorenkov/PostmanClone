import { DataFromForm } from '../main-form/formData';

export class Pipeline {
  name: string = '';
  jsonArray: DataFromForm[] = [];
  tabStatus: string = 'disable';
  index: number = 0;

  constructor(name, index) {
    this.name = name;
    this.index = index;
}
}

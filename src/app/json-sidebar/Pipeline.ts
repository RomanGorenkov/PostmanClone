import { DataFromForm } from '../main-form/formData';

export class Pipeline {
  pipeline: string = '';
  stages: DataFromForm[] = [];
  tabStatus: string = 'disable';
  index: number = 0;

  constructor(name: string, index: number) {
    this.pipeline = name;
    this.index = index;
}

}

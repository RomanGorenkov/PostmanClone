import { FormArray } from '@angular/forms';

export class DataFromForm {
  url: string = '';
  method: string = '';
  header: string = '';
  data: string = '';
  output: string = '';
  assert_code: string = ''
  assert_response: string = '';
  fullJSONpart: string = '';
  partName: string = '';
  index: number = null;

  paramsArray: FormArray = null;

  constructor() {
}
}

import { FormArray } from '@angular/forms';

export class DataFromForm {
  url: string = '';
  urlNative: string = '';
  urlParam: string = '';
  method: string = '';
  header: string = '';
  data: string = '';
  output: string = '';
  assert_code: string = ''
  assert_response: string = '';
  fullJSONpart: string = '';
  part_name: string = '';
  index: number = null;

  paramsArray = null;
  hedersArray = null;

  constructor() {

  }
}

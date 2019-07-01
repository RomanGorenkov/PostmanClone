export class DataFromForm {
  url: string;
  method: string;
  header: string;
  data: string;
  output: string;
  assert_code: '';
  assert_response: '';
  fullJSONpart: string;
  partName: string;

  constructor() {
  this.url = '';
  this.method = '';
  this.header = '';
  this.data = '';
  this.output = '';
  this.assert_code = '';
  this.assert_response = '';
  this.fullJSONpart = '';
  this.partName = 'Name';
}
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Input } from '@angular/core';

import { DataService } from '../../../data.service';

import { Request } from './request';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataFromForm } from '../../formData';


@Component({
  selector: 'app-main-form-tab',
  templateUrl: './main-form-tab.component.html',
  styleUrls: ['./main-form-tab.component.css'],
})
export class MainFormTabComponent implements OnInit {

  @Input() tabName: string;

  @ViewChild('key', { static: false }) key: ElementRef;
  @ViewChild('value', { static: false }) value: ElementRef;
  @ViewChild('inputKey', { static: false }) inputKey: ElementRef;
  @ViewChild('bodyData', { static: false }) bodyData: ElementRef;



  condition: boolean;
  keyValue: boolean;
  paramArray: string[];
  param: Subscription;
  assertCodes: string[] = ["100", "101", "102", "200", "201", "202", "203", "204", "205", "206", "300", "301", "302", "303", "304", "305", "306", "307", "308", "400", "401", "402", "403", "404", "405", "406", "407", "408", "409", "410", "411", "412", "413", "414", "415", "416", "417", "500", "501", "502", "503", "504", "504"];



  myForm: FormGroup;
  constructor(private fb: FormBuilder, private dataService: DataService) {


  }

  private _createForm() {
    this.myForm = this.fb.group({
      responseKey: '',
      formRequest: this.fb.array([])
    });
  }

  get formRequestArray(): FormArray {
    return <FormArray>this.myForm.get('formRequest');
  }

  addFormRequest() {
    let fg = this.fb.group({
      requestCheck: '',
      requestKey: '',
      requestValue: '',
      requestDescription: '',
    });
    this.formRequestArray.push(fg);
  }

  removeFormRequest() {
    if (this.formRequestArray.length < 2) {
      return;
    }
    this.formRequestArray.removeAt(this.formRequestArray.length - 1);
  }

  ngOnInit() {
    this.condition = this.tabName == 'Tests';
    this.keyValue = this.tabName == 'Params' || this.tabName == 'Headers';
    this._createForm();
    this.addFormRequest();
    this.setData();
  }

  addRequestParam() {
    this.addFormRequest();
  }
  removeRequestParam() {
    this.removeFormRequest();
  }

  getKeyValueHeaderString(requestArray: FormArray): string {
    let keyValueString: string = '{';
    let params = requestArray.value;
    params.map(param => {
      if (param.requestKey != '' && param.requestValue != '') {
        keyValueString = keyValueString + `'${param.requestKey}': '${param.requestValue}',`
      }
    })
    if (keyValueString.length < 2) {
      return;
    }
    keyValueString = keyValueString.slice(0, -1);
    keyValueString = keyValueString + '}';
    return keyValueString;
  }

  getKeyValueParamString(requestArray: FormArray): string{
    let keyValueString: string = '?';
    let params = requestArray.value;
    params.map(param => {
      if (param.requestKey != '' && param.requestValue != '') {
        keyValueString = keyValueString + `${param.requestKey}=${param.requestValue}&`
      }
    })
    if (keyValueString.length < 2) {
      return;
    }
    keyValueString = keyValueString.slice(0, -1);
    return keyValueString;
  }

  setData() {
    this.dataService.saveEvent.subscribe(data => {
      if (data == true) {
        let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length - 1];
        this.getHeaderData(lastData);
        this.getAssertCode(lastData);
        this.getBodyData(lastData);
        this.getParamData(lastData);
      }
    });
  }

  getAssertCode(lastData: DataFromForm) {
    if (this.tabName == 'Tests') {
      let assertCode = this.inputKey.nativeElement.value;
      lastData.assert_code = assertCode;
    }
  }

  getHeaderData(lastData: DataFromForm){
    if (this.tabName == 'Headers') {
      let header: string = this.getKeyValueHeaderString(this.formRequestArray);
      lastData.header = header;
    }
  }

  getBodyData(lastData: DataFromForm){
    if (this.tabName == 'Body') {
      let body: string = this.bodyData.nativeElement.value;;
      lastData.data = body;
    }
  }

  getParamData(lastData: DataFromForm){
    if (this.tabName == 'Params') {
      let urlParam: string = this.getKeyValueParamString(this.formRequestArray);
      lastData.url = lastData.url + (urlParam != undefined ? urlParam : '');
    }
  }
}

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
  @ViewChild('inputKey', { static: false }) assertCode: ElementRef;
  @ViewChild('bodyData', { static: false }) bodyData: ElementRef;



  condition: boolean;
  keyValue: boolean;
  paramArray: string[];
  param: Subscription;
  assertCodes: string[] = ["100", "101", "102", "200", "201", "202", "203", "204", "205", "206", "300", "301", "302", "303", "304", "305", "306", "307", "308", "400", "401", "402", "403", "404", "405", "406", "407", "408", "409", "410", "411", "412", "413", "414", "415", "416", "417", "500", "501", "502", "503", "504", "504"];
  loadJsonPartEvent: Subscription;



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
      requestKey: '',
      requestValue: '',
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

    this.loadJsonPartEvent = this.dataService.loadEvent.subscribe(permission => {
      if (permission == true) {
        this.uploadFormData();
      }
    });
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

  getKeyValueParamString(requestArray: FormArray): string {
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
        let dataForSave: DataFromForm = this.getDataForSave();
        this.getHeaderData(dataForSave);
        this.getAssertCode(dataForSave);
        this.getBodyData(dataForSave);
        this.getParamData(dataForSave);

        this.dataService.saveDataReady.next(this.dataService.saveDataReady.getValue() + 1);
      }
    });
  }

  getDataForSave(){
    let dataForSave: DataFromForm;
    dataForSave = this.dataService.getData()[this.dataService.getData().length - 1];
    return dataForSave;
  }

  getAssertCode(lastData: DataFromForm) {
    if (this.tabName == 'Tests') {
      let assertCode = this.assertCode.nativeElement.value;
      lastData.assert_code = assertCode;
    }
  }

  getHeaderData(lastData: DataFromForm) {
    if (this.tabName == 'Headers') {
      let header: string = this.getKeyValueHeaderString(this.formRequestArray);
      lastData.header = header;
      lastData.hedersArray = this.formRequestArray.value;
    }
  }

  getBodyData(lastData: DataFromForm) {
    if (this.tabName == 'Body') {
      let body: string = this.bodyData.nativeElement.value;
      lastData.data = body;
    }
  }

  getParamData(lastData: DataFromForm) {
    if (this.tabName == 'Params') {
      let urlParam: string = this.getKeyValueParamString(this.formRequestArray);
      lastData.urlNative = lastData.urlNative;
      lastData.urlParam = urlParam != undefined ? urlParam : '';
      lastData.url = lastData.urlNative + lastData.urlParam;
      lastData.paramsArray = this.formRequestArray.value;
    }
  }

  setAssertCode() {

  }

  uploadFormData() {
    let dataToUpload: DataFromForm = this.dataService.activData;
    if (this.tabName == 'Params') {
      this.uploadParamsData(dataToUpload);
    }
    if (this.tabName == 'Headers') {
      this.uploadHeadersData(dataToUpload);
    }
    if (this.tabName == 'Body') {
      this.uploadBodyData(dataToUpload);
    }
    if (this.tabName == 'Tests') {
      this.uploadTestData(dataToUpload);
    }

  }

  uploadParamsData(dataToUpload: DataFromForm) {
    if (dataToUpload.paramsArray == undefined) {
      return;
    }
    this.trimFormRequestArrayByTemplate(dataToUpload.paramsArray);
    dataToUpload.paramsArray.map((keyValueLine, index: number) => {
      this.expandFormRequestArrayForWriting(index);
      this.formRequestArray.get(`${index}`).get('requestKey').setValue(`${keyValueLine.requestKey}`);
      this.formRequestArray.get(`${index}`).get('requestValue').setValue(`${keyValueLine.requestValue}`);
    })
  }

  uploadHeadersData(dataToUpload: DataFromForm) {
    this.trimFormRequestArrayByTemplate(dataToUpload.hedersArray);
    if (dataToUpload.hedersArray) {
      dataToUpload.hedersArray.map((keyValueLine, index: number) => {
        this.expandFormRequestArrayForWriting(index);
        this.formRequestArray.get(`${index}`).get('requestKey').setValue(`${keyValueLine.requestKey}`);
        this.formRequestArray.get(`${index}`).get('requestValue').setValue(`${keyValueLine.requestValue}`);
      })
    }
  }

  uploadBodyData(dataToUpload: DataFromForm) {
    this.bodyData.nativeElement.value = dataToUpload.data;
  }

  uploadTestData(dataToUpload: DataFromForm) {
    this.assertCode.nativeElement.value = dataToUpload.assert_code;
  }

  trimFormRequestArrayByTemplate(template) {
    if (template == undefined) {
      return;
    }
    if (this.formRequestArray.length > template.length) {
      this.formRequestArray.removeAt(this.formRequestArray.length - (this.formRequestArray.length - template.length));
    }
  }

  expandFormRequestArrayForWriting(index: number) {
    if (index >= this.formRequestArray.length) {
      this.addFormRequest();
    }
  }
}

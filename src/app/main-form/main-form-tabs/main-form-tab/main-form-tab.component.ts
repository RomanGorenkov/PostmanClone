import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Input } from '@angular/core';

import {DataService} from '../../../data.service';

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

  @ViewChild('key', {static: false} ) key: ElementRef;
  @ViewChild('value', {static: false} ) value: ElementRef;



  condition: boolean;
  keyValue: boolean;
  paramArray: string[];
  param: Subscription;


  myForm: FormGroup;
  constructor(private fb: FormBuilder, private dataService: DataService) {


  }

  private _createForm() {
    this.myForm = this.fb.group({
      responseKey: '',
      formRequest: this.fb.array([])
    });
    // this.addRequestRow();

  }

  get formRequestArray(): FormArray {
    return <FormArray>this.myForm.get('formRequest');
  }

  get formPermissionOnFreeRow(): boolean{
    // this.formRequestArray.controls.map((row: FormGroup) => {
    //   row.controls.map((propertyValue) =>{
    //     if(propertyValue == ""{

    //     })
    //   })
    // })
    return
  }

  addFormRequest() {
    // let fg = this.fb.group(new Request());
    let fg = this.fb.group({
    requestCheck: '',
    requestKey: '',
    requestValue: '',
    requestDescription: '',
  });
      this.formRequestArray.push(fg);
  }

  removeFormRequest(){
    if(this.formRequestArray.length < 2){
      return;
    }
    this.formRequestArray.removeAt(this.formRequestArray.length-1);
  }

  ngOnInit() {
    this.condition = this.tabName == 'Tests';
    this.keyValue = this.tabName == 'Params' || this.tabName == 'Headers';
    this._createForm();
    this.addFormRequest();
    this.dataService.saveEvent.subscribe( data => {
      let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length-1];
      // lastData.header = this.getKeyValueString(this.formRequestArray);
    });
    // console.log(this.formRequestArray);
    // console.log(this.myForm.get('requestKey'));

  }

  onInputChange() {
    // console.log("+++");
    // this.addFormRequest();

    console.log(this.formRequestArray);
  }

  addRequestParam() {
    this.addFormRequest();
 }
 removeRequestParam(){
   this.removeFormRequest();
 }

 getKeyValueString(requestArray: FormArray){
  let keyValueString: string = '{';
  let params = requestArray.value;
  // console.log(params);
  params.map( param => {
    if(param.requestKey != '' && param.requestValue != ''){
      keyValueString = keyValueString + `'${param.requestKey}': '${param.requestValue}',`
    }
  })
  if(keyValueString.length < 2){
    return;
  }
  keyValueString = keyValueString.slice(0, -1);
  keyValueString = keyValueString + '}';
  console.log(keyValueString);
 }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Input } from '@angular/core';

import {DataService} from '../../../data.service';

import { Request } from './request';


@Component({
  selector: 'app-main-form-tab',
  templateUrl: './main-form-tab.component.html',
  styleUrls: ['./main-form-tab.component.css'],
  providers: [DataService]
})
export class MainFormTabComponent implements OnInit {

  @Input() tabName: string;

  condition: boolean;


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
    this._createForm();
    this.addFormRequest();
    // console.log(this.formRequestArray);
    console.log(this.myForm.get('requestKey'));

  }

  onInputChange() {
    // console.log("+++");
    // this.addFormRequest();

    // console.log(this.formRequestArray);
  }

  addRequestParam() {
    this.addFormRequest();
 }
 removeRequestParam(){
   this.removeFormRequest();
 }
}

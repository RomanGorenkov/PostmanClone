import { Component, OnInit, ViewChild, ElementRef, Renderer2, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {DataService} from '../data.service';
import { DataFromForm } from './formData';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.css'],
})
export class MainFormComponent implements OnInit {

  @ViewChild('url', {static: false} ) url: ElementRef;
  @ViewChild('response', {static: false} ) responseNumber: ElementRef;
  @ViewChild('type', {static: false} ) method: ElementRef;
  @ViewChild('name', {static: false} ) jsonName: ElementRef;

  types: string[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "COPY", "HEAD", "OPTIONS", "LINK", "UNLINK", "PURGE", "LOCK", "UNLOCK", "PROPFIND", "VIEW"];
  myForm: FormGroup;
  loadJsonPartEvent: Subscription;



  constructor(private dataService: DataService) {
    this.myForm = new FormGroup({
      "requestName": new FormControl("", Validators.required),
      "requestUrl": new FormControl("", Validators.required),
      "response": new FormControl("", Validators.required),
      "requestJsonName": new FormControl("",Validators.required)
    });


  }

  submit() {

  }

  ngOnInit() {
    this.loadJsonPartEvent = this.dataService.loadEvent.subscribe( permission => {
      if(permission == true){
        this.uploadFormData();
      }
    });
  }

  saveJSON() {
    let data = new DataFromForm();
    data.url = this.url.nativeElement.value;
    data.method = this.method.nativeElement.value;
    data.partName = this.jsonName.nativeElement.value != '' ? this.jsonName.nativeElement.value : 'Name';
    this.dataService.addData(data);
    this.dataService.saveEvent.next(true);
  }

  uploadFormData(){
    let dataToUpload:DataFromForm = this.dataService.activData;
    this.url.nativeElement.value = dataToUpload.url;
    this.method.nativeElement.value = dataToUpload.method;
    this.jsonName.nativeElement.value = dataToUpload.partName;
  }

}

import { Component, OnInit, ViewChild, ElementRef, Renderer2, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {DataService} from '../data.service';
import { DataFromForm } from './formData';



@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.css'],
})
export class MainFormComponent implements OnInit {

  types: string[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "COPY", "HEAD", "OPTIONS", "LINK", "UNLINK", "PURGE", "LOCK", "UNLOCK", "PROPFIND", "VIEW"];
  myForm: FormGroup;

  @ViewChild('url', {static: false} ) url: ElementRef;
  @ViewChild('response', {static: false} ) responseNumber: ElementRef;
  @ViewChild('type', {static: false} ) responseType: ElementRef;
  @ViewChild('name', {static: false} ) jsonName: ElementRef;


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
  }

  saveJSON() {
    let data = new DataFromForm();
    data.url = this.url.nativeElement.value;
    data.method = this.responseType.nativeElement.value;
    data.partName = this.jsonName.nativeElement.value != '' ? this.jsonName.nativeElement.value : 'Name';
    this.dataService.addData(data);
    this.dataService.saveEvent.next(true);
  }

}

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { DataService } from '../data.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Data } from '@angular/router';
import { DataFromForm } from '../main-form/formData';

@Component({
  selector: 'app-json-preview',
  templateUrl: './json-preview.component.html',
  styleUrls: ['./json-preview.component.css'],
})
export class JsonPreviewComponent implements OnInit {
  dataToPrint={};
  @ViewChild('json', { static: false }) json: ElementRef;
  @ViewChild('saveButton', {static: false}) saveButton: ElementRef;
  param: Subscription;
  switchJSONPart: Subscription;
  getFullJson: Subscription;

  constructor(private dataService: DataService) {


  }

  ngOnInit() {

    this.param = this.dataService.saveEvent.subscribe(data => {
      setTimeout(() => {
        let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length - 1];
        if (data == true && this.addData(lastData) != '' && lastData.fullJSONpart == '' ) {
          this.json.nativeElement.value = `${this.addData(lastData)}`;
          lastData.fullJSONpart = `${this.addData(lastData)}`;
          this.dataService.getData()[this.dataService.getData().length - 1].fullJSONpart
        }
      }, 10);
    });

    this.switchJSONPart = this.dataService.loadEvent.subscribe(data => {
        if(data == true){
          this.json.nativeElement.value = this.dataService.jsonToPrint;
        }
    })

    this.getFullJson = this.dataService.getFullJson.subscribe( data => {
      if(data == true){
        this.json.nativeElement.value = this.dataService.jsonToPrint;
      }
    })
  }

  ngAfterViewInit() {
    this.json.nativeElement.value = this.dataService.getData();
  }

  addData(lastData: DataFromForm) : string{
    this.dataPars(lastData.url,'url');
    this.dataPars(lastData.method,'method');
    this.dataPars(lastData.header,'header');
    this.dataPars(lastData.assert_code,'assert_code');
    this.dataPars(lastData.data,'data');
    this.dataPars(lastData.partName,'part_name');
    let formatData = JSON.stringify(this.dataToPrint, null, 4);
    console.log(JSON.stringify(this.dataToPrint, null, 4));
    return formatData;
  }

  dataPars(jsonPar,parName){
    if(jsonPar) this.dataToPrint[parName] = jsonPar;
  }

  saveChange(){
    console.log(this.json.nativeElement.value);
    this.json.nativeElement.value
  }
}

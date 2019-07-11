import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { DataFromForm } from '../main-form/formData';

@Component({
  selector: 'app-json-preview',
  templateUrl: './json-preview.component.html',
  styleUrls: ['./json-preview.component.css'],
})

export class JsonPreviewComponent implements OnInit {
  @ViewChild('json', { static: false }) json: ElementRef;
  @ViewChild('saveButton', { static: false }) saveButton: ElementRef;

  dataToPrint = {};
  param: Subscription;
  switchJSONPart: Subscription;
  getFullJson: Subscription;

  constructor(private dataService: DataService) {

  }

  ngOnInit() {

    this.param = this.dataService.saveEvent.subscribe(permission => {
      setTimeout(() => {
        this.previewRender(permission);
      }, 10);
    });

    this.switchJSONPart = this.dataService.loadEvent.subscribe(data => {
      if (data == true) {
        this.json.nativeElement.value = this.dataService.jsonToPrint;
      }
    })

    this.getFullJson = this.dataService.getFullJson.subscribe(data => {
      if (data == true) {
        this.json.nativeElement.value = this.dataService.jsonToPrint;
      }
    })
  }

  ngAfterViewInit() {
    this.json.nativeElement.value = this.dataService.getData();
  }

  creatDataString(lastData: DataFromForm): string {
    this.paramValidation(lastData.url, 'url');
    this.paramValidation(lastData.method, 'method');
    this.paramValidation(lastData.header, 'header');
    this.paramValidation(lastData.assert_code, 'assert_code');
    this.paramValidation(lastData.data, 'data');
    this.paramValidation(lastData.partName, 'part_name');
    let formatData = JSON.stringify(this.dataToPrint, null, 4);
    return formatData;
  }

  paramValidation(jsonPar: string, parName: string) {
    if (jsonPar) this.dataToPrint[parName] = jsonPar;
  }

  previewRender(permission: boolean) {
    let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length - 1];
    if (permission == true && this.creatDataString(lastData) != '' && lastData.fullJSONpart == '' && this.dataService.resave == false) {
      let lastDataString: string = this.creatDataString(lastData);
      this.json.nativeElement.value = lastDataString;
      this.dataService.activData = lastData;
      lastData.fullJSONpart = lastDataString;
    }
    if(this.dataService.resave == true){
      let activDataString: string = this.creatDataString(this.dataService.activData);
      this.json.nativeElement.value = activDataString;
      this.dataService.activData.fullJSONpart = activDataString;
    }
  }
}

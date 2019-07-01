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

  @ViewChild('json', { static: false }) json: ElementRef;
  param: Subscription;

  constructor(private dataService: DataService) {


  }

  ngOnInit() {

    this.param = this.dataService.saveEvent.subscribe(data => {
      setTimeout(() => {
        let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length - 1];
        if (data == true && this.addData(lastData) != '') {
          this.json.nativeElement.value = `{${this.addData(lastData)}\n}`;
          lastData.fullJSONpart = `{${this.addData(lastData)}\n}`;
        }
      }, 10);
    });
  }

  ngAfterViewInit() {
    this.json.nativeElement.value = this.dataService.getData();
  }

  addData(lastData: DataFromForm) : string{
    let url: string = lastData.url != '' ? `\n\t"url":"${lastData.url}"` : '';
    let method: string = lastData.method != '' ? `\n\t"method":"${lastData.method}"` : '';
    let header: string = lastData.header != undefined ? `\n\t"header":"${lastData.header}` : '';
    let assertCode: string = lastData.assert_code != '' ? `\n\t"assert_code":"${lastData.assert_code}"` : '';
    let data: string = lastData.data != '' ? `\n\t"data":"${lastData.data}"` : '';

    let dataArray = new Array( url, method, header, assertCode, data);
    dataArray = dataArray.filter(item => item != '');

    let formatData = dataArray.join(',');
    return formatData;
  }

}

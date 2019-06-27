import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import {DataService} from '../data.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Data } from '@angular/router';
import { DataFromForm } from '../main-form/formData';

@Component({
  selector: 'app-json-preview',
  templateUrl: './json-preview.component.html',
  styleUrls: ['./json-preview.component.css'],
})
export class JsonPreviewComponent implements OnInit {

  @ViewChild('json', {static: false} ) json: ElementRef;
  param: Subscription;

  constructor(private dataService: DataService) {


  }

  ngOnInit() {

    this.param = this.dataService.saveEvent.subscribe( data => {
      console.log(data);
      let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length-1];
      if(data == true){
        this.json.nativeElement.value = `{\n\t"url":"${lastData.url}",\n\t"method":"${lastData.method}",\n}`
      }
    });

  }

  ngAfterViewInit(){
    this.json.nativeElement.value = this.dataService.getData();
  }

}

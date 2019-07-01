import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { DataFromForm } from '../main-form/formData';


@Component({
  selector: 'app-json-sidebar',
  templateUrl: './json-sidebar.component.html',
  styleUrls: ['./json-sidebar.component.css']
})
export class JsonSidebarComponent implements OnInit {

  @ViewChild('jsonParts', { static: false }) jsonBar: ElementRef;


  param: Subscription;
  jsonArray: DataFromForm[] = [];

  constructor(private dataService: DataService) {
    this.param = this.dataService.saveEvent.subscribe(data => {
      let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length - 1];
      if(data == true){
        setTimeout(() => {
          this.jsonArray.push(lastData);
        }, 11);
      }
    });
   }

  ngOnInit() {
  }

}

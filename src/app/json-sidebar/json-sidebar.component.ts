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

  printJSON(index){
    let data: DataFromForm[] = this.dataService.getData();
    console.log(data[index].fullJSONpart);
    this.dataService.jsonToPrint = data[index].fullJSONpart;
    this.dataService.loadEvent.next(true);
  }

  saveJSON(){
    let fullJSON: string = `{\n\t"tests":[
    {
      "pipeline":"test_pipeline",
      "stages":[\n`;
    let data: DataFromForm[] = this.dataService.getData();
    data.forEach( part => {
      fullJSON = fullJSON +`${part.fullJSONpart},\n`;
    })
    fullJSON = fullJSON.slice(0, -2) + "\n]\n}\n]\n}";
    let convert = JSON.parse(fullJSON);
    fullJSON = JSON.stringify(convert, null, 2);
    this.dataService.jsonToPrint = fullJSON;
    console.log(fullJSON);
    this.dataService.getFullJson.next(true);
  }

}

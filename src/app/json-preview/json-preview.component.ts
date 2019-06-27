import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import {DataService} from '../data.service';

@Component({
  selector: 'app-json-preview',
  templateUrl: './json-preview.component.html',
  styleUrls: ['./json-preview.component.css'],
  providers: [DataService]
})
export class JsonPreviewComponent implements OnInit {

  @ViewChild('json', {static: false} ) json: ElementRef;


  constructor(private dataService: DataService) { }

  ngOnInit() {



  }

  ngAfterViewInit(){
    console.log(this.json.nativeElement.value = 'lol');
    console.log(this.dataService.getData());
  }

}

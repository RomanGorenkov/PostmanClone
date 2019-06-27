import { Component, OnInit, Renderer, ElementRef  } from '@angular/core';

@Component({
  selector: 'app-main-form-tabs',
  templateUrl: './main-form-tabs.component.html',
  styleUrls: ['./main-form-tabs.component.css']
})
export class MainFormTabsComponent implements OnInit {


  labelName:string='pop';

  constructor(private elementRef: ElementRef) {
    // console.log(this.labelName);
   }

  ngOnInit() {
  }

}

import { Component, OnInit, ElementRef  } from '@angular/core';

@Component({
  selector: 'app-main-form-tabs',
  templateUrl: './main-form-tabs.component.html',
  styleUrls: ['./main-form-tabs.component.css']
})
export class MainFormTabsComponent implements OnInit {
  constructor(private elementRef: ElementRef) {
   }

  ngOnInit() {
  }

}

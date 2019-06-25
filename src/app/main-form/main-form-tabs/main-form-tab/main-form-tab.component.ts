import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Input} from '@angular/core';


@Component({
  selector: 'app-main-form-tab',
  templateUrl: './main-form-tab.component.html',
  styleUrls: ['./main-form-tab.component.css']
})
export class MainFormTabComponent implements OnInit {

  @Input() tabName: string;

  condition: boolean;


  myForm: FormGroup;
  constructor() {
    console.log('{{tabName}}');
    this.myForm = new FormGroup({

      "requestKey": new FormControl(""),
      "requestValue": new FormControl(""),
      "requestDescription": new FormControl("")
    });
   }

  ngOnInit() {
    this.condition = this.tabName == 'Tests';
  }

}

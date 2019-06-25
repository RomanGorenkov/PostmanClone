import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.css']
})
export class MainFormComponent implements OnInit {

  types: string[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "COPY", "HEAD","OPTIONS","LINK","UNLINK","PURGE","LOCK","UNLOCK","PROPFIND","VIEW"];
  myForm: FormGroup;
  constructor() {
    this.myForm = new FormGroup({

      "requestName": new FormControl("", Validators.required),
      "requestUrl": new FormControl("", Validators.required),
      "response": new FormControl("", Validators.required),

      // "userEmail": new FormControl("", [
      //   Validators.required,
      //   Validators.email
      // ]),
      // "userPhone": new FormControl("", Validators.pattern("[0-9]{10}"))
    });
  }

  submit() {
    console.log(this.myForm);
  }

  ngOnInit() {
  }

}

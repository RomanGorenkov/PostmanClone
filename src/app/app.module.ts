import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { ReactiveFormsModule }   from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

import 'hammerjs';
import { MainFormTabsComponent } from './main-form/main-form-tabs/main-form-tabs.component';
import { MainFormTabComponent } from './main-form/main-form-tabs/main-form-tab/main-form-tab.component';
import { JsonPreviewComponent } from './json-preview/json-preview.component';
import { DataService } from './data.service';
import { JsonSidebarComponent } from './json-sidebar/json-sidebar.component';



@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    MainFormTabsComponent,
    MainFormTabComponent,
    JsonPreviewComponent,
    JsonSidebarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

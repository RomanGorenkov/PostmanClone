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
import { DataService } from './data.service';
import { JsonSidebarComponent } from './json-sidebar/json-sidebar.component';
import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TestResultComponent } from './test-result/test-result.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    MainFormTabsComponent,
    MainFormTabComponent,
    JsonSidebarComponent,
    TestResultComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTreeModule,
    HttpClientModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [DataService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }

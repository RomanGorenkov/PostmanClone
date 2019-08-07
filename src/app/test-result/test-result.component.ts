import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { DataService } from '../data.service';

export interface PeriodicElement {
  name: string;
  pipeline: string;
  result: string;
  time: number;
}


let ELEMENT_DATA: PeriodicElement[] = [
];

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.css']
})
export class TestResultComponent implements OnInit {
  displayedColumns: string[] = ['pipeline', 'name', 'time', 'code', 'result'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(dataService: DataService) {
    dataService.response.subscribe(data => {
      if (dataService.serverResponse) {
        let newData = dataService.serverResponse;
        console.log(newData)
        ELEMENT_DATA = [];
        newData.forEach(element => {
          const newRow = <PeriodicElement>{pipeline: element.pipeline, name: element.response[0].stage, time: element.response[0].time, code: element.response[0].code, result: element.response[0].status}
          ELEMENT_DATA.push(newRow);
        });
        
        
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      }
    })
  }

}

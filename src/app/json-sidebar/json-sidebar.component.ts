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

  @ViewChild('pipelineName', {static: false}) pipelineName: ElementRef;
  @ViewChild('addButton', {static: false}) addButton: ElementRef;
  @ViewChild('jsonParts', { static: false }) jsonBar: ElementRef;
  @ViewChild('pipelineList', { static: false }) pipelineList: ElementRef;



  param: Subscription;
  pipelineArray = [];
  jsonArray: DataFromForm[] = [];

  constructor(private dataService: DataService) {
    this.param = this.dataService.saveEvent.subscribe(data => {
      let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length - 1];
      if(data == true){
        setTimeout(() => {
          let activePipelineIndex = this.findeActivPipelineIndex(this.pipelineArray);
          lastData.index = this.jsonArray.length;
          this.pipelineArray[activePipelineIndex][1].push(lastData);

        }, 11);
      }
    });
   }

  ngOnInit() {
  }

  printJSON(index){
    let activePipelineIndex = this.findeActivPipelineIndex(this.pipelineArray);
    console.log(activePipelineIndex);
    // let data: DataFromForm[] = this.dataService.getData();
    // console.log(data[index].fullJSONpart);
    // this.dataService.jsonToPrint = data[index].fullJSONpart;
    this.dataService.jsonToPrint = this.pipelineArray[activePipelineIndex][1].fullJSONpart;

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

  addPipeline(){

    this.pipelineArray.push([this.pipelineName.nativeElement.value,[],'disable']);
    console.log(this.pipelineArray);
  }

  choosePipeline($event, index){
    let selectedPipeline = event.srcElement as HTMLElement;
    if(selectedPipeline.classList.contains('sidebar__pipline-title')){
      if(this.pipelineList.nativeElement.querySelector('.active-pipeline')){
        this.pipelineList.nativeElement.querySelector('.active-pipeline').classList.remove('active-pipeline');
        for(let i = 0; i < this.pipelineArray.length; i++){
          this.pipelineArray[i][2] = 'disable';
        }
      }
      selectedPipeline.classList.add('active-pipeline');
      this.pipelineArray[index][2] = 'active';
    }
  }

  findeActivPipelineIndex(pipelineArray){
    for(let i = 0; i < this.pipelineArray.length; i++){
      if(this.pipelineArray[i][2] == 'active'){
        return  i;
      }
    }
  }

}

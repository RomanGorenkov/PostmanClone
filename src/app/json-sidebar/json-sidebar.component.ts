import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { DataFromForm } from '../main-form/formData';
import { DomSanitizer } from '@angular/platform-browser';
import { Url } from 'url';


@Component({
  selector: 'app-json-sidebar',
  templateUrl: './json-sidebar.component.html',
  styleUrls: ['./json-sidebar.component.css']
})
export class JsonSidebarComponent implements OnInit {

  @ViewChild('pipelineName', {static: false}) pipelineName: ElementRef;
  @ViewChild('addButton', {static: false}) addButton: ElementRef;
  @ViewChild('jsonParts', { static: false }) jsonParts: ElementRef;
  @ViewChild('pipelineList', { static: false }) pipelineList: ElementRef;
  @ViewChild('pipelineItem', { static: false }) pipelineItem: ElementRef;




  param: Subscription;
  pipelineArray = [];
  jsonArray: DataFromForm[] = [];
  fileUrl: Url;


  constructor(private dataService: DataService, private sanitizer: DomSanitizer) {
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
    this.dataService.activData = this.pipelineArray[activePipelineIndex][1][index];
    this.dataService.jsonToPrint = this.pipelineArray[activePipelineIndex][1][index].fullJSONpart;

    this.dataService.loadEvent.next(true);
  }

  saveJSON(){
    let fullJSON: string = `{\n\t"tests":[`;
    this.pipelineArray.map( pipeline => {
      fullJSON = fullJSON + `{
          "pipeline":"${pipeline[0]}",
           "stages":[\n`;
      pipeline[1].map( jsonPart => {
        fullJSON = fullJSON +`${jsonPart.fullJSONpart},\n`;
      })
      fullJSON = fullJSON.slice(0,-2) + ']\n},\n';
    })
    fullJSON = fullJSON.slice(0, -5) + "\n]\n}\n]\n}";
    console.log(fullJSON);
    let convert = JSON.parse(fullJSON);
    fullJSON = JSON.stringify(convert, null, 2);
    this.dataService.jsonToPrint = fullJSON;
    console.log(fullJSON);
    this.creatJSONToDownload(fullJSON);
    this.dataService.getFullJson.next(true);
  }

  creatJSONToDownload(fullJSON){
    const data = fullJSON;
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  addPipeline(){

    this.pipelineArray.push([this.pipelineName.nativeElement.value,[],'disable',this.pipelineArray.length]);
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
      selectedPipeline.parentElement.classList.add('active-pipeline');
      this.pipelineArray[index][2] = 'active';
      this.jsonArray = this.pipelineArray[index][1];
      // console.log(this.pipelineList.nativeElement.querySelector('.active-pipeline .sidebar__jsons-pipeline .sidebar__jsons-list'));
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

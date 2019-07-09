import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { DataFromForm } from '../main-form/formData';
import { DomSanitizer } from '@angular/platform-browser';
import { Url } from 'url';
import { Pipeline } from './Pipeline';


@Component({
  selector: 'app-json-sidebar',
  templateUrl: './json-sidebar.component.html',
  styleUrls: ['./json-sidebar.component.css']
})
export class JsonSidebarComponent implements OnInit {

  @ViewChild('pipelineName', { static: false }) pipelineName: ElementRef;
  @ViewChild('pipelineList', { static: false }) pipelineList: ElementRef;
  @ViewChild('downloadLink', { static: false }) downloadLink: ElementRef;

  param: Subscription;
  pipelineArray: Pipeline[] = [];
  jsonArray: DataFromForm[] = [];
  fileUrl: Url;


  constructor(private dataService: DataService, private sanitizer: DomSanitizer) {
    this.param = this.dataService.saveEvent.subscribe(data => {
      let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length - 1];
      if (data == true) {
        setTimeout(() => {
          let activePipelineIndex = this.findeActivPipelineIndex();
          lastData.index = this.jsonArray.length;
          this.pipelineArray[activePipelineIndex].jsonArray.push(lastData);
        }, 11);
      }
    });
  }

  ngOnInit() {
  }

  printJSON(index:number) {
    let activePipelineIndex = this.findeActivPipelineIndex();
    this.dataService.activData = this.pipelineArray[activePipelineIndex].jsonArray[index];
    this.dataService.jsonToPrint = this.pipelineArray[activePipelineIndex].jsonArray[index].fullJSONpart;
    this.dataService.loadEvent.next(true);
  }

  saveJSON() {
    let fullJSON = this.creatJSONString();
    fullJSON = this.convertStringToJSON(fullJSON);
    this.creatJSONToDownload(fullJSON);
    this.dataService.jsonToPrint = fullJSON;
    this.dataService.getFullJson.next(true);
  }

  creatJSONString(){
    let fullJSON: string = `{\n\t"tests":[`;
    this.pipelineArray.map(pipeline => {
      fullJSON = fullJSON + `{
          "pipeline":"${pipeline.name}",
           "stages":[\n`;
      pipeline.jsonArray.map(jsonPart => {
        fullJSON = fullJSON + `${jsonPart.fullJSONpart},\n`;
      })
      if(pipeline.jsonArray.length == 0){
        fullJSON = fullJSON + ']\n},\n';
      } else{
        fullJSON = fullJSON.slice(0, -2) + ']\n},\n';
      }
    })
    fullJSON = fullJSON.slice(0, -5) + "\n]\n}\n]\n}";
    return fullJSON;
  }

  convertStringToJSON(fullJSON){
    fullJSON = JSON.parse(fullJSON);
    fullJSON = JSON.stringify(fullJSON, null, 2);
    return fullJSON;
  }

  creatJSONToDownload(fullJSON) {
    const data = fullJSON;
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    this.downloadLink.nativeElement.style.visibility = 'visible';
  }

  addPipeline() {
    this.pipelineArray.push(new Pipeline(this.pipelineName.nativeElement.value, this.pipelineArray.length));
  }

  choosePipeline($event, index: number) {
    let selectedPipeline = event.srcElement as HTMLElement;
    if (selectedPipeline.parentElement.classList.contains('active-pipeline')) {
      this.disablePipelines();
      return;
    }
    if (selectedPipeline.classList.contains('sidebar__pipline-title')) {
      if (this.pipelineList.nativeElement.querySelector('.active-pipeline')) {
        this.disablePipelines();
      }
      this.enablePipeline(selectedPipeline,index);
    }
  }

  disablePipelines() {
    this.pipelineList.nativeElement.querySelector('.active-pipeline').classList.remove('active-pipeline');
    for (let i = 0; i < this.pipelineArray.length; i++) {
      this.pipelineArray[i].tabStatus = 'disable';
    }
  }

  enablePipeline(selectedPipeline: HTMLElement, index: number) {
    selectedPipeline.parentElement.classList.add('active-pipeline');
    this.pipelineArray[index].tabStatus = 'active';
    this.jsonArray = this.pipelineArray[index].jsonArray;
  }

  findeActivPipelineIndex() {
    for (let i = 0; i < this.pipelineArray.length; i++) {
      if (this.pipelineArray[i].tabStatus == 'active') {
        return i;
      }
    }
  }

}

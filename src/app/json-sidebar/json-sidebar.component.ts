import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { DataFromForm } from '../main-form/formData';
import { DomSanitizer } from '@angular/platform-browser';
import { Url } from 'url';
import { Pipeline } from './Pipeline';
import { viewClassName } from '@angular/compiler';
import { HttpService } from '../http.service';



@Component({
  selector: 'app-json-sidebar',
  templateUrl: './json-sidebar.component.html',
  styleUrls: ['./json-sidebar.component.css']
})
export class JsonSidebarComponent implements OnInit {

  @ViewChild('pipelineName', { static: false }) pipelineName: ElementRef;
  @ViewChild('pipelineList', { static: false }) pipelineList: ElementRef;
  @ViewChild('jsonParts', { static: false }) jsonList: ElementRef;
  @ViewChild('downloadLink', { static: false }) downloadLink: ElementRef;

  param: Subscription;
  pipelineArray: Pipeline[] = [];
  jsonArray: DataFromForm[] = [];
  fileUrl: Url;


  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private httpService: HttpService) {
    this.param = this.dataService.saveEvent.subscribe(data => {
      let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length - 1];
      if (data == true) {
        setTimeout(() => {
          if (this.dataService.resave == false) {
            let activePipelineIndex = this.findeActivPipelineIndex();
            lastData.index = this.jsonArray.length;
            this.pipelineArray[activePipelineIndex].stages.push(lastData);
          }
        }, 11);
      }
    });
  }

  ngOnInit() {
  }

  printJSON(index: number) {
    this.dataService.resave = true;
    let jsonPart = event.srcElement as HTMLElement;
    // jsonPart.parentElement.classList.add('active-json');
    let activePipelineIndex = this.findeActivPipelineIndex();
    this.disableJsonPart(jsonPart);
    this.dataService.activData = this.pipelineArray[activePipelineIndex].stages[index];
    this.dataService.jsonToPrint = this.pipelineArray[activePipelineIndex].stages[index].fullJSONpart;
    this.dataService.loadEvent.next(true);
  }

  disableJsonPart(target: HTMLElement) {
    if (target.parentElement.querySelector('.active-json')) {
      if(target.parentElement.querySelector('.active-json') == target){
        target.parentElement.querySelector('.active-json').classList.remove('active-json');
        this.dataService.resave = false;
        return;
      } else{
        target.parentElement.querySelector('.active-json').classList.remove('active-json');
        target.classList.add('active-json');
      }
    } else{
      target.classList.add('active-json');
    }
  }

  saveJSON() {
    let fullJSON = this.creatJSONString();
    fullJSON = this.convertStringToJSON(fullJSON);
    this.creatJSONToDownload(fullJSON);
    this.dataService.jsonToPrint = fullJSON;
    this.dataService.getFullJson.next(true);
  }

  creatJSONString() {
    let fullJSON: string = `{\n\t"tests":[`;
    this.pipelineArray.map(pipeline => {
      fullJSON = fullJSON + `{
          "pipeline":"${pipeline.pipeline}",
           "stages":[\n`;
      pipeline.stages.map(jsonPart => {
        fullJSON = fullJSON + `${jsonPart.fullJSONpart},\n`;
      })
      if (pipeline.stages.length == 0) {
        fullJSON = fullJSON + ']\n},\n';
      } else {
        fullJSON = fullJSON.slice(0, -2) + ']\n},\n';
      }
    })
    fullJSON = fullJSON.slice(0, -5) + "\n]\n}\n]\n}";
    return fullJSON;
  }

  convertStringToJSON(fullJSON) {
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
      this.enablePipeline(selectedPipeline, index);
      this.dataService.resave = false;
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
    this.jsonArray = this.pipelineArray[index].stages;
  }

  findeActivPipelineIndex() {
    for (let i = 0; i < this.pipelineArray.length; i++) {
      if (this.pipelineArray[i].tabStatus == 'active') {
        return i;
      }
    }
  }

  openFile(event) {
    let input = event.target;
    for (let index = 0; index < input.files.length; index++) {
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.pipelineArray = this.parseDataToUpload(`${text}`);
        }
        reader.readAsText(input.files[index]);
    };
}
  postData(){
    console.log(this.dataService.jsonToPrint);
    this.httpService.postData(this.dataService.jsonToPrint);
  }

parseDataToUpload(text: string){
  let parseData = JSON.parse(`${text}`);
  parseData.tests.forEach( (pipeline, index: number) =>{
    let validPipeline = new Pipeline(pipeline.pipeline, index);
    pipeline.stages.forEach( (stages, index: number) => {
      stages.fullJSONpart = JSON.stringify(stages, null, 4);
      stages.urlNative = stages.url.split('?')[0];
      stages.urlParam = '?' + stages.url.split('?')[1];
      stages.index = index;
      stages.paramsArray = this.parseParamDataToUpload(stages.urlParam);
      stages.hedersArray = this.parseHeaderDataToUpload(stages.header)
      // if(stages.part_name == undefined){
      //   console.log('+++');
      //   stages.part_name == 'index';
      // }
      this.dataService.addData(stages);
      return stages;
    })

    validPipeline.index = index;
    validPipeline.tabStatus = 'disable';
    validPipeline.stages = pipeline.stages;
    return validPipeline;
  })
  return parseData.tests;
}

parseParamDataToUpload(paramStr: string){
  if(paramStr == '?undefined'){
    return;
  }
  let paramsArray = [];
  paramStr = paramStr.slice(1);
  let paramString: string = paramStr.split('&').join('=');
  let paramStringArray: string[] = paramString.split('=');
  let requestKeyArray: string[] = paramStringArray.filter( (item, index) => {
    return index % 2 == 0;
  });
  let requestValue: string[]= paramStringArray.filter( (item, index) => {
    return index % 2 == 1;
  });

  for( let index: number = 0; index < requestKeyArray.length; index++){
    paramsArray.push({requestKey: `${requestKeyArray[index]}`, requestValue: `${requestValue[index]}`});
  }
  return paramsArray;
}

parseHeaderDataToUpload(headerDataStr: string){
  let paramsArray = [];
  headerDataStr = headerDataStr.slice(2).slice(0,-2);
  let headerString: string = headerDataStr.split("','").join("': '");
  let headerStringArray: string[] = headerString.split("': '");
  let requestKeyArray: string[] = headerStringArray.filter( (item, index) => {
    return index % 2 == 0;
  });
  let requestValue: string[]= headerStringArray.filter( (item, index) => {
    return index % 2 == 1;
  });

  for( let index: number = 0; index < requestKeyArray.length; index++){
    paramsArray.push({requestKey: `${requestKeyArray[index]}`, requestValue: `${requestValue[index]}`});
  }
  return paramsArray;
}
}

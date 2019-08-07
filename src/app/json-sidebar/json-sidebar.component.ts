import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { DataFromForm } from '../main-form/formData';
import { DomSanitizer } from '@angular/platform-browser';
import { Url } from 'url';
import { Pipeline } from './Pipeline';
import { HttpService } from '../http.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';

export class PipelineNode {
  id: string;
  name: string;
  children?: PipelineNode[];
}

export class ExampleFlatNode {
  id: string;
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-json-sidebar',
  templateUrl: './json-sidebar.component.html',
  styleUrls: ['./json-sidebar.component.css']
})
export class JsonSidebarComponent implements OnInit {

  PIPELINE_DATA: PipelineNode[] = [];
  clicked: boolean = false;

  private _transformer = (node: PipelineNode, level: number) => {
    console.log(this.nestedNodeMap)
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.id === node.id
      ? this.nestedNodeMap.get(node)!
      : new ExampleFlatNode();

    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);

    return flatNode;
  }

  selectedNode: ExampleFlatNode;
  param: Subscription;
  fileUrl: Url;
  pipelineName: string;

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  pipelineArray: Map<ExampleFlatNode, Pipeline> = new Map<ExampleFlatNode, Pipeline>();
  flatNodeMap: Map<ExampleFlatNode, PipelineNode> = new Map<ExampleFlatNode, PipelineNode>();
  nestedNodeMap: Map<PipelineNode, ExampleFlatNode> = new Map<PipelineNode, ExampleFlatNode>();

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private httpService: HttpService) {
    this.dataSource.data = [];
    this.param = this.dataService.saveDataReady.subscribe(data => {
      if (data == 4) {
        this.dataService.saveDataReady.next(0);
        let lastData: DataFromForm = this.dataService.getData()[this.dataService.getData().length - 1];
        console.log(lastData)
        if (this.selectedNode.level == 0) {
          const child = <PipelineNode>{ 'name': lastData.part_name, 'id': this.generateId() };
          let parentNode = this.flatNodeMap.get(this.selectedNode);
          parentNode.children.push(child)
          this.dataSource.data = this.PIPELINE_DATA;

          const newNodeData = <Pipeline>{ 'data': lastData, 'pipeline': this.selectedNode.name };
          let qwe = this.nestedNodeMap.get(child)
          this.pipelineArray.set(qwe, newNodeData);
        } else {
          this.setByKey(this.pipelineArray, this.selectedNode.id, lastData);
          console.log(this.pipelineArray)
        }
      }
    });
  }

  ngOnInit() {
  }

  generateId() {
    let r = Math.random().toString(36).substring(7);
    return r;
  }

  saveJSON() {
    let fullJSON = this.creatJSONString();
    console.log(fullJSON)
    /*fullJSON = this.convertStringToJSON(fullJSON);
    this.creatJSONToDownload(fullJSON);
    this.dataService.jsonToPrint = fullJSON;
    this.dataService.getFullJson.next(true);*/
  }

  creatJSONString() {
    console.log('pipeline array', this.pipelineArray)
    let fullJSON: string = `{"tests":[`;
    this.pipelineArray.forEach((key, value) => {
      console.log(key, value)
      fullJSON = fullJSON + `{"pipeline":"${key.pipeline}", "stages":[`;
      fullJSON = fullJSON + `{"part_name": "${key.data.part_name}","url": "${key.data.urlNative}","method": "${key.data.method}", "header": "${key.data.header}", "data": "${key.data.data}", "assert_code": ${key.data.assert_code}},`
      fullJSON = fullJSON.slice(0, -1) + ']},';
    })
    fullJSON = fullJSON.slice(0, -1) + "]}";

    console.log(fullJSON)

    return fullJSON;
  }

  convertStringToJSON(fullJSON) {
    fullJSON = JSON.parse(fullJSON);
    fullJSON = JSON.stringify(fullJSON, null, 2);
    return fullJSON;
  }

  creatJSONToDownload() {
    //const data = this.creatJSONString();
    console.log('to file', this.nestedNodeMap)
    const data = {
      'PIPELINE_DATA': this.PIPELINE_DATA,
      'pipelineArray': Array.from(this.pipelineArray.entries()),
      'flatNodeMap': Array.from(this.flatNodeMap.entries()),
      'nestedNodeMap': Array.from(this.nestedNodeMap.entries())
    };
    console.log(JSON.stringify(data))
    const blob = new Blob([JSON.stringify(data)], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  setByKey(data, id, newData) {
    data.forEach((value, key) => {
      if (key.id === id) {
        data.get(key).data = newData
      }
    })
  }

  deleteByKey(data, id) {
    data.forEach((value, key) => {
      if (key.id === id) {
        data.delete(key);
      }
    })
  }

  getByKey(data, id) {
    let result;
    data.forEach((value, key) => {
      if (key.id === id) {
        result = value;
      }
    })

    return result;
  }

  remove(node) {
    this.clicked = true;
    let i = 0;
    this.PIPELINE_DATA.forEach(data => {
      if(data.id == node.id) {
        this.PIPELINE_DATA.splice(i, 1);
      }
      i++;
    })
    this.dataSource.data = this.PIPELINE_DATA;
    console.log(this.pipelineArray)
    this.getByKey(this.flatNodeMap, node.id).children.forEach(element => {
      this.deleteByKey(this.pipelineArray, element.id);
      console.log(element.id)
      console.log(node.id)
      this.deleteByKey(this.nestedNodeMap, node.id);
      this.deleteByKey(this.nestedNodeMap, element.id);
      this.deleteByKey(this.flatNodeMap, node.id);
      this.deleteByKey(this.flatNodeMap, element.id);
    });
    console.log(this.nestedNodeMap)
    console.log(this.flatNodeMap)
  }

  pipelineClick(node) {
    if (!this.clicked) {
      if (node.level == 1) {
        console.log('return', this.getByKey(this.pipelineArray, node.id))
        this.printJSON(this.getByKey(this.pipelineArray, node.id).data);
      } else {
        this.printJSON(new DataFromForm())
      }
      this.selectedNode = node;
    }
    this.clicked = false;
  }

  addPipeline() {
    let node = {} as PipelineNode;
    node.id = this.generateId();
    node.name = this.pipelineName;
    node.children = [];
    this.PIPELINE_DATA.push(node);
    this.dataSource.data = this.PIPELINE_DATA;
    this.pipelineName = '';
  }

  openFile(event) {
    console.log(event.target)
    let input = event.target;
    for (let index = 0; index < input.files.length; index++) {
      let reader = new FileReader();
      reader.onload = () => {
        let text = reader.result;
        let data = JSON.parse(text.toString())
        console.log(data.nestedNodeMap)
        this.nestedNodeMap = new Map(data.nestedNodeMap);
        this.PIPELINE_DATA = data.PIPELINE_DATA;
        this.pipelineArray = new Map(data.pipelineArray);
        this.flatNodeMap = new Map(data.flatNodeMap);
        this.dataSource.data = this.PIPELINE_DATA;
        //this.pipelineArray = this.parseDataToUpload(`${text}`);
        console.log(this.nestedNodeMap)
      }
      reader.readAsText(input.files[index]);
    };
  }
  postData() {
    let data = this.creatJSONString();
    this.httpService.postData(this.creatJSONString()).subscribe(response => {
      this.dataService.serverResponse = response;
      this.dataService.response.next(true);
    });
  }

  printJSON(data) {
    this.dataService.activData = data;
    this.dataService.loadEvent.next(true);
  }
}


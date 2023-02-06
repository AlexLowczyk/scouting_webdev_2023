import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { CEA } from '../../CEA';
import { ApiService, Final24 } from 'src/app/services/api.service';

@Component({
  selector: 'app-analysis-graph',
  templateUrl: './analysis-graph.component.html',
  styleUrls: ['./analysis-graph.component.scss']
  
})
export class AnalysisGraphComponent implements OnInit {

  @Input() teamList: Final24[];
  @Input() selectedTeam: string;
  @Input() analysisTypeID: number;
  @Input() graphSize: number;
  @Input() focus: string;
  @Input() filter: number;

  

  apiAnalysis: CEA[] = [];
  apiAnalysis_filter: CEA[] = [];
  title: string;
  team: string;
  analysisType: string;
  graphData: any[];
  maj: number = 1;
  MeanMedian: string;
  public graph = {
    data: [    { x: [], y: [],  }    ],
    layout: {width: 640, height: 480, title: "", xaxis: { type: 'category' }, margin: {b:0, l:0, r:0, t:0}}
  };

  constructor(private apiService: ApiService) {
    this.apiAnalysis_filter = [];
    this.apiAnalysis = [];
    this.title = "Title";
    this.selectedTeam = "";
    this.analysisTypeID = 0;
    this.team = "";
    this.analysisType = "";
    this.graphData = [];
    this.graphSize = 0;
    this.teamList = [];
    this.focus = "";
    this.filter = 1;
    this.MeanMedian = " Median";

    // Update the filter whenever the inputting data changes
    this.apiService.CEAReplay.subscribe(analysis => {
      this.apiAnalysis = analysis;
      this.regenerateFilter();
    });

  }

  majSort(type: number) {

    console.log("Sort Type: " + type)
    if (type == 1) {
      this.maj = 2;
    } else {
      this.maj = 1;
    }
    this.regenerateFilter();
  }
  


  ngOnInit(): void {
    //console.log("ngOnInit: Team Passed to Component: " + this.selectedTeam);
    //this.regenerateFilter();
  }

  ngOnChanges() {
    this.regenerateFilter();
  }


  regenerateFilter() {

    for (const t of this.teamList) {
      
    }

    console.log("Filter: " + this.filter);

    if (this.apiAnalysis) {

      this.graphData = [];
      this.apiAnalysis_filter = [];
      for (const cea of this.apiAnalysis)
      {
        if (cea.analysisTypeID == this.analysisTypeID) 
        {
          
          let yValueList = [];
          let xValueList = [];
          let color = '#CCCCCC';

          if (this.filter == 0) {
            color = '#0000FF';
          }
         

          this.team = cea.team;
          this.analysisType = cea.analysisType;
          

          if ((this.teamList.find(item => item.team === cea.team)) || (this.selectedTeam == cea.team)) {
            if (this.filter == 1) {
              color = '#0000FF';
            } else {
              color = '#CCCCCC';
            }
          }

          if (this.team == this.focus) {
            color = '#9932cc';
          }

          if (this.graphSize == 1) {
            xValueList.push(this.analysisType);
          } else {
            xValueList.push(cea.team);
          }

          if (this.maj == 1) {
            yValueList.push(cea.S2V);
            this.MeanMedian = " Median";
          }
          if (this.maj == 2){
            yValueList.push(cea.S1V);
            this.MeanMedian = " Mean";
          }

          this.graphData.push({
            x: xValueList,
            y: yValueList,
            text: yValueList.map(String),
            type: "bar",
            marker: { color: color },
            showlegend: false,
            name: this.team
          });
        }
      }
    } else 
    {
      this.apiAnalysis_filter = [];
    }

    // Sort Graph Data by Value (y-axis)
    this.graphData.sort((a, b) => b.y - a.y);

    if (this.graphSize == 1) {
      // Layout for Small Graphs on Robot Snapshot
      this.graph = {
        data: this.graphData,
        layout: {width: 240, height: 120, title: " ", xaxis: { type: 'category' }, margin: {b:20, l:20, r:20, t:20}},
      };
      
    } else if (this.graphSize == 2){
      // Layout for Large Graphs on Team Picker Snapshot
      this.graph = {
        data: this.graphData,
        layout: {width: 1000, height: 325, title: this.analysisType + this.MeanMedian, xaxis: { type: 'category' }, margin: {b:40, l:20, r:20, t:30}},
        
      };
      
    }
    


  }

}



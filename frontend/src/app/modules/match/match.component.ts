import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Matches } from '../../matches';
import { CEA } from '../../CEA'

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

 redTeam1: string = "195";
 redTeam2: string = "195";
 redTeam3: string = "195";
 blueTeam1: string = "195";
 blueTeam2: string = "195";
 blueTeam3: string = "195";
 matchNo: number = 1;
 matchString: string = "";

  //apiAnalysis: CEA[] = [];
  apiMatchList: Matches[] = [];  

  constructor(private apiService: ApiService, private route: ActivatedRoute) {

    this.apiService.MatchReplay.subscribe(match => {
      this.apiMatchList = match;
      this.regenerateFilter();
    });

  }

  getMatch(match: number) {
    //console.log("Made it to getMatch with [" + match + "]");
    this.matchNo=match;
    this.regenerateFilter();

  }

  regenerateFilter() {

    //console.log("Made it to Filter with [" + this.matchNo + "]");
    if (this.apiMatchList) {
      for (const m of this.apiMatchList) {
        //console.log("Match: [" + m.MatchNo + "], selected: [" + this.match + "]");
        if (m.matchID == this.matchNo) {
          this.redTeam1 = m.red1;
          this.redTeam2 = m.red2;
          this.redTeam3 = m.red3;
          this.blueTeam1 = m.blue1;
          this.blueTeam2 = m.blue2;
          this.blueTeam3 = m.blue3;
          break;
        }
      }
    } else {
      console.log("Match List Not Found");
    }

  }

  ngOnInit(): void {

    this.matchNo = Number(this.route.snapshot.paramMap.get('match')|| '1');
    //this.matchNo = Number(this.matchString);
    console.log("Check Match: " + this.matchNo)
  }

}

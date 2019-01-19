import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {UserInLeaderboard, UserScore} from "../../models/user";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {Match} from "../../models/match";
import {Team} from "../../models/team";
import {rankings} from "../../models/user";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {Router} from "@angular/router";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  topScore:number = 35000;
  displayedColumns: string[] = ['position', 'username', 'score',"ranking"];
  leaderBoardSub: Subscription;
  leaderboard: Array<UserInLeaderboard> = [];
  dataSource = new MatTableDataSource<UserInLeaderboard>(this.leaderboard);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private dataService:DataService,
    private http:HttpClient,
    private router: Router
  ) { }

  ngOnInit(){
    this.leaderBoardSub = this.dataService.getLeaderboard().subscribe(
      scores=>{
        this.leaderboard = scores.map(
          (v,index)=>
            new UserInLeaderboard(
            index+1,
            v.username,
            Math.floor(v.score),
            this.getRankings(v.score)
          )
        );
        this.refresh();
      }
    );
    this.http.get('api/users/score').subscribe(
      (data: Array<UserScore>)=>{
        this.leaderboard = data.map(
          (
            v,index)=>new UserInLeaderboard(
            index+1,
                    v.username,
                    Math.floor(v.score),
            this.getRankings(v.score)
          )
        );
        this.refresh();
      },err =>{
        console.log(err);
      });
    this.dataSource.paginator = this.paginator;

  }
  getRankings(score:number):string {
    var level =  Math.floor(score/(this.topScore/14));
    level = level>14?14:level<0?0:level;
    return rankings[level];
  }
  refresh() {
    this.dataSource.data = this.leaderboard;
  };

  showUserInfo(username:string) {
    LocalStorageHelper.setItem(StorageKey.CLICKED_USER, username);
    this.router.navigateByUrl("/userProfile");
  }

  ngOnDestroy() {
    // this.leaderBoardSub.unsubscribe();
  }
}

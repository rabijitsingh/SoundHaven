import { Component, ViewChild, AfterViewInit, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { startWith, map, catchError } from 'rxjs/operators';
import { SideNavService } from './sound-haven/services/side-nav/side-nav.service';
import { TrackService } from './sound-haven/services/tracks/track-service.service';
import { PlayerComponent } from './sound-haven/player/player.component';
import { AnimationComponent } from './sound-haven/animation/animation.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit,OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @Input() player: PlayerComponent;
  @Input() animation: AnimationComponent;

  reason = '';
  private subscription: any;
  public tracks: any = [];
  stateCtrl: FormControl;
  filteredTracks: Observable<any[]>;
  constructor(private _sideNavService: SideNavService, private _trackService: TrackService, private _player: PlayerComponent) {

  }

  ngOnInit()
  {
    console.log(this.tracks.length);
    this.stateCtrl = new FormControl();
    this.filteredTracks = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => state ? this.filterTracks(state) : this.tracks.slice())
    );
    this.subscription = this._trackService.trackListChange.subscribe((value) => {
      let trackList = [];
      let recievedObject = value;
      for (let i = 0; i < recievedObject.length; i++) {
        let tempStr = recievedObject[i].file;
        console.log('tempstr',value)
        let sym = tempStr.lastIndexOf('/');
        console.log(sym);
        tempStr = tempStr.substring(sym + 1);
        trackList.push({ id: recievedObject[i].id, trackName: tempStr });
        console.log("show id",recievedObject[i].id)
        
      }
      this.tracks = trackList;
      console.log(trackList);
    });
  }

  private filterTracks(name: string) {
    return this.tracks.filter(track =>
      track.trackName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  ngAfterViewInit() {
    this._sideNavService.setSideNav(this.sidenav);
  }

  playCurrent(id: number){
    console.log(id);
    this._player.stopSong()
    this._trackService.changeNextIndex(id);
    this._player.playPause();
    this.close(this.reason);
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}

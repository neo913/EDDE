import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import * as library  from '../../assets/library'

interface ModifiedRect {
  id: string,
  height: number,
  width: number,
  y: number,
  top: number,
  bottom: number
}
interface History {
  company: string,
  logoUrl: string,
  position: string,
  period: string,
  description: string
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  windowHeight = 0;
  windowWidth = 0;
  pages: ModifiedRect[] = [];
  wakeUptime = 0;
  direction = '';
  lastY = 0;
  down = 0;
  up = 0;
  historyText: History[] = [];

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private router: Router ) {
    this.accordion = new MatAccordion;
  }

  ngOnInit(): void {
    this.sizeInit();
    this.pageInit();
    this.accordianInit();
  }

  sizeInit() {
    // responsive
    this.windowHeight = document.body.clientHeight;
    this.windowWidth = document.body.clientWidth;
  }

  accordianInit() {
    this.historyText = new Array<History>();
    this.historyText = library.workHistories;
  }

  pageInit() {
    const containers = document.getElementsByClassName('container');
    this.pages = new Array<ModifiedRect>(containers.length);
    for(let i=0; i< containers.length; i++) {
      let page = containers[i].getBoundingClientRect();
      this.pages[i] = {
        id: containers[i].id,
        height: page.height,
        width: page.width,
        y: page.y,
        top: page.top,
        bottom: page.bottom
      };
    }
  }

  /* Getting current tag */
  getTag() {
    let url = this.router.url;
    let urlArr = url.split('#');
    let tag = urlArr[1]? urlArr[1]: '';
    if(tag == '') { tag = 'home'; }
    return tag;
  }

  scroller(id: string) {
    if(id == 'up') {
      if(this.getTag() != this.pages[0].id) {
        location.hash = '#' + this.pages[this.pages.findIndex(p => p.id == this.getTag()) - 1].id;
      }
    } else if(id == 'down') { 
      if(this.getTag() != this.pages[this.pages.length-1].id) {
        location.hash = '#' + this.pages[this.pages.findIndex(p => p.id == this.getTag()) + 1].id;
      }
    } else {
      location.hash = '#'+id; 
    }
  }

  getDirection() {
    let st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    st > this.lastY? this.down++ : this.up++ ;
    this.lastY = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    //console.log(this.direction);
  }

  @HostListener('mousewheel', ['$event'])
  // @HostListener('touchmove', ['$event'])
  wheelManager(event: WheelEvent) {
  // wheelManager(event: Event) { // for scroll event
    
  let targetOn = <HTMLElement>(event.target || event.currentTarget);
    if(targetOn.id == '') { return; } // stop auto-scroll on other div
    
    // this.getDirection(); // for scroll event
    event.deltaY > 0? this.down++ : this.up++; // for mousewheel event

    if((this.down + this.up) > 5) { // logic go figure out where user mean to scroll
      this.down > this.up? this.direction = "down": this.direction = "up";
      if(this.wakeUptime > Date.now()) {  // still sleeping
        event.stopPropagation();
        // event.preventDefault();
        return;
      } else { 
        this.wakeUptime = Date.now() + 1000;
        this.scroller(this.direction);
        this.down = 0;  // down init
        this.up = 0;    // up init
      }
    } else {
      event.stopPropagation();
      // event.preventDefault();
      return;
    }
  }

}

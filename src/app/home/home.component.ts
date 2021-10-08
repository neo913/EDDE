import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { aboutText } from '../../assets/library';

interface ModifiedRect {
  id: string,
  height: number,
  width: number,
  y: number
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  aboutText = aboutText;
  windowHeight = 0;
  windowWidth = 0;
  pages: ModifiedRect[] = [];
  wakeUptime = 0;
  direction = '';
  lastY = 0;

  constructor(private router: Router, private viewportScroller: ViewportScroller) {
  }

  ngOnInit(): void {
    this.sizeInit();
    this.pageInit();
  }

  sizeInit() {
    // responsive
    this.windowHeight = document.body.clientHeight;
    this.windowWidth = document.body.clientWidth;
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
        y: page.y
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
    st > this.lastY? this.direction = "down": this.direction = "up";
    this.lastY = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    console.log(this.direction);
  }

  @HostListener('mousewheel', ['$event'])
  wheelManager(event: Event) {
    
    this.getDirection();

    if(this.wakeUptime > Date.now()) { 
      return;
    } else { 
      this.wakeUptime = Date.now() + 500;
      this.scroller(this.direction);
    }
  }

}

import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { aboutText } from '../../assets/library';

interface ModifiedRect {
  id: string,
  height: number,
  width: number,
  y: number,
  top: number,
  bottom: number
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
  down = 0;
  up = 0;

  constructor(private router: Router ) {
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
  wheelManager(event: Event) {

    this.getDirection();
    
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

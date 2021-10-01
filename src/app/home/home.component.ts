import { Component, HostListener, OnInit } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { aboutText } from '../../assets/library';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  currentPosition = window.pageYOffset;
  aboutText = aboutText;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /* Getting current tag */
  getTag() {
    let url = this.router.url;
    let urlArr = url.split('#');
    return urlArr[1]? urlArr[1]: '';
  }

  /* Scroll to specific element */
  scrollTo(direction: string) {
    console.log(direction);
    let target = '';
    if(direction == 'down'){
      switch (this.getTag()) {
        case 'home'   : target = "about"; break;
        case 'about'  : target = "contact"; break;
        case 'contact': target = "contact"; break;
        default : target = "about"; break;
      }
    } else if(direction == 'up') {
      switch (this.getTag()) {
        case 'home'   : target = "home"; break;
        case 'about'  : target = "home"; break;
        case 'contact': target = "about"; break;
        default : target = "home"; break;
      }
    } else if(direction == 'cur') {
      target = this.getTag();
    }

    // const debouncer = Date.now() + 2000;
    // if(!this.scrolledTime || this.scrolledTime > debouncer) {
    //   this.scrolledTime = Date.now();
    // }
    // console.log(this.scrolledTime , debouncer, debouncer - this.scrolledTime);
    // if(this.scrolledTime > debouncer) {
    //   return ;
    // }
    // console.log(1);
    // this.scrolledTime = Date.now();
    
    this.router.navigate(['/Home'], { fragment: target });
    let el = document.getElementById(target);
    el?.scrollIntoView({behavior:'smooth'});
    // this.sleep(1000);
  }

  sleep(ms: number) {
    const wakeUpTime = Date.now() + ms;
    while(Date.now() < wakeUpTime) { }
  }

  scrolledTime = Date.now();
  wakeUpTime = Date.now();

  @HostListener('window:scroll', ['$event'])
  scrolled(e:any) {
    console.log(this.scrolledTime, this.wakeUpTime, this.scrolledTime < this.wakeUpTime)
    // while(this.scrolledTime < this.wakeUpTime) {
    //   this.scrolledTime = Date.now();
    //   this.scrollTo('cur');
    // }

    let scroll = e.target.scrollingElement.scrollTop;
    console.log(scroll, this.currentPosition, scroll > this.currentPosition);
    if (scroll > this.currentPosition) { // scroll down
      // console.log('down');
      this.scrollTo('down');
    } else { // scroll up
      // console.log('up');
      this.scrollTo('up');
    }
    this.currentPosition = scroll;

    this.scrolledTime = Date.now();
    this.wakeUpTime = this.scrolledTime + 3000;
  }
  
}

import { AfterViewInit, Component, Host, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { aboutText } from '../../assets/library';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  aboutText = aboutText;
  windowHeight = 0;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.windowHeight = document.body.clientHeight; // responsive
  }

  /* Getting current tag */
  getTag() {
    let url = this.router.url;
    let urlArr = url.split('#');
    return urlArr[1]? urlArr[1]: '';
  }

  scrollInto(target: string) {
    this.router.navigate(['/Home'], {fragment: target});
    target = '#' + target;
    document.querySelector(target)?.scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  @HostListener('window:scroll', ['$event'])
  scrollManager(event: Event) {

    const home = document.querySelector('#home')?.getBoundingClientRect();
    const about = document.querySelector('#about')?.getBoundingClientRect();
    const skills = document.querySelector('#skills')?.getBoundingClientRect();
    const works = document.querySelector('#works')?.getBoundingClientRect();
    
    let target = "";
    let margin = this.windowHeight * 0.6;

    if(home && about && skills && works) {

      if(Math.abs(home.y) < margin && (this.getTag() != "" && this.getTag() != "home")) {
        target = "home";
      } else if(Math.abs(about.y) < margin && this.getTag() != "about") {
        target = "about";
      } else if(Math.abs(skills.y) < margin && this.getTag() != "skills") {
        target = "skills";
      } else if(Math.abs(works.y) < margin && this.getTag() != "works") {
        target = "works"
      }

      if(target != "") {
        this.scrollInto(target);
      }
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

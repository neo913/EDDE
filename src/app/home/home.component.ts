import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getTag() {
    let url = this.router.url;
    let urlArr = url.split('#');
    return urlArr[1]? urlArr[1]: '';
    
  }
}

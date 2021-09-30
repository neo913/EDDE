import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { aboutText } from '../../assets/library';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  aboutText = aboutText;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getTag() {
    let url = this.router.url;
    let urlArr = url.split('#');
    return urlArr[1]? urlArr[1]: '';
  }
}

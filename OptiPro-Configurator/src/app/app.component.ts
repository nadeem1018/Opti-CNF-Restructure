import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showHeader = false;
  showSidebar = false;
  showFooter = false;
  compactLayout = false;

  public svgFile:string = 'assets/images/svg/svg-sprite.svg';
  public svgVersion:any = "1.00";

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeader = this.activatedRoute.firstChild.snapshot.data.showHeader !== false;
        this.showSidebar = this.activatedRoute.firstChild.snapshot.data.showSidebar !== false;
        this.showFooter = this.activatedRoute.firstChild.snapshot.data.showFooter !== false;        
        this.compactLayout = this.activatedRoute.firstChild.snapshot.data.compactLayout !== false;        
        console.log('Header : ' + this.showHeader);
        console.log('SideBar : ' + this.showSidebar);
        console.log('Footer : ' + this.showFooter);
        console.log('Compact layout is : ' + this.compactLayout);
        if(this.showSidebar){
          document.body.classList.remove("no-sidebar");
        }else{
          document.body.classList.add("no-sidebar");
        }
        if(this.compactLayout){
          document.body.classList.add("compact-layout");
        }else{
          document.body.classList.remove("compact-layout");
        }
        if(this.showHeader){
          document.body.classList.remove("no-header");
          document.body.classList.add("with-header");
        }else{
          document.body.classList.add("no-header");
          document.body.classList.remove("with-header");
        }
      }      
      
    });  
    this.svgSprite();
  }

  svgSprite(){
    console.log("SVG Sprite version : " + this.svgVersion);
    let that = this;
    if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect)
          return true;

      var isLocalStorage = 'localStorage' in window && window['localStorage'] !== null,
          request,
          data,
          insertIT = function () {
              document.body.insertAdjacentHTML('afterbegin', data);
          },
          insert = function () {
              if (document.body) insertIT();
              else document.addEventListener('DOMContentLoaded', insertIT);
          };

      if (isLocalStorage && (localStorage.getItem('inlineSVGrev') == that.svgVersion)) {
          data = localStorage.getItem('inlineSVGdata');
          if (data) {
              insert();
              return true;
          }
      }

      try {
          request = new XMLHttpRequest();
          request.open('GET', that.svgFile, true);
          request.onload = function () {
              if (request.status >= 200 && request.status < 400) {
                  data = request.responseText;
                  insert();
                  if (isLocalStorage) {
                      localStorage.setItem('inlineSVGdata', data);
                      localStorage.setItem('inlineSVGrev', that.svgVersion);
                  }
              }
          }
          request.send();
      }
      catch (e) { }
    }
}


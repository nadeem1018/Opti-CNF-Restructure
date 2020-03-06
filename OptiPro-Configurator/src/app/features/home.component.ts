import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public config_param = JSON.parse(sessionStorage.system_config);
  public language = JSON.parse(sessionStorage.getItem('current_lang'));
  constructor() {}
  ngOnInit() {}
}


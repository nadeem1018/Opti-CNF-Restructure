import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-dialogs',
  templateUrl: './custom-dialogs.component.html',
  styleUrls: ['./custom-dialogs.component.scss']
})
export class CustomDialogsComponent implements OnInit { 

  @Input() dialogParams:any;
  @Output() userSelectionValue = new EventEmitter();
  public message:any;  
  public dialogOpened = false;
  language = JSON.parse(sessionStorage.getItem('current_lang'));
  public popup_title = this.language.confirm;
  constructor() { }

  public closeDialoge() {
    this.userSelectionValue.emit(false);
    this.dialogOpened = false;
  }

  public openDialoge() {
    this.dialogOpened = true;
  }

  ngOnInit() {
    if(this.dialogParams.length > 0){
      this.message = this.dialogParams[0].message;
      this.open_confirmation_dialog(); 
    }
  }

  //Events
  onOKPress(){
    this.userSelectionValue.emit(true);
    this.close_confirmation_dialog();
  }

  onCancelPress(){
    this.userSelectionValue.emit(false);
    this.close_confirmation_dialog();
  }


  //Core Function 
  //To open the dialog
  open_confirmation_dialog(){
        this.dialogOpened = true;
  }

  //To close the dialog
  close_confirmation_dialog(){
      this.dialogOpened = false;
      this.userSelectionValue.emit("true")
  }
}

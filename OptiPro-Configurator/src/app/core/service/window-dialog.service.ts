import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { CommonData } from '../data/CommonData';
import {
  DialogService,
  DialogRef,
  DialogCloseResult
} from '@progress/kendo-angular-dialog';

@Injectable({
  providedIn: 'root'
})
export class WindowDialogService {

  constructor(private router:Router, private commonservice: CommonService, private dialogService: DialogService) { }
  public result;

  public showConfirmation() {
    const dialog: DialogRef = this.dialogService.open({
        title: 'Please confirm',
        content: 'Are you sure?',
        actions: [
            { text: 'No' },
            { text: 'Yes', primary: true }
        ],
        width: 450,
        height: 200,
        minWidth: 250
    });

    dialog.result.subscribe((result) => {
        if (result instanceof DialogCloseResult) {
            console.log('close');
        } else {
            console.log('action', result);
        }

        this.result = JSON.stringify(result);
    });
}
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { CommonData } from '../data/CommonData';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private router:Router, private commonservice: CommonService) { } 
  confirm(message?: string): Observable<boolean> {
    if(message == ""){
      message = "Unsaved changes will be lost, Do you wish to continue ?";
    }
    const confirmation = window.confirm(message || 'Is it OK?');
    if(confirmation && CommonData.sessionExpire){
      CommonData.made_changes =false;
      this.router.navigateByUrl('/login');
      this.commonservice.RemoveLoggedInUser().subscribe();
      this.commonservice.signOut(this.router, 'Logout');
    } else if(confirmation){
      CommonData.made_changes =false;
    }
    CommonData.sessionExpire =false;
    return of(confirmation);
  };
}

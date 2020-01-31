import { Injectable } from '@angular/core';
import { AppUserSession } from '../model/app-user-session-model';

@Injectable(
    { providedIn: 'root' }
)
export class LocalStorageService {
    private appUserSession: AppUserSession;

    public getCurrentLanguage(): string {

        const session = this.getAppUserSession();
        let currentLang: string = '';
        if (session != undefined && session != null) {
            currentLang = session.Language;
        }
        if (currentLang == null || currentLang == '') {
            currentLang = 'en';
        }
        return currentLang;
    }

    public getAppUserSession(): AppUserSession {

        if (!this.appUserSession) {
            this.appUserSession = JSON.parse(localStorage.getItem("appusersession"));
            if (!this.appUserSession) {
                this.appUserSession = new AppUserSession();
            }
        }
        return this.appUserSession;
    }
}
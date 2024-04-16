import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Languages} from "./languages";

const headers = new Headers();
headers.append('Access-Control-Allow-Headers', 'Content-Type');
headers.append('Access-Control-Allow-Methods', 'GET');
headers.append('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class NgxTranslatekitService {

  private libreTranslateUrl = 'https://translate.fedilab.app/';
  browserLang: any

  constructor(private http: HttpClient) {}

  detectLocale(){
    return navigator.language;
  }

  getDate(){
    return new Date().toLocaleDateString();
  }
  languages(): Observable<Languages[]> {
    const params = new HttpParams()

    return this.http.get(this.libreTranslateUrl + 'languages').pipe(
      map((response: any) => response)
    );
  }

  translate(text: string, targetLanguage: string): Observable<string> {
    const params = new HttpParams()
      .set('q', text)
      .set('source', "auto")
      .set('target', targetLanguage);

    return this.http.post(this.libreTranslateUrl + 'translate', null, { params }).pipe(
      map((response: any) => response.translatedText)
    );
  }
}

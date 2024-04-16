# NgxTranslatekit

“NgxTranslatekit is an essential library for Angular applications, designed to streamline the integration of internationalization, enabling seamless support for multiple languages and regional settings.”

![Static Badge](https://img.shields.io/badge/build-passing-brightgreen)
![GitHub Repo stars](https://img.shields.io/github/stars/raju/ngx-multilingual)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/raju/ngx-multilingual/main)

## Usage

### 1. Install

```
npm install ngx-translatekit --save
```

### 2. Service Integration

Integrate NgxTranslatekitService into your Angular application:

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, takeUntilDestroyed } from "rxjs";
import { Languages } from "./languages";

@Injectable({
  providedIn: 'root'
})
export class NgxTranslatekitService {
  private libreTranslateUrl = 'https://translate.fedilab.app/';

  constructor(private http: HttpClient) {}

  detectLocale(): string {
    return navigator.language;
  }

  getAvailableLanguages(): Observable<Languages[]> {
    return this.http.get<Languages[]>(this.libreTranslateUrl + 'languages');
  }

  translateText(text: string, targetLanguage: string): Observable<string> {
    const params = new HttpParams()
      .set('q', text)
      .set('source', 'auto')
      .set('target', targetLanguage);

    return this.http.post<{ translatedText: string }>(
      this.libreTranslateUrl + 'translate',
      null,
      { params }
    ).pipe(
      map(response => response.translatedText)
    );
  }
}

```

### 3、Component Setup

```typescript
import {
Component,
DestroyRef,
inject,
OnInit,
} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgxTranslatekitService, RtlSupportDirectiveDirective} from 'ngx-translatekit';
import {Languages} from "./languages";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormsModule} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {NgForOf} from "@angular/common";

@Component({
selector: 'app-root',
standalone: true,
imports: [RouterOutlet, FormsModule, NgForOf, RtlSupportDirectiveDirective],
providers: [NgxTranslatekitService],
templateUrl: './app.component.html',
styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
title = 'test-ngx-translatekit';
languages: Languages[] = [];
translatedJson: any = {};
selectedLanguage = 'en';
currentDate: any;
private readonly destroyRef = inject(DestroyRef);
private readonly translationService = inject(NgxTranslatekitService);
private readonly http = inject(HttpClient);

ngOnInit(): void {
this.getLanguages();
this.loadJsonFile();
if (this.translationService.detectLocale() !== undefined) {
this.selectedLanguage = this.translationService.detectLocale().split('-')[0];
this.currentDate = new Date().toLocaleDateString();
console.log(this.currentDate);
}
}

onLanguageChange(selectedLang: string): void {
this.selectedLanguage = selectedLang; // Set the current language
this.loadJsonFile();
}

getLanguages(): void {
this.translationService.languages()
.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe((languages: any) => {
this.languages = languages;
});
}

loadJsonFile() {
this.http.get('assets/content.json', {responseType: 'json'})
.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe(data => {
this.translateJson(data);
}, error => {
console.error('There was an error!', error);
});
}

translateJson(data: any): void {
Object.keys(data).forEach(key => {
this.translationService.translate(data[key], this.selectedLanguage)
.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe(translation => {
this.translatedJson[key] = translation;
});
});
}
}

```

### template

```html
<div libRtlSupportDirective [currentLang]="selectedLanguage" class="container-fluid">
  <header class="row bg-dark">
    <div class="col-md-12 bg-primary text-light py-2">
      <h1 #main_header>{{ translatedJson.header }}</h1>
    </div>
  </header>

  <main   class="row">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
              aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
        </ul>
        <select [(ngModel)]="selectedLanguage" (ngModelChange)="onLanguageChange(selectedLanguage)">
          <option *ngFor="let language of languages" [value]="language.code">{{ language.name }}</option>
        </select>
      </div>
    </nav>
    <div class="col-md-12 col-lg-12 py-3">
      <div class="main-content">
        <div class="card border-primary mb-3">
          <div  class="card-header">{{ currentDate +' ' + translatedJson.header }}</div>
          <div class="card-body text-primary">
            <h5  class="card-title" #title>{{ translatedJson.title }}</h5>
            <p  class="card-text">{{ translatedJson.paragraph }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

#### CSS
You can use this css to support on right-to-left and vice versa
```css
.rtl {
  direction: rtl;
  text-align: start; /* 'start' will align text to the right in RTL mode */
}

/* Other styles to adjust padding, margins, etc., for RTL layout */
.rtl .some-class {
  padding-right: 15px;
  padding-left: 0;
}
```
#### Usage

This is how to use the directive
```html
<div libRtlSupportDirective [currentLang]="selectedLanguage"></div>
```
### 4、RtlSupportDirectiveDirective

```typescript
import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[libRtlSupportDirective]',
  standalone: true
})
export class RtlSupportDirectiveDirective implements OnInit, OnChanges {
  @Input() currentLang = 'en';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.adjustLayoutForRtl();
  }

  ngOnInit(): void {
    console.log('currentLang: ',this.currentLang);
    this.adjustLayoutForRtl()
  }

  ngOnChanges() {
    this.adjustLayoutForRtl(); // React to changes in currentLang
  }

  adjustLayoutForRtl() {
    if (this.isRtlLanguage(this.currentLang)) {
      this.renderer.addClass(this.el.nativeElement, 'rtl');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'rtl');
    }
  }

  isRtlLanguage(lang: string): boolean {
    // Add all RTL languages you want to support
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']; // arabic | hebrew | persian | urdu
    return rtlLanguages.includes(lang);
  }
}

```
The RtlSupportDirectiveDirective is a pivotal feature of the NgxTranslatekit library, designed to enhance the user experience for languages that are read from right to left. This directive dynamically adjusts the layout of an Angular application based on the current language selection, ensuring that text and other elements are correctly aligned for languages such as Arabic, Hebrew, Persian, and Urdu.

Here’s a brief overview of its functionality:

#### Dynamic Layout Adjustment:
It listens for changes in the language and automatically applies the ‘rtl’ class to elements, flipping the layout to match the reading direction of RTL languages.
#### Language Support:
By default, it supports a set of RTL languages but can be easily extended to include more languages as needed.
#### Ease of Use:
With simple input binding, the directive can be applied to any element that requires RTL support, making it a versatile tool for developers.
#### Seamless Integration:
As a standalone directive, it can be imported and used independently, allowing for modular and clean code architecture.

### 5、Content to translate
This is the JSON file to translate

```json
{
    "header": "Ngx-TranslateKit Library",
    "title": "Ngx-TranslateKit Library for developers",
    "paragraph": "Ngx-TranslateKit is a comprehensive library for Angular applications that facilitates internationalization by allowing developers to easily translate their apps into multiple languages. It provides a powerful translation service, along with a pipe and directive, to manage translations and dynamically load language files from the server. The library supports Angular’s modular architecture, enabling developers to import it in the root module with TranslateModule.forRoot() for application-wide usage or in feature modules using TranslateModule.forChild(). With ngx-translatekit, developers can enhance their applications’ global reach by providing a localized user experience"
}

```

### 6、DOM
This is how the translated page will look like:
# Translator
Microservice architecture is a very popular approach in designing and implementing highly scalable web applications. Communication within a monolithic application between components is usually based on method or function calls within the same process. A microservices‑based application, on the other hand, is a distributed system running on multiple machines.

# Translated Section {Persian [ fa ]}

```jade
Ngx-Translate کتابخانه کیت برای توسعه دهندگان
Ngx-Translate کیت یک کتابخانه جامع برای برنامه های Angular است که تسهیل بین المللی سازی با اجازه دادن به توسعه دهندگان به راحتی ترجمه برنامه های خود را به چندین زبان است. این یک سرویس ترجمه قدرتمند، همراه با یک لوله و دستورالعمل، برای مدیریت ترجمه ها و فایل های زبان به طور پویا بارگذاری از سرور فراهم می کند. کتابخانه از معماری مدولار Angular پشتیبانی می کند، توسعه دهندگان را قادر می سازد تا آن را در ماژول ریشه با TranslateModule.ForRoot() برای استفاده در سراسر برنامه یا ماژول های ویژگی با استفاده از TranslateModule.forChild وارد کنند. با ngx-Translatekit، توسعه دهندگان می توانند دسترسی جهانی برنامه های خود را با ارائه یک تجربه کاربری محلی افزایش دهند
```

Supported Languages
English [ en ]

Arabic [ ar ]

Azerbaijani [ az ]

Catalan [ ca ]

Chinese [ zh ]

Czech [ cs ]

Danish [ da ]

Dutch [ nl ]

Esperanto [ eo ]

Finnish [ fi ]

French [ fr ]

German [ de ]

Greek [ el ]

Hebrew [ he ]

Hindi [ hi ]

Hungarian [ hu ]

Indonesian [ id ]

Irish [ ga ]

Italian [ it ]

Japanese [ ja ]

Korean [ ko ]

Persian [ fa ]

Polish [ pl ]

Portuguese [ pt ]

Russian [ ru ]

Slovak [ sk ]

Spanish [ es ]

Swedish [ sv ]

Thai [ th ]

Turkish [ tr ]

Ukranian [ uk ]

Vietnamese [ vi ]



## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/raju/ngx-translatekit/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/raju/ngx-translatekit/blob/main/LICENSE) file for the full text)

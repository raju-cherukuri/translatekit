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
      this.currentDate = this.translationService.getDate();
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

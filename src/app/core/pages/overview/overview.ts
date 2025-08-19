import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Layout } from '@core/layout/layout';
import { FormWrapper } from '@shared/form-wrapper/form-wrapper';
import { Form } from '@features/form/form';
import { v4 as uuidv4 } from 'uuid';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UrlListService } from '@shared/services/urllistitem/urllistitem';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

export interface urlListItem {
  url: string;
  id: string;
}

@Component({
  selector: 'app-overview',
  imports: [Layout, FormWrapper, Form, MatListModule, MatButtonModule, MatIconModule],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  newUrl = signal<urlListItem>({ url: '', id: '' });
  urlList: WritableSignal<urlListItem[]> = signal([]);
  urlAlreadyExists = signal(false);
  private urlListService = inject(UrlListService);

  constructor(private router: Router) {}

  ngOnInit() {
    // this.loadState();
    this.urlListService.loadState();
    this.urlListService.getUrlList().forEach((item) => {
      this.urlList.update((list) => [...list, item]);
    });
    // this.urlListService.getUrlList().forEach((item))
    // this.urlListService.getNewUrl();
    // this.urlListService.urlList = this.urlList();
    // this.urlListService.newUrl = this.newUrl();
  }

  // loadState() {
  //   const savedList = localStorage.getItem('urlList');
  //   const savedListItem = localStorage.getItem('newUrl');
  //   if (savedList) {
  //     this.urlList.set(JSON.parse(savedList));
  //   }
  //   if (savedListItem) {
  //     this.newUrl.set(JSON.parse(savedListItem));
  //   }
  // }

  async checkUrlWorks(testUrl: any): Promise<boolean> {
    try {
      const url = new URL(testUrl);
      // Basic format validation, bit of a double-up with the built in Angular forms regex validation
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
      }
      // Basic fetch test with HEAD request
      const response = await fetch(url.href, {
        method: 'HEAD',
        mode: 'no-cors', //Bypass CORS but we won't get status code
      });
      // If we reach here without error, URL is likely valid
      return true;
    } catch (error) {
      // URL parsing failed or network error
      console.log('URL validation failed:', error);
      return false;
    }
  }

  async handleSubmit(addedUrl: string) {
    let myuuid = uuidv4();
    this.newUrl.set({ url: addedUrl, id: myuuid });
    let currentList = [...this.urlList()];

    let checkUrlPreviouslyAdded = currentList.some((obj) => obj.url === addedUrl);
    if (addedUrl && (await this.checkUrlWorks(addedUrl))) {
      if (checkUrlPreviouslyAdded) {
        console.log('url already exists');
        this.urlAlreadyExists.set(true);
        return;
      } else {
        currentList.push(this.newUrl());
        this.urlList.set([...currentList]);

        this.urlListService.urlList = this.urlList();
        this.urlListService.newUrl = this.newUrl();

        localStorage.setItem('newUrl', JSON.stringify(this.newUrl()));
        localStorage.setItem('urlList', JSON.stringify(this.urlList()));
        console.log('current list: ', this.urlList());
        this.router.navigate(['/results']);
      }
    }
  }

  deleteUrl(id: string): void {
    console.log('id: ', id);
    let currentList = [...this.urlList()];
    if (id) {
      currentList = currentList.filter((item) => item.id !== id);
      this.urlList.set([...currentList]);
    }
  }
}

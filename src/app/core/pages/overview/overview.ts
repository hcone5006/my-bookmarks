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
    this.loadState();
  }

  loadState() {
    const savedList = localStorage.getItem('urlList');
    const savedListItem = localStorage.getItem('newUrl');
    if (savedList) {
      this.urlList.set(JSON.parse(savedList));
    }
    if (savedListItem) {
      this.newUrl.set(JSON.parse(savedListItem));
    }
  }

  handleSubmit(addedUrl: string) {
    let myuuid = uuidv4();
    this.newUrl.set({ url: addedUrl, id: myuuid });
    let currentList = [...this.urlList()];

    let checkUrlExists = currentList.some((obj) => obj.url === addedUrl);
    if (addedUrl) {
      if (checkUrlExists) {
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

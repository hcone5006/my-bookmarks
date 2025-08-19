import { Component, signal, WritableSignal } from '@angular/core';
import { Layout } from '@core/layout/layout';
import { FormWrapper } from '@shared/form-wrapper/form-wrapper';
import { Form } from '@features/form/form';
import { v4 as uuidv4 } from 'uuid';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface urlListItem {
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
  childUrl = signal<urlListItem>({ url: '', id: '' });
  urlList: WritableSignal<urlListItem[]> = signal([]);
  urlAlreadyExists = signal(false);

  handleSubmit(addedUrl: string) {
    let myuuid = uuidv4();
    this.childUrl.set({ url: addedUrl, id: myuuid });
    let currentList = [...this.urlList()];
    console.log('Child URL:', this.childUrl());

    let checkUrlExists = currentList.some((obj) => obj.url === addedUrl);
    if (addedUrl) {
      if (checkUrlExists) {
        console.log('url already exists');
        this.urlAlreadyExists.set(true);
        return;
      } else {
        currentList.push(this.childUrl());
        this.urlList.set([...currentList]);
        console.log('current list: ', this.urlList());
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

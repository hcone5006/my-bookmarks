import { Component, inject, signal, WritableSignal, computed } from '@angular/core';
import { Layout } from '@core/layout/layout';
import { FormWrapper } from '@shared/form-wrapper/form-wrapper';
import { Form } from '@features/form/form';
import { v4 as uuidv4 } from 'uuid';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UrlListService } from '@shared/services/urllistitem/urllistitem';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';

export interface urlListItem {
  url: string;
  id: string;
}

@Component({
  selector: 'app-overview',
  imports: [
    Layout,
    FormWrapper,
    Form,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  newUrl = signal<urlListItem>({ url: '', id: '' });
  urlList: WritableSignal<urlListItem[]> = signal([]); //urlList needs to be writable, create an empty array
  urlAlreadyExists = signal(false); // Set value to check if url was previously added
  private urlListService = inject(UrlListService); // Inject service to access urlList and newUrl
  numberOfUrls = signal(0); // Signal to track number of URLs
  pageIndex = signal(0); // Current page index for pagination
  pageSize = signal(20); // Number of items per page for pagination

  // Set up computed signal that will show correct paginated items
  // todo: consider saving pagesize to localstorage so if the user changes the page size, it persists when they come back to the Overview page
  paginatedUrls = computed(() => {
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.urlList().slice(startIndex, endIndex);
  });

  constructor(private router: Router) {}

  ngOnInit() {
    this.urlListService.loadState(); // if list has items, load them on init
    this.urlListService.getUrlList().forEach((item) => {
      // Populate urlList if there are items saved in localStorage
      this.urlList.update((list) => [...list, item]);
    });

    this.setNumberOfUrls();
  }

  // Test url is valid by checking protocol is valud and if HEAD can be fetched
  async checkUrlWorks(testUrl: any): Promise<boolean> {
    try {
      const url = new URL(testUrl);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
      }
      const response = await fetch(url.href, {
        method: 'HEAD',
        mode: 'no-cors',
      });
      return true;
    } catch (error) {
      console.log('URL validation failed:', error);
      return false;
    }
  }

  setNumberOfUrls() {
    if (this.urlList().length > 0) {
      this.numberOfUrls.set(this.urlList().length);
    } else {
      return;
    }
  }

  updateUrlListService() {
    this.urlListService.urlList = this.urlList();
    this.urlListService.newUrl = this.newUrl();

    localStorage.setItem('newUrl', JSON.stringify(this.newUrl()));
    localStorage.setItem('urlList', JSON.stringify(this.urlList()));
  }

  // Handle form submission... add new url and update the list, save to localStorage
  async handleSubmit(addedUrl: string) {
    let myuuid = uuidv4();
    this.newUrl.set({ url: addedUrl, id: myuuid }); // set personal key for each list item
    let currentList = [...this.urlList()];

    let checkUrlPreviouslyAdded = currentList.some((obj) => obj.url === addedUrl);
    if (addedUrl && (await this.checkUrlWorks(addedUrl))) {
      if (checkUrlPreviouslyAdded) {
        alert('url already exists');
        this.urlAlreadyExists.set(true);
        return;
      } else {
        currentList.push(this.newUrl());
        this.urlList.set([...currentList]);

        this.updateUrlListService(); // update service with new url and list
        this.setNumberOfUrls(); // update total number of urls for paginator
        this.router.navigate(['/results']); // navigate to results page upon successful submission
      }
    }
  }

  // Delete url from list and update list in localStorage
  deleteUrl(id: string): void {
    console.log('id: ', id);
    let currentList = [...this.urlList()];
    if (id) {
      currentList = currentList.filter((item) => item.id !== id);
      this.urlList.set([...currentList]);
    }
  }

  // Handle page change event from paginator
  onPageChange(event: any): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}

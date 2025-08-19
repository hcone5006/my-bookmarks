import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

// Service to manage URL list items and new URL
// This service handles the URL list and the new URL being added, including saving to and loading localStorage
export class UrlListService {
  public urlList: { url: string; id: string }[] = [];
  public newUrl: { url: string; id: string } = { url: '', id: '' };

  constructor() {
    this.loadState();
  }

  public loadState() {
    const savedList = localStorage.getItem('urlList');
    const savedListItem = localStorage.getItem('newUrl');
    if (savedList) {
      this.urlList = JSON.parse(savedList);
    }
    if (savedListItem) {
      this.newUrl = JSON.parse(savedListItem);
    }
  }

  getUrlList() {
    return this.urlList;
  }

  getNewUrl() {
    return this.newUrl;
  }
}

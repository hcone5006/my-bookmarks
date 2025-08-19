import { Component, inject } from '@angular/core';
import { Layout } from '@core/layout/layout';
import { UrlListService } from '@shared/services/urllistitem/urllistitem';
import { urlListItem } from '@core/pages/overview/overview';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-results',
  imports: [Layout, MatButtonModule, MatIconModule],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  updatedUrl?: urlListItem;
  private urlListService = inject(UrlListService);
  newUrl = this.urlListService.getNewUrl();

  ngOnInit(): void {
    this.updatedUrl = this.urlListService.getNewUrl();
  }
}

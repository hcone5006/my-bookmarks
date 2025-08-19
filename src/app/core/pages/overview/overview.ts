import { Component, signal } from '@angular/core';
import { Layout } from '@core/layout/layout';
import { FormWrapper } from "@shared/form-wrapper/form-wrapper";
import { Form } from "@features/form/form";

@Component({
  selector: 'app-overview',
  imports: [Layout, FormWrapper, Form],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  childUrl = signal('');

  handleSubmit(url: string) {
    this.childUrl.set(url);
    console.log('Child URL:', this.childUrl());
  }
}

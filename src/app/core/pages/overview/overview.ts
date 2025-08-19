import { Component } from '@angular/core';
import { Layout } from '@core/layout/layout';
// import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormWrapper } from "@shared/form-wrapper/form-wrapper";
import { Form } from "@features/form/form";
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-overview',
  imports: [Layout, FormWrapper, Form],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  // url = new FormControl('');

}

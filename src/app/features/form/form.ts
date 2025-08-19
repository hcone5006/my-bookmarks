import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './form.html',
  styleUrl: './form.scss'
})
export class Form {
  // favUrl = new FormControl('');
  errorMessage = signal('');

  favUrlForm = new FormGroup({
    favUrl: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
  });

  constructor() {
    const favUrlControl = this.favUrlForm.get('favUrl');
    if (favUrlControl) {
      merge(
        favUrlControl.valueChanges,
        this.favUrlForm.statusChanges
      ).subscribe(() => {
        if (favUrlControl.hasError('required')) {
          this.errorMessage.set('URL is required');
        } else if (favUrlControl.hasError('pattern')) {
          this.errorMessage.set('Please enter a valid URL starting with http:// or https://');
        } else {
          this.errorMessage.set('');
        }
      });
    }
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.favUrlForm.value);
  }
}

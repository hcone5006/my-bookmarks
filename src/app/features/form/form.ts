import { Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})

// Form component lives in feature instead of shared as it's tightly coupled with application logic. 
// TODO: Should update naming convention as the component name sounds like it would be reusable/extendable, but for now it's only set up to handle capturing a url and emiting the value.
export class Form {
  errorMessage = signal('');

  // Output event to send the current URL back to the parent component
  currentURLEvent = output<string>();

  // bit of a double-up on checking URL protocol is correct, but this method is using Angular/forms built-in validation, which helps us display error messaging for the user
  // not 100% accurate pattern recognition using this regex but something we could try improving later... 
  // setup for using Reactive Forms 
  favUrlForm = new FormGroup({
    favUrl: new FormControl('', [
      Validators.required,
      Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'),
    ]),
  });

  constructor() {
    // set up some error messaging for form control field so the user can see what they need to do
    const favUrlControl = this.favUrlForm.get('favUrl');
    if (favUrlControl) {
      merge(favUrlControl.valueChanges, this.favUrlForm.statusChanges).subscribe(() => {
        if (favUrlControl.hasError('required')) {
          this.errorMessage.set('URL is required');
        } else if (favUrlControl.hasError('pattern')) {
          this.errorMessage.set(
            'Please enter a valid URL starting with http:// or https:// and including the domain name.'
          );
        } else {
          this.errorMessage.set('');
        }
      });
    }
  }

  // emit current url if form is valid, then clear the form
  onSubmit() {
    if (this.favUrlForm.valid) {
      this.currentURLEvent.emit(this.favUrlForm.get('favUrl')?.value || '');
      this.favUrlForm.reset();
    }
  }
}

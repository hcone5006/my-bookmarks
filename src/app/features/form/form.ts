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
  styleUrl: './form.scss'
})
export class Form {
  errorMessage = signal('');

  currentURLEvent = output<string>();

  favUrlForm = new FormGroup({
    favUrl: new FormControl('', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
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
          this.errorMessage.set('Please enter a valid URL starting with http:// or https:// and including the domain name.');
        } else {
          this.errorMessage.set('');
        }
      });
    }
  }

  onSubmit() {
    console.log(this.favUrlForm.value);
    
    if(this.favUrlForm.valid) {
      this.currentURLEvent.emit(this.favUrlForm.get('favUrl')?.value || '');
    }
    
  }
}

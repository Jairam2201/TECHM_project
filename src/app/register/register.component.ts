import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], // Ensure ReactiveFormsModule is included
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  passwordMismatch = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // Getter for accessing form controls easily in the template
  get f() {
    return this.registerForm.controls;
  }

  // This method will be called on form submission
  onSubmit() {
    this.submitted = true;

    // Log form validity and control values for debugging
    console.log("Form validity: ", this.registerForm.valid);
    console.log("Form controls values: ", this.registerForm.value);
    console.log("Form controls status: ", this.registerForm.controls);

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      console.log("Form is invalid. Please check individual fields.");
      return;
    }

    // Accessing form values using 'key' notation
    const { username, email, password, confirmPassword } = this.registerForm.value;
    console.log('Register form data:', { username, email, password });

    // Check if passwords match
    if (password !== confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    // Call register API
    this.authService.register({ username, email, password }).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);
        this.authService.storeUserData(res.token, res.username, res.role);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('Registration failed. Please try again!');
      }
    });
  }
}

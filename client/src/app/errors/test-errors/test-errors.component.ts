import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})

export class TestErrorsComponent implements OnInit {
  baseUrl = environment.apiUrl;
  validatioErrors:string[] = []; 
  showSpinner:boolean = false;

  constructor(private http:HttpClient, private spinnerService:NgxSpinnerService) { }

  ngOnInit(): void {
  }

  get404Error()
  {
    this.http.get(this.baseUrl + 'buggy/not-found')
    .subscribe({
      next: (r) => console.log(r),
      error: (e) => console.log(e)
    });
  }

  get400Error()
  {
    this.http.get(this.baseUrl + 'buggy/bad-request')
    .subscribe({
      next: (r) => console.log(r),
      error: (e) => console.log(e)
    });
  }

  get500Error()
  {
    this.http.get(this.baseUrl + 'buggy/server-error')
    .subscribe({
      next: (r) => console.log(r),
      error: (e) => console.log(e)
    });
  }

  get401Error()
  {
    this.http.get(this.baseUrl + 'buggy/auth')
    .subscribe({
      next: (r) => console.log(r),
      error: (e) => console.log(e)
    });
  }

  get400ValidationError()
  {
    this.http.post(this.baseUrl + 'account/register', {})
    .subscribe({
      next: (r) => {console.log(r);},
      error: (e) => {console.log(e);
      this.validatioErrors = e;}
    });
  }

  loadSpinner() {
    this.showSpinner = true;
    this.spinnerService.show();

    setTimeout(() => {
      this.spinnerService.hide();
      this.showSpinner = false;
    }, 2000);
  }

} 

import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  textAreaUpdate = new Subject<string>();
  name: any;
  viewerNames: any;
  oldUser = false;
  textArea: any;
  baseUrl = ' https://google-doc-api.herokuapp.com'

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.textAreaUpdate.pipe(
      debounceTime(5000),
      distinctUntilChanged())
      .subscribe(value => {
        if (value.length > 0) {
          this.change();
        }
      });
  }

  change() {
    this.getText();
    this.getApiCall(basUrl+'/view').then(res => {
      this.viewerNames = Object(res).name;
    })
  }

  getApiCall(apiUrl): Promise<void | object> {
    const token = localStorage.getItem('user');
    let httpOptions;
    if (token !== null) {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'user': token
        })
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    }

    return this.http.get(apiUrl, httpOptions).toPromise().then(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  save() {
    localStorage.setItem('user', this.name);
    this.oldUser = true;
    this.change();
  }

  saveText() {
    this.getApiCall(baseUrl + '/save?txt='+this.textArea);
  }

  getText() {
    this.getApiCall(baseUrl + '/getText').then(res => {
      this.textArea = Object(res).text.content;
    });
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.oldUser = true;
      this.change();
    }
    this.getText();
  }
}

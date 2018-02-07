import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Aww Pics Search Engine';
  searchString: String;
  searchSubject$ = new Subject<string>();
  results$: Observable<any>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.results$ = this.searchSubject$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(searchString => console.log(searchString))
      .switchMap(searchString => this.queryAPI(searchString));
  }

  queryAPI(searchString) {
    return this.http.get(`https://www.reddit.com/r/aww/search.json?q=${searchString}`)
      .map(result => result['data']['children']);
  }

  onSearchStringChange($event) {
    console.log('Search String Change:', $event);
    this.searchSubject$.next($event);
  }

  /**
   * Simple url validator function.
   * @param $url
   * @returns {boolean}
   */
  validateUrl($url) {
    return $url.search('http') === 0; // url starts with http:// or https://
  }

}

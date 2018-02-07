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
export class AppComponent implements OnInit {
  title = 'Aww Pics Search Engine';
  searchString: String;
  searchSortBy: String = 'new';
  searchLimit: Number = 100;
  searchSubject$ = new Subject<any>();
  results$: Observable<any>;
  notFound = false;
  searching = false;

  // Live user feedback of fetching data

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.results$ = this.searchSubject$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(params => console.log(params))
      .switchMap(params => this.queryAPI(params));
  }

  /**
   * Retrieve posts from Reddit api.
   * @param searchString
   * @returns {Observable<any[]>}
   */
  queryAPI(params) {
    this.searching = true;
    this.notFound = false;
    return this.http.get(`https://www.reddit.com/r/aww/search.json` +
    `?q=${encodeURIComponent(params.q)}&limit=${params.limit}&sort=${params.sort}`)
      .map(result => {

        const finalResult = []; // valid data that has thumbnail only
        result['data']['children'].forEach((item, index) => {

          if (this.validateUrl(item.data.thumbnail)) {
            finalResult.push(item);
          }

        });

        this.searching = false; // setting to false so, our searching gif disappear

        return finalResult;
      })
      .do(result => {
        console.log(result);
        if (result.length > 0) {
          this.notFound = false;
        } else {
          this.notFound = true;
        }

      });
  }

  onSearchStringChange($event) {
    if ($event) {
      this.searchSubject$.next({
        q: $event,
        sort: this.searchSortBy,
        limit: this.searchLimit
      });
    }
  }

  onSearchSortChange($event) {
    if ($event && this.searchString) {
      this.searchSubject$.next({
        q: this.searchString,
        sort: $event,
        limit: this.searchLimit
      });
    }
  }

  onSearchLimitChange($event) {
    if ($event && this.searchString) {
      this.searchSubject$.next({
        q: this.searchString,
        sort: this.searchSortBy,
        limit: $event
      });
    }
  }

  /**
   * Simple url validator function. return true when valid otherwise false
   * @param $url
   * @returns {boolean}
   */
  validateUrl($url) {
    return $url.search('http') === 0; // url starts with http:// or https://
  }
}

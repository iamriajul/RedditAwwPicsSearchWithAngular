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
  notFound = false;
  searching = false; // Live user feedback of fetching data

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.results$ = this.searchSubject$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(searchString => console.log(searchString))
      .switchMap(searchString => this.queryAPI(searchString));
  }

  /**
   * Retrieve posts from Reddit api.
   * @param searchString
   * @returns {Observable<any[]>}
   */
  queryAPI(searchString) {
    this.searching = true;
    this.notFound = false;
    return this.http.get(`https://www.reddit.com/r/aww/search.json?q=${searchString}&limit=100&sort=new`)
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
    console.log('Search String Change:', $event);
    if ($event) {
      this.searchSubject$.next($event);
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

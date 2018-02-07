import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Aww Pics Search Engine';
  searchString  = 'Cat';
  results$: Observable<any>;

  ngOnInit() {

  }

  onSearchStringChange($event) {
    console.log(this.searchString);
  }
}

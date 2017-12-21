import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnInit {

  @Input() busy:boolean;
  @Input() message:string;

  constructor() { }

  ngOnInit() {
  }

}

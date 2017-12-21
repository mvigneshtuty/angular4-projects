import { Component, Input } from '@angular/core'

@Component({
  selector: 'spinner',
  templateUrl: 'src/spinner/spinner.component.html',
  styleUrls: ['src/spinner/spinner.component.css']
})
export class SpinnerComponent {
  @Input() busy:boolean;
  @Input() message:string;
}
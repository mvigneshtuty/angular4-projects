//our root app component
import {Component, NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {SpinnerComponent} from './spinner/spinner.component'

@Component({
  selector: 'my-app',
  template: `
    <div id="main-container">
      <h1>Spinner demo</h1>
      <div class="button-row">
        <button class="button" (click)="onClick()">Change spinner spates</button>
      </div>
      <spinner [busy]="isSpinnerActive" message="loading...">
        <div class="container">
          <div class="column">
            <h2>First paragraph</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum eu ante a lacinia. Aenean scelerisque id lectus vestibulum commodo. Ut nibh velit, hendrerit eget lobortis elementum, pellentesque vel nisi. Nulla ipsum risus, laoreet ut ex bibendum, mattis pretium lectus. Maecenas at ligula iaculis, condimentum augue ut, porttitor nisi.</p>
          </div>
          <div class="column">
            <h2>Second paragraph</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum eu ante a lacinia. Aenean scelerisque id lectus vestibulum commodo. Ut nibh velit, hendrerit eget lobortis elementum, pellentesque vel nisi. Nulla ipsum risus, laoreet ut ex bibendum, mattis pretium lectus. Maecenas at ligula iaculis, condimentum augue ut, porttitor nisi.</p>
          </div>
        </div>
      </spinner>
      <h2>The overlay adjusts to different sizes as well</h2>
      <spinner [busy]="isSpinnerActive" message="loading...">
        <div id="list-container">
            <h3>Best ingredients</h3>
            <ul>
              <li>Potato</li>
              <li>Cucumber</li>
              <li>Carrot</li>
              <li>Beer</li>
            </ul>
        </div>
      </spinner>
    </div>
  `,
})
export class AppComponent {
  
  private isSpinnerActive:boolean:
  private name:string;
  
  constructor() {
    this.name = 'Angular2'
  }
  
  public onClick(event) {
    this.isSpinnerActive = !this.isSpinnerActive;
  }
}

@NgModule({
  imports: [ 
    BrowserModule 
  ],
  declarations: [ 
    AppComponent,
    SpinnerComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
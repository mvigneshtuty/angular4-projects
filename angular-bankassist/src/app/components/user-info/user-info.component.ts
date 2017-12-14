import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {User} from '../../types/user';
import { DynamodbService } from '../../services/dynamodb.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserInfoComponent implements OnInit {

  @Input() user: User;

  constructor(private dbservice: DynamodbService) { }

  ngOnInit() {
    this.user={
      id:'',
      name:'',
      password:''
    }
  }

  continue():void{
    console.log('User Id inputted :', this.user.id);
    console.log('AWS credentials configured :', this.dbservice.getAWSCredentials());
    this.dbservice.getUserEnrollmentStatus(this.user.id);
  }
}

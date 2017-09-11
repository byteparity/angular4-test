import 'rxjs/add/operator/finally';

import { Component, OnInit } from '@angular/core';

import { MainServiceService } from '../core/main-service/main-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  command: any;
  link: any;
  element: any;
  isLoading: boolean;
  messageList: Array<any> = [];

  constructor(private mainServiceService: MainServiceService) {}

  ngOnInit() {
  
  }

  getCommand(){
    this.isLoading = true;
    this.mainServiceService.getCommand()
    .finally(() => { this.isLoading = false; })
    .subscribe((command: any) => {
      this.command = command;
      this.isLoading = true;
      if(this.command.payload.command === 'request_link') {
        this.mainServiceService.getLink()
        .finally(() => { this.isLoading = false; })
        .subscribe((link: any) => { 
          this.link = link
          this.link.warnings.length !== 0 ? this.messageList.push(this.link.warnings) : false;
          this.link.errors.length !== 0 ? this.messageList.push(this.link.errors) : false;
        });
      }

      if(this.command.payload.command === 'request_element') {
        this.mainServiceService.getElement()
        .finally(() => { this.isLoading = false; })
        .subscribe((element: any) => { 
          this.element = element
          this.element.warnings.length !== 0 ? this.messageList.push(this.element.warnings) : false;
          this.element.errors.length !== 0 ? this.messageList.push(this.element.errors) : false;
        });
      }
      
     });
  }

  clearData() {
    this.messageList = [];
  }
}

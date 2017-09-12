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

  getCommand() {
    this.isLoading = true;
    this.mainServiceService.getCommand()
    .finally(() => { this.isLoading = false; })
    .subscribe((command: any) => {
      this.command = command;
      // this.setmessageList(command);
      this.isLoading = true;

      if (this.command.payload.command === 'request_link') {
        this.mainServiceService.getLink()
        .finally(() => { this.isLoading = false; })
        .subscribe((link: any) => {
          this.link = link
          this.setmessageList(link);
        }, (error: any) => {
          this.setmessageList(error);
         });
      }

      if (this.command.payload.command === 'request_element') {
        this.mainServiceService.getElement()
        .finally(() => { this.isLoading = false; })
        .subscribe((element: any) => {
          this.element = element
          this.setmessageList(element);
        }, (error: any) => {
          this.setmessageList(error);
         });
      }

      if (this.command.payload.command === 'request_command') {
        this.getCommand();
      }
     }, (error: any) => {
      this.setmessageList(error);
     });
  }

  setmessageList(_item: any) {
    if (_item.warnings.length !== 0) {
      _item.warnings[0].type = 'warning';
      this.messageList.push(_item.warnings);
    }
    if (_item.errors.length !== 0) {
      _item.errors[0].type = 'error';
      this.messageList.push(_item.errors);
    }
    if (_item.warnings.length === 0 && _item.errors.length === 0) {
      this.messageList.push([{code: 'HAPPY_REQUEST', details: '', type: 'success'}]);
    }
  }

  clearData() {
    this.messageList = [];
  }
}

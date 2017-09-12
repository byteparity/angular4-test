import 'rxjs/add/operator/finally';
import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../core/main-service/main-service.service';
import * as _ from 'lodash';

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
  elementIdList: Array<any> = [];
  linkItemList: Array<any> = [];

  constructor(private mainServiceService: MainServiceService) {}

  ngOnInit() {
  }

  getCommand() {
    // TODO : Need to check/improve condtional code
    this.isLoading = true;
    this.messageList = [];
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
    if (_item.message) {
      return true;
    } else {
      if (_item.warnings.length !== 0) {
        _item.warnings[0].type = 'warning';
        this.messageList.push(_item.warnings);
      }
      if (_item.errors.length !== 0) {
        _item.errors[0].type = 'error';
        this.messageList.push(_item.errors);
      }
      if (_item.warnings.length === 0 && _item.errors.length === 0) {

        if (_item.payload.id !== undefined) {
          if (this.elementIdList.includes(_item.payload.id)) {
            this.messageList.push([{code: _item.payload.id, details: 'element_already_exists', type: 'warning'}]);
            return true;
          } else {
            this.elementIdList.push(_item.payload.id);
            this.messageList.push([{code: 'HAPPY_REQUEST', details: '', type: 'success'}]);
          }
        }

        if (_item.payload.action !== undefined) {
          this.takeAction(_item.payload);
        }
      }
    }
  }

  takeAction(_payload: any) {
    const tempItem =  _.values(_payload);
    tempItem.shift();

    if (_payload.action === 'bind') {
      if (_.intersection(this.elementIdList, tempItem).length !== 2) {
        this.messageList.push([
          {
            code: tempItem.toString() + ' does not exist in elements', // TODO : Add in lang file
            details: 'connection_could_not_be_created',
            type: 'warning'
          }
        ]);
        return true;
      } else {
        this.linkItemList.push(_payload);
        this.messageList.push([{code: tempItem.toString(), details: 'connection_created', type: 'success'}]);
      }
    } else if (_payload.action === 'unbind') {
      if (_.intersectionWith(this.linkItemList, [_payload.action], _.isEqual).length !== 1) {
        this.messageList.push([
          {
            code: tempItem.toString() + ' does not exist in connections', // TODO : Add in lang file
            details: 'connection_could_not_be_removed',
            type: 'warning'
          }
        ]);
        return true;
      } else {
        _payload.action = 'bind';
        _.pullAllBy(this.linkItemList, [_payload], 'action');
        this.messageList.push([{code: tempItem.toString(), details: 'connection_removed', type: 'success'}]);
      }
    }
    return true;
  }
  clearData() {
    this.messageList = [];
    this.elementIdList = [];
    this.linkItemList = [];
  }
}

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ToolbarComponent implements OnInit {
  @Input()
  isLogin: boolean | null = false;
  @Input()
  title: any;
  @Input()
  username: any;

  constructor() {}

  ngOnInit(): void {}
}

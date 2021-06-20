import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AvatarComponent implements OnInit {
  @Input()
  public photoUrl!: string;

  @Input()
  public name!: string;

  @Input()
  public username!: string;

  @Input()
  public size!: number;

  public initials!: string;
  public circleColor!: string;

  // private colors = [
  //   '#EB7181', // red
  //   '#468547', // green
  //   '#FFD558', // yellow
  //   '#3670B2', // blue
  // ];
  private colors = [
    '#214559',
    '#262b2f',
    '#00626f',
    '#0f3b57',
    '#00022e',
    '#112222',
    '#2a293e',
    '#2b6867',
    '#29304e',
    '#020035',
    '#34414e',
    '#040348',
    '#391285',
    '#203e4a',
    '#184343',
    '#0000aa',
    '#000133',
    '#033500',
    '#373e02',
    '#6f7755',
    '#547053',
    '#11574a',
    '#80884e',
    '#495e35',
    '#696006',
    '#11887b',
    '#044a05',
    '#004953',
    '#35654d',
    '#014600',
    '#3e6257',
    '#3d6c54',
    '#062e03',
    '#004400',
    '#b4262a',
    '#d1001c',
    '#c14a09',
    '#7f4330',
    '#c65102',
    '#ba160c',
    '#ca6636',
    '#e6ba45',
    '#d5b60a',
    '#900020',
    '#420303',
    '#840000',
    '#820000',
    '#9e1212',
    '#800000',
    '#4a0100',
    '#980036',
    '#3d0c02',
    '#220a0a',
    '#3a181a',
    '#af2f0d',
    '#9c004a',
    '#d90166',
    '#cb416b',
    '#b0306a',
    '#490648',
    '#76424e',
    '#35063e',
    '#80444c',
    '#36013f',
    '#674c47',
    '#280137',
    '#4d233d',
    '#5c4450',
    '#673a3f',
    '#605467',
    '#553f2d',
    '#442200',
    '#593c39',
    '#742802',
    '#341c02',
    '#490206',
    '#410200',
    '#4f1507',
    '#754600',
    '#7f7053',
    '#937a62',
    '#5c5337',
    '#985538',
    '#755139',
    '#3b2820',
    '#573b2a',
    '#415764',
    '#48412b',
    '#4e5552',
    '#333333',
    '#363737',
    '#646356',
    '#716e61',
    '#565350',
    '#25342b',
    '#4e5541',
    '#2a2a35',
    '#6f828a',
    '#404854',
    '#4d4b3a',
    '#110022',
    '#2a2b2d',
    '#5a5348',
    '#50574c',
    '#1d0200',
    '#5d5242',
    '#3b3c36',
    '#1e272c',
    '#362d26',
    '#171717',
    '#23191e',
    '#0a0502',
    '#161616',
    '#080808',
    '#2b0202',
    '#050d25',
    '#302621',
    '#1b1811',
    '#3b302f',
    '#000000',
  ];

  ngOnInit() {
    const randomIndex = Math.floor(
      Math.random() * Math.floor(this.colors.length)
    );
    this.circleColor = this.colors[randomIndex];
  }

  public createInitials(): string {
    let initials = '';

    for (let i = 0; i < this.name.length; i++) {
      if (this.name.charAt(i) === ' ') {
        continue;
      }

      if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
        initials += this.name.charAt(i);

        if (initials.length == 2) {
          break;
        }
      }
    }
    return initials;
  }

  public createUsername(): string {
    let username = '';

    for (let i = 0; i < this.username.length; i++) {
      if (this.username.charAt(i) === ' ') {
        continue;
      }

      username += this.username.charAt(i);

      if (username.length == 2) {
        break;
      }
    }
    return username;
  }
}

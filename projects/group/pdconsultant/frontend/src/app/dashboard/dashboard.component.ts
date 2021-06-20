import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from '../core/shared/token-storage.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { FormControl } from '@angular/forms';
import { CdkAccordionItem } from '@angular/cdk/accordion';

interface Pokemon {
  value: string;
  viewValue: string;
}

interface PokemonGroup {
  disabled?: boolean;
  name: string;
  pokemon: Pokemon[];
}

@Component({
  selector: 'app-dashboard',
  animations: [
    trigger('sideNavOpenClose', [
      // ...
      state(
        'true',
        style({
          width: '200px',
        })
      ),
      state(
        'false',
        style({
          width: DashboardComponent.sideCloseWidth + 'px',
        })
      ),
      transition('open => closed', [animate('0.25s ease-out')]),
      transition('closed => open', [animate('0.5s ease-in')]),
    ]),
    trigger('containerOpenClose', [
      // ...
      state(
        'open',
        style({
          marginLeft: '200px',
        })
      ),
      state(
        'closed',
        style({
          marginLeft: DashboardComponent.sideCloseWidth + 'px',
        })
      ),
      transition('open => closed', [animate('0.25s ease-out')]),
      transition('closed => open', [animate('0.15s ease-in')]),
    ]),
    trigger('menuTitleVisible', [
      state('*', style({ opacity: '1' })),
      state('void', style({ opacity: '0' })),
      transition(':enter', [animate('0.25s')]),
      transition(':leave', [animate('0s')]),
    ]),
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  static sideCloseWidth = 50;
  showDoctor = false;
  pokemonControl = new FormControl({
    value: 'bulbasaur-0',
    viewValue: 'Bulbasaur',
  });
  pokemonGroups: PokemonGroup[] = [
    {
      name: 'Grass',
      pokemon: [
        { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
        { value: 'oddish-1', viewValue: 'Oddish' },
        { value: 'bellsprout-2', viewValue: 'Bellsprout' },
      ],
    },
    {
      name: 'Water',
      pokemon: [
        { value: 'squirtle-3', viewValue: 'Squirtle' },
        { value: 'psyduck-4', viewValue: 'Psyduck' },
        { value: 'horsea-5', viewValue: 'Horsea' },
      ],
    },
    {
      name: 'Fire',
      disabled: true,
      pokemon: [
        { value: 'charmander-6', viewValue: 'Charmander' },
        { value: 'vulpix-7', viewValue: 'Vulpix' },
        { value: 'flareon-8', viewValue: 'Flareon' },
      ],
    },
    {
      name: 'Psychic',
      pokemon: [
        { value: 'mew-9', viewValue: 'Mew' },
        { value: 'mewtwo-10', viewValue: 'Mewtwo' },
      ],
    },
  ];
  user: any;
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  constructor(
    private snackBar: MatSnackBar,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.snackBar.dismiss();
    this.isLoading = false;
    this.user = this.tokenStorageService.getUser();
  }

  showError(title: string, redirect = false) {
    this.snackBar
      .open(title, 'DISMISS')
      .afterDismissed()
      .subscribe(async () => {
        if (redirect) {
          this.snackBar.dismiss();
        }
      });
  }

  showQueue(accordionItem: CdkAccordionItem) {
    if (this.isOpen) {
      accordionItem.toggle();
    } else {
      if (!accordionItem.expanded) {
        accordionItem.open();
      }
    }
    this.isOpen = true;
  }

  isNurse(): boolean {
    return this.tokenStorageService.isNurse();
  }

  isPatient(): boolean {
    return this.tokenStorageService.isPatient();
  }

  isDoctor(): boolean {
    return this.tokenStorageService.isDoctor();
  }

  isAdmin(): boolean {
    return this.tokenStorageService.isAdmin();
  }
}

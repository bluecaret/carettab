import { transition, trigger, style, state, animate } from '@angular/animations';

export const slideIn = trigger('slideIn', [
  state('*', style({
    opacity: 1,
    transform: 'scaleY(1)'
  })),
  state('void', style({
    opacity: 0,
    transform: 'scaleY(0.6)'
  })),
  transition('* => void', animate('250ms ease-out')),
  transition('void => *', animate('250ms ease-in'))
]);

export const fade = trigger('fade', [
  state('*', style({
    opacity: 1,
  })),
  state('void', style({
    opacity: 0,
  })),
  transition('* => void', animate('250ms ease-out')),
  transition('void => *', animate('250ms ease-in'))
]);

export const fadeIn = trigger('fadeIn', [
  state('*', style({
    opacity: 1,
  })),
  state('void', style({
    opacity: 0,
  })),
  transition('void => *', animate('250ms ease-in'))
]);

export const options = trigger('options', [
  state('*', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  state('void', style({
    opacity: 0,
    transform: 'translateX(30%)'
  })),
  transition('* => void', animate('300ms ease-out')),
  transition('void => *', animate('300ms ease-in'))
]);

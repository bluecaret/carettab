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
  transition(':enter', [
    style({opacity: 0}),
    animate('200ms 150ms ease', style({opacity: 1}))
  ]),
  transition(':leave', [
    style({position: 'absolute', left: 0, right: 0, top: 0}),
    animate('200ms ease', style({opacity: 0}))
  ])
]);

export const options = trigger('options', [
  transition(':enter', [
    style({transform: 'translateX(100%) translateY(100%)'}),
    animate('300ms ease-out', style({transform: 'translateX(0%) translateY(0%)'}))
  ]),
  transition(':leave', [
    animate('300ms ease-out', style({transform: 'translateX(100%) translateY(100%)'}))
  ])
]);

export const tab = trigger('tab', [
  state('false', style({
    width: '100vw'
  })),
  state('true', style({
    width: 'calc(100vw - 800px)'
  })),
  transition('false => true', animate('400ms ease-in')),
  transition('true => false', animate('400ms ease-in'))
]);

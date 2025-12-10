import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbellOutline, timerOutline, addCircleOutline, caretForwardOutline, caretDownOutline } from 'ionicons/icons'

addIcons({
'barbell-outline': barbellOutline,
'timer-outline': timerOutline,
'add-circle-outline': addCircleOutline,
'caret-forward-outline': caretForwardOutline,
'caret-down-outline': caretDownOutline
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}

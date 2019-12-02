import { Component, OnInit, NgZone } from '@angular/core';
import { Bluetooth } from 'nativescript-bluetooth';
const bluetooth = new Bluetooth();
import { Peripheral } from 'nativescript-bluetooth';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ItemEventData } from "tns-core-modules/ui/list-view"

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    isEnabledSubscription: Subscription;
    isBluetoothEnabled = false;
     devices: any[] = [];
/*     devices: any[] = [{
        UUID: '1111',
        name: 'test mip 1'
    }, {
        UUID: '2222',
        name: 'test mip 2'
    }]; */



    constructor() {

    }

    ngOnInit(): void {
        // Init your component properties here.
        bluetooth.requestCoarseLocationPermission();

        this.isEnabledSubscription = this.listenToBluetoothEnabled()
          .subscribe(enabled => this.isBluetoothEnabled = enabled);
        }

    public listenToBluetoothEnabled(): Observable<boolean> {
        return new Observable<boolean>(observer => {
          bluetooth.isBluetoothEnabled()
            .then(enabled => observer.next(enabled))

          let intervalHandle = setInterval(
            () => {
              bluetooth.isBluetoothEnabled()
                .then(enabled => observer.next(enabled))
            }
            , 1000);

          // stop checking every second on unsubscribe
          return () => clearInterval(intervalHandle);
        })
        .pipe(
          distinctUntilChanged()
        );
      }
    onItemTap(args: ItemEventData): void {
        console.log('Item with index: ' + args.index + ' tapped');
    }
    
    scan() {
        this.devices = [];

        bluetooth.startScanning({
          skipPermissionCheck: true,
          seconds: 3,
          // serviceUUIDs: ['ffe5'],
          // serviceUUIDs: ['0000ffe5-0000-1000-8000-00805f9b34fb'],
          onDiscovered: (peripheral: Peripheral) => {
            if(peripheral.name) {
              console.log(`UUID: ${peripheral.UUID} name: ${peripheral.name}`)
              this.devices.push(peripheral);
            }
          }
        })
      }


  addDevice(name: string, UUID: string) {
    this.devices.push({ name, UUID});
  }
}

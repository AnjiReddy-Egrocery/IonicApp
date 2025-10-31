import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class Auth {
   private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  // 🔹 Save login state + user data
  async setLoginData(user: any) {
    await this._storage?.set('isLoggedIn', true);
    await this._storage?.set('user', user);
  }

  // 🔹 Get user data
  async getUser() {
    return await this._storage?.get('user');
  }

  // 🔹 Check login state
  async getLoginState(): Promise<boolean> {
    return (await this._storage?.get('isLoggedIn')) || false;
  }

  async logout() {
    await this._storage?.clear();
  }
}

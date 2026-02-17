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
    if (!this._storage) await this.init();

    await this._storage?.set('isLoggedIn', true);
    await this._storage?.set('user', user);
  }

  // 🔹 Get user data
  async getUser() {
    if (!this._storage) await this.init();

    const user = await this._storage?.get('user');

    if (!user) {
      console.warn("⚠️ No user in storage");
      return null;  // return null instead of undefined
    }

    return user;
  }

  // 🔹 Check login state
  async getLoginState(): Promise<boolean> {
    if (!this._storage) await this.init();

    return (await this._storage?.get('isLoggedIn')) || false;
  }

  async logout() {
     if (!this._storage) await this.init();

    await this._storage?.remove('user');
    await this._storage?.set('isLoggedIn', false);
  }
}

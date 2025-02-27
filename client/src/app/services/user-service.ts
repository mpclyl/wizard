import {action, computed, observable} from 'mobx';
import {Inject, Injectable} from 'react-ts-di';

import {HTTP} from '../api';
import {BaseInfoData} from '../components';
import {USER_API} from '../constant';
import {LoadingStore} from '../store';
// import {TipStore} from '../store';
import {Optional} from '../types/type-utils';
import {InjectStore} from '../utils';

import {JWT} from './jwt-service';

export interface UserBaseInfo {
  displayName: string;
  username: string;
  password: string;
  email: string;
  avatar: string;
}

interface OrganizationInfo {
  organizationName: string;
  organizationDescription?: string;
}

export type ParsedRegisterData = UserBaseInfo & OrganizationInfo;

export type RegisterData = Optional<ParsedRegisterData>;

@Injectable()
export class User {
  @computed
  get getIsLogin(): boolean {
    console.info(this.isLogin);
    return this.isLogin;
  }

  @Inject
  private http!: HTTP;

  @Inject
  private jwt!: JWT;

  @InjectStore(LoadingStore)
  private loading!: LoadingStore;

  registerData: RegisterData = {};

  @observable
  userInfo: UserBaseInfo | undefined;

  @observable
  isLogin: boolean = false;

  constructor() {
    if (this.jwt.isExist) {
      // 刷新时带上 JWT 拿到用户的信息
      this.initUserInfo();
    }
  }

  @action
  setUserInfo(userInfo: UserBaseInfo): void {
    this.userInfo = userInfo;
    this.isLogin = true;
  }

  @action
  async initUserInfo(): Promise<void> {
    this.loading.loadingDialogToggle();

    try {
      const {userInfo} = await this.http.get(USER_API.INFO);

      this.setUserInfo(userInfo);
    } catch (e) {
      console.error(e);
    } finally {
      this.loading.loadingDialogToggle();
    }
  }

  @action
  async login(username: string, password: string): Promise<void> {
    const {jwt: jwtString, userInfo} = await this.http.post(USER_API.LOGIN, {
      username,
      password,
    });

    this.jwt.save(jwtString);
    this.setUserInfo(userInfo);
  }

  async validBaseInfo(baseInfo: BaseInfoData): Promise<boolean> {
    interface ValidResult {
      isValid: boolean;
    }

    const {isValid} = this.http.post<ValidResult, BaseInfoData>(
      USER_API.VALID_BASE_INFO,
      baseInfo,
    );

    return isValid;
  }

  @computed
  get avatar(): string {
    if (!this.userInfo) {
      return '';
    }

    const {avatar, username} = this.userInfo;

    return avatar === '' || !avatar ? username.slice(0, 2) : avatar;
  }

  register(): void {
    return this.http.post(USER_API.REGISTER, this.registerData);
  }

  collectBaseInfo(baseInfo: BaseInfoData): void {
    this.registerData = {...this.registerData, ...baseInfo};
  }

  ensureOrganization(
    organizationName: string,
    organizationDescription?: string,
  ): void {
    console.info(organizationName, organizationDescription);

    this.registerData = {
      ...this.registerData,
      organizationName,
      organizationDescription,
    };
  }

  logout(): void {
    this.jwt.remove();

    // reset userData
    this.userInfo = undefined;
    this.isLogin = false;
  }
}

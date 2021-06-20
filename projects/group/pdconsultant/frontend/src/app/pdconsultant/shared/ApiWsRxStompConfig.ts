import { environment } from '../../../environments/environment';
import { TokenStorageService } from '../../core/shared/token-storage.service';

export class ApiWsRxStompConfig {
  public brokerURL = environment.apiWsUrl;
  public connectHeaders = {};
  public debug = environment.enableApiWsLog
    ? (msg: string): void => {
        console.log(new Date(), msg);
      }
    : () => {};

  constructor(private tokenStorageService: TokenStorageService) {
    this.connectHeaders = {
      token: this.tokenStorageService.getToken(),
    };
  }
}

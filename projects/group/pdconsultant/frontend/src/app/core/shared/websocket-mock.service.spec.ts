import { TestBed } from '@angular/core/testing';

import { WebsocketMockService } from './websocket-mock.service';

describe('WebsocketMockService', () => {
  let service: WebsocketMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

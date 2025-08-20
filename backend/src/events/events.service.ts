import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventsService {
  constructor(private eventEmitter: EventEmitter2) {}

  pub(nombre: string, data: Record<string, any>) {
    this.eventEmitter.emit(nombre, data);
  }
}

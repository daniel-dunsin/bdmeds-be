import { WebhookEvents } from '../enums';

export interface WebhookResponse {
   event: WebhookEvents;
   data: ChargeResponse;
}

export interface ChargeResponse {
   id: number;
   amount: number;
   channel: string;
   reference: string;
}

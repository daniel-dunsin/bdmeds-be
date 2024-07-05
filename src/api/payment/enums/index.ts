export enum PaymentStatus {
   PENDING = 'Pending',
   SUCCESSFUL = 'Successful',
   FAILED = 'Failed',
}

export enum WebhookEvents {
   TRANSACTION_SUCCESSFUL = 'charge.success',
   TRANSACTION_FAILED = 'charge.failed',
}

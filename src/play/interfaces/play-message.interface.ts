export interface PlayMessage {
  message: object | string;
  type: 'info' | 'warning' | 'error' | 'success' | 'validation_error';
}

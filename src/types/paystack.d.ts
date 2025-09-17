declare module '@paystack/inline-js' {
  class PaystackPop {
    constructor();
    newTransaction(config: {
      key: string;
      email: string;
      amount: number;
      ref?: string;
      onSuccess?: () => void;
      onCancel?: () => void;
    }): void;
    redirect(url: string): void;
  }
  export default PaystackPop;
}
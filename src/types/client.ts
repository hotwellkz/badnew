export interface Client {
  id: string;
  clientNumber: string;
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  iin: string;
  constructionAddress: string;
  livingAddress: string;
  objectName: string;
  constructionDays: number;
  totalAmount: number;
  deposit: number;
  firstPayment: number;
  secondPayment: number;
  thirdPayment: number;
  fourthPayment: number;
  year: number;
  status: 'building' | 'deposit' | 'built';
  createdAt?: any;
  files?: string[];
  progress?: number;
  isVisible?: boolean;
  totalPaid?: number;
}
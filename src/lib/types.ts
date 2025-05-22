import { initialState } from './data';

export type iFormState = typeof initialState;
export type iFormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_FORM_DATA'; data: Partial<iFormState> };

export enum iVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
  Quaternary = 'quaternary',
  Quinary = 'quinary',
}

export type VariantType = keyof typeof iVariant;

export enum iSize {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
}
export type SizeType = keyof typeof iSize;

export interface iLockUpProps {
  id?: string;
  overline?: string;
  title: string;
  subtitle?: string;
  variant?: iVariant;
  size?: iSize;
  theme?: iTheme;
  centered?: boolean;
  bold?: boolean;
}

export enum iTheme {
  Light = 'light',
  Dark = 'dark',
}

export interface iTicket {
  name: string;
  subtitle: string;
  price: number;
  availability: number;
  features: string;
}
export interface iTransaction {
  m_payment_id?: string;
  pf_payment_id: string;
  payment_status: 'COMPLETE' | 'CANCELLED';
  item_name: string;
  item_description?: string;
  amount_gross?: number;
  amount_fee?: number;
  amount_net?: number;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: number;
  custom_int2?: number;
  custom_int3?: number;
  custom_int4?: number;
  custom_int5?: number;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  merchant_id: string;
  signature?: string;
}

export interface iFullEvent {
  id: number;
  title: string;
  subtitle: string;
  overview: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:mm:ss
  endTime: string; // Format: HH:mm:ss
  location: string;
  category: string;
  tags: string[];
  images: string[];
  organiser: {
    id: string;
    name: string;
    email: string;
  };
  ticketTypes: {
    id: number;
    name: string;
    description: string;
    price: number;
    features: string[];
    totalTickets: number;
    availability: number;
  }[];
}

export interface iShortEvent {
  title: string;
  subtitle: string;
  overview: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:mm:ss.fffffffff
  endTime: string; // Format: HH:mm:ss.fffffffff
  location: string;
  category: string;
  tags: string[];
  images: string[];
  organiserId: string;
}

export interface iDetailedTicket {
  id: number;
  event: {
    id: number;
    title: string;
    subtitle: string;
    overview: string;
    date: string; // Format: YYYY-MM-DD
    startTime: string; // Format: HH:mm:ss
    endTime: string; // Format: HH:mm:ss
    location: string;
    category: string;
    tags: string[];
    images: string[];
    active: boolean;
    organiser: {
      id: string;
      name: string;
      email: string;
    };
    ticketTypes: {
      id: number;
      name: string;
      description: string;
      price: number;
      features: string[];
      totalTickets: number;
      availability: number;
    }[];
  };
  type: {
    id: number;
    name: string;
    description: string;
    price: number;
    features: string[];
    totalTickets: number;
    availability: number;
  };
  owner: {
    id: string;
    name: string;
    email: string;
  };
  transaction: {
    id: number;
    pfPaymentId: string;
    paymentStatus: 'COMPLETE' | 'CANCELLED';
    itemName: string;
    itemDescription?: string;
    amountGross: number;
    amountFee: number;
    amountNet: number;
    paymentId: string;
  };
}

export interface iFooter {
  subscribeTitle: string;
  subscribeDescription: string;
  privacyPolicyLink: string;
  links: { [group: string]: { href: string; label: string }[] };
  copyright: string;
}

export interface iApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  organizationName: string;
  organizationWebsite: string;
  wheelchairAccessible: boolean;
  hearingAssistance: boolean;
  signLanguageInterpreter: boolean;
  additionalDetails: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  status: iStatus;
  submittedDate: string;
  lastUpdated: string;
  documents: { idDocument: string; proofOfBankAccount: string; selfie: string };
  rejectionReason?: string;
  orgId?: string;
}

export interface iEmail {
  id: number;
  from_email: string;
  to_email: string;
  subject: string;
  body: string;
  status: string;
  date_sent: string;
  sender_id: string;
  service_name: string;
  last_updated: string;
}

export interface iVenue {
  id: number;
  venueName?: string;
  name: string;
  address: string;
  phoneNumber: string;
  capacity: number;
  venueType: string;
  accessibilityOptions: string[];
  email: string;
  websiteUrl: string;
  additionalDetails: string;
  applicationStatus: iStatus;
  applicationReferenceNumber: string;
}

export enum iStatus {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Suspended = 'SUSPENDED',
}

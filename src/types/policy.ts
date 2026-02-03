export type PolicyType = 'life' | 'annuity' | 'property' | 'casualty';
export type PolicyStatus = 'active' | 'pending' | 'lapsed' | 'cancelled';
export type ActionStatus = 'pending' | 'in_review' | 'approved' | 'completed' | 'rejected';

export interface Policy {
  id: string;
  policyNumber: string;
  type: PolicyType;
  productName: string;
  status: PolicyStatus;
  effectiveDate: string;
  expirationDate?: string;
  premium: number;
  coverageAmount: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  nextPaymentDate: string;
  beneficiaries?: Beneficiary[];
  coverages?: Coverage[];
  insured: Insured;
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  isPrimary: boolean;
}

export interface Coverage {
  id: string;
  type: string;
  limit: number;
  deductible: number;
  description: string;
}

export interface Insured {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: Address;
  phone: string;
  email: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CustomerAction {
  id: string;
  policyId: string;
  policyNumber: string;
  type: string;
  title: string;
  description: string;
  status: ActionStatus;
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
  dueDate?: string;
  completedDate?: string;
  lifecycle: ActionLifecycle[];
}

export interface ActionLifecycle {
  status: ActionStatus;
  timestamp: string;
  note?: string;
  performer?: string;
}

export interface IllustrationRequest {
  id: string;
  policyId: string;
  policyNumber: string;
  requestDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedBy: string;
  requestType: 'inforce' | 'policy_change' | 'quote';
  scenarioType?: 'guaranteed' | 'illustrated' | 'custom';
  projectionYears?: number;
  additionalPremium?: number;
  notes?: string;
  completedDate?: string;
  illustrationId?: string;
}

export interface Illustration {
  id: string;
  policyId: string;
  policyNumber: string;
  generatedDate: string;
  illustrationType: 'inforce' | 'policy_change' | 'quote';
  policyDetails: {
    insuredName: string;
    age: number;
    gender: string;
    issueDate: string;
    productName: string;
    faceAmount: number;
    modalPremium: number;
    premiumMode: string;
  };
  currentValues: {
    policyYear: number;
    cashSurrenderValue: number;
    deathBenefit: number;
    loanBalance: number;
  };
  projections: IllustrationProjection[];
  assumptions: {
    guaranteedInterestRate: number;
    illustratedInterestRate: number;
    currentCostOfInsurance: boolean;
    taxBracket?: string;
  };
  disclosures: string[];
}

export interface IllustrationProjection {
  year: number;
  age: number;
  premium: number;
  cashSurrenderValue: {
    guaranteed: number;
    illustrated: number;
  };
  deathBenefit: {
    guaranteed: number;
    illustrated: number;
  };
  accumulationValue?: number;
  loanBalance?: number;
}

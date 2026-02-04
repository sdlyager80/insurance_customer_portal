import type { Policy, CustomerAction, IllustrationRequest, Illustration } from '../types/policy';

// Mock data for policies
export const mockPolicies: Policy[] = [
  {
    id: '1',
    policyNumber: 'LIFE-2024-001234',
    type: 'life',
    productName: 'Universal Life Insurance',
    status: 'active',
    effectiveDate: '2024-01-15',
    premium: 83.33,
    coverageAmount: 200000,
    paymentFrequency: 'monthly',
    nextPaymentDate: '2026-03-01',
    insured: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1985-06-15',
      address: {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      },
      phone: '(555) 123-4567',
      email: 'john.smith@email.com'
    },
    beneficiaries: [
      {
        id: 'b1',
        name: 'Jane Smith',
        relationship: 'Spouse',
        percentage: 60,
        isPrimary: true
      },
      {
        id: 'b2',
        name: 'Emily Smith',
        relationship: 'Daughter',
        percentage: 40,
        isPrimary: true
      }
    ]
  },
  {
    id: '2',
    policyNumber: 'ANN-2023-005678',
    type: 'annuity',
    productName: 'Fixed Index Annuity',
    status: 'active',
    effectiveDate: '2023-06-01',
    premium: 850.00,
    coverageAmount: 250000,
    paymentFrequency: 'quarterly',
    nextPaymentDate: '2026-03-15',
    insured: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1985-06-15',
      address: {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      },
      phone: '(555) 123-4567',
      email: 'john.smith@email.com'
    }
  },
  {
    id: '3',
    policyNumber: 'HOME-2025-009012',
    type: 'property',
    productName: 'Homeowners Premier',
    status: 'active',
    effectiveDate: '2025-02-01',
    expirationDate: '2026-02-01',
    premium: 145.00,
    coverageAmount: 450000,
    paymentFrequency: 'monthly',
    nextPaymentDate: '2026-03-01',
    insured: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1985-06-15',
      address: {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      },
      phone: '(555) 123-4567',
      email: 'john.smith@email.com'
    },
    coverages: [
      {
        id: 'c1',
        type: 'Dwelling',
        limit: 450000,
        deductible: 2500,
        description: 'Protection for your home structure'
      },
      {
        id: 'c2',
        type: 'Personal Property',
        limit: 225000,
        deductible: 1000,
        description: 'Coverage for belongings inside your home'
      },
      {
        id: 'c3',
        type: 'Liability',
        limit: 500000,
        deductible: 0,
        description: 'Protection against lawsuits and claims'
      }
    ]
  },
  {
    id: '4',
    policyNumber: 'AUTO-2025-003456',
    type: 'casualty',
    productName: 'Auto Complete Coverage',
    status: 'active',
    effectiveDate: '2025-01-10',
    expirationDate: '2026-01-10',
    premium: 165.75,
    coverageAmount: 300000,
    paymentFrequency: 'monthly',
    nextPaymentDate: '2026-03-01',
    insured: {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1985-06-15',
      address: {
        street: '123 Main Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701'
      },
      phone: '(555) 123-4567',
      email: 'john.smith@email.com'
    },
    coverages: [
      {
        id: 'c4',
        type: 'Bodily Injury',
        limit: 300000,
        deductible: 0,
        description: 'Per person/Per accident coverage'
      },
      {
        id: 'c5',
        type: 'Property Damage',
        limit: 100000,
        deductible: 0,
        description: 'Damage to others property'
      },
      {
        id: 'c6',
        type: 'Collision',
        limit: 50000,
        deductible: 500,
        description: 'Vehicle damage from collision'
      },
      {
        id: 'c7',
        type: 'Comprehensive',
        limit: 50000,
        deductible: 250,
        description: 'Vehicle damage from non-collision events'
      }
    ]
  }
];

// Mock data for customer actions
export const mockActions: CustomerAction[] = [
  {
    id: 'a1',
    policyId: '1',
    policyNumber: 'LIFE-2024-001234',
    type: 'beneficiary_update',
    title: 'Review Beneficiary Designation',
    description: 'Annual beneficiary review is recommended to ensure your policy reflects your current wishes.',
    status: 'pending',
    priority: 'medium',
    createdDate: '2026-02-01',
    dueDate: '2026-03-01',
    lifecycle: [
      {
        status: 'pending',
        timestamp: '2026-02-01T10:30:00Z',
        note: 'Action created - Annual beneficiary review initiated'
      }
    ]
  },
  {
    id: 'a2',
    policyId: '3',
    policyNumber: 'HOME-2025-009012',
    type: 'payment_required',
    title: 'Payment Due Soon',
    description: 'Your next premium payment of $145.00 is due on March 1, 2026.',
    status: 'pending',
    priority: 'high',
    createdDate: '2026-02-10',
    dueDate: '2026-03-01',
    lifecycle: [
      {
        status: 'pending',
        timestamp: '2026-02-10T08:00:00Z',
        note: 'Payment reminder sent'
      }
    ]
  },
  {
    id: 'a3',
    policyId: '2',
    policyNumber: 'ANN-2023-005678',
    type: 'coverage_change',
    title: 'Coverage Modification Request',
    description: 'Your request to adjust payment schedule is being processed.',
    status: 'in_review',
    priority: 'medium',
    createdDate: '2026-01-28',
    lifecycle: [
      {
        status: 'pending',
        timestamp: '2026-01-28T14:22:00Z',
        note: 'Request submitted by customer'
      },
      {
        status: 'in_review',
        timestamp: '2026-01-30T09:15:00Z',
        note: 'Under review by underwriting team',
        performer: 'Underwriting Dept'
      }
    ]
  },
  {
    id: 'a4',
    policyId: '4',
    policyNumber: 'AUTO-2025-003456',
    type: 'document_required',
    title: 'Vehicle Inspection Required',
    description: 'Annual vehicle inspection documentation needed for policy renewal.',
    status: 'pending',
    priority: 'medium',
    createdDate: '2026-02-03',
    dueDate: '2026-03-10',
    lifecycle: [
      {
        status: 'pending',
        timestamp: '2026-02-03T11:45:00Z',
        note: 'Inspection requirement notification sent'
      }
    ]
  }
];

// API Service functions
export const policyApi = {
  getAllPolicies: async (): Promise<Policy[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPolicies), 500);
    });
  },

  getPolicyById: async (id: string): Promise<Policy | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const policy = mockPolicies.find(p => p.id === id);
        resolve(policy);
      }, 300);
    });
  },

  updatePolicy: async (id: string, updates: Partial<Policy>): Promise<Policy> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockPolicies.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPolicies[index] = { ...mockPolicies[index], ...updates };
          resolve(mockPolicies[index]);
        } else {
          reject(new Error('Policy not found'));
        }
      }, 500);
    });
  }
};

export const actionApi = {
  getAllActions: async (): Promise<CustomerAction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockActions), 500);
    });
  },

  getActionById: async (id: string): Promise<CustomerAction | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const action = mockActions.find(a => a.id === id);
        resolve(action);
      }, 300);
    });
  },

  updateActionStatus: async (id: string, status: string, note?: string): Promise<CustomerAction> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockActions.findIndex(a => a.id === id);
        if (index !== -1) {
          const lifecycle = [
            ...mockActions[index].lifecycle,
            {
              status: status as any,
              timestamp: new Date().toISOString(),
              note: note || `Status updated to ${status}`
            }
          ];
          mockActions[index] = {
            ...mockActions[index],
            status: status as any,
            lifecycle
          };
          resolve(mockActions[index]);
        } else {
          reject(new Error('Action not found'));
        }
      }, 500);
    });
  }
};

// Mock data for illustrations
const mockIllustration: Illustration = {
  id: 'ill-001',
  policyId: '1',
  policyNumber: 'LIFE-2024-001234',
  generatedDate: '2026-02-03',
  illustrationType: 'inforce',
  policyDetails: {
    insuredName: 'John Charles Smith',
    age: 30,
    gender: 'Male',
    issueDate: '2024-01-15',
    productName: 'Universal Life Insurance',
    faceAmount: 200000,
    modalPremium: 1000,
    premiumMode: 'Annual',
  },
  currentValues: {
    policyYear: 2,
    cashSurrenderValue: 1850,
    deathBenefit: 200000,
    loanBalance: 0,
  },
  assumptions: {
    guaranteedInterestRate: 3.0,
    illustratedInterestRate: 5.5,
    currentCostOfInsurance: true,
  },
  projections: [
    { year: 1, age: 30, premium: 1000, cashSurrenderValue: { guaranteed: 750, illustrated: 950 }, deathBenefit: { guaranteed: 200000, illustrated: 200000 } },
    { year: 2, age: 31, premium: 1000, cashSurrenderValue: { guaranteed: 1600, illustrated: 1850 }, deathBenefit: { guaranteed: 200000, illustrated: 200000 } },
    { year: 5, age: 34, premium: 1000, cashSurrenderValue: { guaranteed: 4250, illustrated: 5120 }, deathBenefit: { guaranteed: 200000, illustrated: 205000 } },
    { year: 10, age: 39, premium: 1000, cashSurrenderValue: { guaranteed: 9100, illustrated: 12350 }, deathBenefit: { guaranteed: 200000, illustrated: 215000 } },
    { year: 15, age: 44, premium: 1000, cashSurrenderValue: { guaranteed: 14500, illustrated: 21800 }, deathBenefit: { guaranteed: 200000, illustrated: 228000 } },
    { year: 20, age: 49, premium: 1000, cashSurrenderValue: { guaranteed: 20400, illustrated: 34200 }, deathBenefit: { guaranteed: 200000, illustrated: 245000 } },
    { year: 25, age: 54, premium: 1000, cashSurrenderValue: { guaranteed: 27100, illustrated: 50400 }, deathBenefit: { guaranteed: 200000, illustrated: 265000 } },
    { year: 30, age: 59, premium: 1000, cashSurrenderValue: { guaranteed: 34500, illustrated: 71500 }, deathBenefit: { guaranteed: 200000, illustrated: 289000 } },
    { year: 35, age: 64, premium: 1000, cashSurrenderValue: { guaranteed: 42800, illustrated: 98200 }, deathBenefit: { guaranteed: 200000, illustrated: 318000 } },
    { year: 40, age: 69, premium: 1000, cashSurrenderValue: { guaranteed: 52100, illustrated: 131400 }, deathBenefit: { guaranteed: 200000, illustrated: 352000 } },
  ],
  disclosures: [
    'This illustration is based on current cost of insurance rates and illustrated interest rates, which are not guaranteed.',
    'Actual policy performance may be more or less favorable than shown.',
    'The guaranteed values assume the minimum guaranteed interest rate of 3.0% as specified in the policy.',
    'Illustrated values assume a non-guaranteed interest rate of 5.5% which may vary.',
    'Continuation of coverage beyond shown years assumes premiums are paid as illustrated.',
    'Policy loans and withdrawals will reduce cash values and death benefits.',
    'This illustration does not constitute an offer or contract. Refer to your policy for actual terms and conditions.',
  ],
};

const mockIllustrationRequests: IllustrationRequest[] = [];

export const illustrationApi = {
  getIllustration: async (id: string): Promise<Illustration> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === mockIllustration.id) {
          resolve(mockIllustration);
        } else {
          reject(new Error('Illustration not found'));
        }
      }, 500);
    });
  },

  getIllustrationsByPolicy: async (policyId: string): Promise<Illustration[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (policyId === '1') {
          resolve([mockIllustration]);
        } else {
          resolve([]);
        }
      }, 500);
    });
  },

  createIllustrationRequest: async (request: Omit<IllustrationRequest, 'id' | 'requestDate' | 'status'>): Promise<IllustrationRequest> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: IllustrationRequest = {
          ...request,
          id: `req-${Date.now()}`,
          requestDate: new Date().toISOString(),
          status: 'pending',
        };
        mockIllustrationRequests.push(newRequest);
        resolve(newRequest);
      }, 500);
    });
  },

  getIllustrationRequests: async (policyId?: string): Promise<IllustrationRequest[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (policyId) {
          resolve(mockIllustrationRequests.filter(r => r.policyId === policyId));
        } else {
          resolve(mockIllustrationRequests);
        }
      }, 300);
    });
  },
};

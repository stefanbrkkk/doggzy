import { z } from 'zod'

// Base form schemas
export const BaseFormSchema = z.object({
  // Honeypot field - should always be empty
  website: z.string().max(0, 'Bot detected').optional(),
  // Common fields
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Please enter a valid email address').max(255, 'Email too long'),
  phone: z.string().optional(),
})

// Contact form schema
export const ContactFormSchema = BaseFormSchema.extend({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
})

// Simplified adoption form schema (for initial contact)
export const AdoptionFormSchema = BaseFormSchema.extend({
  phone: z.string().optional(),
  location: z.string().min(2, 'Location is required').max(200, 'Location too long'),
  experience: z.string().min(1, 'Please select experience level').max(100, 'Experience selection too long'),
  message: z.string().max(2000, 'Message too long').optional(),
})

// Full adoption form schema (for detailed applications)
export const AdoptionFormFullSchema = BaseFormSchema.extend({
  // Personal information
  firstName: z.string().min(2, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(2, 'Last name is required').max(50, 'Last name too long'),
  phone: z.string().min(10, 'Phone number is required').max(20, 'Phone number too long'),
  address: z.string().min(10, 'Address is required').max(200, 'Address too long'),
  city: z.string().min(2, 'City is required').max(100, 'City too long'),
  state: z.string().min(2, 'State/Province is required').max(100, 'State/Province too long'),
  zipCode: z.string().min(3, 'ZIP/Postal code is required').max(20, 'ZIP/Postal code too long'),
  country: z.string().min(2, 'Country is required').max(100, 'Country too long'),
  
  // Experience
  experience: z.string().min(20, 'Please describe your experience with dogs').max(1000, 'Experience description too long'),
  
  // Housing
  housingType: z.enum(['house', 'apartment', 'condo', 'other']).refine(val => val, {
    message: 'Please select housing type'
  }),
  ownRent: z.enum(['own', 'rent']).refine(val => val, {
    message: 'Please select if you own or rent'
  }),
  landlordApproval: z.boolean().optional(),
  yardFenced: z.boolean(),
  
  // Household
  householdSize: z.number().min(1, 'Household size is required').max(20, 'Household size seems too large'),
  children: z.string().max(200, 'Children information too long').optional(),
  otherPets: z.string().max(500, 'Other pets information too long').optional(),
  
  // Preferences
  preferredAge: z.string().max(100, 'Preferred age too long').optional(),
  preferredSize: z.enum(['small', 'medium', 'large', 'giant', 'noPreference']).optional(),
  activityLevel: z.enum(['low', 'moderate', 'high', 'noPreference']).optional(),
  specialNeeds: z.boolean(),
  
  // Commitment
  timeCommitment: z.string().min(1, 'Time commitment is required').max(100, 'Time commitment too long'),
  lifespan: z.boolean().refine(val => val === true, 'You must be prepared for a long-term commitment'),
  
  // Emergency contact
  emergencyName: z.string().min(2, 'Emergency contact name is required').max(100, 'Emergency contact name too long'),
  emergencyPhone: z.string().min(10, 'Emergency contact phone is required').max(20, 'Emergency contact phone too long'),
  emergencyRelationship: z.string().min(2, 'Relationship is required').max(50, 'Relationship too long'),
  
  // Veterinary
  vetName: z.string().max(100, 'Veterinarian name too long').optional(),
  vetPhone: z.string().max(20, 'Veterinarian phone too long').optional(),
  
  // Additional
  whyAdopt: z.string().min(20, 'Please tell us why you want to adopt').max(1000, 'Response too long'),
  anythingElse: z.string().max(1000, 'Additional information too long').optional(),
  
  // Agreements
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreeHomeVisit: z.boolean().refine(val => val === true, 'You must agree to a home visit'),
  agreeUpdates: z.boolean().refine(val => val === true, 'You must agree to provide updates'),
})

// Simplified foster form schema (for initial contact)
export const FosterFormSchema = BaseFormSchema.extend({
  phone: z.string().optional(),
  location: z.string().min(2, 'Location is required').max(200, 'Location too long'),
  experience: z.string().min(1, 'Please select experience level').max(100, 'Experience selection too long'),
  message: z.string().max(2000, 'Message too long').optional(),
})

// Full foster form schema (for detailed applications)
export const FosterFormFullSchema = BaseFormSchema.extend({
  firstName: z.string().min(2, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(2, 'Last name is required').max(50, 'Last name too long'),
  phone: z.string().min(10, 'Phone number is required').max(20, 'Phone number too long'),
  address: z.string().min(10, 'Address is required').max(200, 'Address too long'),
  city: z.string().min(2, 'City is required').max(100, 'City too long'),
  state: z.string().min(2, 'State/Province is required').max(100, 'State/Province too long'),
  zipCode: z.string().min(3, 'ZIP/Postal code is required').max(20, 'ZIP/Postal code too long'),
  country: z.string().min(2, 'Country is required').max(100, 'Country too long'),
  
  experience: z.string().min(20, 'Please describe your experience with dogs').max(1000, 'Experience description too long'),
  availability: z.string().min(10, 'Please describe your availability').max(500, 'Availability description too long'),
  duration: z.enum(['shortTerm', 'mediumTerm', 'longTerm', 'flexible']).refine(val => val, {
    message: 'Please select foster duration'
  }),
  dogTypes: z.array(z.enum(['puppies', 'adults', 'seniors', 'medical', 'behavioral', 'pregnant', 'nursing'])).min(1, 'Please select at least one dog type'),
  transportation: z.boolean(),
  
  housingType: z.enum(['house', 'apartment', 'condo', 'other']).refine(val => val, {
    message: 'Please select housing type'
  }),
  ownRent: z.enum(['own', 'rent']).refine(val => val, {
    message: 'Please select if you own or rent'
  }),
  landlordApproval: z.boolean().optional(),
  yardFenced: z.boolean(),
  
  householdSize: z.number().min(1, 'Household size is required').max(20, 'Household size seems too large'),
  children: z.string().max(200, 'Children information too long').optional(),
  otherPets: z.string().max(500, 'Other pets information too long').optional(),
  
  emergencyName: z.string().min(2, 'Emergency contact name is required').max(100, 'Emergency contact name too long'),
  emergencyPhone: z.string().min(10, 'Emergency contact phone is required').max(20, 'Emergency contact phone too long'),
  emergencyRelationship: z.string().min(2, 'Relationship is required').max(50, 'Relationship too long'),
  
  vetName: z.string().max(100, 'Veterinarian name too long').optional(),
  vetPhone: z.string().max(20, 'Veterinarian phone too long').optional(),
  
  anythingElse: z.string().max(1000, 'Additional information too long').optional(),
  
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreeHomeVisit: z.boolean().refine(val => val === true, 'You must agree to a home visit'),
  agreeUpdates: z.boolean().refine(val => val === true, 'You must agree to provide updates'),
})

// Careers form schema
export const CareersFormSchema = BaseFormSchema.extend({
  portfolio: z.string().max(200, 'Portfolio URL too long').optional(),
  location: z.string().max(100, 'Location too long').optional(),
  position: z.string().min(2, 'Position is required').max(100, 'Position too long'),
  message: z.string().min(10, 'Please tell us about yourself and why you want to join').max(2000, 'Message too long'),
})

// Report form schema
export const ReportFormSchema = BaseFormSchema.extend({
  anonymous: z.boolean().default(false),
  location: z.string().min(10, 'Location is required').max(300, 'Location too long'),
  description: z.string().min(20, 'Please provide more details about the incident').max(2000, 'Description too long'),
  date: z.string().min(8, 'Date is required'),
  time: z.string().max(20, 'Time too long').optional(),
  ongoing: z.boolean(),
  animals: z.string().min(5, 'Please describe the animals involved').max(200, 'Animal description too long'),
  evidence: z.boolean(),
  contactAuthorities: z.boolean(),
  urgency: z.enum(['immediate', 'urgent', 'concern']).refine(val => val, {
    message: 'Please select urgency level'
  }),
})

// Form type mapping
export const FormSchemas = {
  contact: ContactFormSchema,
  adopt: AdoptionFormSchema,
  foster: FosterFormSchema,
  careers: CareersFormSchema,
  report: ReportFormSchema,
} as const

export type FormType = keyof typeof FormSchemas
export type ContactFormData = z.infer<typeof ContactFormSchema>
export type AdoptionFormData = z.infer<typeof AdoptionFormSchema>
export type FosterFormData = z.infer<typeof FosterFormSchema>
export type CareersFormData = z.infer<typeof CareersFormSchema>
export type ReportFormData = z.infer<typeof ReportFormSchema>

export type FormData = ContactFormData | AdoptionFormData | FosterFormData | CareersFormData | ReportFormData

// Validation helper
export function validateFormData<T extends FormType>(
  data: unknown,
  formType: T
): { success: boolean; data?: unknown; errors?: z.ZodError } {
  try {
    const schema = FormSchemas[formType]
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

// Format validation errors for API response
export function formatValidationErrors(errors: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {}
  
  for (const error of errors.issues) {
    const path = error.path.join('.')
    if (!formatted[path]) {
      formatted[path] = []
    }
    formatted[path].push(error.message)
  }
  
  return formatted
}

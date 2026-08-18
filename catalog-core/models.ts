export type PriceMode = 'quote' | 'startingAt' | 'range' | 'fixed' | 'contact';
export type SolutionStatus = 'draft' | 'published' | 'archived';
export type MediaType = 'image' | 'video';
export type AuthChannel = 'email' | 'whatsapp';
export interface ServiceCategory { id: string; name: string; slug: string; shortDescription: string; description?: string; image?: string; icon?: string; order: number; isActive: boolean; rowVersion?: string; }
export interface SolutionMedia { id: string; url: string; alt: string; type: MediaType; order: number; isCover: boolean; storageKey?: string; mimeType?: string; width?: number; height?: number; bytes?: number; }
export interface SolutionFeature { id: string; title: string; description?: string; }
export interface SolutionSeo { title?: string; description?: string; keywords?: string[]; }
export interface Solution { id: string; categoryId: string; name: string; slug: string; eyebrow?: string; shortDescription: string; description: string; gallery: SolutionMedia[]; features: SolutionFeature[]; useCases: string[]; tags: string[]; modalities?: string[]; implementationTime?: string; priceMode: PriceMode; priceFrom?: number; priceTo?: number; currency?: string; featured: boolean; status: SolutionStatus; publishedAt?: string; relatedSolutionIds?: string[]; seo?: SolutionSeo; order: number; rowVersion?: string; }
export interface ProjectSelection { solutionId: string; addedAt: string; quantity: number; }
export type ProjectRequestStatus = 'New' | 'InReview' | 'Contacted' | 'Qualified' | 'Won' | 'Lost' | 'Archived';
export interface ProjectRequest { id?: string; name: string; company?: string; email: string; phone: string; city: string; approximateDate?: string | null; attendees?: number | null; message?: string; acceptedPrivacy: boolean; privacyPolicyVersion: string; website?: string; selections: ProjectSelection[]; createdAt?: string; }
export interface AuthSession { authenticated: boolean; userId?: string; displayName?: string; email?: string; roles: string[]; permissions: string[]; expiresAt?: string; }

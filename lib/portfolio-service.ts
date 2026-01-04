// ============================================
// Portfolio Service - Kamidev Next.js
// ============================================
// Centralized service for portfolio API interactions

import { apiClient } from './api-client';
import type { 
  Proposal, 
  ProposalListResponse, 
  ContactFormData, 
  ContactResponse,
  ReplyData,
  ReplyResponse 
} from '@/types/api';

// ============================================
// API Endpoints
// ============================================
const CONTACT_ENDPOINT = '/api/v1/portfolio/contact';
const PROPOSALS_ENDPOINT = '/api/v1/portfolio/proposals';

// ============================================
// Contact Form Service
// ============================================

export const contactService = {
  /**
   * Submit a contact form (public endpoint)
   */
  async submit(data: ContactFormData): Promise<ContactResponse> {
    const response = await apiClient.post<ContactResponse>(CONTACT_ENDPOINT, data);
    
    if (!response.ok) {
      return {
        success: false,
        message: response.error || 'Failed to submit contact form',
      };
    }
    
    return response.data || { success: true, message: 'Message sent successfully' };
  },
};

// ============================================
// Proposals Service (Admin)
// ============================================

export const proposalsService = {
  /**
   * Get all proposals (requires auth)
   */
  async getAll(authToken?: string): Promise<ProposalListResponse> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await apiClient.get<ProposalListResponse>(PROPOSALS_ENDPOINT, {
      headers,
    });
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Failed to fetch proposals');
    }
    
    return response.data;
  },

  /**
   * Get a single proposal by ID
   */
  async getById(id: string, authToken?: string): Promise<Proposal | null> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await apiClient.get<{ proposal: Proposal }>(
      `${PROPOSALS_ENDPOINT}/${id}`,
      { headers }
    );
    
    if (!response.ok || !response.data) {
      return null;
    }
    
    return response.data.proposal;
  },

  /**
   * Mark proposal as read
   */
  async markAsRead(id: string, authToken?: string): Promise<Proposal> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await apiClient.patch<{ proposal: Proposal }>(
      `${PROPOSALS_ENDPOINT}/${id}`,
      { status: 'read' },
      { headers }
    );
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Failed to update proposal');
    }
    
    return response.data.proposal;
  },

  /**
   * Reply to a proposal
   */
  async reply(id: string, data: ReplyData, authToken?: string): Promise<ReplyResponse> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await apiClient.post<ReplyResponse>(
      `${PROPOSALS_ENDPOINT}/${id}/reply`,
      data,
      { headers }
    );
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Failed to send reply');
    }
    
    return response.data;
  },

  /**
   * Delete a proposal
   */
  async delete(id: string, authToken?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await apiClient.delete(`${PROPOSALS_ENDPOINT}/${id}`, { headers });
    
    if (!response.ok) {
      throw new Error(response.error || 'Failed to delete proposal');
    }
  },

  /**
   * Get unread count
   */
  async getUnreadCount(authToken?: string): Promise<number> {
    const data = await this.getAll(authToken);
    return data.unreadCount;
  },
};

// ============================================
// Export all services
// ============================================

export const portfolioApi = {
  contact: contactService,
  proposals: proposalsService,
};

export default portfolioApi;

import { API_CONFIG, getApiUrl } from '../../../config/api.config';
import { apiClient } from '../../../config/apiClient';
import { getUserId } from '../Auth/auth.utils';

class HerPhasesService {
  constructor() {
    this.createEndpoint = API_CONFIG.ENDPOINTS.HER_PHASES.CREATE;
  }

  async createPhase(payload) {
    try {
      const userId = getUserId();

      const body = {
        user_id: payload.user_id ?? userId ?? null,
        user_name: payload.user_name,
        phone_number: payload.phone_number,
        email_id: payload.email_id ?? null,
        last_period_date: payload.last_period_date, // YYYY-MM-DD
        cycle_length: payload.cycle_length,
        cycle_start_date: payload.cycle_start_date, // "10 September 2025"
        next_period_date: payload.next_period_date, // "08 October 2025"
        ovulation_date: payload.ovulation_date, // "24 September 2025"
      };

      const url = getApiUrl(this.createEndpoint);
      const response = await apiClient.post(url, body);

      const isHttpOk = response.status >= 200 && response.status < 300;
      if (!isHttpOk) {
        throw new Error(response?.data?.message || 'Failed to create her phase');
      }

      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Phase created successfully'
      };
    } catch (error) {
      console.error('❌ Error creating her phase:', error);
      return {
        success: false,
        error: error?.message || 'Unknown error',
        message: 'Failed to create her phase'
      };
    }
  }
}

export const herPhasesService = new HerPhasesService();



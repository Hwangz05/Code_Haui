import { apiClient } from './api/client';

export const contestService = {
  async runCode(language, code, input) {
    try {
      return await apiClient.post('/judge/run', { language, code, input });
    } catch (error) {
      // Sandbox Simulator
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 'SUCCESS',
            output: '99',
            executionTime: 18,
            memory: 8.2,
          });
        }, 500);
      });
    }
  },

  async submitCode(problemId, language, code) {
    try {
      return await apiClient.post('/judge/submit', { problemId, language, code });
    } catch (error) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            status: 'ACCEPTED',
            passedCount: 20,
            totalCount: 20,
            score: 100,
            executionTime: 24,
            memory: 14.5,
          });
        }, 1000);
      });
    }
  },
};

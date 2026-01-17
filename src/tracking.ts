import { appInsights } from './appInsights';

export const trackEvent = (name: string, properties?: Record<string, any>) => {
  if (appInsights) {
    appInsights.trackEvent({ name }, properties);
  }
};

export const trackException = (error: Error, properties?: Record<string, any>) => {
  if (appInsights) {
    appInsights.trackException({ exception: error }, properties);
  }
};

export const trackTrace = (message: string, properties?: Record<string, any>) => {
  if (appInsights) {
    appInsights.trackTrace({ message }, properties);
  }
};

export const setUserId = (userId: string) => {
  if (appInsights) {
    appInsights.setAuthenticatedUserContext(userId);
  }
};

export const clearUserId = () => {
  if (appInsights) {
    appInsights.clearAuthenticatedUserContext();
  }
};

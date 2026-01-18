import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import * as Sentry from "@sentry/react";

const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

// Initialize Sentry
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0, // Capture 100% of sessions for full visibility
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
}

// Initialize Application Insights
let appInsights: ApplicationInsights | null = null;

if (connectionString) {
  appInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableAutoRouteTracking: true,
      enableCorsCorrelation: true,
      enableRequestHeaderTracking: true,
      enableResponseHeaderTracking: true,
    }
  });
  
  appInsights.loadAppInsights();
  appInsights.trackPageView();
}

export { appInsights };

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import * as Sentry from "@sentry/react";

const connectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

// Initialize Sentry
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
  console.log('[Sentry] Initialized with Session Replay', { dsn: sentryDsn, env: import.meta.env.MODE });
} else {
  console.warn('[Sentry] DSN not configured - Session Replay disabled');
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

// src/apolloClient.js (Frontend Microservice Router Setup)
import { ApolloClient, InMemoryCache, HttpLink, from, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

/**
 * 1. Configure Base Cloud Functions URL
 * Replace <region>-<project-id> with your Firebase project region & ID
 * (e.g., "https://us-central1-your-project-id.cloudfunctions.net")
 * or set VITE_FUNCTIONS_BASE_URL / REACT_APP_FUNCTIONS_BASE_URL in your .env file.
 */
const FUNCTIONS_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_FUNCTIONS_BASE_URL) ||
  (typeof process !== "undefined" &&
    (process.env?.NEXT_PUBLIC_FUNCTIONS_BASE_URL || process.env?.REACT_APP_FUNCTIONS_BASE_URL)) ||
  "https://us-central1-cricket-global-league.cloudfunctions.net";

/**
 * 2. Define Isolated Microservice HTTP Links
 */
const coreServiceLink = new HttpLink({
  uri: `${FUNCTIONS_BASE_URL}/api`,
});

const leagueServiceLink = new HttpLink({
  uri: `${FUNCTIONS_BASE_URL}/leagueService`,
});

/**
 * 3. Registry of Root GraphQL Fields Owned by the League Microservice
 * Any query or mutation calling these fields is automatically routed to `/leagueService`.
 */
const LEAGUE_SERVICE_FIELDS = new Set([
  "createLeagueConfiguration",
  "getActiveLeaguesByScope",
  "enrollTeamIntoLeague",        // Added for League Enrollment
  "getEnrolledTeamsByLeague",     // Added for League Enrollment
  "getLeagueById",            // Added for League Dashboard
  "getLeagueTeamDetails"      // Added for Team Roster Drill-down
]);

/**
 * Helper: Checks whether a GraphQL operation belongs to the League Microservice.
 * Supports both:
 *  - Automatic detection via root field name (e.g., `createLeagueConfiguration`)
 *  - Explicit override via `useQuery(QUERY, { context: { service: "league" } })`
 */
const isLeagueOperation = (operation) => {
  const { service } = operation.getContext();
  if (service) {
    return service === "league";
  }

  const definition = getMainDefinition(operation.query);
  if (definition.kind === "OperationDefinition" && definition.selectionSet) {
    return definition.selectionSet.selections.some(
      (selection) =>
        selection.kind === "Field" && LEAGUE_SERVICE_FIELDS.has(selection.name.value)
    );
  }

  return false;
};

/**
 * 4. Directional Microservice Link Router
 * Routes League operations -> `/leagueService`
 * Routes Core operations (Players, Teams, Ads, Geo) -> `/api`
 */
const microserviceRouterLink = split(
  isLeagueOperation,
  leagueServiceLink,
  coreServiceLink
);

/**
 * 5. Unified Apollo Client Instance
 */
export const apolloClient = new ApolloClient({
  link: from([microserviceRouterLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
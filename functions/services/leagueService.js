// functions/services/leagueService.js
const { ApolloServer, gql } = require("apollo-server-cloud-functions");

const leagueTypeDefs = gql`
  # Force compilation stability for cloud function engines
  scalar Int
  scalar Boolean
  scalar ID
  scalar String

  type TargetHorizon {
    startDate: String!
    endDate: String!
    totalDurationDays: Int!
  }

  type GlobalStageConfig {
    superFourEnabled: Boolean!
    semisCount: Int!
    finalsCount: Int!
  }

  type StructureConfig {
    formatType: String!
    subDivisionsTarget: String!
    activePoolIds: [String!]!
    qualifiersPerPool: Int!
    globalStageConfig: GlobalStageConfig!
  }

  type League {
    id: ID!
    title: String!
    leagueSlug: String!
    seasonYear: Int!
    executionScope: String!
    parentGeoIds: [String!]!
    targetHorizon: TargetHorizon!
    structureConfiguration: StructureConfig!
    leagueStatus: String!
    createdAt: String!
  }

  type GeoRegistryNode {
    id: String!
    label: String!
    parentRef: String!
  }

  #Team Enrollment for League 
    type LeagueTeamEnrollment {
    id: ID!
    leagueId: String!
    teamId: String!
    teamName: String!
    logoUrl: String!
    ownerName: String!
    ownerPhone: String!
    poolId: String!
    squadIds: [String!]!
    stats: TeamLeagueStats!
    enrollmentStatus: String!
    enrolledAt: String!
  }

  type TeamLeagueStats {
    played: Int!
    won: Int!
    lost: Int!
    tied: Int!
    points: Int!
    nrr: Float!
  }

   type HydratedPlayerCard {
      id: ID!
      username: String!
      name: String!
      phone: String!
      skill: String!
      profilePic: String!
    }

    type LeagueTeamRosterResponse {
      enrollment: LeagueTeamEnrollment!
      leagueSquadPlayers: [HydratedPlayerCard!]!
      otherGlobalPlayers: [HydratedPlayerCard!]!
    }

  type Query {
    # Extract dynamic configured league frameworks filtered by localized execution boundaries
    getActiveLeaguesByScope(scope: String!, geoId: String!): [League!]!

    # 🚀 INJECTED DIRECTLY INSIDE LEAGUE MICROSERVICE FOR ISOLATED CONTEXT RUNTIME
    getUniversalGeoNodes(level: String!, target: String!, parentIds: [String]): [GeoRegistryNode!]!

    getEnrolledTeamsByLeague(leagueId: String!, poolId: String): [LeagueTeamEnrollment!]!

    getLeagueById(leagueId: ID!): League
    getLeagueTeamDetails(leagueId: String!, teamId: String!): LeagueTeamRosterResponse!

  }

  type Mutation {
    # Master framework mutation engine to spin up dynamic customized tournament configurations
    createLeagueConfiguration(
      title: String!
      seasonYear: Int!
      executionScope: String!
      parentGeoIds: [String!]!
      startDate: String!
      endDate: String!
      formatType: String!
      subDivisionsTarget: String!
      activePoolIds: [String!]!
      qualifiersPerPool: Int!
      superFourEnabled: Boolean!
      semisCount: Int!
      finalsCount: Int!
    ): League!

    enrollTeamIntoLeague(
    leagueId: String!
    teamId: String!
    poolId: String!
    squadIds: [String!]!
  ): LeagueTeamEnrollment!
  }
`;

const createLeagueResolvers = (db) => ({
  Query: {
    getActiveLeaguesByScope: async (_, { scope, geoId }) => {
      try {
        const snapshot = await db
          .collection("leagues")
          .where("executionScope", "==", scope.trim().toUpperCase())
          .where("parentGeoIds", "array-contains", geoId.trim().toUpperCase())
          .get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error inside getActiveLeaguesByScope:", error);
        throw new Error("Failed to query localized active league parameters from database layer.");
      }
    },

    // 🚀 REDIRECT MATRIX RUNTIME LOOKUP DIRECTLY FROM SINGLE CONSTITUENCY_MASTER SOURCE
    getUniversalGeoNodes: async (_, { level, target, parentIds }) => {
      try {
        const cleanLevel = level.trim().toUpperCase();
        const cleanTarget = target.trim().toUpperCase();

        let queryRef = db.collection("constituency_master").where("isActive", "==", true);

        if (parentIds && parentIds.length > 0) {
          const cleanParents = parentIds.map((id) => id.trim().toUpperCase());
          if (cleanLevel === "DISTRICT" && cleanTarget === "CONSTITUENCY") {
            queryRef = queryRef.where("district", "in", cleanParents);
          } else if (cleanLevel === "STATE" && cleanTarget === "DISTRICT") {
            queryRef = queryRef.where("state", "in", cleanParents);
          }
        }

        const snapshot = await queryRef.get();
        if (snapshot.empty) return [];

        const uniqueNodesMap = new Map();

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (cleanLevel === "COUNTRY" && cleanTarget === "DISTRICT") {
            uniqueNodesMap.set(data.district, {
              id: data.district,
              label: data.districtLabel || data.district,
              parentRef: data.stateLabel || data.state,
            });
          } else if (cleanLevel === "COUNTRY" && cleanTarget === "STATE") {
            uniqueNodesMap.set(data.state, {
              id: data.state,
              label: data.stateLabel || data.state,
              parentRef: data.country || "IN",
            });
          } else if (cleanLevel === "STATE" && cleanTarget === "DISTRICT") {
            uniqueNodesMap.set(data.district, {
              id: data.district,
              label: data.districtLabel || data.district,
              parentRef: data.stateLabel || data.state,
            });
          } else if (cleanLevel === "DISTRICT" && cleanTarget === "CONSTITUENCY") {
            uniqueNodesMap.set(data.id, {
              id: data.id,
              label: data.constituency || data.label,
              parentRef: data.district,
            });
          }
        });

        return Array.from(uniqueNodesMap.values());
      } catch (error) {
        console.error("Universal Geo Processing Exception Failure:", error);
        throw new Error("Failed to resolve geographical scope data nodes inside league microservice context.");
      }
    },

    getEnrolledTeamsByLeague: async (_, { leagueId, poolId }) => {
    try {
      let queryRef = db.collection("league_enrollments")
                       .where("leagueId", "==", leagueId.trim());
      
      if (poolId && poolId.trim().length > 0) {
        queryRef = queryRef.where("poolId", "==", poolId.trim().toUpperCase());
      }

      const snapshot = await queryRef.get();
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      throw new Error("Failed to fetch enrolled league teams: " + error.message);
    }
  },
        getLeagueById: async (_, { leagueId }) => {
        try {
          const docSnap = await db.collection("leagues").doc(leagueId.trim()).get();
          if (!docSnap.exists) {
            throw new Error("Target league node not found.");
          }
          return docSnap.data();
        } catch (error) {
          throw new Error("Failed to load league details: " + error.message);
        }
      },

      getLeagueTeamDetails: async (_, { leagueId, teamId }) => {
        try {
          const cleanLeagueId = leagueId.trim();
          const cleanTeamId = teamId.trim();
          const enrollmentDocId = `${cleanLeagueId}_${cleanTeamId}`;

          // 1. Fetch League Enrollment Record
          const enrollmentSnap = await db.collection("league_enrollments").doc(enrollmentDocId).get();
          if (!enrollmentSnap.exists) {
            throw new Error("Team enrollment record not found for this league.");
          }
          const enrollmentData = enrollmentSnap.data();
          const leagueSquadIds = enrollmentData.squadIds || [];

          // 2. Fetch Global Team Record to get all base club players
          const globalTeamSnap = await db.collection("teams").doc(cleanTeamId).get();
          const globalPlayerIds = globalTeamSnap.exists ? (globalTeamSnap.data().playerIds || []) : [];

          // 3. Separate IDs into League Squad vs Remaining Global Bench Players
          const leagueSquadSet = new Set(leagueSquadIds);
          const remainingGlobalIds = globalPlayerIds.filter(pid => !leagueSquadSet.has(pid));

          // Helper to hydrate user documents by ID array
          const hydratePlayers = async (idArray) => {
            if (!idArray || idArray.length === 0) return [];
            const refs = idArray.map(pid => db.collection("users").doc(pid.trim().toLowerCase()));
            const snapshots = await db.getAll(...refs);
            const players = [];
            snapshots.forEach(snap => {
              if (snap.exists) {
                const d = snap.data();
                players.push({
                  id: snap.id,
                  username: d.username || snap.id,
                  name: d.name || "Unknown Player",
                  phone: d.phone || "",
                  skill: d.skill || "All-Rounder",
                  profilePic: d.profilePic || ""
                });
              }
            });
            return players;
          };

          const [leagueSquadPlayers, otherGlobalPlayers] = await Promise.all([
            hydratePlayers(leagueSquadIds),
            hydratePlayers(remainingGlobalIds)
          ]);

          return {
            enrollment: enrollmentData,
            leagueSquadPlayers,
            otherGlobalPlayers
          };
        } catch (error) {
          throw new Error("Failed to compile team roster details: " + error.message);
        }
      },

  },

  Mutation: {
    createLeagueConfiguration: async (
      _,
      {
        title,
        seasonYear,
        executionScope,
        parentGeoIds,
        startDate,
        endDate,
        formatType,
        subDivisionsTarget,
        activePoolIds,
        qualifiersPerPool,
        superFourEnabled,
        semisCount,
        finalsCount,
      }
    ) => {
      try {
        const parsedSeasonYear = parseInt(seasonYear, 10);
        const cleanSlug =
          title
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-") +
          "-" +
          parsedSeasonYear;
        const customLeagueDocId = "league-" + cleanSlug;
        const docRef = db.collection("leagues").doc(customLeagueDocId);

        const startTimestamp = new Date(startDate).getTime();
        const endTimestamp = new Date(endDate).getTime();
        const durationDays =
          Math.max(1, Math.ceil((endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24))) || 1;

        const newLeaguePayload = {
          id: customLeagueDocId,
          title: title.trim(),
          leagueSlug: cleanSlug,
          seasonYear: parsedSeasonYear,
          executionScope: executionScope.trim().toUpperCase(),
          parentGeoIds: parentGeoIds.map((id) => id.trim().toUpperCase()),
          targetHorizon: {
            startDate: startDate.trim(),
            endDate: endDate.trim(),
            totalDurationDays: durationDays,
          },
          structureConfiguration: {
            formatType: formatType.trim().toUpperCase(),
            subDivisionsTarget: subDivisionsTarget.trim().toUpperCase(),
            activePoolIds: activePoolIds.map((id) => id.trim().toUpperCase()),
            qualifiersPerPool: parseInt(qualifiersPerPool, 10),
            globalStageConfig: {
              superFourEnabled: Boolean(superFourEnabled),
              semisCount: parseInt(semisCount, 10),
              finalsCount: parseInt(finalsCount, 10),
            },
          },
          leagueStatus: "REGISTRATION_OPEN",
          createdAt: new Date().toISOString(),
        };

        await docRef.set(newLeaguePayload);
        return newLeaguePayload;
      } catch (error) {
        console.error("Create League Configuration Error:", error);
        throw new Error("Failed to deploy customized league configuration matrix: " + error.message);
      }
    },

      enrollTeamIntoLeague: async (_, { leagueId, teamId, poolId, squadIds }) => {
          try {
            const cleanLeagueId = leagueId.trim();
            const cleanTeamId = teamId.trim();
            const cleanPoolId = poolId.trim().toUpperCase();

            // 1. Verify League exists
            const leagueDoc = await db.collection("leagues").doc(cleanLeagueId).get();
            if (!leagueDoc.exists) {
              throw new Error("ENROLLMENT_REJECTION: Target league does not exist.");
            }

            // 2. Verify Global Team exists and fetch snapshot metadata
            const teamDoc = await db.collection("teams").doc(cleanTeamId).get();
            if (!teamDoc.exists) {
              throw new Error("ENROLLMENT_REJECTION: Target global team does not exist.");
            }
            const teamData = teamDoc.data();

            // 3. Prevent duplicate team enrollment in the same league
            const enrollmentDocId = `${cleanLeagueId}_${cleanTeamId}`;
            const enrollmentRef = db.collection("league_enrollments").doc(enrollmentDocId);
            const existingEnrollment = await enrollmentRef.get();
            if (existingEnrollment.exists) {
              throw new Error("ENROLLMENT_REJECTION: This club is already enrolled in this league.");
            }

            // 4. Prevent a player from playing for multiple teams within the same league
            if (squadIds && squadIds.length > 0) {
              const existingTeamsSnap = await db.collection("league_enrollments")
                .where("leagueId", "==", cleanLeagueId)
                .get();

              const draftedPlayersSet = new Set();
              existingTeamsSnap.forEach(doc => {
                const enrolledSquad = doc.data().squadIds || [];
                enrolledSquad.forEach(pid => draftedPlayersSet.add(pid));
              });

              const conflictingPlayers = squadIds.filter(pid => draftedPlayersSet.has(pid));
              if (conflictingPlayers.length > 0) {
                throw new Error(`ENROLLMENT_REJECTION: Player(s) [${conflictingPlayers.join(", ")}] are already locked with another team in this league.`);
              }
            }

            // 5. Construct Denormalized League Enrollment Document (Initializes Points Table Stats at 0)
            const enrollmentPayload = {
              id: enrollmentDocId,
              leagueId: cleanLeagueId,
              teamId: cleanTeamId,
              teamName: teamData.teamName,
              logoUrl: teamData.logoUrl,
              ownerName: teamData.ownerName,
              ownerPhone: teamData.ownerPhone,
              poolId: cleanPoolId,
              squadIds: squadIds || [],
              stats: {
                played: 0,
                won: 0,
                lost: 0,
                tied: 0,
                points: 0,
                nrr: 0.0
              },
              enrollmentStatus: "CONFIRMED",
              enrolledAt: new Date().toISOString()
            };

            await enrollmentRef.set(enrollmentPayload);
            return enrollmentPayload;
          } catch (error) {
            throw new Error(error.message || "Failed to enroll team into league.");
          }
    },
  },
});

const initLeagueService = (functions, admin, db) => {
  let leagueHandler = null;

  return functions.https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
    res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, apollo-require-preflight, x-apollo-operation-name"
    );
    res.set("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    // Lazy initialization ensures Cloud Run container starts & binds to PORT=8080 immediately
    if (!leagueHandler) {
      const leagueServer = new ApolloServer({
        typeDefs: leagueTypeDefs,
        resolvers: createLeagueResolvers(db),
        playground: true,
        introspection: true,
        cors: false,
      });
      leagueHandler = leagueServer.createHandler();
    }

    return leagueHandler(req, res);
  });
};

module.exports = {
  initLeagueService,
  leagueTypeDefs,
  createLeagueResolvers,
};
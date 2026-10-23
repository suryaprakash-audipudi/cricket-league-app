// functions/services/coreService.js
const crypto = require("crypto");
const { ApolloServer, gql } = require("apollo-server-cloud-functions");

const coreTypeDefs = gql`
  input GeoScopeInput {
    level: String!          # DISTRICT, STATE, NATIONAL, INTERNATIONAL
    country: String!        # e.g., "IN"
    state: String           # e.g., "AP"
    district: String        # e.g., "GNT"
    constituency: String    # e.g., "NRT"
  }

  type GeoScope {
    level: String!
    country: String!
    state: String
    district: String
    constituency: String
  }

  type User {
    id: ID!
    username: String!
    name: String!
    phone: String!
    role: String!
    skill: String!
    geoScope: GeoScope!
    profilePic: String!
    idHash: String!
    idCardDocUrl: String    # 🚀 ఆధార్ కార్డ్ PDF/JPG డాక్యుమెంట్ లింక్
    status: String!
  }

  type TeamGeoScope {
    country: String!
    state: String!
    stateLabel: String
    district: String!
    districtLabel: String
    constituency: String!
    constituencyLabel: String
  }

  type GlobalTeam {
    id: ID!
    teamName: String!
    teamSlug: String!
    ownerName: String!
    ownerPhone: String!
    ownerEmail: String
    logoUrl: String!
    globalStatus: String!
    baseGeoScope: TeamGeoScope!
    createdAt: String!
    playerIds: [String!]!
  }

  type SponsorAd {
    id: ID!
    sponsorName: String!
    mediaUrl: String!
    mediaType: String!
    placement: String!
    sponsorLevel: String!
    targetId: String
    geoScope: GeoScope!
    isActive: Boolean!
  }

  type MasterConstituency {
    id: ID!
    label: String!
    district: String!
    state: String!
    country: String!
    isActive: Boolean!
  }

  type GeoRegistryNode {
    id: String!
    label: String!
    parentRef: String!      # Maps to state name for districts, or district name for constituencies
  }

  type Query {
    # Ads
    getAdsByScope(
      level: String!
      country: String!
      state: String
      district: String
      placement: String
    ): [SponsorAd]

    # Players
    getGlobalPlayers: [User]
    getPendingPlayers: [User]
    checkUsernameAvailability(username: String!): Boolean!

    # Global Teams
    getGlobalTeamsByConstituency(constituency: String!): [GlobalTeam!]!

    # Master List & Geo Registry
    getConstituencyMasterList: [MasterConstituency!]!
    getUniversalGeoNodes(level: String!, target: String!, parentIds: [String]): [GeoRegistryNode!]!
  }

  type Mutation {
    #### Ads ####
    createGlobalSponsorAd(
      sponsorName: String!
      mediaUrl: String!
      mediaType: String!
      placement: String!
      sponsorLevel: String!
      targetId: String
      geoScope: GeoScopeInput!
    ): SponsorAd

    #### Players ####
    registerGlobalPlayer(
      username: String!
      name: String!
      phone: String!
      skill: String!
      geoScope: GeoScopeInput!
      profilePic: String!
      idHash: String!
      idCardDocUrl: String!
    ): User
    updatePlayerStatus(playerId: ID!, status: String!): String!

    #### Global Team ####
    createGlobalTeam(
      teamName: String!
      ownerName: String!
      ownerPhone: String!
      ownerEmail: String
      logoUrl: String!
      country: String
      state: String
      district: String
      constituency: String!
      playerIds: [String]!
    ): GlobalTeam!
  }
`;

const createCoreResolvers = (db) => ({
  Query: {
    /** Ads **/
    getAdsByScope: async (_, { level, country, state, district, placement }) => {
      try {
        let query = db
          .collection("sponsors_ads")
          .where("geoScope.level", "==", level)
          .where("geoScope.country", "==", country)
          .where("isActive", "==", true);
        if (state) query = query.where("geoScope.state", "==", state);
        if (district) query = query.where("geoScope.district", "==", district);
        if (placement) query = query.where("placement", "==", placement);
        const snapshot = await query.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        throw new Error("Failed to fetch ads");
      }
    },

    /** Players **/
    getGlobalPlayers: async () => {
      try {
        const snapshot = await db
          .collection("users")
          .where("role", "==", "PLAYER")
          .where("status", "==", "APPROVED")
          .get();

        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error inside getGlobalPlayers:", error);
        throw new Error("Backend failed to retrieve talent pool");
      }
    },

    getPendingPlayers: async () => {
      try {
        const snapshot = await db
          .collection("users")
          .where("role", "==", "PLAYER")
          .where("status", "==", "PENDING")
          .get();

        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error inside getPendingPlayers:", error);
        throw new Error("Backend failed to retrieve pending applications");
      }
    },

    checkUsernameAvailability: async (_, { username }) => {
      try {
        const cleanUsername = username.trim().toLowerCase();
        const docRef = db.collection("users").doc(cleanUsername);
        const docSnapshot = await docRef.get();
        return !docSnapshot.exists;
      } catch (error) {
        console.error("Username Availability Check Error:", error);
        throw new Error("Failed to check username index registry.");
      }
    },

    /** Teams **/
    getGlobalTeamsByConstituency: async (_, { constituency }) => {
      try {
        const targetConstituency = constituency.trim().toUpperCase();
        const snapshot = await db
          .collection("teams")
          .where("baseGeoScope.constituency", "==", targetConstituency)
          .get();

        if (snapshot.empty) return [];

        const teamsList = [];
        snapshot.forEach((doc) => {
          teamsList.push({ id: doc.id, ...doc.data() });
        });

        return teamsList;
      } catch (error) {
        console.error("Fetch Global Teams Exception Failure:", error);
        throw new Error("Failed to scan global pool registry for teams");
      }
    },

    /** Master List & Geo Registry **/
    getConstituencyMasterList: async () => {
      try {
        const snapshot = await db
          .collection("constituency_master")
          .where("isActive", "==", true)
          .get();

        if (snapshot.empty) return [];

        const masterList = [];
        snapshot.forEach((doc) => {
          masterList.push({ id: doc.id, ...doc.data() });
        });

        return masterList;
      } catch (error) {
        console.error("Master Registry Generation Exception Failure:", error);
        throw new Error("Failed to compile master geo-registry parameters from server");
      }
    },

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
        throw new Error("Failed to resolve geographical scope data nodes");
      }
    },
  },

  Mutation: {
    createGlobalSponsorAd: async (
      _,
      { sponsorName, mediaUrl, mediaType, placement, sponsorLevel, targetId, geoScope }
    ) => {
      try {
        const newAdData = {
          sponsorName,
          mediaUrl,
          mediaType,
          placement,
          sponsorLevel,
          targetId: targetId || null,
          geoScope,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        const docRef = await db.collection("sponsors_ads").add(newAdData);
        return { id: docRef.id, ...newAdData };
      } catch (error) {
        throw new Error("Failed to create ad");
      }
    },

    registerGlobalPlayer: async (
      _,
      { username, name, phone, skill, geoScope, profilePic, idHash, idCardDocUrl }
    ) => {
      try {
        const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

        const docRef = db.collection("users").doc(cleanUsername);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
          throw new Error("DUPLICATE_ENTRY: Username identifier already taken");
        }

        const idDuplicateSnapshot = await db
          .collection("users")
          .where("idHash", "==", idHash)
          .get();
        if (!idDuplicateSnapshot.empty) {
          throw new Error("DUPLICATE_ENTRY: Identity credential already registered");
        }

        const phoneDuplicateSnapshot = await db
          .collection("users")
          .where("phone", "==", phone)
          .get();
        if (!phoneDuplicateSnapshot.empty) {
          throw new Error("DUPLICATE_ENTRY: Mobile registry vector already exists");
        }

        const newPlayerData = {
          username: cleanUsername,
          name,
          phone,
          skill,
          role: "PLAYER",
          geoScope,
          profilePic,
          idHash,
          idCardDocUrl,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        };

        await docRef.set(newPlayerData);

        return { id: cleanUsername, ...newPlayerData };
      } catch (error) {
        console.error("Server Enrollment Exception:", error);
        throw new Error(error.message || "Failed to persist player node");
      }
    },

    updatePlayerStatus: async (_, { playerId, status }) => {
      try {
        await db.collection("users").doc(playerId).update({
          status: status,
          authorizedAt: new Date().toISOString(),
        });
        return `SUCCESS: Target node state transitioned to "${status}" metrics.`;
      } catch (error) {
        console.error("Error in updatePlayerStatus:", error);
        throw new Error("Failed to transition target node authorization matrix.");
      }
    },

    createGlobalTeam: async (
      _,
      { teamName, ownerName, ownerPhone, ownerEmail, logoUrl, playerIds, constituency }
    ) => {
      try {
        const targetConstituency = constituency.trim().toUpperCase();

        const masterDoc = await db
          .collection("constituency_master")
          .doc(targetConstituency.toLowerCase())
          .get();

        if (!masterDoc.exists) {
          throw new Error(
            "REGISTRY_REJECTION: The selected constituency division token does not exist inside our authorized master grids."
          );
        }

        const geoContext = masterDoc.data();
        const cleanSlug = teamName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

        const randomVal = crypto.randomBytes(4).readUInt32BE(0);
        const uniqueToken = ((randomVal % 1500000000) + 2200000000).toString(36).toLowerCase();

        const customTeamDocId =
          "team-" + targetConstituency.toLowerCase() + "-" + cleanSlug + "-" + uniqueToken;
        const docRef = db.collection("teams").doc(customTeamDocId);

        const duplicatePhoneSnapshot = await db
          .collection("teams")
          .where("ownerPhone", "==", ownerPhone.trim())
          .get();
        if (!duplicatePhoneSnapshot.empty) {
          throw new Error(
            "REGISTRY_REJECTION: This corporate mobile registry number is already tied to another active team node."
          );
        }

        const newTeamPayload = {
          id: customTeamDocId,
          teamName: teamName.trim(),
          teamSlug: cleanSlug,
          ownerName: ownerName.trim(),
          ownerPhone: ownerPhone.trim(),
          ownerEmail: ownerEmail ? ownerEmail.trim().toLowerCase() : null,
          logoUrl: logoUrl.trim(),
          playerIds: playerIds || [],
          globalStatus: "ACTIVE",
          baseGeoScope: {
            country: geoContext.country || "IN",
            state: geoContext.state || "AP",
            stateLabel: geoContext.stateLabel || "Andhra Pradesh",
            district: geoContext.district || "GNT",
            districtLabel: geoContext.districtLabel || geoContext.district,
            constituency: targetConstituency,
            constituencyLabel: geoContext.label || targetConstituency,
          },
          createdAt: new Date().toISOString(),
        };

        await docRef.set(newTeamPayload);

        return newTeamPayload;
      } catch (error) {
        console.error("Sovereign Club Creation Ingestion Exception Failure:", error);
        throw new Error(
          error.message || "Failed to finalize database persistence layout for team configuration."
        );
      }
    },
  },
});

const initCoreService = (functions, admin, db) => {
  const coreResolvers = createCoreResolvers(db);

  const coreServer = new ApolloServer({
    typeDefs: coreTypeDefs,
    resolvers: coreResolvers,
    playground: true,
    introspection: true,
    cors: false,
  });

  const coreHandler = coreServer.createHandler();

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

    return coreHandler(req, res);
  });
};

module.exports = {
  initCoreService,
  coreTypeDefs,
  createCoreResolvers,
};
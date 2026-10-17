// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { ApolloServer, gql } = require("apollo-server-cloud-functions");

admin.initializeApp();
const db = admin.firestore();

// 1. GraphQL Schema Design
const typeDefs = gql`
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
    name: String!
    phone: String!
    role: String!          
    skill: String!         
    geoScope: GeoScope!
    profilePic: String!
    idHash: String!
    idCardDocUrl: String   # 🚀 ఆధార్ కార్డ్ PDF/JPG డాక్యుమెంట్ లింక్ యాడ్ చేసాం
    status: String!
  }

  type Team {
    id: ID!
    teamName: String!
    logoUrl: String!
    ownerId: String!
    playerIds: [String]
    geoScope: GeoScope!
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

  type Query {
    getAdsByScope(level: String!, country: String!, state: String, district: String, placement: String): [SponsorAd],
    getGlobalPlayers: [User],
    
    # 🚀 3. అడ్మిన్ డాష్‌బోర్డ్ కోసం కేవలం PENDING లో ఉన్న ప్లేయర్స్ ని మాత్రమే తెచ్చే క్వెరీ
    getPendingPlayers: [User],

    checkUsernameAvailability(username: String!): Boolean!
  }

  type Mutation {
    createGlobalSponsorAd(
      sponsorName: String!
      mediaUrl: String!
      mediaType: String!
      placement: String!
      sponsorLevel: String!
      targetId: String
      geoScope: GeoScopeInput!
    ): SponsorAd

    registerGlobalPlayer(
        name: String!
        phone: String!
        skill: String!
        geoScope: GeoScopeInput!
        profilePic: String!
        idHash: String!
        idCardDocUrl: String! # 🚀 ముటేషన్ ఇన్‌పుట్‌లో యాడ్ చేసాం
    ): User


    createGlobalTeam(
        teamName: String!
        logoUrl: String!
        ownerId: String!
        playerIds: [String]!
        geoScope: GeoScopeInput!
    ): Team

    # 🚀 5. అడ్మిన్ పెండింగ్ ప్లేయర్ ని APPROVED లేదా REJECTED గా మార్చడానికి ముటేషన్
    updatePlayerStatus(playerId: ID!, status: String!): String!
  }
`;

// 2. GraphQL Resolvers
const resolvers = {
  Query: {
    getAdsByScope: async (_, { level, country, state, district, placement }) => {
      try {
        let query = db.collection("sponsors_ads").where("geoScope.level", "==", level).where("geoScope.country", "==", country).where("isActive", "==", true);
        if (state) query = query.where("geoScope.state", "==", state);
        if (district) query = query.where("geoScope.district", "==", district);
        if (placement) query = query.where("placement", "==", placement);
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        throw new Error("Failed to fetch ads");
      }
    }, 
    getGlobalPlayers: async () => {
      try {
        // 💎 ఆక్షన్ పూల్ లేదా పబ్లిక్ లిస్ట్ లో కేవలం APPROVED అయిన ప్లేయర్స్ మాత్రమే కనిపిస్తారు (Data Security)
        const snapshot = await db.collection("users")
          .where("role", "==", "PLAYER")
          .where("status", "==", "APPROVED")
          .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error inside getGlobalPlayers:", error);
        throw new Error("Backend failed to retrieve talent pool");
      }
    },
    getPendingPlayers: async () => {
      try {
        // అడ్మిన్ వెరిఫికేషన్ కోసం కేవలం PENDING లో ఉన్న రికార్డులను మాత్రమే లాగుతుంది
        const snapshot = await db.collection("users")
          .where("role", "==", "PLAYER")
          .where("status", "==", "PENDING")
          .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error inside getPendingPlayers:", error);
        throw new Error("Backend failed to retrieve pending applications");
      }
    },
    checkUsernameAvailability: async (_, { username }) => {
        try {
            const cleanUsername = username.trim().toLowerCase();
            
            // 🔒 ఫైర్‌స్టోర్ లో నేరుగా ఆ డాక్యుమెంట్ ఐడీ ఉందో లేదో చెక్ చేస్తుంది (0.001s వేగం)
            const docRef = db.collection("users").doc(cleanUsername);
            const docSnapshot = await docRef.get();
            
            // డాక్యుమెంట్ లేకపోతే అది అవైలబుల్ లో ఉన్నట్లు (Returns true)
            return !docSnapshot.exists;
        } catch (error) {
            console.error("Username Availability Check Error:", error);
            throw new Error("Failed to check username index registry.");
        }
    }
  },

  Mutation: {
    createGlobalSponsorAd: async (_, { sponsorName, mediaUrl, mediaType, placement, sponsorLevel, targetId, geoScope }) => {
      try {
        const newAdData = { sponsorName, mediaUrl, mediaType, placement, sponsorLevel, targetId: targetId || null, geoScope, isActive: true, createdAt: new Date().toISOString() };
        const docRef = await db.collection("sponsors_ads").add(newAdData);
        return { id: docRef.id, ...newAdData };
      } catch (error) {
        throw new Error("Failed to create ad");
      }
    },

    registerGlobalPlayer: async (_, { username, name, phone, skill, geoScope, profilePic, idHash, idCardDocUrl }) => {
  try {
    // Sanitize input username to lowercase alphanumeric characters only
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Create reference to the target document using the sanitized username as ID
    const docRef = db.collection("users").doc(cleanUsername);
    const docSnapshot = await docRef.get();
    
    // Enforce uniqueness for the custom document ID to prevent overwriting existing nodes
    if (docSnapshot.exists) {
      throw new Error("DUPLICATE_ENTRY: Username identifier already taken");
    }

    // Execute duplicate screening checks for government ID hash and phone registry vectors
    const idDuplicateSnapshot = await db.collection("users").where("idHash", "==", idHash).get();
    if (!idDuplicateSnapshot.empty) {
      throw new Error("DUPLICATE_ENTRY: Identity credential already registered");
    }

    const phoneDuplicateSnapshot = await db.collection("users").where("phone", "==", phone).get();
    if (!phoneDuplicateSnapshot.empty) {
      throw new Error("DUPLICATE_ENTRY: Mobile registry vector already exists");
    }

    // Construct the standard schema structure for database persistence
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
      createdAt: new Date().toISOString() 
    };
    
    // Write data payload directly into Firestore using the customized document path string
    await docRef.set(newPlayerData);
    
    return { id: cleanUsername, ...newPlayerData };
  } catch (error) {
    console.error("Server Enrollment Exception:", error);
    throw new Error(error.message || "Failed to persist player node");
  }
},


    createGlobalTeam: async (_, { teamName, logoUrl, ownerId, playerIds, geoScope }) => {
      try {
        const newTeamData = { teamName, logoUrl, ownerId, playerIds, geoScope, createdAt: new Date().toISOString() };
        const docRef = await db.collection("teams").add(newTeamData);
        return { id: docRef.id, ...newTeamData };
      } catch (error) {
        console.error("Error in createGlobalTeam Resolver:", error);
        throw new Error("Failed to create global team document inside Firestore.");
      }
    },

    updatePlayerStatus: async (_, { playerId, status }) => {
      try {
        // అడ్మిన్ క్లిక్ చేసిన కమాండ్ ని బట్టి Firestore లో 'status' ఫీల్డ్ అప్‌డేట్ అవుతుంది
        await db.collection("users").doc(playerId).update({ 
          status: status,
          authorizedAt: new Date().toISOString()
        });
        return `SUCCESS: Target node state transitioned to "${status}" metrics.`;
      } catch (error) {
        console.error("Error in updatePlayerStatus:", error);
        throw new Error("Failed to transition target node authorization matrix.");
      }
    }
  }
};

// 3. Apollo Server Initialization
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  cors: false
});

const handler = server.createHandler();

// 🚀 Safe Production CORS Access Layer Middleware
exports.api = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, apollo-require-preflight, x-apollo-operation-name");
  res.set("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  return handler(req, res);
});

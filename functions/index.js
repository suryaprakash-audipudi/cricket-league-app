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
    getGlobalPlayers: [User]
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
    ): User

    createGlobalTeam(
        teamName: String!
        logoUrl: String!
        ownerId: String!
        playerIds: [String]!
        geoScope: GeoScopeInput!
    ): Team

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
        // Firestore 'users' లో 'role == PLAYER' ఉన్న వాళ్ళని ఫెచ్ చేస్తుంది
        const snapshot = await db.collection("users").where("role", "==", "PLAYER").get();
        
        // డేటాను ఐడిలతో సహా మ్యాప్ చేసి రిటర్న్ చేస్తుంది
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error inside getGlobalPlayers:", error);
        throw new Error("Backend failed to retrieve talent pool");
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

    registerGlobalPlayer: async (_, { name, phone, skill, geoScope }) => {
      try {
        const newPlayerData = { name, phone, skill, role: "PLAYER", geoScope, profilePic, createdAt: new Date().toISOString() };
        const docRef = await db.collection("users").add(newPlayerData);
        return { id: docRef.id, ...newPlayerData };
      } catch (error) {
        console.error("Player Registration Error:", error);
        throw new Error("Failed to register player");
      }
    },

    createGlobalTeam: async (_, { teamName, logoUrl, ownerId, playerIds, geoScope }) => {
      try {
        const newTeamData = {
          teamName,
          logoUrl,
          ownerId,
          playerIds, // ఫ్రంటెండ్ ఆటో-కంప్లీట్ చిప్స్ నుండి వచ్చిన ఐడిల అరే
          geoScope,
          createdAt: new Date().toISOString()
        };

        // Firestore లోని 'teams' కలెక్షన్ లోకి డేటా ఇన్సర్ట్ అవుతుంది
        // ఇది మనం రాసిన firestore.rules కి లోబడి సేవ్ అవుతుంది
        const docRef = await db.collection("teams").add(newTeamData);
        
        // డేటాబేస్ క్రియేట్ చేసిన ఐడి తో సహా తిరిగి రిటర్న్ చేస్తున్నాం
        return {
          id: docRef.id,
          ...newTeamData
        };
      } catch (error) {
        console.error("Error in createGlobalTeam Resolver:", error);
        throw new Error("Failed to create global team document inside Firestore.");
      }
    }
  }
};

// 3. Apollo Server ఇనిషియలైజేషన్ (CORS ని ఇక్కడ నిలిపివేసి మనం కింద మాన్యువల్ గా ఇస్తాం)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  cors: false // ఆటోమేటిక్ అపోలో CORS ని ఆపేసాం
});

const handler = server.createHandler();

// 🚀 బ్రౌజర్ ఎర్రర్స్ రాకుండా గట్టిగా పట్టుకునే క్లీన్ CORS మిడిల్‌వేర్ హ్యాండ్లర్
exports.api = functions.https.onRequest((req, res) => {
  // అన్ని ఒరిజిన్స్ మరియు మెథడ్స్ కి పక్కాగా హెడర్స్ ఇస్తున్నాం
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, apollo-require-preflight");

  // బ్రౌజర్ పంపే టెస్ట్ సిగ్నల్ (OPTIONS / Pre-flight) ని ఇక్కడే సక్సెస్ ఫుల్ గా రిటర్న్ చేస్తున్నాం
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  // ఒరిజినల్ రిక్వెస్ట్ ని అపోలో సర్వర్ కి పంపుతున్నాం
  return handler(req, res);
});

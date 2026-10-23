// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Import Isolated Microservices
const { initCoreService } = require("./services/coreService");
const { initLeagueService } = require("./services/leagueService");

// Single Shared Firebase Admin & Firestore Initialization
admin.initializeApp();
const db = admin.firestore();

// 🚀 Microservice 1: Core Service (Players, Global Teams, Ads, Master Geo Registry)
// Endpoint: https://<region>-<project-id>.cloudfunctions.net/api
exports.api = initCoreService(functions, admin, db);

// 🚀 Microservice 2: League Management Microservice
// Endpoint: https://<region>-<project-id>.cloudfunctions.net/leagueService
exports.leagueService = initLeagueService(functions, admin, db);
require('dotenv').config();

// Simple persistent in-memory database for local development
// Data persists across all requests in this session
const mockDatabase = {
  collections: {
    users: new Map(),
    dailyRecords: new Map(),
    transport: new Map()
  },
  logs: []
};

// Mock Firestore Database
class MockFirestore {
  collection(name) {
    if (!mockDatabase.collections[name]) {
      mockDatabase.collections[name] = new Map();
    }
    return new MockCollection(name, mockDatabase.collections[name]);
  }
}

class MockCollection {
  constructor(name, data) {
    this.name = name;
    this.data = data;
  }

  where(field, operator, value) {
    return new MockQuery(this.data, field, operator, value);
  }

  doc(id) {
    return new MockDocRef(this.data, id);
  }
}

class MockQuery {
  constructor(data, field, operator, value) {
    this.data = data;
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  async get() {
    const results = [];
    for (const [id, doc] of this.data) {
      if (this.operator === '==' && doc[this.field] === this.value) {
        results.push({ id, data: () => doc });
      }
    }
    return {
      empty: results.length === 0,
      docs: results
    };
  }
}

class MockDocRef {
  constructor(data, id) {
    this.data = data;
    this.id = id;
  }

  async set(docData) {
    console.log(`[MockDB] Setting document: ${this.id}`, Object.keys(docData));
    // Make a deep copy to avoid reference issues
    this.data.set(this.id, JSON.parse(JSON.stringify(docData)));
    return Promise.resolve();
  }

  async get() {
    const doc = this.data.get(this.id);
    console.log(`[MockDB] Getting document: ${this.id}`, doc ? 'Found' : 'Not found');
    return {
      exists: !!doc,
      data: () => doc ? JSON.parse(JSON.stringify(doc)) : {},
      id: this.id
    };
  }

  async update(docData) {
    const existing = this.data.get(this.id) || {};
    const updated = { ...existing, ...docData };
    this.data.set(this.id, JSON.parse(JSON.stringify(updated)));
    console.log(`[MockDB] Updating document: ${this.id}`);
    return Promise.resolve();
  }

  async delete() {
    this.data.delete(this.id);
    return Promise.resolve();
  }
}

const db = new MockFirestore();

// Mock Auth
const auth = {
  createUser: async (userRecord) => ({ uid: userRecord.email }),
  verifyIdToken: async (token) => ({ uid: token })
};

const admin = {
  initializeApp: () => {},
  firestore: () => db,
  auth: () => auth
};

console.log('[✓] Using in-memory database for local development');
console.log('[✓] All data persists during this session');

module.exports = { db, auth, admin };

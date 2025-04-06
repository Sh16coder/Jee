// Firebase configuration - replace with your project's config
const firebaseConfig = {
  apiKey: "AIzaSyBSxHz0oSES5RcqqX4SPVfceST3UrEGOnU",
  authDomain: "jees-94077.firebaseapp.com",
  databaseURL: "https://jees-94077-default-rtdb.firebaseio.com",
  projectId: "jees-94077",
  storageBucket: "jees-94077.firebasestorage.app",
  messagingSenderId: "863537448366",
  appId: "1:863537448366:web:93cb50b4a4ecdafa61b43f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Helper functions for Firebase operations
const firebaseHelpers = {
  // Save data to Firebase
  saveData: function(path, data) {
    return database.ref(path).set(data);
  },

  // Load data from Firebase
  loadData: function(path, callback) {
    return database.ref(path).on('value', (snapshot) => {
      callback(snapshot.val());
    });
  },

  // Update specific fields in Firebase
  updateData: function(path, updates) {
    return database.ref(path).update(updates);
  },

  // Delete data from Firebase
  deleteData: function(path) {
    return database.ref(path).remove();
  },

  // Check if Firebase is connected
  isConnected: function() {
    return navigator.onLine && firebase.app().options.projectId !== 'YOUR_PROJECT_ID';
  }
};

// Fallback to localStorage if Firebase is not configured
if (!firebaseHelpers.isConnected()) {
  console.warn("Firebase not properly configured - using localStorage as fallback");
  
  const localStorageFallback = {
    saveData: function(path, data) {
      localStorage.setItem(`firebase_${path}`, JSON.stringify(data));
      return Promise.resolve();
    },
    
    loadData: function(path, callback) {
      const data = localStorage.getItem(`firebase_${path}`);
      callback(data ? JSON.parse(data) : null);
      return Promise.resolve();
    },
    
    updateData: function(path, updates) {
      const currentData = JSON.parse(localStorage.getItem(`firebase_${path}`) || {});
      const newData = {...currentData, ...updates};
      localStorage.setItem(`firebase_${path}`, JSON.stringify(newData));
      return Promise.resolve();
    },
    
    deleteData: function(path) {
      localStorage.removeItem(`firebase_${path}`);
      return Promise.resolve();
    }
  };
  
  // Override Firebase helpers with localStorage fallback
  Object.assign(firebaseHelpers, localStorageFallback);
}

// Export Firebase helpers
export { firebaseHelpers, database };

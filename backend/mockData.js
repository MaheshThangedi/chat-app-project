const { v4: uuidv4 } = require('uuid');

// --- A POOL OF MOCK RESPONSES WITH SUGGESTED QUESTIONS ---
const mockResponses = [
  {
    response: {
      text: "Here's an overview of our Q3 sales performance by product category. It appears 'Electronics' are leading the growth:",
      tableData: [
        { "Category": "Electronics", "Q3 Sales": "$1,200,000", "Growth": "15%" },
        { "Category": "Apparel", "Q3 Sales": "$850,000", "Growth": "8%" },
        { "Category": "Home Goods", "Q3 Sales": "$620,000", "Growth": "5%" },
        { "Category": "Books", "Q3 Sales": "$310,000", "Growth": "2%" }
      ]
    },
    suggestions: [
      "Show me Q2 sales data for Electronics",
      "What were the top 3 performing regions in Q3?",
      "Can you project Q4 sales based on current trends?"
    ]
  },
  {
    response: {
      text: "This table summarizes the latest marketing campaign's reach and engagement metrics across different channels:",
      tableData: [
        { "Channel": "Google Ads", "Reach": "1.5M", "Impressions": "5.2M", "CTR": "2.5%" },
        { "Channel": "Facebook Ads", "Reach": "2.1M", "Impressions": "7.8M", "CTR": "1.8%" },
        { "Channel": "Email Marketing", "Reach": "0.8M", "Impressions": "0.9M", "CTR": "15.0%" },
        { "Channel": "LinkedIn Ads", "Reach": "0.4M", "Impressions": "1.1M", "CTR": "0.9%" }
      ]
    },
    suggestions: [
      "Compare Facebook and Google Ads performance",
      "What was the conversion rate for email marketing?",
      "Suggest ways to improve LinkedIn Ads CTR"
    ]
  },
  {
    response: {
      text: "Project status update for 'Phoenix' project. All major modules are on track, with integration testing starting next week:",
      tableData: [
        { "Module": "Frontend UI", "Status": "Completed", "Progress": "100%" },
        { "Module": "Backend API", "Status": "In Progress", "Progress": "90%" },
        { "Module": "Database Schema", "Status": "Completed", "Progress": "100%" },
        { "Module": "Integration Testing", "Status": "Not Started", "Progress": "0%" }
      ]
    },
    suggestions: [
      "Who is responsible for integration testing?",
      "Are there any blockers for the backend API?",
      "Provide a timeline for the next phase of the project"
    ]
  },
  {
    response: {
      text: "Here's the current inventory report for high-demand items in our main warehouse. Stock levels are generally healthy:",
      tableData: [
        { "Item SKU": "ELEC001", "Product Name": "Laptop Pro X", "Stock": 550, "Min Level": 100 },
        { "Item SKU": "HOME005", "Product Name": "Smart Thermostat", "Stock": 320, "Min Level": 50 },
        { "Item SKU": "APPA010", "Product Name": "Premium Hoodie", "Stock": 800, "Min Level": 200 },
        { "Item SKU": "ELEC003", "Product Name": "Wireless Earbuds", "Stock": 1200, "Min Level": 300 }
      ]
    },
    suggestions: [
      "Which items are below minimum stock level?",
      "Generate a purchase order for Laptop Pro X",
      "Show me inventory for all warehouses"
    ]
  },
  {
    response: {
      text: "The quarterly financial summary shows strong revenue growth, primarily driven by new customer acquisition:",
      tableData: [
        { "Metric": "Total Revenue", "Value": "$2.98M", "Change QoQ": "+12%" },
        { "Metric": "Net Profit", "Value": "$0.5M", "Change QoQ": "+10%" },
        { "Metric": "New Customers", "Value": "1,200", "Change QoQ": "+25%" },
        { "Metric": "Operating Expenses", "Value": "$1.8M", "Change QoQ": "+3%" }
      ]
    },
    suggestions: [
      "What were the biggest expenses this quarter?",
      "Show a breakdown of revenue by segment",
      "What are the forecasts for next quarter's revenue?"
    ]
  }
];

// --- "DATABASE" ---
const db = {
  sessions: [
    { id: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8", title: "Q3 Sales Review", dateTime: "2025-11-16T10:30:00Z" },
    { id: "b2c3d4e5-f6a7-8901-h2i3-j4k5l6m7n8o9", title: "Marketing Campaign Performance", dateTime: "2025-11-16T11:45:00Z" },
  ],
  chats: {
    "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8": [
      { sender: 'bot', text: 'Welcome! How can I help you with Q3 sales data today?' }
    ],
    "b2c3d4e5-f6a7-8901-h2i3-j4k5l6m7n8o9": [
      { sender: 'user', text: 'Show me the latest marketing report.' },
      {
        sender: 'bot',
        text: mockResponses[1].response.text,
        tableData: mockResponses[1].response.tableData,
        suggestions: mockResponses[1].suggestions
      }
    ]
  }
};

const getSessions = () => {
  return db.sessions.map(s => ({ id: s.id, title: s.title, dateTime: s.dateTime }));
};

const createNewSession = () => {
  const newId = uuidv4();
  const newSession = {
    id: newId,
    title: "New Session",
    dateTime: new Date().toISOString()
  };
  db.sessions.push(newSession);
  db.chats[newId] = [{ sender: 'bot', text: 'Hello! How can I assist you with a new chat today?' }];
  return newSession;
};

const getSessionHistory = (id) => {
  return db.chats[id] || [];
};

const addMessage = (id, question) => {
  if (!db.chats[id]) {
    db.chats[id] = [];
  }
  
  // Add user message
  db.chats[id].push({ sender: 'user', text: question });

  // Get a random mock response with suggestions
  const randomResponseEntry = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  const botResponse = {
    sender: 'bot',
    text: `${randomResponseEntry.response.text} (In response to: "${question}")`,
    tableData: randomResponseEntry.response.tableData,
    suggestions: randomResponseEntry.suggestions // Attach suggestions here
  };
  
  // Add bot response
  db.chats[id].push(botResponse);
  
  // If this is the first real question (after initial bot welcome), update the session title
  if (db.chats[id].length === 3) { // [bot welcome, user q, bot response]
    const session = db.sessions.find(s => s.id === id);
    if (session) {
      session.title = question.substring(0, 25) + (question.length > 25 ? '...' : ''); // Generate title from first question
    }
  }
  
  return botResponse;
};

module.exports = {
  getSessions,
  createNewSession,
  getSessionHistory,
  addMessage
};
const https = require('https');
const Profile = require('../models/Profile');

/**
 * Fetch candidate profile data dynamically from MongoDB or default schema
 */
async function getCandidateProfileData() {
  try {
    const profile = await Profile.findOne();
    if (profile) {
      return {
        name: profile.name || 'Venkata Siva Reddy',
        role: profile.role || 'Full Stack Developer & Software Engineer',
        degree: profile.degree ? `${profile.degree} in ${profile.branch || 'CSE'}` : 'B.Tech in Computer Science and Engineering',
        graduationYear: profile.graduationYear || 2027,
        cgpa: profile.cgpa || 8.1,
        college: profile.college || 'Rajeev Gandhi Memorial College of Engineering and Technology',
        focus: profile.currentFocus || 'MERN Stack, Data Structures & Algorithms, Cloud Infrastructure, AI Integration'
      };
    }
  } catch (err) {
    console.warn('[AI Controller] Could not fetch profile from DB, using schema defaults:', err.message);
  }

  return {
    name: 'Venkata Siva Reddy',
    role: 'Full Stack Developer & Software Engineer',
    degree: 'B.Tech in Computer Science and Engineering',
    graduationYear: 2027,
    cgpa: 8.1,
    college: 'Rajeev Gandhi Memorial College of Engineering and Technology',
    focus: 'MERN Stack, Data Structures & Algorithms, Cloud Infrastructure, AI Integration'
  };
}

/**
 * Perform basic NLP feature extraction (intent categorization & entity extraction)
 */
function analyzeNlpFeatures(prompt) {
  const cleanPrompt = (prompt || '').trim();

  const techKeywords = [
    'React', 'Node.js', 'Express', 'JavaScript', 'Python', 'Java', 'MongoDB', 'MySQL', 'SQL', 'NoSQL',
    'MERN', 'FastAPI', 'QuickSort', 'Binary Search', 'REST API', 'GraphQL', 'Docker', 'JWT',
    'Candidate', 'Match', 'Security', 'Anomaly', 'Risk', 'MFA', 'OAuth', 'SQL Injection',
    'Venkata Siva Reddy', 'Hire', 'Skills', 'TCP', 'UDP', 'Polymorphism', 'HTTPS', 'CAP theorem'
  ];

  const extractedEntities = [];
  techKeywords.forEach((keyword) => {
    if (new RegExp(`\\b${keyword}\\b`, 'i').test(cleanPrompt)) {
      extractedEntities.push(keyword);
    }
  });

  const lower = cleanPrompt.toLowerCase();
  let intent = 'General Technical Query';

  if (lower.includes('hire') || lower.includes('candidate') || lower.includes('resume') || lower.includes('skill') || lower.includes('who are you') || lower.includes('profile') || lower.includes('why should')) {
    intent = 'Candidate Portfolio Evaluation';
  } else if (lower.includes('anomaly') || lower.includes('security') || lower.includes('risk') || lower.includes('threat') || lower.includes('mfa') || lower.includes('injection') || lower.includes('vulnerability') || lower.includes('https')) {
    intent = 'Security & Threat Anomaly Audit';
  } else if (lower.includes('search') || lower.includes('sort') || lower.includes('algorithm') || lower.includes('binary') || lower.includes('tree') || lower.includes('quicksort') || lower.includes('recursion') || lower.includes('polymorphism')) {
    intent = 'Data Structures & Algorithms';
  } else if (lower.includes('react') || lower.includes('node') || lower.includes('express') || lower.includes('mongodb') || lower.includes('mysql') || lower.includes('sql') || lower.includes('api') || lower.includes('tcp') || lower.includes('udp') || lower.includes('normalization') || lower.includes('cap theorem')) {
    intent = 'Full-Stack & Web Architecture';
  }

  return {
    extractedEntities: Array.from(new Set(extractedEntities)),
    intent
  };
}

/**
 * Google Gemini LLM Service API Call
 */
async function callSingleGeminiModel(prompt, apiKey, candidateInfo, modelName) {
  return new Promise((resolve, reject) => {
    const systemPrompt = `You are an intelligent AI assistant embedded in ${candidateInfo.name}'s software engineering portfolio.
Candidate Details: ${candidateInfo.name}, ${candidateInfo.role}, ${candidateInfo.degree} (${candidateInfo.graduationYear}), College: ${candidateInfo.college}, Focus: ${candidateInfo.focus}.
User Question: "${prompt}"

Provide a clear, accurate, professional 2-4 sentence answer directly addressing the user's question. Do NOT return boilerplate or template code.`;

    const postData = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.2
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.candidates && json.candidates[0] && json.candidates[0].content) {
            const text = json.candidates[0].content.parts[0].text;
            const tokenCount = json.usageMetadata ? json.usageMetadata.totalTokenCount : null;
            resolve({ text: text.trim(), tokenCount });
          } else {
            reject(new Error(json.error?.message || `Gemini API response format invalid (${res.statusCode})`));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

/**
 * Call Gemini API with automatic model fallback
 */
async function callGeminiApi(prompt, apiKey, candidateInfo) {
  const models = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
  let lastError = null;

  for (const model of models) {
    try {
      const res = await callSingleGeminiModel(prompt, apiKey, candidateInfo, model);
      return res;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

/**
 * Portfolio Local Knowledge Engine (Answers supported portfolio/tech topics, or returns truthful unconfigured message)
 */
function solveLocalKnowledgeQuery(prompt, candidateInfo) {
  const p = prompt.toLowerCase().trim();

  // 1. Candidate / Portfolio Queries (Uses real DB candidate data)
  if (p.includes('why should i hire') || p.includes('why hire') || p.includes('hire him')) {
    return `${candidateInfo.name} is a ${candidateInfo.degree} student (${candidateInfo.graduationYear}) at ${candidateInfo.college}. His practical expertise in full-stack MERN development, REST API design, and AI microservices makes him a strong candidate for software engineering roles. He brings strong problem-solving skills and hands-on experience building scalable applications.`;
  }

  if (p.includes('skills') || p.includes('what skills') || p.includes('technologies')) {
    return `Candidate ${candidateInfo.name}'s core technical focus includes: ${candidateInfo.focus}. He is proficient in JavaScript, React, Node.js, Express, MongoDB, Java Data Structures, and cloud deployments.`;
  }

  if (p.includes('who are you') || p.includes('who is the candidate') || p.includes('tell me about')) {
    return `${candidateInfo.name} is a ${candidateInfo.role} pursuing his ${candidateInfo.degree} at ${candidateInfo.college}. He specializes in full-stack web engineering and AI product integrations.`;
  }

  // 2. Security Questions (Truthful explanation without invented fake risk scores)
  if (p.includes('rapid login') || p.includes('session risk') || p.includes('anomaly') || p.includes('threat')) {
    return `Session risk assessment evaluates real-time security telemetry including IP location variance, login attempt frequencies, and device fingerprint headers to detect automated credential stuffing or unauthorized session hijacking. Evaluating risk cannot be performed from prompt text alone; in production environments, suspicious login spikes trigger automated rate limiting and Multi-Factor Authentication (MFA) challenges to protect user accounts.`;
  }

  if (p.includes('sql injection')) {
    return `SQL Injection (SQLi) is a critical web security vulnerability where untrusted input is improperly concatenated into SQL statements, enabling malicious database query execution. It is prevented by enforcing parameterized queries (prepared statements), rigorous input validation, and applying database principal of least privilege.`;
  }

  // 3. Algorithm Questions
  if (p.includes('binary search')) {
    return `Binary Search is an efficient O(log N) divide-and-conquer algorithm used to find the position of a target value within a sorted array. It operates by comparing the target value to the middle element of the array and halving the search space in each iteration until the target is located or the sub-array becomes empty.`;
  }

  if (p.includes('quicksort') || p.includes('quick sort')) {
    return `QuickSort is a highly efficient divide-and-conquer sorting algorithm with an average time complexity of O(N log N). It works by selecting a pivot element from the array, partitioning the remaining elements into two sub-arrays according to whether they are less than or greater than the pivot, and recursively sorting the sub-arrays.`;
  }

  // 4. Web Dev & DB Questions
  if (p.includes('mongodb and mysql') || p.includes('mysql and mongodb') || p.includes('sql vs nosql') || p.includes('nosql vs sql')) {
    return `MySQL is a traditional relational SQL database utilizing strict schemas, structured tables, and ACID transactions suitable for complex relational joins. MongoDB is a NoSQL document-oriented database storing flexible BSON documents, optimized for horizontal scalability, rapid iteration, and dynamic schema requirements.`;
  }

  if (p.includes('react')) {
    return `React is an open-source component-based JavaScript library developed by Meta for building dynamic user interfaces. It utilizes a Virtual DOM reconciliation algorithm to compute minimal UI state updates, ensuring high performance for modern web applications.`;
  }

  if (/\bapi\b/i.test(p) || /\brest api\b/i.test(p)) {
    return `A REST API (Representational State Transfer) is an architectural style for web services that uses stateless HTTP methods (GET, POST, PUT, DELETE) to manage resource states and exchange structured JSON payloads between client applications and server backends.`;
  }

  // 5. Truthful Fallback for unsupported / general queries when Gemini is unconfigured
  return `The cloud generative AI service is currently unconfigured. I can answer questions regarding ${candidateInfo.name}'s portfolio, candidate profile, web development (React, REST APIs, databases), algorithms, and security topics supported in the local knowledge engine.`;
}

/**
 * Controller Handler: POST /api/nlp/query
 */
exports.processNlpQuery = async (req, res) => {
  const startTime = Date.now();
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Prompt query string is required.'
    });
  }

  const cleanPrompt = prompt.trim();
  const nlpInfo = analyzeNlpFeatures(cleanPrompt);
  const candidateInfo = await getCandidateProfileData();

  let answer = '';
  let source = 'Local Knowledge Engine';
  let tokenCount = null;

  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (apiKey && apiKey !== 're_your_api_key_here' && apiKey !== 'your_api_key_here') {
    try {
      const geminiResult = await callGeminiApi(cleanPrompt, apiKey, candidateInfo);
      answer = geminiResult.text;
      tokenCount = geminiResult.tokenCount;
      source = 'Google Gemini LLM Service';
    } catch (err) {
      console.warn('[AI Controller Warning] Gemini API call failed, using local solver:', err.message);
      answer = solveLocalKnowledgeQuery(cleanPrompt, candidateInfo);
    }
  } else {
    answer = solveLocalKnowledgeQuery(cleanPrompt, candidateInfo);
  }

  const processingTimeMs = Date.now() - startTime;
  const wordsCount = answer ? answer.trim().split(/\s+/).filter(Boolean).length : 0;

  res.json({
    success: true,
    prompt: cleanPrompt,
    answer,
    nlpAnalysis: {
      intent: nlpInfo.intent,
      wordsCount,
      tokensCount: tokenCount,
      extractedEntities: nlpInfo.extractedEntities,
      processingTimeMs,
      source
    }
  });
};

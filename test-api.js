// Quick API Test Script
// Run with: node test-api.js

require('dotenv').config();
const axios = require('axios');

const RAWG_KEY = process.env.REACT_APP_RAWG_KEY;
const BASE_URL = 'https://api.rawg.io/api';

async function testAPI() {
  console.log('🎮 Testing RAWG API Connection...\n');
  
  if (!RAWG_KEY) {
    console.error('❌ RAWG API key not found!');
    console.log('📝 Please create a .env file with: REACT_APP_RAWG_KEY=your_key_here');
    console.log('🔗 Get your free key at: https://rawg.io/apidocs');
    return;
  }
  
  console.log('✅ API key found:', RAWG_KEY.substring(0, 8) + '...');
  
  try {
    // Test basic API connection
    console.log('🔍 Testing API connection...');
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: RAWG_KEY,
        platforms: '15,16', // PS2 and PS3
        page_size: 5
      }
    });
    
    console.log('✅ API connection successful!');
    console.log(`📊 Found ${response.data.count} total games`);
    console.log(`🎯 Retrieved ${response.data.results.length} games in this request`);
    
    console.log('\n🎮 Sample games:');
    response.data.results.forEach((game, index) => {
      console.log(`${index + 1}. ${game.name} (${game.released || 'Unknown year'})`);
    });
    
    console.log('\n🎉 Your API setup is working perfectly!');
    console.log('🚀 You can now run: npm start');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.response?.status === 401) {
      console.log('🔑 Invalid API key. Please check your key at https://rawg.io/apidocs');
    } else if (error.response?.status === 429) {
      console.log('⏰ Rate limit exceeded. Please wait a moment and try again.');
    } else {
      console.log('🌐 Check your internet connection and try again.');
    }
  }
}

testAPI(); 
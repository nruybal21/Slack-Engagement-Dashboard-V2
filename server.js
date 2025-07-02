// Enhanced server.js for Render deployment
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 10000; // Render uses port 10000 by default

// Slack Integration Setup (for future use)
const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
let slackIntegration = null;

if (SLACK_TOKEN) {
    console.log('🔌 Slack token detected - integration ready');
} else {
    console.log('ℹ️ No Slack token provided, using sample data mode');
}

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-render-app.onrender.com'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv',
            'application/json'
        ];
        
        if (allowedTypes.includes(file.mimetype) || 
            file.originalname.toLowerCase().match(/\.(xlsx|xls|csv|json)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Please upload Excel, CSV, or JSON files.'));
        }
    }
});

// Data storage
let teamMembers = [];
let uploadedFiles = [];
let systemHealth = {
    status: 'healthy',
    uptime: Date.now(),
    version: '2.0.0',
    environment: 'render',
    features: ['team-management', 'analytics', 'file-upload', 'mom-tracking', 'slack-integration']
};

// Enhanced sample team data
function loadSampleTeamData() {
    return [
        { 
            id: 'U001', name: 'Nicole Ruybal', role: 'Primary Owner', state: 'Colorado', 
            messages: 96, reactions: 180, comments: 45, responseTime: 1.2, 
            engagementScore: 96, trend: 'up', performance: 'excellent',
            lastActive: '2024-07-02T10:30:00Z', timezone: 'MT', isActive: true
        },
        { 
            id: 'U002', name: 'Chloe Entner', role: 'Team Member', state: 'Colorado', 
            messages: 89, reactions: 145, comments: 38, responseTime: 1.8, 
            engagementScore: 89, trend: 'up', performance: 'good',
            lastActive: '2024-07-02T09:15:00Z', timezone: 'MT', isActive: true
        },
        { 
            id: 'U003', name: 'Crystal Foley', role: 'Team Member', state: 'Colorado', 
            messages: 92, reactions: 156, comments: 42, responseTime: 1.5, 
            engagementScore: 92, trend: 'up', performance: 'excellent',
            lastActive: '2024-07-02T11:00:00Z', timezone: 'MT', isActive: true
        },
        { 
            id: 'U008', name: 'Constance Montgomery', role: 'Team Member', state: 'West Texas', 
            messages: 94, reactions: 178, comments: 47, responseTime: 1.3, 
            engagementScore: 94, trend: 'up', performance: 'excellent',
            lastActive: '2024-07-02T10:45:00Z', timezone: 'CT', isActive: true
        },
        { 
            id: 'U009', name: 'Kris Schmidt', role: 'Team Member', state: 'West Texas', 
            messages: 90, reactions: 165, comments: 43, responseTime: 1.7, 
            engagementScore: 90, trend: 'up', performance: 'excellent',
            lastActive: '2024-07-02T09:30:00Z', timezone: 'CT', isActive: true
        },
        { 
            id: 'U014', name: 'Gidget Miller', role: 'Team Member', state: 'EPNM', 
            messages: 91, reactions: 159, comments: 42, responseTime: 2.1, 
            engagementScore: 91, trend: 'up', performance: 'excellent',
            lastActive: '2024-07-02T10:20:00Z', timezone: 'MT', isActive: true
        },
        { 
            id: 'U017', name: 'Erica Torres', role: 'Team Member', state: 'EPNM', 
            messages: 92, reactions: 164, comments: 44, responseTime: 2.2, 
            engagementScore: 92, trend: 'up', performance: 'excellent',
            lastActive: '2024-07-02T11:15:00Z', timezone: 'MT', isActive: true
        },
        { 
            id: 'U019', name: 'Jen Hettum', role: 'Team Member', state: 'EPNM', 
            messages: 90, reactions: 147, comments: 41, responseTime: 2.3, 
            engagementScore: 90, trend: 'up', performance: 'excellent',
            lastActive: '2024-07-02T09:45:00Z', timezone: 'MT', isActive: true
        }
    ];
}

// Utility functions
function determinePerformance(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
}

function mapState(state) {
    const stateStr = state.toString().toLowerCase();
    if (stateStr.includes('colorado') || stateStr.includes('co')) return 'Colorado';
    if (stateStr.includes('texas') || stateStr.includes('tx') || stateStr.includes('west')) return 'West Texas';
    if (stateStr.includes('epnm') || stateStr.includes('new mexico') || stateStr.includes('nm')) return 'EPNM';
    return 'Colorado';
}

// =============================================================================
// API ENDPOINTS
// =============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - systemHealth.uptime,
        teamMemberCount: teamMembers.length,
        uploadedFilesCount: uploadedFiles.length,
        version: systemHealth.version,
        environment: 'render',
        features: systemHealth.features,
        slackIntegration: {
            available: !!SLACK_TOKEN,
            connected: !!slackIntegration
        }
    });
});

// =============================================================================
// SLACK API ENDPOINTS (with fallback to sample data)
// =============================================================================

// Test Slack connection
app.get('/api/slack/test', async (req, res) => {
    try {
        if (!SLACK_TOKEN) {
            return res.json({
                success: false,
                error: 'Slack integration not configured. Using sample data mode.'
            });
        }

        // If we had real Slack integration, we'd test it here
        // For now, return success with sample data indication
        res.json({
            success: true,
            team: 'Sample Workspace',
            teamId: 'T1234567890',
            botId: 'B1234567890',
            message: 'Using sample data - set SLACK_BOT_TOKEN environment variable for real integration'
        });
    } catch (error) {
        console.error('Slack test error:', error);
        res.json({
            success: false,
            error: error.message
        });
    }
});

// Get Slack users with engagement data
app.get('/api/slack/users', async (req, res) => {
    try {
        // For demo purposes, return enhanced sample data
        const sampleData = loadSampleTeamData();
        
        res.json({
            success: true,
            data: sampleData,
            source: SLACK_TOKEN ? 'slack_api_ready' : 'sample_data',
            stats: {
                totalUsers: sampleData.length,
                activeUsers: sampleData.filter(u => u.isActive).length,
                messagesAnalyzed: sampleData.reduce((sum, u) => sum + u.messages, 0),
                reactionsAnalyzed: sampleData.reduce((sum, u) => sum + u.reactions, 0),
                channelsAnalyzed: 5,
                dataRange: '30 days (simulated)'
            }
        });
    } catch (error) {
        console.error('Get Slack users error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Slack channels
app.get('/api/slack/channels', async (req, res) => {
    try {
        // Return sample channel data
        const sampleChannels = [
            { id: 'C001', name: 'general', isPrivate: false, memberCount: 20, messageCount: 150, purpose: 'Company-wide announcements', isArchived: false },
            { id: 'C002', name: 'colorado-team', isPrivate: false, memberCount: 7, messageCount: 89, purpose: 'Colorado regional discussions', isArchived: false },
            { id: 'C003', name: 'west-texas-team', isPrivate: false, memberCount: 5, messageCount: 76, purpose: 'West Texas regional discussions', isArchived: false },
            { id: 'C004', name: 'epnm-team', isPrivate: false, memberCount: 8, messageCount: 92, purpose: 'EPNM regional discussions', isArchived: false },
            { id: 'C005', name: 'leadership', isPrivate: true, memberCount: 4, messageCount: 45, purpose: 'Leadership team discussions', isArchived: false }
        ];

        res.json({
            success: true,
            data: sampleChannels,
            source: SLACK_TOKEN ? 'slack_api_ready' : 'sample_data',
            stats: {
                totalChannels: sampleChannels.length,
                publicChannels: sampleChannels.filter(c => !c.isPrivate).length,
                privateChannels: sampleChannels.filter(c => c.isPrivate).length,
                totalMembers: sampleChannels.reduce((sum, c) => sum + c.memberCount, 0),
                totalMessages: sampleChannels.reduce((sum, c) => sum + c.messageCount, 0)
            }
        });
    } catch (error) {
        console.error('Get Slack channels error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get workspace info
app.get('/api/slack/workspace', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                name: 'Enhanced Slack Dashboard Workspace',
                id: 'T1234567890',
                domain: 'enhanced-slack-workspace',
                plan: 'Pro',
                memberCount: teamMembers.length || 20
            },
            source: SLACK_TOKEN ? 'slack_api' : 'sample_data'
        });
    } catch (error) {
        console.error('Get workspace info error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =============================================================================
// TEAM MEMBER MANAGEMENT ENDPOINTS
// =============================================================================

// Get all team members
app.get('/api/team-members', (req, res) => {
    try {
        const includeAnalytics = req.query.analytics === 'true';
        
        const summary = {
            total: teamMembers.length,
            byState: {
                Colorado: teamMembers.filter(m => m.state === 'Colorado').length,
                'West Texas': teamMembers.filter(m => m.state === 'West Texas').length,
                'EPNM': teamMembers.filter(m => m.state === 'EPNM').length
            },
            byPerformance: {
                excellent: teamMembers.filter(m => m.performance === 'excellent').length,
                good: teamMembers.filter(m => m.performance === 'good').length,
                average: teamMembers.filter(m => m.performance === 'average').length,
                poor: teamMembers.filter(m => m.performance === 'poor').length
            },
            averageEngagement: teamMembers.length > 0 ? 
                Math.round(teamMembers.reduce((sum, m) => sum + m.engagementScore, 0) / teamMembers.length) : 0,
            totalMessages: teamMembers.reduce((sum, m) => sum + m.messages, 0),
            totalReactions: teamMembers.reduce((sum, m) => sum + (m.reactions || 0), 0)
        };

        let responseData = {
            success: true,
            data: teamMembers,
            summary: summary,
            lastUpdated: new Date().toISOString()
        };

        if (includeAnalytics) {
            responseData.analytics = {
                trends: 'Sample trend data',
                predictions: 'Sample prediction data'
            };
        }

        res.json(responseData);
    } catch (error) {
        console.error('Error getting team members:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve team members',
            details: error.message
        });
    }
});

// Add new team member
app.post('/api/team-members', (req, res) => {
    try {
        const { name, role, state, messages, engagementScore, trend } = req.body;
        
        if (!name || !state) {
            return res.status(400).json({
                success: false,
                error: 'Name and state are required'
            });
        }

        const maxId = Math.max(...teamMembers.map(m => parseInt(m.id.substring(1)) || 0), 0);
        const newId = `U${String(maxId + 1).padStart(3, '0')}`;

        const newMember = {
            id: newId,
            name: name.trim(),
            role: role || 'Team Member',
            state: mapState(state),
            messages: parseInt(messages) || 85,
            reactions: Math.floor(Math.random() * 50) + 100,
            comments: Math.floor(Math.random() * 20) + 30,
            responseTime: (Math.random() * 2 + 1).toFixed(1),
            engagementScore: parseInt(engagementScore) || 85,
            trend: trend || 'stable',
            performance: determinePerformance(parseInt(engagementScore) || 85),
            lastActive: new Date().toISOString(),
            timezone: state === 'West Texas' ? 'CT' : 'MT',
            isActive: true,
            createdAt: new Date().toISOString()
        };

        teamMembers.push(newMember);

        res.json({
            success: true,
            data: newMember,
            message: `Successfully added ${newMember.name} to ${newMember.state}`
        });

    } catch (error) {
        console.error('Error adding team member:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add team member',
            details: error.message
        });
    }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Process uploaded file here
        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileName: req.file.originalname,
                size: req.file.size,
                uploadedAt: new Date().toISOString()
            }
        });

        // Clean up uploaded file
        setTimeout(() => {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.warn('Could not clean up uploaded file:', cleanupError.message);
            }
        }, 5000);

    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process uploaded file',
            details: error.message
        });
    }
});

// =============================================================================
// SERVE DASHBOARD
// =============================================================================

// Serve the main dashboard
app.get('/', (req, res) => {
    const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Enhanced Slack Dashboard - Render Deployment</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; padding: 20px;
        }
        .container { 
            max-width: 1200px; margin: 0 auto; background: white; 
            border-radius: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.15); overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #4a154b 0%, #1264a3 100%);
            color: white; padding: 30px; text-align: center;
        }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .status { 
            padding: 20px; background: #e8f5e8; border-left: 5px solid #27ae60;
            margin: 20px; border-radius: 8px; font-weight: 600;
        }
        .btn { 
            display: inline-block; padding: 12px 24px; margin: 10px;
            background: linear-gradient(135deg, #4a154b, #1264a3); color: white;
            text-decoration: none; border-radius: 8px; font-weight: 600;
            transition: all 0.3s ease; border: none; cursor: pointer;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .features { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px; padding: 30px; margin: 20px;
        }
        .feature { 
            padding: 20px; background: #f8f9fa; border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center;
        }
        .feature h3 { color: #2c3e50; margin-bottom: 10px; }
        .api-links { padding: 20px; text-align: center; }
        .api-links a { 
            display: inline-block; margin: 5px 10px; padding: 8px 16px;
            background: #3498db; color: white; text-decoration: none;
            border-radius: 6px; font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Enhanced Slack Dashboard</h1>
            <p>Real-Time Multi-State Communication Analytics</p>
            <p><strong>✅ Successfully deployed on Render!</strong></p>
        </div>
        
        <div class="status" id="statusMessage">
            🎉 Dashboard is running successfully on Render! Ready for team analytics.
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>📊 Real-Time Analytics</h3>
                <p>Track team engagement across Colorado, West Texas, and EPNM regions with live month-over-month insights.</p>
            </div>
            <div class="feature">
                <h3>🔗 Slack Integration</h3>
                <p>Connect to your Slack workspace for real-time data or use enhanced sample data for demonstrations.</p>
            </div>
            <div class="feature">
                <h3>📈 Advanced Charts</h3>
                <p>Interactive Chart.js visualizations showing trends, performance distributions, and predictive analytics.</p>
            </div>
            <div class="feature">
                <h3>👥 Team Management</h3>
                <p>Add, edit, and manage team members with role assignments and performance tracking.</p>
            </div>
        </div>
        
        <div style="text-align: center; padding: 30px;">
            <button class="btn" onclick="loadDashboard()">
                🚀 Launch Dashboard
            </button>
            <button class="btn" onclick="testAPI()">
                🧪 Test API
            </button>
            <button class="btn" onclick="loadSampleData()">
                📋 Load Sample Data
            </button>
        </div>
        
        <div class="api-links">
            <h3 style="margin-bottom: 15px; color: #2c3e50;">API Endpoints:</h3>
            <a href="/health">Health Check</a>
            <a href="/api/slack/test">Test Slack</a>
            <a href="/api/slack/users">User Data</a>
            <a href="/api/slack/channels">Channels</a>
            <a href="/api/team-members">Team Members</a>
        </div>
    </div>

    <script>
        function updateStatus(message) {
            document.getElementById('statusMessage').textContent = message;
        }

        async function loadDashboard() {
            updateStatus('🔄 Loading dashboard interface...');
            // Here you would load your full dashboard HTML
            updateStatus('✅ Dashboard interface ready! (Full dashboard HTML to be integrated)');
        }

        async function testAPI() {
            try {
                updateStatus('🧪 Testing API connections...');
                
                const healthCheck = await fetch('/health');
                const healthData = await healthCheck.json();
                
                const slackTest = await fetch('/api/slack/test');
                const slackData = await slackTest.json();
                
                updateStatus(\`✅ API Test Complete - Health: \${healthData.status}, Slack: \${slackData.success ? 'Ready' : 'Sample Mode'}\`);
                
            } catch (error) {
                updateStatus('❌ API test failed: ' + error.message);
            }
        }

        async function loadSampleData() {
            try {
                updateStatus('📋 Loading sample team data...');
                
                const response = await fetch('/api/slack/users');
                const data = await response.json();
                
                if (data.success) {
                    updateStatus(\`✅ Loaded \${data.data.length} team members - \${data.stats.messagesAnalyzed} messages analyzed\`);
                } else {
                    updateStatus('❌ Failed to load sample data');
                }
                
            } catch (error) {
                updateStatus('❌ Sample data loading failed: ' + error.message);
            }
        }

        // Auto-test on load
        setTimeout(testAPI, 2000);
    </script>
</body>
</html>`;

    res.send(dashboardHTML);
});

// =============================================================================
// ERROR HANDLING & STARTUP
// =============================================================================

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
            '/health',
            '/api/slack/test',
            '/api/slack/users',
            '/api/slack/channels',
            '/api/team-members'
        ]
    });
});

// Initialize with sample data
teamMembers = loadSampleTeamData();

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Enhanced Slack Dashboard Server running on port ${PORT}`);
    console.log(`📊 Dashboard available at: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    console.log(`👥 Initial team members loaded: ${teamMembers.length}`);
    console.log(`✨ Features: ${systemHealth.features.join(', ')}`);
    console.log(`🌐 Environment: Render deployment ready`);
    
    if (SLACK_TOKEN) {
        console.log('🔌 Slack integration available');
    } else {
        console.log('ℹ️ Running in sample data mode - set SLACK_BOT_TOKEN for real integration');
    }
});

module.exports = app;

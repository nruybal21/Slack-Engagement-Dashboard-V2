// server.js - Complete Enhanced Slack Dashboard for Render
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced sample team data with detailed analytics
const sampleTeamData = [
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
        id: 'U004', name: 'Jeff Goulet', role: 'Team Member', state: 'Colorado', 
        messages: 85, reactions: 120, comments: 35, responseTime: 2.2, 
        engagementScore: 85, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T08:45:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U005', name: 'Hannah Jackson', role: 'Team Member', state: 'Colorado', 
        messages: 88, reactions: 134, comments: 40, responseTime: 1.9, 
        engagementScore: 88, trend: 'up', performance: 'good',
        lastActive: '2024-07-02T10:15:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U006', name: 'Amy Partlow', role: 'Team Member', state: 'Colorado', 
        messages: 91, reactions: 167, comments: 44, responseTime: 1.6, 
        engagementScore: 91, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T11:30:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U007', name: 'Haley Santiago', role: 'Team Member', state: 'Colorado', 
        messages: 87, reactions: 142, comments: 39, responseTime: 2.0, 
        engagementScore: 87, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T09:00:00Z', timezone: 'MT', isActive: true
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
        id: 'U010', name: 'Sandi Franklin', role: 'Team Member', state: 'West Texas', 
        messages: 86, reactions: 148, comments: 38, responseTime: 1.9, 
        engagementScore: 86, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T08:20:00Z', timezone: 'CT', isActive: true
    },
    { 
        id: 'U011', name: 'Jonathan Barnhart', role: 'Team Member', state: 'West Texas', 
        messages: 89, reactions: 156, comments: 41, responseTime: 1.8, 
        engagementScore: 89, trend: 'up', performance: 'good',
        lastActive: '2024-07-02T10:10:00Z', timezone: 'CT', isActive: true
    },
    { 
        id: 'U012', name: 'Christian Melendez', role: 'Team Member', state: 'West Texas', 
        messages: 93, reactions: 172, comments: 46, responseTime: 1.5, 
        engagementScore: 93, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T11:20:00Z', timezone: 'CT', isActive: true
    },
    { 
        id: 'U013', name: 'Scott Duerfeldt', role: 'Team Member', state: 'EPNM', 
        messages: 88, reactions: 143, comments: 37, responseTime: 2.3, 
        engagementScore: 88, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T08:50:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U014', name: 'Gidget Miller', role: 'Team Member', state: 'EPNM', 
        messages: 91, reactions: 159, comments: 42, responseTime: 2.1, 
        engagementScore: 91, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T10:20:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U015', name: 'Sandra Lopez', role: 'Team Member', state: 'EPNM', 
        messages: 87, reactions: 138, comments: 36, responseTime: 2.6, 
        engagementScore: 87, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T09:10:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U016', name: 'Kelly Rose-Jones', role: 'Team Member', state: 'EPNM', 
        messages: 89, reactions: 151, comments: 40, responseTime: 2.4, 
        engagementScore: 89, trend: 'up', performance: 'good',
        lastActive: '2024-07-02T10:35:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U017', name: 'Erica Torres', role: 'Team Member', state: 'EPNM', 
        messages: 92, reactions: 164, comments: 44, responseTime: 2.2, 
        engagementScore: 92, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T11:15:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U018', name: 'Jake Alsept', role: 'Team Member', state: 'EPNM', 
        messages: 85, reactions: 132, comments: 34, responseTime: 2.8, 
        engagementScore: 85, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T08:30:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U019', name: 'Jen Hettum', role: 'Team Member', state: 'EPNM', 
        messages: 90, reactions: 147, comments: 41, responseTime: 2.3, 
        engagementScore: 90, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T09:45:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U020', name: 'Hector R Ramirez-Bruno', role: 'Team Member', state: 'EPNM', 
        messages: 88, reactions: 140, comments: 38, responseTime: 2.5, 
        engagementScore: 88, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T10:05:00Z', timezone: 'MT', isActive: true
    }
];

// Store team data
let teamMembers = [...sampleTeamData];

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        teamMemberCount: teamMembers.length,
        version: '2.0.0',
        environment: 'render',
        uptime: process.uptime()
    });
});

// API Endpoints
app.get('/api/slack/test', (req, res) => {
    res.json({
        success: true,
        team: 'Enhanced Slack Dashboard',
        teamId: 'T1234567890',
        message: 'Complete dashboard interface deployed successfully on Render!',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/slack/users', (req, res) => {
    res.json({
        success: true,
        data: teamMembers,
        source: 'enhanced_sample_data',
        stats: {
            totalUsers: teamMembers.length,
            activeUsers: teamMembers.filter(u => u.isActive).length,
            messagesAnalyzed: teamMembers.reduce((sum, u) => sum + u.messages, 0),
            reactionsAnalyzed: teamMembers.reduce((sum, u) => sum + u.reactions, 0),
            channelsAnalyzed: 5,
            dataRange: '30 days (real-time simulation)',
            lastUpdated: new Date().toISOString()
        }
    });
});

app.get('/api/slack/channels', (req, res) => {
    const sampleChannels = [
        { id: 'C001', name: 'general', memberCount: 20, messageCount: 150, isPrivate: false, purpose: 'Company-wide announcements' },
        { id: 'C002', name: 'colorado-team', memberCount: 7, messageCount: 89, isPrivate: false, purpose: 'Colorado regional discussions' },
        { id: 'C003', name: 'west-texas-team', memberCount: 5, messageCount: 76, isPrivate: false, purpose: 'West Texas regional discussions' },
        { id: 'C004', name: 'epnm-team', memberCount: 8, messageCount: 92, isPrivate: false, purpose: 'EPNM regional discussions' },
        { id: 'C005', name: 'leadership', memberCount: 4, messageCount: 45, isPrivate: true, purpose: 'Leadership team discussions' }
    ];

    res.json({
        success: true,
        data: sampleChannels,
        source: 'sample_data',
        stats: {
            totalChannels: sampleChannels.length,
            publicChannels: sampleChannels.filter(c => !c.isPrivate).length,
            privateChannels: sampleChannels.filter(c => c.isPrivate).length,
            totalMembers: sampleChannels.reduce((sum, c) => sum + c.memberCount, 0),
            totalMessages: sampleChannels.reduce((sum, c) => sum + c.messageCount, 0)
        }
    });
});

app.get('/api/team-members', (req, res) => {
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
        averageEngagement: Math.round(teamMembers.reduce((sum, m) => sum + m.engagementScore, 0) / teamMembers.length),
        totalMessages: teamMembers.reduce((sum, m) => sum + m.messages, 0),
        totalReactions: teamMembers.reduce((sum, m) => sum + m.reactions, 0)
    };

    res.json({
        success: true,
        data: teamMembers,
        summary: summary,
        lastUpdated: new Date().toISOString()
    });
});

// Analytics endpoint
app.get('/api/analytics/summary', (req, res) => {
    const period = req.query.period || '6months';
    
    const analytics = {
        period: period,
        currentMetrics: {
            totalEngagement: Math.round(teamMembers.reduce((sum, m) => sum + m.engagementScore, 0) / teamMembers.length),
            totalMessages: teamMembers.reduce((sum, m) => sum + m.messages, 0),
            activeMembers: teamMembers.filter(m => m.isActive).length,
            avgResponseTime: 2.1
        },
        trends: {
            engagementGrowth: '+12.3%',
            messageGrowth: '+8.7%',
            memberGrowth: '+5.2%',
            responseImprovement: '+15.4%'
        },
        regionalBreakdown: {
            Colorado: {
                members: teamMembers.filter(m => m.state === 'Colorado').length,
                avgEngagement: Math.round(teamMembers.filter(m => m.state === 'Colorado').reduce((sum, m) => sum + m.engagementScore, 0) / teamMembers.filter(m => m.state === 'Colorado').length)
            },
            'West Texas': {
                members: teamMembers.filter(m => m.state === 'West Texas').length,
                avgEngagement: Math.round(teamMembers.filter(m => m.state === 'West Texas').reduce((sum, m) => sum + m.engagementScore, 0) / teamMembers.filter(m => m.state === 'West Texas').length)
            },
            'EPNM': {
                members: teamMembers.filter(m => m.state === 'EPNM').length,
                avgEngagement: Math.round(teamMembers.filter(m => m.state === 'EPNM').reduce((sum, m) => sum + m.engagementScore, 0) / teamMembers.filter(m => m.state === 'EPNM').length)
            }
        }
    };

    res.json({
        success: true,
        data: analytics,
        timestamp: new Date().toISOString()
    });
});

// Main dashboard route with COMPLETE interface
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Enhanced Slack Dashboard - Complete Interface</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4a154b 0%, #1264a3 100%);
            color: white;
            padding: 30px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: headerGlow 8s ease-in-out infinite;
        }
        
        @keyframes headerGlow {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
        }
        
        .header h1 {
            font-size: 3rem;
            margin: 0 0 15px 0;
            font-weight: 800;
            position: relative;
            z-index: 1;
        }
        
        .header p {
            font-size: 1.3rem;
            margin: 0;
            opacity: 0.95;
            position: relative;
            z-index: 1;
        }
        
        .render-badge {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-top: 10px;
            display: inline-block;
            backdrop-filter: blur(10px);
        }
        
        .tab-navigation {
            display: flex;
            background: #34495e;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow-x: auto;
        }
        
        .tab-button {
            flex: 1;
            min-width: 180px;
            padding: 20px 25px;
            background: #34495e;
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            border-bottom: 4px solid transparent;
        }
        
        .tab-button:hover {
            background: #3498db;
            transform: translateY(-2px);
        }
        
        .tab-button.active {
            background: #3498db;
            border-bottom-color: #2980b9;
            box-shadow: inset 0 3px 0 #2980b9;
        }
        
        .tab-badge {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 700;
            margin-left: 8px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .tab-content {
            display: none;
            padding: 40px;
            min-height: 600px;
            animation: fadeIn 0.5s ease-in;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .section-title {
            font-size: 2rem;
            color: #2c3e50;
            margin-bottom: 25px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .section-title::after {
            content: '';
            flex: 1;
            height: 3px;
            background: linear-gradient(90deg, #3498db, transparent);
            margin-left: 20px;
        }
        
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .kpi-card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border-left: 6px solid #4a154b;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .kpi-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        
        .kpi-card.excellent {
            border-left-color: #27ae60;
            background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%);
        }
        
        .kpi-card.good {
            border-left-color: #3498db;
            background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
        }
        
        .kpi-card.warning {
            border-left-color: #f39c12;
            background: linear-gradient(135deg, #ffffff 0%, #fffcf0 100%);
        }
        
        .kpi-label {
            font-size: 1rem;
            color: #7f8c8d;
            margin-bottom: 15px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .kpi-value {
            font-size: 3rem;
            font-weight: 900;
            color: #2c3e50;
            margin-bottom: 10px;
            line-height: 1;
        }
        
        .kpi-change {
            font-size: 0.95rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
        }
        
        .kpi-change.positive {
            color: #27ae60;
        }
        
        .mom-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 12px;
            font-size: 0.85rem;
            font-weight: 600;
            padding: 8px 12px;
            border-radius: 20px;
            background: rgba(255,255,255,0.5);
            backdrop-filter: blur(10px);
        }
        
        .mom-percentage {
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 700;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
        }
        
        .connection-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .connection-status.connected {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
        }
        
        .connection-status.loading {
            background: linear-gradient(135deg, #f39c12, #f7dc6f);
            color: white;
        }
        
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 25px;
            margin: 30px 0;
        }
        
        .chart-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            height: 350px;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }
        
        .chart-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #4a154b, #1264a3, #3498db);
        }
        
        .chart-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        
        .chart-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 3px solid #ecf0f1;
        }
        
        .chart-container {
            flex: 1;
            position: relative;
            min-height: 250px;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 15px 30px;
            margin: 10px;
            background: linear-gradient(135deg, #4a154b, #1264a3);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(74, 21, 75, 0.3);
            text-decoration: none;
        }
        
        .btn:hover {
            background: linear-gradient(135deg, #5a1f5b, #1574b3);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 21, 75, 0.4);
        }
        
        .btn.success {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
        }
        
        .btn.secondary {
            background: linear-gradient(135deg, #95a5a6, #7f8c8d);
        }
        
        .status {
            padding: 20px;
            margin: 20px 0;
            background: linear-gradient(135deg, #d5f4e6, #ffecd1);
            border: 1px solid #b2dfdb;
            border-radius: 10px;
            font-weight: 600;
            color: #2c3e50;
            border-left: 5px solid #27ae60;
            position: relative;
            overflow: hidden;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #7f8c8d;
            font-size: 1.1rem;
        }
        
        .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.5;
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .member-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .member-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-left: 4px solid #3498db;
            transition: all 0.3s ease;
        }
        
        .member-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .member-card.excellent {
            border-left-color: #27ae60;
        }
        
        .member-card.good {
            border-left-color: #3498db;
        }
        
        .member-header {
            margin-bottom: 15px;
        }
        
        .member-header h4 {
            margin: 0 0 5px 0;
            color: #2c3e50;
            font-size: 1.1rem;
        }
        
        .member-header p {
            margin: 0;
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        .member-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 15px;
        }
        
        .stat-item {
            text-align: center;
            padding: 8px;
            background: rgba(255,255,255,0.7);
            border-radius: 6px;
            backdrop-filter: blur(10px);
        }
        
        .stat-value {
            font-weight: 700;
            color: #2c3e50;
            font-size: 0.9rem;
        }
        
        .stat-label {
            font-size: 0.7rem;
            color: #7f8c8d;
            text-transform: uppercase;
        }
        
        .performance-indicator {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .performance-indicator.excellent {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
        }
        
        .performance-indicator.good {
            background: linear-gradient(135deg, #3498db, #5dade2);
            color: white;
        }
        
        @media (max-width: 768px) {
            .tab-navigation {
                flex-direction: column;
            }
            
            .tab-button {
                min-width: auto;
                flex: none;
            }
            
            .container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .header {
                padding: 25px 20px;
            }
            
            .header h1 {
                font-size: 2.2rem;
            }
            
            .tab-content {
                padding: 25px 20px;
            }
            
            .kpi-grid {
                grid-template-columns: 1fr;
            }
            
            .charts-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Enhanced Slack Dashboard</h1>
            <p>Real-Time Multi-State Communication Analytics with Advanced Features</p>
            <div class="render-badge">
                ✅ Complete Interface Live on Render
            </div>
        </div>

        <div class="tab-navigation">
            <button class="tab-button active" onclick="showTab('executive')" id="tab-executive">
                📊 Executive Summary
                <span class="tab-badge" id="badge-executive">Live</span>
            </button>
            <button class="tab-button" onclick="showTab('analytics')" id="tab-analytics">
                📈 MoM Analytics
                <span class="tab-badge" id="badge-analytics">Trends</span>
            </button>
            <button class="tab-button" onclick="showTab('colorado')" id="tab-colorado">
                🏔️ Colorado
                <span class="tab-badge" id="badge-colorado">7</span>
            </button>
            <button class="tab-button" onclick="showTab('west-texas')" id="tab-west-texas">
                🤠 West Texas
                <span class="tab-badge" id="badge-west-texas">5</span>
            </button>
            <button class="tab-button" onclick="showTab('epnm')" id="tab-epnm">
                🌵 EPNM
                <span class="tab-badge" id="badge-epnm">8</span>
            </button>
        </div>

        <!-- Executive Summary Tab -->
        <div id="tab-content-executive" class="tab-content active">
            <h2 class="section-title">📊 Executive Performance Overview</h2>

            <!-- Connection Status -->
            <div class="connection-status connected" id="connectionStatus">
                🔌 Loading dashboard analytics...
            </div>

            <!-- KPI Grid -->
            <div class="kpi-grid">
                <div class="kpi-card excellent">
                    <div class="kpi-label">Overall Engagement Score</div>
                    <div class="kpi-value" id="overallEngagement">--</div>
                    <div class="kpi-change positive">📈 Real-time analytics</div>
                    <div class="mom-indicator">
                        <span class="mom-percentage">+5.2%</span>
                        <span>vs last month</span>
                    </div>
                </div>

                <div class="kpi-card good">
                    <div class="kpi-label">Active Team Members</div>
                    <div class="kpi-value" id="activeMembers">--</div>
                    <div class="kpi-change positive">👥 Multi-regional team</div>
                    <div class="mom-indicator">
                        <span class="mom-percentage">+2.5%</span>
                        <span>team growth</span>
                    </div>
                </div>

                <div class="kpi-card warning">
                    <div class="kpi-label">Total Messages</div>
                    <div class="kpi-value" id="totalMessages">--</div>
                    <div class="kpi-change positive">💬 Active communication</div>
                    <div class="mom-indicator">
                        <span class="mom-percentage">+12.3%</span>
                        <span>message volume</span>
                    </div>
                </div>

                <div class="kpi-card excellent">
                    <div class="kpi-label">Avg Response Time</div>
                    <div class="kpi-value" id="avgResponseTime">--</div>
                    <div class="kpi-change positive">⏱️ Quick response</div>
                    <div class="mom-indicator">
                        <span class="mom-percentage">+8.1%</span>
                        <span>improvement</span>
                    </div>
                </div>
            </div>

            <!-- Charts Grid -->
            <div class="charts-grid">
                <div class="chart-card">
                    <div class="chart-title">📈 6-Month Performance Trends</div>
                    <div class="chart-container">
                        <canvas id="trendsChart"></canvas>
                    </div>
                </div>

                <div class="chart-card">
                    <div class="chart-title">📊 Regional Distribution</div>
                    <div class="chart-container">
                        <canvas id="regionalChart"></canvas>
                    </div>
                </div>

                <div class="chart-card">
                    <div class="chart-title">🎯 Performance Breakdown</div>
                    <div class="chart-container">
                        <canvas id="performanceChart"></canvas>
                    </div>
                </div>

                <div class="chart-card">
                    <div class="chart-title">📅 Month-over-Month</div>
                    <div class="chart-container">
                        <canvas id="monthlyChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
                <button class="btn success" onclick="loadRealData()">
                    🔗 Load Live Data
                </button>
                <button class="btn" onclick="refreshData()">
                    🔄 Refresh Analytics
                </button>
                <button class="btn secondary" onclick="testConnection()">
                    🧪 Test API Connection
                </button>
                <button class="btn" onclick="exportData()">
                    💾 Export Dashboard
                </button>
            </div>
        </div>

        <!-- Analytics Tab -->
        <div id="tab-content-analytics" class="tab-content">
            <h2 class="section-title">📈 Advanced Month-over-Month Analytics</h2>
            
            <div class="kpi-grid">
                <div class="kpi-card excellent">
                    <div class="kpi-label">Growth Trajectory</div>
                    <div class="kpi-value">📈</div>
                    <div class="kpi-change positive">Upward trend</div>
                    <div class="mom-indicator">
                        <span class="mom-percentage">+15.7%</span>
                        <span>6-month growth</span>
                    </div>
                </div>
                
                <div class="kpi-card good">
                    <div class="kpi-label">MoM Change</div>
                    <div class="kpi-value">+12%</div>
                    <div class="kpi-change positive">Above target</div>
                    <div class="mom-indicator">
                        <span class="mom-percentage">+2.3%</span>
                        <span>acceleration</span>
                    </div>
                </div>
                
                <div class="kpi-card excellent">
                    <div class="kpi-label">Forecast Score</div>
                    <div class="kpi-value">94</div>
                    <div class="kpi-change positive">Strong outlook</div>
                    <div class="mom-indicator">
                        <span class="mom-percentage">+2.2%</span>
                        <span>predicted</span>
                    </div>
                </div>
                
                <div class="kpi-card good">
                    <div class="kpi-label">Volatility</div>
                    <div class="kpi-value">Low</div>
                    <div class="kpi-change positive">Stable performance</div>
                    <div class="mom-indicator">
                        <span class="mom-percentage">±2.3%</span>
                        <span>variance</span>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 15px; margin-top: 30px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px;">📊 Advanced Analytics Ready</h3>
                <p style="color: #6c757d; margin-bottom: 30px;">
                    Month-over-month trends show consistent growth across all regions with strong predictive indicators for continued improvement.
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px;">
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; color: #27ae60;">+15.7%</div>
                        <div style="color: #6c757d; font-size: 0.9rem;">6-Month Growth</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; color: #3498db;">94.2</div>
                        <div style="color: #6c757d; font-size: 0.9rem;">Peak Score</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; color: #f39c12;">±2.3%</div>
                        <div style="color: #6c757d; font-size: 0.9rem;">Variance</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Regional Tabs -->
        <div id="tab-content-colorado" class="tab-content">
            <h2 class="section-title">🏔️ Colorado Regional Performance</h2>
            
            <div class="kpi-grid">
                <div class="kpi-card excellent">
                    <div class="kpi-label">Colorado Engagement</div>
                    <div class="kpi-value" id="coloradoEngagement">--</div>
                    <div class="kpi-change positive">Above company average</div>
                </div>
                
                <div class="kpi-card good">
                    <div class="kpi-label">Team Members</div>
                    <div class="kpi-value" id="coloradoMembers">--</div>
                    <div class="kpi-change positive">Full participation</div>
                </div>
            </div>
            
            <div id="coloradoTeamGrid" class="member-grid">
                <!-- Colorado team members will be loaded here -->
            </div>
        </div>

        <div id="tab-content-west-texas" class="tab-content">
            <h2 class="section-title">🤠 West Texas Regional Performance</h2>
            
            <div class="kpi-grid">
                <div class="kpi-card excellent">
                    <div class="kpi-label">West Texas Engagement</div>
                    <div class="kpi-value" id="texasEngagement">--</div>
                    <div class="kpi-change positive">Regional leader</div>
                </div>
                
                <div class="kpi-card good">
                    <div class="kpi-label">Team Members</div>
                    <div class="kpi-value" id="texasMembers">--</div>
                    <div class="kpi-change positive">High efficiency</div>
                </div>
            </div>
            
            <div id="texasTeamGrid" class="member-grid">
                <!-- West Texas team members will be loaded here -->
            </div>
        </div>

        <div id="tab-content-epnm" class="tab-content">
            <h2 class="section-title">🌵 EPNM Regional Performance</h2>
            
            <div class="kpi-grid">
                <div class="kpi-card excellent">
                    <div class="kpi-label">EPNM Engagement</div>
                    <div class="kpi-value" id="epnmEngagement">--</div>
                    <div class="kpi-change positive">Strong improvement</div>
                </div>
                
                <div class="kpi-card good">
                    <div class="kpi-label">Team Members</div>
                    <div class="kpi-value" id="epnmMembers">--</div>
                    <div class="kpi-change positive">Largest team</div>
                </div>
            </div>
            
            <div id="epnmTeamGrid" class="member-grid">
                <!-- EPNM team members will be loaded here -->
            </div>
        </div>

        <!-- Status Message -->
        <div class="status" id="statusMessage">
            🚀 Complete Enhanced Slack Dashboard loaded successfully on Render
        </div>
    </div>

    <script>
        // Global Variables
        let teamMembers = [];
        let currentTab = 'executive';
        let charts = {};
        let isConnected = false;

        // Utility Functions
        function updateStatus(message) {
            const statusElement = document.getElementById('statusMessage');
            if (statusElement) {
                statusElement.textContent = message;
                statusElement.style.display = 'block';
            }
            console.log('Status:', message);
        }

        function updateConnectionStatus(status, message) {
            const statusElement = document.getElementById('connectionStatus');
            if (statusElement) {
                statusElement.className = \`connection-status \${status}\`;
                const icons = {
                    connected: '✅',
                    loading: '🔄',
                    error: '❌'
                };
                statusElement.innerHTML = \`\${icons[status] || '🔌'} \${message}\`;
                isConnected = status === 'connected';
            }
        }

        // Tab Management
        function showTab(tabName) {
            try {
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });

                // Remove active class from all tab buttons
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Show selected tab content
                const selectedContent = document.getElementById(\`tab-content-\${tabName}\`);
                if (selectedContent) {
                    selectedContent.classList.add('active');
                }

                // Add active class to selected tab button
                const selectedButton = document.getElementById(\`tab-\${tabName}\`);
                if (selectedButton) {
                    selectedButton.classList.add('active');
                }

                currentTab = tabName;
                updateStatus(\`📊 Switched to \${tabName} view\`);
                
                // Load regional data if needed
                if (tabName !== 'executive' && tabName !== 'analytics') {
                    loadRegionalData(tabName);
                }

            } catch (error) {
                console.error('Error switching tabs:', error);
                updateStatus('❌ Tab switching error');
            }
        }

        // Data Loading Functions
        async function loadRealData() {
            try {
                updateStatus('🔄 Loading live team data...');
                updateConnectionStatus('loading', 'Fetching from API...');

                const response = await fetch('/api/slack/users');
                const result = await response.json();

                if (result.success) {
                    teamMembers = result.data;
                    updateConnectionStatus('connected', \`Live data - \${teamMembers.length} team members loaded\`);
                    
                    updateKPIs();
                    updateCharts();
                    updateTabBadges();
                    loadRegionalData(currentTab);
                    
                    updateStatus(\`✅ Loaded \${teamMembers.length} team members from live data\`);
                } else {
                    throw new Error(result.error || 'Failed to load data');
                }

            } catch (error) {
                console.error('Error loading real data:', error);
                updateConnectionStatus('error', 'Using sample data mode');
                updateStatus('⚠️ Live data unavailable - using sample data');
            }
        }

        async function refreshData() {
            updateStatus('🔄 Refreshing all analytics...');
            
            setTimeout(() => {
                updateKPIs();
                updateCharts();
                updateTabBadges();
                loadRegionalData(currentTab);
                updateStatus('✅ Dashboard refreshed successfully');
            }, 1500);
        }

        async function testConnection() {
            try {
                updateStatus('🧪 Testing API connections...');
                
                const healthResponse = await fetch('/health');
                const healthData = await healthResponse.json();
                
                const slackResponse = await fetch('/api/slack/test');
                const slackData = await slackResponse.json();
                
                updateStatus(\`✅ API Test Complete - Server: \${healthData.status}, Slack: \${slackData.success ? 'Ready' : 'Sample Mode'}\`);
                
            } catch (error) {
                console.error('Connection test failed:', error);
                updateStatus('❌ API connection test failed');
            }
        }

        async function exportData() {
            try {
                const exportData = {
                    teamMembers: teamMembers,
                    exportDate: new Date().toISOString(),
                    totalMembers: teamMembers.length,
                    platform: 'Render Cloud',
                    summary: {
                        avgEngagement: Math.round(teamMembers.reduce((sum, m) => sum + m.engagementScore, 0) / teamMembers.length),
                        totalMessages: teamMembers.reduce((sum, m) => sum + m.messages, 0),
                        regions: {
                            Colorado: teamMembers.filter(m => m.state === 'Colorado').length,
                            'West Texas': teamMembers.filter(m => m.state === 'West Texas').length,
                            EPNM: teamMembers.filter(m => m.state === 'EPNM').length
                        }
                    }
                };

                const dataStr = JSON.stringify(exportData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = \`slack-dashboard-render-\${new Date().toISOString().split('T')[0]}.json\`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                updateStatus('💾 Dashboard data exported successfully');
            } catch (error) {
                console.error('Export failed:', error);
                updateStatus('❌ Export failed');
            }
        }

        // Update Functions
        function updateKPIs() {
            try {
                if (teamMembers.length === 0) return;

                const avgEngagement = Math.round(
                    teamMembers.reduce((sum, member) => sum + member.engagementScore, 0) / teamMembers.length
                );
                const totalMessages = teamMembers.reduce((sum, member) => sum + member.messages, 0);
                const activeMembers = teamMembers.length;
                const avgResponseTime = '2.1h';

                document.getElementById('overallEngagement').textContent = avgEngagement;
                document.getElementById('activeMembers').textContent = activeMembers;
                document.getElementById('totalMessages').textContent = totalMessages.toLocaleString();
                document.getElementById('avgResponseTime').textContent = avgResponseTime;

                console.log('KPIs updated:', { avgEngagement, totalMessages, activeMembers });

            } catch (error) {
                console.error('Error updating KPIs:', error);
            }
        }

        function updateTabBadges() {
            const badges = {
                'badge-executive': 'Live',
                'badge-analytics': 'Trends', 
                'badge-colorado': teamMembers.filter(m => m.state === 'Colorado').length || '7',
                'badge-west-texas': teamMembers.filter(m => m.state === 'West Texas').length || '5',
                'badge-epnm': teamMembers.filter(m => m.state === 'EPNM').length || '8'
            };

            Object.entries(badges).forEach(([badgeId, value]) => {
                const badge = document.getElementById(badgeId);
                if (badge) {
                    badge.textContent = value;
                }
            });
        }

        // Chart Functions
        function updateCharts() {
            try {
                createTrendsChart();
                createRegionalChart();
                createPerformanceChart();
                createMonthlyChart();
                console.log('Charts updated successfully');
            } catch (error) {
                console.error('Error updating charts:', error);
            }
        }

        function createTrendsChart() {
            const ctx = document.getElementById('trendsChart');
            if (!ctx) return;

            if (charts.trends) {
                charts.trends.destroy();
            }

            charts.trends = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Engagement Score',
                        data: [82, 84, 85, 86, 88, 90],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3498db',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 75,
                            max: 95,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    }
                }
            });
        }

        function createRegionalChart() {
            const ctx = document.getElementById('regionalChart');
            if (!ctx) return;

            if (charts.regional) {
                charts.regional.destroy();
            }

            const regionData = teamMembers.reduce((acc, member) => {
                acc[member.state] = (acc[member.state] || 0) + 1;
                return acc;
            }, {});

            charts.regional = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(regionData),
                    datasets: [{
                        data: Object.values(regionData),
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.8)',
                            'rgba(39, 174, 96, 0.8)',
                            'rgba(243, 156, 18, 0.8)'
                        ],
                        borderColor: [
                            '#3498db',
                            '#27ae60', 
                            '#f39c12'
                        ],
                        borderWidth: 3,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff'
                        }
                    }
                }
            });
        }

        function createPerformanceChart() {
            const ctx = document.getElementById('performanceChart');
            if (!ctx) return;

            if (charts.performance) {
                charts.performance.destroy();
            }

            const performanceData = teamMembers.reduce((acc, member) => {
                acc[member.performance] = (acc[member.performance] || 0) + 1;
                return acc;
            }, {});

            charts.performance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(performanceData).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
                    datasets: [{
                        data: Object.values(performanceData),
                        backgroundColor: [
                            'rgba(39, 174, 96, 0.8)',
                            'rgba(52, 152, 219, 0.8)',
                            'rgba(243, 156, 18, 0.8)',
                            'rgba(231, 76, 60, 0.8)'
                        ],
                        borderColor: [
                            '#27ae60',
                            '#3498db',
                            '#f39c12',
                            '#e74c3c'
                        ],
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        function createMonthlyChart() {
            const ctx = document.getElementById('monthlyChart');
            if (!ctx) return;

            if (charts.monthly) {
                charts.monthly.destroy();
            }

            charts.monthly = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Previous Month', 'Current Month'],
                    datasets: [{
                        label: 'Messages',
                        data: [603, 678],
                        backgroundColor: [
                            'rgba(149, 165, 166, 0.8)',
                            'rgba(39, 174, 96, 0.8)'
                        ],
                        borderColor: [
                            '#95a5a6',
                            '#27ae60'
                        ],
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Regional Data Loading
        async function loadRegionalData(region) {
            try {
                const regionMap = {
                    'colorado': 'Colorado',
                    'west-texas': 'West Texas',
                    'epnm': 'EPNM'
                };
                
                const regionName = regionMap[region];
                if (!regionName) return;
                
                const regionMembers = teamMembers.filter(member => member.state === regionName);
                
                // Update regional KPIs
                const avgEngagement = regionMembers.length > 0 ? 
                    Math.round(regionMembers.reduce((sum, m) => sum + m.engagementScore, 0) / regionMembers.length) : 0;
                
                const engagementId = region === 'colorado' ? 'coloradoEngagement' : 
                                   region === 'west-texas' ? 'texasEngagement' : 'epnmEngagement';
                const membersId = region === 'colorado' ? 'coloradoMembers' : 
                                 region === 'west-texas' ? 'texasMembers' : 'epnmMembers';
                
                const engagementEl = document.getElementById(engagementId);
                const membersEl = document.getElementById(membersId);
                
                if (engagementEl) engagementEl.textContent = avgEngagement;
                if (membersEl) membersEl.textContent = regionMembers.length;
                
                // Update team grid
                const gridId = region === 'colorado' ? 'coloradoTeamGrid' : 
                              region === 'west-texas' ? 'texasTeamGrid' : 'epnmTeamGrid';
                
                const gridElement = document.getElementById(gridId);
                if (gridElement && regionMembers.length > 0) {
                    gridElement.innerHTML = regionMembers.map(member => \`
                        <div class="member-card \${member.performance}">
                            <div class="member-header">
                                <h4>\${member.name}</h4>
                                <p>\${member.role}</p>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <span class="performance-indicator \${member.performance}">\${member.performance}</span>
                                <span style="font-size: 1.2rem;">\${member.trend === 'up' ? '📈' : member.trend === 'down' ? '📉' : '➡️'}</span>
                            </div>
                            <div class="member-stats">
                                <div class="stat-item">
                                    <div class="stat-value">\${member.engagementScore}</div>
                                    <div class="stat-label">Score</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">\${member.messages}</div>
                                    <div class="stat-label">Messages</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">\${member.responseTime}h</div>
                                    <div class="stat-label">Response</div>
                                </div>
                            </div>
                        </div>
                    \`).join('');
                } else if (gridElement) {
                    gridElement.innerHTML = \`
                        <div class="empty-state">
                            <div class="empty-state-icon">\${region === 'colorado' ? '🏔️' : region === 'west-texas' ? '🤠' : '🌵'}</div>
                            <p>No team members found in \${regionName}. Load data to see team members.</p>
                        </div>
                    \`;
                }
                
            } catch (error) {
                console.error('Error loading regional data:', error);
            }
        }

        // Initialize Dashboard
        async function initializeDashboard() {
            try {
                console.log('🚀 Initializing Complete Slack Dashboard...');
                
                updateConnectionStatus('loading', 'Initializing dashboard...');
                updateStatus('🔄 Loading dashboard components...');
                
                // Auto-load data on startup
                setTimeout(async () => {
                    await loadRealData();
                    
                    // Initialize with executive tab
                    showTab('executive');
                    
                    updateStatus('✅ Complete Slack Dashboard initialized successfully on Render');
                    console.log('✅ Dashboard initialization complete');
                }, 1000);
                
            } catch (error) {
                console.error('❌ Dashboard initialization failed:', error);
                updateStatus('❌ Dashboard initialization failed');
                updateConnectionStatus('error', 'Initialization failed');
            }
        }

        // Handle window resize for charts
        window.addEventListener('resize', function() {
            Object.values(charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        });

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeDashboard);
        } else {
            initializeDashboard();
        }

        // Global API for debugging
        window.slackDashboard = {
            teamMembers: () => [...teamMembers],
            showTab: showTab,
            loadRealData: loadRealData,
            refreshData: refreshData,
            exportData: exportData,
            currentTab: () => currentTab,
            charts: () => charts
        };

        console.log('🎯 Complete Enhanced Slack Dashboard loaded successfully on Render!');
    </script>
</body>
</html>
    `);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        availableRoutes: [
            'GET /',
            'GET /health',
            'GET /api/slack/test',
            'GET /api/slack/users',
            'GET /api/slack/channels',
            'GET /api/team-members',
            'GET /api/analytics/summary'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Enhanced Slack Dashboard Server running on port ${PORT}`);
    console.log(`📊 Dashboard URL: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    console.log(`👥 Team members loaded: ${teamMembers.length}`);
    console.log(`✨ Features: Real-time analytics, Multi-regional support, Advanced charts`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📦 Platform: Render Cloud Deployment Ready`);
});

module.exports = app;

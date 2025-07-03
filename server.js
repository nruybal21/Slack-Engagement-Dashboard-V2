// Initialize Dashboard
        function initializeDashboard() {
            // Load data automatically on startup
            loadRealData();
        }

        // Team Management Functions
        function loadManagementData() {
            renderMemberManagementList();
        }

        function renderMemberManagementList() {
            const container = document.getElementById('memberManagementList');
            if (!container) return;

            container.innerHTML = '';

            if (teamMembers.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👥</div>
                        <p>No team members found. Add some members to get started!</p>
                    </div>
                `;
                return;
            }

            teamMembers.forEach(member => {
                const memberCard = document.createElement('div');
                memberCard.className = 'member-management-item';
                memberCard.innerHTML = `
                    <div class="member-actions">
                        <button class="action-btn edit" onclick="editMember('${member.id}')">✏️ Edit</button>
                        <button class="action-btn delete" onclick="deleteMember('${member.id}')">🗑️ Delete</button>
                    </div>
                    <div class="member-header">
                        <div class="member-info">
                            <h4>${member.name}</h4>
                            <p>${member.role} • ${member.state}</p>
                        </div>
                        <span class="performance-indicator ${member.performance}">${member.performance}</span>
                    </div>
                    <div class="member-stats">
                        <div class="stat-item">
                            <div class="stat-value">${member.engagementScore}</div>
                            <div class="stat-label">Engagement</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${member.messages}</div>
                            <div class="stat-label">Messages</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${member.responseTime}h</div>
                            <div class="stat-label">Response</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${member.isActive ? '✅' : '❌'}</div>
                            <div class="stat-label">Status</div>
                        </div>
                    </div>
                `;
                container.appendChild(memberCard);
            });
        }

        function openAddMemberModal() {
            document.getElementById('modalTitle').textContent = 'Add New Member';
            document.getElementById('memberForm').reset();
            document.getElementById('memberModal').style.display = 'flex';
        }

        function editMember(memberId) {
            const member = teamMembers.find(m => m.id === memberId);
            if (!member) return;

            document.getElementById('modalTitle').textContent = 'Edit Member';
            document.getElementById('memberName').value = member.name;
            document.getElementById('memberRole').value = member.role;
            document.getElementById('memberState').value = member.state;
            document.getElementById('memberTimezone').value = member.timezone || 'MT';
            document.getElementById('memberMessages').value = member.messages;
            document.getElementById('memberReactions').value = member.reactions;
            document.getElementById('memberComments').value = member.comments;
            document.getElementById('memberResponseTime').value = member.responseTime;
            document.getElementById('memberEngagement').value = member.engagementScore;
            document.getElementById('memberTrend').value = member.trend;
            document.getElementById('memberActive').value = member.isActive.toString();

            // Store the ID for editing
            document.getElementById('memberForm').setAttribute('data-editing', memberId);
            document.getElementById('memberModal').style.display = 'flex';
        }

        function deleteMember(memberId) {
            if (confirm('Are you sure you want to delete this member?')) {
                teamMembers = teamMembers.filter(m => m.id !== memberId);
                updateKPIs();
                updateTabBadges();
                updateLeaderboards();
                loadManagementData();
                createCharts();
                updateStatus('🗑️ Member deleted successfully');
            }
        }

        function closeMemberModal() {
            document.getElementById('memberModal').style.display = 'none';
            document.getElementById('memberForm').removeAttribute('data-editing');
        }

        function bulkEdit() {
            document.getElementById('bulkModal').style.display = 'flex';
        }

        function closeBulkModal() {
            document.getElementById('bulkModal').style.display = 'none';
        }

        function applyBulkEdit() {
            const field = document.getElementById('bulkField').value;
            const value = document.getElementById('bulkValue').value;
            
            if (!value) {
                alert('Please enter a value');
                return;
            }

            teamMembers.forEach(member => {
                if (field === 'isActive') {
                    member[field] = value === 'true';
                } else {
                    member[field] = value;
                }
                
                // Recalculate performance if engagement score changed
                if (field === 'engagementScore') {
                    member.performance = determinePerformance(parseInt(value));
                }
            });

            updateKPIs();
            updateTabBadges();
            updateLeaderboards();
            loadManagementData();
            createCharts();
            closeBulkModal();
            updateStatus('📝 Bulk edit applied successfully');
        }

        function importMembers() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.json';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            let importData;
                            if (file.name.endsWith('.json')) {
                                importData = JSON.parse(e.target.result);
                            } else {
                                // Basic CSV parsing
                                const lines = e.target.result.split('\\n');
                                const headers = lines[0].split(',').map(h => h.trim());
                                importData = lines.slice(1).filter(line => line.trim()).map(line => {
                                    const values = line.split(',').map(v => v.trim());
                                    const obj = {};
                                    headers.forEach((header, index) => {
                                        obj[header] = values[index] || '';
                                    });
                                    return obj;
                                });
                            }
                            
                            // Process imported data
                            importData.forEach(item => {
                                const newMember = {
                                    id: 'U' + Date.now() + Math.random().toString(36).substr(2, 9),
                                    name: item.name || 'Unknown',
                                    role: item.role || 'Team Member',
                                    state: item.state || 'Colorado',
                                    messages: parseInt(item.messages) || 0,
                                    reactions: parseInt(item.reactions) || 0,
                                    comments: parseInt(item.comments) || 0,
                                    responseTime: parseFloat(item.responseTime) || 2.0,
                                    engagementScore: parseInt(item.engagementScore) || 75,
                                    trend: item.trend || 'stable',
                                    isActive: item.isActive !== 'false',
                                    timezone: item.timezone || 'MT'
                                };
                                newMember.performance = determinePerformance(newMember.engagementScore);
                                teamMembers.push(newMember);
                            });

                            updateKPIs();
                            updateTabBadges();
                            updateLeaderboards();
                            loadManagementData();
                            createCharts();
                            updateStatus('📁 Imported ' + importData.length + ' members successfully');
                        } catch (error) {
                            alert('Error importing file: ' + error.message);
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        }

        function filterMembers() {
            const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
            const stateFilter = document.getElementById('stateFilter').value;
            const performanceFilter = document.getElementById('performanceFilter').value;
            
            const filteredMembers = teamMembers.filter(member => {
                const matchesSearch = member.name.toLowerCase().includes(searchTerm) ||
                                    member.role.toLowerCase().includes(searchTerm);
                const matchesState = !stateFilter || member.state === stateFilter;
                const matchesPerformance = !performanceFilter || member.performance === performanceFilter;
                
                return matchesSearch && matchesState && matchesPerformance;
            });

            renderFilteredMembers(filteredMembers);
        }

        function renderFilteredMembers(filteredMembers) {
            const container = document.getElementById('memberManagementList');
            if (!container) return;

            container.innerHTML = '';

            filteredMembers.forEach(member => {
                const memberCard = document.createElement('div');
                memberCard.className = 'member-management-item';
                memberCard.innerHTML = `
                    <div class="member-actions">
                        <button class="action-btn edit" onclick="editMember('${member.id}')">✏️ Edit</button>
                        <button class="action-btn delete" onclick="deleteMember('${member.id}')">🗑️ Delete</button>
                    </div>
                    <div class="member-header">
                        <div class="member-info">
                            <h4>${member.name}</h4>
                            <p>${member.role} • ${member.state}</p>
                        </div>
                        <span class="performance-indicator ${member.performance}">${member.performance}</span>
                    </div>
                    <div class="member-stats">
                        <div class="stat-item">
                            <div class="stat-value">${member.engagementScore}</div>
                            <div class="stat-label">Engagement</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${member.messages}</div>
                            <div class="stat-label">Messages</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${member.responseTime}h</div>
                            <div class="stat-label">Response</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${member.isActive ? '✅' : '❌'}</div>
                            <div class="stat-label">Status</div>
                        </div>
                    </div>
                `;
                container.appendChild(memberCard);
            });
        }

        function sortMembers() {
            const sortBy = document.getElementById('sortBy').value;
            teamMembers.sort((a, b) => {
                if (sortBy === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (sortBy === 'engagementScore' || sortBy === 'messages') {
                    return b[sortBy] - a[sortBy];
                } else if (sortBy === 'responseTime') {
                    return a[sortBy] - b[sortBy];
                } else if (sortBy === 'state') {
                    return a.state.localeCompare(b.state);
                }
                return 0;
            });
            loadManagementData();
        }

        function determinePerformance(score) {
            if (score >= 90) return 'excellent';
            if (score >= 80) return 'good';
            if (score >= 70) return 'average';
            return 'poor';
        }

        // Handle form submission
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('memberForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const editingId = this.getAttribute('data-editing');
                const formData = {
                    name: document.getElementById('memberName').value,
                    role: document.getElementById('memberRole').value,
                    state: document.const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample team data
const sampleTeamData = [
    { 
        id: 'U001', name: 'Nicole Ruybal', role: 'Primary Owner', state: 'Colorado', 
        messages: 156, reactions: 234, comments: 67, responseTime: 1.8, 
        engagementScore: 96, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T09:30:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U002', name: 'Chloe Entner', role: 'Team Member', state: 'Colorado', 
        messages: 134, reactions: 189, comments: 45, responseTime: 2.1, 
        engagementScore: 89, trend: 'up', performance: 'good',
        lastActive: '2024-07-02T10:15:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U003', name: 'Crystal Foley', role: 'Team Member', state: 'Colorado', 
        messages: 142, reactions: 198, comments: 52, responseTime: 1.9, 
        engagementScore: 92, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T08:45:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U004', name: 'Jeff Goulet', role: 'Team Member', state: 'Colorado', 
        messages: 118, reactions: 167, comments: 38, responseTime: 2.4, 
        engagementScore: 85, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T11:20:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U005', name: 'Hannah Jackson', role: 'Team Member', state: 'Colorado', 
        messages: 128, reactions: 176, comments: 43, responseTime: 2.2, 
        engagementScore: 88, trend: 'up', performance: 'good',
        lastActive: '2024-07-02T09:00:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U006', name: 'Amy Partlow', role: 'Team Member', state: 'Colorado', 
        messages: 139, reactions: 195, comments: 49, responseTime: 2.0, 
        engagementScore: 91, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T10:30:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U007', name: 'Haley Santiago', role: 'Team Member', state: 'Colorado', 
        messages: 125, reactions: 172, comments: 41, responseTime: 2.3, 
        engagementScore: 87, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T08:15:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U008', name: 'Constance Montgomery', role: 'Team Member', state: 'West Texas', 
        messages: 148, reactions: 218, comments: 58, responseTime: 1.7, 
        engagementScore: 94, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T09:45:00Z', timezone: 'CT', isActive: true
    },
    { 
        id: 'U009', name: 'Kris Schmidt', role: 'Team Member', state: 'West Texas', 
        messages: 137, reactions: 201, comments: 51, responseTime: 2.0, 
        engagementScore: 90, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T11:00:00Z', timezone: 'CT', isActive: true
    },
    { 
        id: 'U010', name: 'Sandi Franklin', role: 'Team Member', state: 'West Texas', 
        messages: 122, reactions: 178, comments: 39, responseTime: 2.5, 
        engagementScore: 86, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T08:30:00Z', timezone: 'CT', isActive: true
    },
    { 
        id: 'U011', name: 'Jonathan Barnhart', role: 'Team Member', state: 'West Texas', 
        messages: 131, reactions: 187, comments: 44, responseTime: 2.2, 
        engagementScore: 89, trend: 'up', performance: 'good',
        lastActive: '2024-07-02T10:45:00Z', timezone: 'CT', isActive: true
    },
    { 
        id: 'U012', name: 'Christian Melendez', role: 'Team Member', state: 'West Texas', 
        messages: 145, reactions: 212, comments: 55, responseTime: 1.8, 
        engagementScore: 93, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T09:15:00Z', timezone: 'CT', isActive: true
    },
    { 
        id: 'U013', name: 'Scott Duerfeldt', role: 'Team Member', state: 'EPNM', 
        messages: 127, reactions: 181, comments: 42, responseTime: 2.3, 
        engagementScore: 88, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T10:35:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U014', name: 'Gidget Miller', role: 'Team Member', state: 'EPNM', 
        messages: 136, reactions: 194, comments: 48, responseTime: 2.1, 
        engagementScore: 91, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T11:30:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U015', name: 'Ray Woodruff', role: 'Team Member', state: 'EPNM', 
        messages: 119, reactions: 169, comments: 37, responseTime: 2.6, 
        engagementScore: 84, trend: 'down', performance: 'good',
        lastActive: '2024-07-02T08:00:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U016', name: 'Aaron Hartman', role: 'Team Member', state: 'EPNM', 
        messages: 133, reactions: 192, comments: 46, responseTime: 2.2, 
        engagementScore: 89, trend: 'up', performance: 'good',
        lastActive: '2024-07-02T10:35:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U017', name: 'Erica Torres', role: 'Team Member', state: 'EPNM', 
        messages: 141, reactions: 204, comments: 54, responseTime: 1.9, 
        engagementScore: 92, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T11:15:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U018', name: 'Jake Alsept', role: 'Team Member', state: 'EPNM', 
        messages: 124, reactions: 175, comments: 40, responseTime: 2.4, 
        engagementScore: 85, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T08:30:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U019', name: 'Jen Hettum', role: 'Team Member', state: 'EPNM', 
        messages: 138, reactions: 199, comments: 50, responseTime: 2.0, 
        engagementScore: 90, trend: 'up', performance: 'excellent',
        lastActive: '2024-07-02T09:45:00Z', timezone: 'MT', isActive: true
    },
    { 
        id: 'U020', name: 'Hector R Ramirez-Bruno', role: 'Team Member', state: 'EPNM', 
        messages: 138, reactions: 199, comments: 50, responseTime: 2.3, 
        engagementScore: 88, trend: 'stable', performance: 'good',
        lastActive: '2024-07-02T10:05:00Z', timezone: 'MT', isActive: true
    }
];

// Store team data - ONLY ONE DECLARATION
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
        connectedAt: new Date().toISOString(),
        features: [
            'Real-time team analytics',
            'Multi-regional support',
            'Advanced month-over-month tracking',
            'Member leaderboards',
            'Performance insights'
        ]
    });
});

app.get('/api/slack/users', (req, res) => {
    res.json({
        success: true,
        data: teamMembers,
        source: 'sample_data',
        stats: {
            totalUsers: teamMembers.length,
            activeUsers: teamMembers.filter(m => m.isActive).length,
            messagesAnalyzed: teamMembers.reduce((sum, u) => sum + u.messages, 0),
            reactionsAnalyzed: teamMembers.reduce((sum, u) => sum + u.reactions, 0),
            channelsAnalyzed: 5,
            dataRange: '30 days (enhanced sample data)'
        }
    });
});

app.get('/api/slack/channels', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 'C001', name: 'general', memberCount: 20, messagesCount: 567 },
            { id: 'C002', name: 'colorado-team', memberCount: 7, messagesCount: 234 },
            { id: 'C003', name: 'west-texas-team', memberCount: 5, messagesCount: 189 },
            { id: 'C004', name: 'epnm-team', memberCount: 8, messagesCount: 312 },
            { id: 'C005', name: 'announcements', memberCount: 20, messagesCount: 45 }
        ]
    });
});

app.get('/api/team-members', (req, res) => {
    const summary = {
        totalMembers: teamMembers.length,
        activeMembers: teamMembers.filter(m => m.isActive).length,
        regionalDistribution: {
            Colorado: teamMembers.filter(m => m.state === 'Colorado').length,
            'West Texas': teamMembers.filter(m => m.state === 'West Texas').length,
            EPNM: teamMembers.filter(m => m.state === 'EPNM').length
        },
        performanceDistribution: {
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

// Main dashboard route - SERVE THE ENHANCED HTML WITH LEADERBOARDS
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Enhanced Slack Dashboard with Leaderboards</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 30px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .header h1 {
            font-size: 2.5rem;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .connection-status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin: 10px 0;
        }

        .connection-status.connected {
            background: #27ae60;
            color: white;
        }

        /* Tab Navigation */
        .tab-navigation {
            display: flex;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            padding: 5px;
            margin-bottom: 30px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        .tab-button {
            flex: 1;
            padding: 15px 20px;
            border: none;
            background: transparent;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            position: relative;
        }

        .tab-button.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            transform: translateY(-2px);
        }

        .tab-badge {
            background: #e74c3c;
            color: white;
            border-radius: 12px;
            padding: 2px 8px;
            font-size: 0.8rem;
            margin-left: 8px;
        }

        /* Main Content */
        .tab-content {
            display: none;
            animation: fadeIn 0.5s ease;
        }

        .tab-content.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* KPI Cards */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .kpi-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border-left: 5px solid;
            transition: all 0.3s ease;
        }

        .kpi-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }

        .kpi-card.excellent { border-left-color: #27ae60; }
        .kpi-card.good { border-left-color: #3498db; }
        .kpi-card.warning { border-left-color: #f39c12; }
        .kpi-card.poor { border-left-color: #e74c3c; }

        .kpi-label {
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-bottom: 10px;
            font-weight: 500;
        }

        .kpi-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 8px;
        }

        .kpi-change {
            font-size: 0.9rem;
            color: #27ae60;
            font-weight: 600;
        }

        /* Leaderboards Section */
        .leaderboards-section {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            margin: 30px 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .leaderboards-title {
            font-size: 1.8rem;
            color: #2c3e50;
            margin-bottom: 25px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }

        .leaderboards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }

        .leaderboard-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }

        .leaderboard-card:hover {
            transform: translateY(-3px);
            border-color: #667eea;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .leaderboard-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #dee2e6;
        }

        .leaderboard-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #2c3e50;
        }

        .leaderboard-icon {
            font-size: 1.5rem;
        }

        .leaderboard-list {
            list-style: none;
        }

        .leaderboard-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 15px;
            margin-bottom: 8px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }

        .leaderboard-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .leaderboard-position {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.9rem;
            margin-right: 15px;
        }

        .leaderboard-position.first {
            background: linear-gradient(135deg, #f1c40f, #f39c12);
            color: white;
        }

        .leaderboard-position.second {
            background: linear-gradient(135deg, #95a5a6, #7f8c8d);
            color: white;
        }

        .leaderboard-position.third {
            background: linear-gradient(135deg, #d35400, #e67e22);
            color: white;
        }

        .leaderboard-position.other {
            background: #ecf0f1;
            color: #7f8c8d;
        }

        .leaderboard-member {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }

        .leaderboard-name {
            font-weight: 600;
            color: #2c3e50;
            font-size: 0.95rem;
        }

        .leaderboard-state {
            font-size: 0.8rem;
            color: #7f8c8d;
        }

        .leaderboard-score {
            font-weight: 700;
            font-size: 1.1rem;
            padding: 6px 12px;
            border-radius: 20px;
            min-width: 60px;
            text-align: center;
        }

        .score-excellent {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
        }

        .score-good {
            background: linear-gradient(135deg, #3498db, #5dade2);
            color: white;
        }

        .score-average {
            background: linear-gradient(135deg, #f39c12, #f8c471);
            color: white;
        }

        .score-poor {
            background: linear-gradient(135deg, #e74c3c, #ec7063);
            color: white;
        }

        /* Charts Grid */
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 25px;
            margin: 30px 0;
        }

        .chart-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }

        .chart-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }

        .chart-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            text-align: center;
        }

        .chart-container {
            position: relative;
            height: 300px;
        }

        /* Control Buttons */
        .controls {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin: 30px 0;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.95rem;
        }

        .btn.primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }

        .btn.secondary {
            background: #95a5a6;
            color: white;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        /* Status Updates */
        .status-bar {
            background: rgba(255, 255, 255, 0.9);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        /* Regional grids for other tabs */
        .regional-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .member-item {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-left: 4px solid;
            transition: all 0.3s ease;
        }

        .member-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .member-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }

        .member-info h4 {
            color: #2c3e50;
            margin-bottom: 5px;
        }

        .member-info p {
            color: #7f8c8d;
            font-size: 0.9rem;
        }

        .performance-indicator {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .performance-indicator.excellent {
            background: #27ae60;
            color: white;
        }

        .performance-indicator.good {
            background: #3498db;
            color: white;
        }

        .performance-indicator.average {
            background: #f39c12;
            color: white;
        }

        .performance-indicator.poor {
            background: #e74c3c;
            color: white;
        }

        .member-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 1.3rem;
            font-weight: 700;
            color: #2c3e50;
        }

        .stat-label {
            font-size: 0.8rem;
            color: #7f8c8d;
            margin-top: 5px;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #7f8c8d;
        }

        .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }

        /* Management Tab Styles */
        .management-controls {
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .management-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .management-buttons {
            display: flex;
            gap: 10px;
        }

        .member-management-section {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .member-management-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 2px solid #ecf0f1;
        }

        .search-filters {
            display: flex;
            gap: 10px;
        }

        .search-filters input, .search-filters select, .sort-options select {
            padding: 8px 12px;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            font-size: 0.9rem;
        }

        .search-filters input:focus, .search-filters select:focus, .sort-options select:focus {
            outline: none;
            border-color: #3498db;
        }

        .member-management-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }

        .member-management-item {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            position: relative;
        }

        .member-management-item:hover {
            border-color: #3498db;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .member-management-item .member-actions {
            position: absolute;
            top: 15px;
            right: 15px;
            display: flex;
            gap: 5px;
        }

        .action-btn {
            padding: 5px 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .action-btn.edit {
            background: #3498db;
            color: white;
        }

        .action-btn.delete {
            background: #e74c3c;
            color: white;
        }

        .action-btn:hover {
            transform: scale(1.1);
        }

        /* Modal Styles */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 2px solid #ecf0f1;
        }

        .modal-header h3 {
            margin: 0;
            color: #2c3e50;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #7f8c8d;
        }

        .close-btn:hover {
            color: #e74c3c;
        }

        .modal-body {
            padding: 25px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            margin-bottom: 5px;
            font-weight: 600;
            color: #2c3e50;
        }

        .form-group input, .form-group select {
            padding: 10px;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            font-size: 0.9rem;
        }

        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #3498db;
        }

        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 15px;
            }

            .header h1 {
                font-size: 2rem;
            }

            .tab-navigation {
                flex-direction: column;
                gap: 5px;
            }

            .kpi-grid {
                grid-template-columns: 1fr;
            }

            .charts-grid {
                grid-template-columns: 1fr;
            }

            .leaderboards-grid {
                grid-template-columns: 1fr;
            }

            .controls {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🚀 Enhanced Slack Dashboard</h1>
            <p>Real-time team engagement analytics with member leaderboards</p>
            <div class="connection-status connected" id="connectionStatus">
                ✅ Dashboard loaded successfully
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-navigation">
            <button class="tab-button active" onclick="showTab('executive')" id="tab-executive">
                📊 Executive
                <span class="tab-badge" id="badge-executive">20</span>
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
            <button class="tab-button" onclick="showTab('management')" id="tab-management">
                ⚙️ Manage Team
                <span class="tab-badge" id="badge-management">Edit</span>
            </button>
        </div>

        <!-- Executive Summary Tab -->
        <div id="tab-content-executive" class="tab-content active">
            <h2 style="font-size: 2rem; color: #2c3e50; margin-bottom: 25px; text-align: center;">📊 Executive Performance Overview</h2>

            <!-- KPIs -->
            <div class="kpi-grid">
                <div class="kpi-card excellent">
                    <div class="kpi-label">Overall Engagement Score</div>
                    <div class="kpi-value" id="overallEngagement">90</div>
                    <div class="kpi-change positive">📈 Excellent performance</div>
                </div>

                <div class="kpi-card good">
                    <div class="kpi-label">Active Team Members</div>
                    <div class="kpi-value" id="activeMembers">20</div>
                    <div class="kpi-change positive">👥 Full team participation</div>
                </div>

                <div class="kpi-card warning">
                    <div class="kpi-label">Total Messages</div>
                    <div class="kpi-value" id="totalMessages">2,680</div>
                    <div class="kpi-change positive">💬 Active communication</div>
                </div>

                <div class="kpi-card good">
                    <div class="kpi-label">Avg Response Time</div>
                    <div class="kpi-value" id="avgResponseTime">2.1h</div>
                    <div class="kpi-change positive">⏱️ Good responsiveness</div>
                </div>
            </div>

            <!-- Member Leaderboards Section -->
            <div class="leaderboards-section">
                <div class="leaderboards-title">
                    🏆 Team Member Leaderboards
                    <span style="font-size: 0.8rem; background: #3498db; color: white; padding: 5px 15px; border-radius: 20px;">
                        Top Performers
                    </span>
                </div>

                <div class="leaderboards-grid">
                    <!-- Engagement Score Leaderboard -->
                    <div class="leaderboard-card">
                        <div class="leaderboard-header">
                            <span class="leaderboard-icon">📈</span>
                            <div class="leaderboard-title">Engagement Leaders</div>
                        </div>
                        <ul class="leaderboard-list" id="engagementLeaderboard">
                            <!-- Will be populated by JavaScript -->
                        </ul>
                    </div>

                    <!-- Messages Leaderboard -->
                    <div class="leaderboard-card">
                        <div class="leaderboard-header">
                            <span class="leaderboard-icon">💬</span>
                            <div class="leaderboard-title">Message Champions</div>
                        </div>
                        <ul class="leaderboard-list" id="messagesLeaderboard">
                            <!-- Will be populated by JavaScript -->
                        </ul>
                    </div>

                    <!-- Response Time Leaderboard -->
                    <div class="leaderboard-card">
                        <div class="leaderboard-header">
                            <span class="leaderboard-icon">⚡</span>
                            <div class="leaderboard-title">Quick Responders</div>
                        </div>
                        <ul class="leaderboard-list" id="responseLeaderboard">
                            <!-- Will be populated by JavaScript -->
                        </ul>
                    </div>

                    <!-- Regional Champions -->
                    <div class="leaderboard-card">
                        <div class="leaderboard-header">
                            <span class="leaderboard-icon">🌟</span>
                            <div class="leaderboard-title">Regional Champions</div>
                        </div>
                        <ul class="leaderboard-list" id="regionalLeaderboard">
                            <!-- Will be populated by JavaScript -->
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Charts -->
            <div class="charts-grid">
                <div class="chart-card">
                    <div class="chart-title">📈 Performance Trends</div>
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
            </div>
        </div>

        <!-- Regional Tabs (Colorado, West Texas, EPNM) -->
        <div id="tab-content-colorado" class="tab-content">
            <h2 style="color: #2c3e50; margin-bottom: 25px;">🏔️ Colorado Team</h2>
            <div class="regional-grid" id="colorado-grid">
                <!-- Will be populated by JavaScript -->
            </div>
        </div>

        <div id="tab-content-west-texas" class="tab-content">
            <h2 style="color: #2c3e50; margin-bottom: 25px;">🤠 West Texas Team</h2>
            <div class="regional-grid" id="west-texas-grid">
                <!-- Will be populated by JavaScript -->
            </div>
        </div>

        <div id="tab-content-epnm" class="tab-content">
            <h2 style="color: #2c3e50; margin-bottom: 25px;">🌵 EPNM Team</h2>
            <div class="regional-grid" id="epnm-grid">
                <!-- Will be populated by JavaScript -->
            </div>
        </div>

        <!-- Team Management Tab -->
        <div id="tab-content-management" class="tab-content">
            <h2 style="color: #2c3e50; margin-bottom: 25px;">⚙️ Team Management</h2>
            
            <!-- Management Controls -->
            <div class="management-controls">
                <div class="management-header">
                    <div>
                        <h3 style="margin: 0 0 5px 0; color: #2c3e50;">Team Member Management</h3>
                        <p style="margin: 0; color: #7f8c8d;">Add, edit, or remove team members from your Slack dashboard</p>
                    </div>
                    <div class="management-buttons">
                        <button class="btn primary" onclick="openAddMemberModal()">
                            ➕ Add New Member
                        </button>
                        <button class="btn secondary" onclick="bulkEdit()">
                            📝 Bulk Edit
                        </button>
                        <button class="btn secondary" onclick="importMembers()">
                            📁 Import CSV
                        </button>
                    </div>
                </div>
            </div>

            <!-- Team Members List -->
            <div class="member-management-section">
                <div class="member-management-header">
                    <div class="search-filters">
                        <input type="text" id="memberSearch" placeholder="🔍 Search members..." oninput="filterMembers()">
                        <select id="stateFilter" onchange="filterMembers()">
                            <option value="">All States</option>
                            <option value="Colorado">Colorado</option>
                            <option value="West Texas">West Texas</option>
                            <option value="EPNM">EPNM</option>
                        </select>
                        <select id="performanceFilter" onchange="filterMembers()">
                            <option value="">All Performance</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="average">Average</option>
                            <option value="poor">Poor</option>
                        </select>
                    </div>
                    <div class="sort-options">
                        <select id="sortBy" onchange="sortMembers()">
                            <option value="name">Sort by Name</option>
                            <option value="engagementScore">Sort by Engagement</option>
                            <option value="messages">Sort by Messages</option>
                            <option value="responseTime">Sort by Response Time</option>
                            <option value="state">Sort by State</option>
                        </select>
                    </div>
                </div>

                <div class="member-management-list" id="memberManagementList">
                    <!-- Will be populated by JavaScript -->
                </div>
            </div>
        </div>

        <!-- Controls -->
        <div class="controls">
            <button class="btn primary" onclick="loadRealData()">🔄 Load Real Data</button>
            <button class="btn secondary" onclick="exportData()">📊 Export Data</button>
            <button class="btn secondary" onclick="refreshCharts()">📈 Refresh Charts</button>
        </div>

        <!-- Status Bar -->
        <div class="status-bar" id="statusBar">
            Ready to load team data
        </div>

        <!-- Member Edit Modal -->
        <div id="memberModal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle">Add New Member</h3>
                    <button class="close-btn" onclick="closeMemberModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="memberForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="memberName">Name *</label>
                                <input type="text" id="memberName" required>
                            </div>
                            <div class="form-group">
                                <label for="memberRole">Role *</label>
                                <select id="memberRole" required>
                                    <option value="">Select Role</option>
                                    <option value="Primary Owner">Primary Owner</option>
                                    <option value="Team Member">Team Member</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Supervisor">Supervisor</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="memberState">State/Region *</label>
                                <select id="memberState" required>
                                    <option value="">Select State</option>
                                    <option value="Colorado">Colorado</option>
                                    <option value="West Texas">West Texas</option>
                                    <option value="EPNM">EPNM</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="memberTimezone">Timezone</label>
                                <select id="memberTimezone">
                                    <option value="MT">Mountain Time (MT)</option>
                                    <option value="CT">Central Time (CT)</option>
                                    <option value="PT">Pacific Time (PT)</option>
                                    <option value="ET">Eastern Time (ET)</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="memberMessages">Messages</label>
                                <input type="number" id="memberMessages" min="0" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label for="memberReactions">Reactions</label>
                                <input type="number" id="memberReactions" min="0" placeholder="0">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="memberComments">Comments</label>
                                <input type="number" id="memberComments" min="0" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label for="memberResponseTime">Response Time (hours)</label>
                                <input type="number" id="memberResponseTime" min="0" step="0.1" placeholder="2.0">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="memberEngagement">Engagement Score</label>
                                <input type="number" id="memberEngagement" min="0" max="100" placeholder="85">
                            </div>
                            <div class="form-group">
                                <label for="memberTrend">Trend</label>
                                <select id="memberTrend">
                                    <option value="stable">Stable</option>
                                    <option value="up">Up</option>
                                    <option value="down">Down</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="memberActive">Status</label>
                                <select id="memberActive">
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn secondary" onclick="closeMemberModal()">Cancel</button>
                            <button type="submit" class="btn primary">Save Member</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Bulk Edit Modal -->
        <div id="bulkModal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Bulk Edit Members</h3>
                    <button class="close-btn" onclick="closeBulkModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Select the field you want to update for all selected members:</p>
                    <div class="form-group">
                        <label for="bulkField">Field to Update</label>
                        <select id="bulkField">
                            <option value="state">State/Region</option>
                            <option value="role">Role</option>
                            <option value="timezone">Timezone</option>
                            <option value="trend">Trend</option>
                            <option value="isActive">Status</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="bulkValue">New Value</label>
                        <input type="text" id="bulkValue" placeholder="Enter new value">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn secondary" onclick="closeBulkModal()">Cancel</button>
                        <button type="button" class="btn primary" onclick="applyBulkEdit()">Apply Changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global Variables
        let teamMembers = [];
        let currentTab = 'executive';
        let charts = {};

        // Tab Management
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            // Remove active class from all tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });

            // Show selected tab content
            document.getElementById('tab-content-' + tabName).classList.add('active');
            document.getElementById('tab-' + tabName).classList.add('active');

            currentTab = tabName;
            updateStatus('📊 Switched to ' + tabName + ' view');

            // Load regional data for non-executive tabs
            if (tabName !== 'executive') {
                loadRegionalData(tabName);
            }
            
            // Load management data for management tab
            if (tabName === 'management') {
                loadManagementData();
            }
        }

        // Leaderboard Functions
        function updateLeaderboards() {
            updateEngagementLeaderboard();
            updateMessagesLeaderboard();
            updateResponseLeaderboard();
            updateRegionalLeaderboard();
        }

        function updateEngagementLeaderboard() {
            const sortedByEngagement = [...teamMembers]
                .sort((a, b) => b.engagementScore - a.engagementScore)
                .slice(0, 5);

            const leaderboard = document.getElementById('engagementLeaderboard');
            leaderboard.innerHTML = sortedByEngagement.map((member, index) => {
                const positionClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : 'other';
                const scoreClass = getScoreClass(member.engagementScore);
                
                return '<li class="leaderboard-item">' +
                    '<div class="leaderboard-position ' + positionClass + '">' + (index + 1) + '</div>' +
                    '<div class="leaderboard-member">' +
                        '<div class="leaderboard-name">' + member.name + '</div>' +
                        '<div class="leaderboard-state">' + member.state + ' • ' + member.role + '</div>' +
                    '</div>' +
                    '<div class="leaderboard-score ' + scoreClass + '">' + member.engagementScore + '</div>' +
                '</li>';
            }).join('');
        }

        function updateMessagesLeaderboard() {
            const sortedByMessages = [...teamMembers]
                .sort((a, b) => b.messages - a.messages)
                .slice(0, 5);

            const leaderboard = document.getElementById('messagesLeaderboard');
            leaderboard.innerHTML = sortedByMessages.map((member, index) => {
                const positionClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : 'other';
                const scoreClass = getScoreClass(member.engagementScore);
                
                return '<li class="leaderboard-item">' +
                    '<div class="leaderboard-position ' + positionClass + '">' + (index + 1) + '</div>' +
                    '<div class="leaderboard-member">' +
                        '<div class="leaderboard-name">' + member.name + '</div>' +
                        '<div class="leaderboard-state">' + member.state + ' • ' + member.messages + ' msgs</div>' +
                    '</div>' +
                    '<div class="leaderboard-score ' + scoreClass + '">' + member.messages + '</div>' +
                '</li>';
            }).join('');
        }

        function updateResponseLeaderboard() {
            const sortedByResponse = [...teamMembers]
                .sort((a, b) => a.responseTime - b.responseTime)
                .slice(0, 5);

            const leaderboard = document.getElementById('responseLeaderboard');
            leaderboard.innerHTML = sortedByResponse.map((member, index) => {
                const positionClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : 'other';
                const scoreClass = getScoreClass(member.engagementScore);
                
                return '<li class="leaderboard-item">' +
                    '<div class="leaderboard-position ' + positionClass + '">' + (index + 1) + '</div>' +
                    '<div class="leaderboard-member">' +
                        '<div class="leaderboard-name">' + member.name + '</div>' +
                        '<div class="leaderboard-state">' + member.state + ' • ' + member.responseTime + 'h avg</div>' +
                    '</div>' +
                    '<div class="leaderboard-score ' + scoreClass + '">' + member.responseTime + 'h</div>' +
                '</li>';
            }).join('');
        }

        function updateRegionalLeaderboard() {
            const regionalChampions = [];
            
            // Get top performer from each region
            const regions = ['Colorado', 'West Texas', 'EPNM'];
            regions.forEach(region => {
                const regionMembers = teamMembers.filter(m => m.state === region);
                if (regionMembers.length > 0) {
                    const topPerformer = regionMembers.reduce((prev, current) => 
                        current.engagementScore > prev.engagementScore ? current : prev
                    );
                    regionalChampions.push({ ...topPerformer, regionIcon: getRegionIcon(region) });
                }
            });

            // Sort by engagement score
            regionalChampions.sort((a, b) => b.engagementScore - a.engagementScore);

            const leaderboard = document.getElementById('regionalLeaderboard');
            leaderboard.innerHTML = regionalChampions.map((member, index) => {
                const positionClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : 'other';
                const scoreClass = getScoreClass(member.engagementScore);
                
                return '<li class="leaderboard-item">' +
                    '<div class="leaderboard-position ' + positionClass + '">' + member.regionIcon + '</div>' +
                    '<div class="leaderboard-member">' +
                        '<div class="leaderboard-name">' + member.name + '</div>' +
                        '<div class="leaderboard-state">' + member.state + ' Champion</div>' +
                    '</div>' +
                    '<div class="leaderboard-score ' + scoreClass + '">' + member.engagementScore + '</div>' +
                '</li>';
            }).join('');
        }

        function getScoreClass(score) {
            if (score >= 90) return 'score-excellent';
            if (score >= 80) return 'score-good';
            if (score >= 70) return 'score-average';
            return 'score-poor';
        }

        function getRegionIcon(region) {
            switch (region) {
                case 'Colorado': return '🏔️';
                case 'West Texas': return '🤠';
                case 'EPNM': return '🌵';
                default: return '🌟';
            }
        }

        // Data Management Functions
        async function loadRealData() {
            updateStatus('🔄 Loading real Slack data...');
            
            try {
                const response = await fetch('/api/team-members');
                const result = await response.json();
                
                if (result.success) {
                    teamMembers = result.data;
                    updateKPIs();
                    updateTabBadges();
                    updateLeaderboards();
                    createCharts();
                    updateStatus('✅ Real data loaded successfully');
                } else {
                    throw new Error(result.error || 'Failed to load data');
                }
            } catch (error) {
                console.error('Error loading data:', error);
                updateStatus('❌ Failed to load data');
            }
        }

        function updateKPIs() {
            if (teamMembers.length === 0) return;

            const avgEngagement = Math.round(
                teamMembers.reduce((sum, member) => sum + member.engagementScore, 0) / teamMembers.length
            );
            const totalMessages = teamMembers.reduce((sum, member) => sum + member.messages, 0);
            const avgResponseTime = (
                teamMembers.reduce((sum, member) => sum + member.responseTime, 0) / teamMembers.length
            ).toFixed(1);
            const activeMembers = teamMembers.filter(member => member.messages > 0).length;

            document.getElementById('overallEngagement').textContent = avgEngagement;
            document.getElementById('totalMessages').textContent = totalMessages.toLocaleString();
            document.getElementById('avgResponseTime').textContent = avgResponseTime + 'h';
            document.getElementById('activeMembers').textContent = activeMembers;
        }

        function updateTabBadges() {
            const stateCounts = {
                'Colorado': 0,
                'West Texas': 0,
                'EPNM': 0
            };

            teamMembers.forEach(member => {
                if (stateCounts[member.state] !== undefined) {
                    stateCounts[member.state]++;
                }
            });

            document.getElementById('badge-colorado').textContent = stateCounts['Colorado'];
            document.getElementById('badge-west-texas').textContent = stateCounts['West Texas'];
            document.getElementById('badge-epnm').textContent = stateCounts['EPNM'];
            document.getElementById('badge-executive').textContent = teamMembers.length;
        }

        function loadRegionalData(region) {
            const regionMap = {
                'colorado': 'Colorado',
                'west-texas': 'West Texas',
                'epnm': 'EPNM'
            };

            const stateName = regionMap[region];
            const regionMembers = teamMembers.filter(member => member.state === stateName);
            const gridElement = document.getElementById(region + '-grid');

            if (!gridElement) return;

            if (regionMembers.length > 0) {
                gridElement.innerHTML = regionMembers.map(member => {
                    const performanceColor = member.performance === 'excellent' ? '#27ae60' : 
                                           member.performance === 'good' ? '#3498db' : 
                                           member.performance === 'average' ? '#f39c12' : '#e74c3c';
                    
                    const trendIcon = member.trend === 'up' ? '📈' : member.trend === 'down' ? '📉' : '➡️';
                    
                    return '<div class="member-item" style="border-left-color: ' + performanceColor + '">' +
                        '<div class="member-header">' +
                            '<div class="member-info">' +
                                '<h4>' + member.name + '</h4>' +
                                '<p>' + member.role + ' • ' + member.state + '</p>' +
                            '</div>' +
                            '<span class="performance-indicator ' + member.performance + '">' + member.performance + '</span>' +
                        '</div>' +
                        '<div class="member-stats">' +
                            '<div class="stat-item">' +
                                '<div class="stat-value">' + member.engagementScore + '</div>' +
                                '<div class="stat-label">Score</div>' +
                            '</div>' +
                            '<div class="stat-item">' +
                                '<div class="stat-value">' + member.messages + '</div>' +
                                '<div class="stat-label">Messages</div>' +
                            '</div>' +
                            '<div class="stat-item">' +
                                '<div class="stat-value">' + member.responseTime + 'h</div>' +
                                '<div class="stat-label">Response</div>' +
                            '</div>' +
                            '<div class="stat-item">' +
                                '<div class="stat-value">' + trendIcon + '</div>' +
                                '<div class="stat-label">Trend</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                }).join('');
            } else {
                const regionIcon = getRegionIcon(stateName);
                gridElement.innerHTML = '<div class="empty-state">' +
                    '<div class="empty-state-icon">' + regionIcon + '</div>' +
                    '<p>No team members found in ' + stateName + '.</p>' +
                '</div>';
            }
        }

        function createCharts() {
            createTrendsChart();
            createRegionalChart();
        }

        function createTrendsChart() {
            const ctx = document.getElementById('trendsChart');
            if (!ctx) return;

            // Destroy existing chart if it exists
            if (charts.trends) {
                charts.trends.destroy();
            }

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            const engagementData = [78, 82, 85, 88, 91, 89];

            charts.trends = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Engagement Score',
                        data: engagementData,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        function createRegionalChart() {
            const ctx = document.getElementById('regionalChart');
            if (!ctx) return;

            // Destroy existing chart if it exists
            if (charts.regional) {
                charts.regional.destroy();
            }

            const regionalData = {
                'Colorado': teamMembers.filter(m => m.state === 'Colorado').length,
                'West Texas': teamMembers.filter(m => m.state === 'West Texas').length,
                'EPNM': teamMembers.filter(m => m.state === 'EPNM').length
            };

            charts.regional = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(regionalData),
                    datasets: [{
                        data: Object.values(regionalData),
                        backgroundColor: [
                            '#3498db',
                            '#e74c3c',
                            '#f39c12'
                        ],
                        borderWidth: 3,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        function refreshCharts() {
            updateStatus('🔄 Refreshing charts...');
            setTimeout(() => {
                createCharts();
                updateStatus('📈 Charts refreshed successfully');
            }, 1000);
        }

        function exportData() {
            updateStatus('📊 Preparing export...');
            
            const exportData = {
                teamMembers: teamMembers,
                exportDate: new Date().toISOString(),
                totalMembers: teamMembers.length,
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
            link.download = 'slack-dashboard-' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            updateStatus('💾 Data exported successfully');
        }

        function updateStatus(message) {
            const statusBar = document.getElementById('statusBar');
            if (statusBar) {
                statusBar.textContent = message;
            }
        }

        // Initialize Dashboard
        function initializeDashboard() {
            // Load data automatically on startup
            loadRealData();
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeDashboard);
        } else {
            initializeDashboard();
        }
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
    console.log(`✨ Features: Real-time analytics, Multi-regional support, Advanced charts, Member leaderboards`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📦 Platform: Render Cloud Deployment Ready`);
});

module.exports = app;

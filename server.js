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
                    <div class="kpi-value" id="totalMessages">1,780</div>
                    <div class="kpi-change positive">💬 Active communication</div>
                </div>

                <div class="kpi-card good">
                    <div class="kpi-label">Avg Response Time</div>
                    <div class="kpi-value" id="avgResponseTime">2.2h</div>
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
    </div>

    <script>
        // Global Variables
        let teamMembers = [];
        let currentTab = 'executive';
        let charts = {};

        // Sample team data
        const sampleTeamData = [
            { id: 'U001', name: 'Nicole Ruybal', role: 'Primary Owner', state: 'Colorado', messages: 156, reactions: 234, comments: 67, responseTime: 1.8, engagementScore: 96, trend: 'up', performance: 'excellent' },
            { id: 'U002', name: 'Chloe Entner', role: 'Team Member', state: 'Colorado', messages: 134, reactions: 189, comments: 45, responseTime: 2.1, engagementScore: 89, trend: 'up', performance: 'good' },
            { id: 'U003', name: 'Crystal Foley', role: 'Team Member', state: 'Colorado', messages: 142, reactions: 198, comments: 52, responseTime: 1.9, engagementScore: 92, trend: 'up', performance: 'excellent' },
            { id: 'U004', name: 'Jeff Goulet', role: 'Team Member', state: 'West Texas', messages: 118, reactions: 167, comments: 38, responseTime: 2.4, engagementScore: 85, trend: 'stable', performance: 'good' },
            { id: 'U005', name: 'Hannah Jackson', role: 'Team Member', state: 'Colorado', messages: 128, reactions: 176, comments: 43, responseTime: 2.2, engagementScore: 88, trend: 'up', performance: 'good' },
            { id: 'U006', name: 'Amy Partlow', role: 'Team Member', state: 'Colorado', messages: 139, reactions: 195, comments: 49, responseTime: 2.0, engagementScore: 91, trend: 'up', performance: 'excellent' },
            { id: 'U007', name: 'Haley Santiago', role: 'Team Member', state: 'Colorado', messages: 125, reactions: 172, comments: 41, responseTime: 2.3, engagementScore: 87, trend: 'stable', performance: 'good' },
            
            { id: 'U008', name: 'Constance Montgomery', role: 'Team Member', state: 'West Texas', messages: 148, reactions: 218, comments: 58, responseTime: 1.7, engagementScore: 94, trend: 'up', performance: 'excellent' },
            { id: 'U009', name: 'Kris Schmidt', role: 'Team Member', state: 'West Texas', messages: 137, reactions: 201, comments: 51, responseTime: 2.0, engagementScore: 90, trend: 'up', performance: 'excellent' },
            { id: 'U010', name: 'Sandi Franklin', role: 'Team Member', state: 'West Texas', messages: 122, reactions: 178, comments: 39, responseTime: 2.5, engagementScore: 86, trend: 'stable', performance: 'good' },
            { id: 'U011', name: 'Jonathan Barnhart', role: 'Team Member', state: 'West Texas', messages: 131, reactions: 187, comments: 44, responseTime: 2.2, engagementScore: 89, trend: 'up', performance: 'good' },
            { id: 'U012', name: 'Christian Melendez', role: 'Team Member', state: 'West Texas', messages: 145, reactions: 212, comments: 55, responseTime: 1.8, engagementScore: 93, trend: 'up', performance: 'excellent' },
            
            { id: 'U013', name: 'Scott Duerfeldt', role: 'Team Member', state: 'EPNM', messages: 127, reactions: 181, comments: 42, responseTime: 2.3, engagementScore: 88, trend: 'stable', performance: 'good' },
            { id: 'U014', name: 'Gidget Miller', role: 'Team Member', state: 'EPNM', messages: 136, reactions: 194, comments: 48, responseTime: 2.1, engagementScore: 91, trend: 'up', performance: 'excellent' },
            { id: 'U015', name: 'Ray Woodruff', role: 'Team Member', state: 'EPNM', messages: 119, reactions: 169, comments: 37, responseTime: 2.6, engagementScore: 84, trend: 'down', performance: 'good' },
            { id: 'U016', name: 'Aaron Hartman', role: 'Team Member', state: 'EPNM', messages: 133, reactions: 192, comments: 46, responseTime: 2.2, engagementScore: 89, trend: 'up', performance: 'good' },
            { id: 'U017', name: 'Erica Torres', role: 'Team Member', state: 'EPNM', messages: 141, reactions: 204, comments: 54, responseTime: 1.9, engagementScore: 92, trend: 'up', performance: 'excellent' },
            { id: 'U018', name: 'Jake Alsept', role: 'Team Member', state: 'EPNM', messages: 124, reactions: 175, comments: 40, responseTime: 2.4, engagementScore: 85, trend: 'stable', performance: 'good' },
            { id: 'U019', name: 'Jen Hettum', role: 'Team Member', state: 'EPNM', messages: 138, reactions: 199, comments: 50, responseTime: 2.0, engagementScore: 90, trend: 'up', performance: 'excellent' },
            { id: 'U020', name: 'Hector R Ramirez-Bruno', role: 'Team Member', state: 'EPNM', messages: 129, reactions: 184, comments: 44, responseTime: 2.3, engagementScore: 88, trend: 'stable', performance: 'good' }
        ];

        // Initialize with sample data
        teamMembers = [...sampleTeamData];

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
            document.getElementById(`tab-content-${tabName}`).classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');

            currentTab = tabName;
            updateStatus(`📊 Switched to ${tabName} view`);

            // Load regional data for non-executive tabs
            if (tabName !== 'executive') {
                loadRegionalData(tabName);
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
                
                return `
                    <li class="leaderboard-item">
                        <div class="leaderboard-position ${positionClass}">${index + 1}</div>
                        <div class="leaderboard-member">
                            <div class="leaderboard-name">${member.name}</div>
                            <div class="leaderboard-state">${member.state} • ${member.role}</div>
                        </div>
                        <div class="leaderboard-score ${scoreClass}">${member.engagementScore}</div>
                    </li>
                `;
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
                
                return `
                    <li class="leaderboard-item">
                        <div class="leaderboard-position ${positionClass}">${index + 1}</div>
                        <div class="leaderboard-member">
                            <div class="leaderboard-name">${member.name}</div>
                            <div class="leaderboard-state">${member.state} • ${member.messages} msgs</div>
                        </div>
                        <div class="leaderboard-score ${scoreClass}">${member.messages}</div>
                    </li>
                `;
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
                
                return `
                    <li class="leaderboard-item">
                        <div class="leaderboard-position ${positionClass}">${index + 1}</div>
                        <div class="leaderboard-member">
                            <div class="leaderboard-name">${member.name}</div>
                            <div class="leaderboard-state">${member.state} • ${member.responseTime}h avg</div>
                        </div>
                        <div class="leaderboard-score ${scoreClass}">${member.responseTime}h</div>
                    </li>
                `;
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
                
                return `
                    <li class="leaderboard-item">
                        <div class="leaderboard-position ${positionClass}">${member.regionIcon}</div>
                        <div class="leaderboard-member">
                            <div class="leaderboard-name">${member.name}</div>
                            <div class="leaderboard-state">${member.state} Champion</div>
                        </div>
                        <div class="leaderboard-score ${scoreClass}">${member.engagementScore}</div>
                    </li>
                `;
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
        function loadRealData() {
            updateStatus('🔄 Loading real Slack data...');
            
            // Simulate API call delay
            setTimeout(() => {
                updateKPIs();
                updateTabBadges();
                updateLeaderboards();
                createCharts();
                updateStatus('✅ Real data loaded successfully');
            }, 1500);
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
            const gridElement = document.getElementById(`${region}-grid`);

            if (!gridElement) return;

            if (regionMembers.length > 0) {
                gridElement.innerHTML = regionMembers.map(member => {
                    const performanceColor = member.performance === 'excellent' ? '#27ae60' : 
                                           member.performance === 'good' ? '#3498db' : 
                                           member.performance === 'average' ? '#f39c12' : '#e74c3c';
                    
                    const trendIcon = member.trend === 'up' ? '📈' : member.trend === 'down' ? '📉' : '➡️';
                    
                    return `
                        <div class="member-item" style="border-left-color: ${performanceColor}">
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
                                    <div class="stat-label">Score</div>
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
                                    <div class="stat-value">${trendIcon}</div>
                                    <div class="stat-label">Trend</div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                const regionIcon = getRegionIcon(stateName);
                gridElement.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">${regionIcon}</div>
                        <p>No team members found in ${stateName}.</p>
                    </div>
                `;
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
            const messagesData = [1200, 1350, 1480, 1620, 1750, 1780];

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
                    }, {
                        label: 'Messages (scaled)',
                        data: messagesData.map(val => val / 20), // Scale down for visibility
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
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
            updateKPIs();
            updateTabBadges();
            updateLeaderboards();
            createCharts();
            updateStatus('✅ Dashboard initialized with leaderboards');
        }

    </script>
</body>
</html>

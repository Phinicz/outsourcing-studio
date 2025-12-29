// Admin Dashboard JavaScript
let currentTab = 'insights';
let messageFilter = 'all'; // 'all', 'unread', 'read'

// Tab switching
function switchTab(event, tabName) {
    currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');

    // Load data for specific tabs if needed
    if (tabName === 'insights') loadInsightsData();
    if (tabName === 'funnel') loadFunnelData();
    if (tabName === 'engagement') loadEngagementData();
    if (tabName === 'messages') {
        // Reset to show unread by default when opening messages tab
        messageFilter = 'unread';
        filterMessages('unread');
    }
}

// Initialize Supabase and load data
async function initAndLoadData() {
    const client = await window.waitForSupabase();
    if (client) {
        await loadData();
    } else {
        console.error('Failed to initialize Supabase');
        loadLocalStorageData();
    }
}

async function loadData() {
    const supabaseClient = window.getSupabase();
    if (!supabaseClient) {
        loadLocalStorageData();
        return;
    }

    try {
        // Load all analytics data
        const [messages, visitors, events, sectionViews, scrollDepth, recentVisitors] = await Promise.all([
            supabaseClient.from('messages').select('*').order('timestamp', { ascending: false }).limit(50),
            supabaseClient.from('visitors').select('*').order('timestamp', { ascending: false }).limit(100),
            supabaseClient.from('analytics_events').select('*').order('timestamp', { ascending: false }),
            supabaseClient.from('analytics_section_views').select('*').order('timestamp', { ascending: false }),
            supabaseClient.from('analytics_scroll_depth').select('*').order('timestamp', { ascending: false }),
            supabaseClient.from('visitors').select('visitor_id').gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        ]);

        // Store data globally for tab switching
        window.analyticsData = {
            messages: messages.data || [],
            visitors: visitors.data || [],
            events: events.data || [],
            sectionViews: sectionViews.data || [],
            scrollDepth: scrollDepth.data || []
        };

        // Debug: Check if messages have IDs
        console.log('Messages loaded:', window.analyticsData.messages.length);
        if (window.analyticsData.messages.length > 0) {
            console.log('Sample message:', window.analyticsData.messages[0]);
            console.log('Message has ID?', window.analyticsData.messages[0].id ? 'YES' : 'NO');
            console.log('Message has is_read?', 'is_read' in window.analyticsData.messages[0] ? 'YES' : 'NO');
        }

        // Calculate hero stats
        updateHeroStats();

        // Display initial data
        loadInsightsData();

    } catch (error) {
        console.error('Error loading data from Supabase:', error);
        loadLocalStorageData();
    }
}

// Update hero stats with meaningful metrics
function updateHeroStats() {
    if (!window.analyticsData) return;

    const { events, sectionViews, visitors, messages } = window.analyticsData;

    // 1. Unread Messages
    const unreadCount = messages.filter(m => !m.is_read).length;
    document.getElementById('unreadMessages').textContent = unreadCount;
    document.getElementById('unreadTrend').textContent = `${messages.length} total messages`;

    // 2. Conversion Rate
    const totalVisitors = new Set(visitors.map(v => v.visitor_id)).size;
    const conversionRate = totalVisitors > 0 ? ((conversions / totalVisitors) * 100).toFixed(1) : 0;
    document.getElementById('conversionRate').textContent = conversionRate + '%';

    // 3. Portfolio Engagement
    const portfolioViewers = new Set(sectionViews.filter(s => s.section_name === 'portfolio').map(s => s.visitor_id)).size;
    const portfolioRate = totalVisitors > 0 ? ((portfolioViewers / totalVisitors) * 100).toFixed(0) : 0;
    document.getElementById('portfolioEngagement').textContent = portfolioRate + '%';
    document.getElementById('portfolioTrend').textContent = `${portfolioViewers} of ${totalVisitors} visitors`;

    // 4. Drop-off Point (most critical)
    const heroViewers = new Set(sectionViews.filter(s => s.section_name === 'hero').map(s => s.visitor_id)).size;
    const contactViewers = new Set(sectionViews.filter(s => s.section_name === 'contact').map(s => s.visitor_id)).size;

    let dropOffPoint = 'Unknown';
    let dropOffTrend = '';

    if (heroViewers > 0) {
        const heroToPortfolio = portfolioViewers / heroViewers;
        const portfolioToContact = portfolioViewers > 0 ? contactViewers / portfolioViewers : 0;
        const contactToConversion = contactViewers > 0 ? conversions / contactViewers : 0;

        if (heroToPortfolio < 0.5) {
            dropOffPoint = 'Hero';
            dropOffTrend = `${((1 - heroToPortfolio) * 100).toFixed(0)}% leave before portfolio`;
        } else if (portfolioToContact < 0.3) {
            dropOffPoint = 'Portfolio';
            dropOffTrend = `${((1 - portfolioToContact) * 100).toFixed(0)}% don't reach contact`;
        } else if (contactToConversion < 0.1) {
            dropOffPoint = 'Contact Form';
            dropOffTrend = `${((1 - contactToConversion) * 100).toFixed(0)}% abandon form`;
        } else {
            dropOffPoint = 'All Good! 🎉';
            dropOffTrend = 'Strong funnel performance';
        }
    }

    document.getElementById('dropOffPoint').textContent = dropOffPoint;
    document.getElementById('dropOffTrend').textContent = dropOffTrend;
}

// Load insights data with recommendations
function loadInsightsData() {
    if (!window.analyticsData) return;

    const { events, sectionViews, scrollDepth, visitors } = window.analyticsData;

    // Generate AI-powered recommendations
    const recommendations = generateRecommendations();

    const recommendationsDiv = document.getElementById('recommendations');
    if (recommendations.length === 0) {
        recommendationsDiv.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: rgba(255,255,255,0.9);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Collecting data...</div>
                <div style="font-size: 0.95rem; opacity: 0.8;">Recommendations will appear once we have enough data to analyze</div>
            </div>
        `;
    } else {
        recommendationsDiv.innerHTML = recommendations.map((rec, index) => `
            <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; backdrop-filter: blur(10px);">
                <div style="display: flex; gap: 1rem; align-items: start;">
                    <div style="font-size: 2rem;">${rec.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">${rec.title}</div>
                        <div style="font-size: 0.95rem; opacity: 0.95; line-height: 1.6; margin-bottom: 1rem;">${rec.description}</div>
                        <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600;">
                            ${rec.action}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Conversion Performance
    const conversions = events.filter(e => e.event_type === 'form_submit').length;
    const totalVisitors = new Set(visitors.map(v => v.visitor_id)).size;
    const contactViewers = new Set(sectionViews.filter(s => s.section_name === 'contact').map(s => s.visitor_id)).size;
    const conversionRate = totalVisitors > 0 ? ((conversions / totalVisitors) * 100).toFixed(1) : 0;
    const contactConversionRate = contactViewers > 0 ? ((conversions / contactViewers) * 100).toFixed(1) : 0;

    document.getElementById('conversionStats').innerHTML = `
        <div style="padding: 1rem;">
            <div style="margin-bottom: 1.5rem;">
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Total Conversions</div>
                <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-primary);">${conversions}</div>
            </div>
            <div style="margin-bottom: 1rem;">
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Overall Conversion Rate</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${conversionRate}%</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">of all visitors</div>
            </div>
            <div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Contact → Form Rate</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: ${contactConversionRate > 10 ? 'var(--success)' : 'var(--warning)'};">${contactConversionRate}%</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">who reach contact form</div>
            </div>
        </div>
    `;

    // Portfolio Performance
    const portfolioClicks = events.filter(e => e.event_category === 'portfolio').length;
    const videoPlays = events.filter(e => e.event_type === 'video_play').length;
    const portfolioViewers = new Set(sectionViews.filter(s => s.section_name === 'portfolio').map(s => s.visitor_id)).size;

    // Find most clicked portfolio item
    const portfolioItems = {};
    events.filter(e => e.event_category === 'portfolio' && e.event_label).forEach(e => {
        if (!portfolioItems[e.event_label]) portfolioItems[e.event_label] = 0;
        portfolioItems[e.event_label]++;
    });
    const topPortfolioItem = Object.entries(portfolioItems).sort((a, b) => b[1] - a[1])[0];

    document.getElementById('portfolioStats').innerHTML = `
        <div style="padding: 1rem;">
            <div style="margin-bottom: 1.5rem;">
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Portfolio Viewers</div>
                <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-primary);">${portfolioViewers}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${totalVisitors > 0 ? ((portfolioViewers / totalVisitors) * 100).toFixed(0) : 0}% of visitors</div>
            </div>
            <div style="margin-bottom: 1rem;">
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Total Interactions</div>
                <div style="font-size: 1.5rem; font-weight: 700;">${portfolioClicks}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${videoPlays} video plays</div>
            </div>
            ${topPortfolioItem ? `
            <div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Top Performer</div>
                <div style="font-size: 0.95rem; font-weight: 600; color: var(--primary);">${topPortfolioItem[0]}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${topPortfolioItem[1]} clicks</div>
            </div>
            ` : ''}
        </div>
    `;

    // Contact Method Preference
    const whatsappClicks = events.filter(e => e.event_label === 'whatsapp_click').length;
    const phoneClicks = events.filter(e => e.event_label === 'phone_click').length;
    const emailClicks = events.filter(e => e.event_label === 'email_click').length;

    const totalContactClicks = whatsappClicks + phoneClicks + emailClicks;

    document.getElementById('contactMethodStats').innerHTML = `
        <div style="padding: 1rem;">
            ${totalContactClicks === 0 ? `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📞</div>
                    <div>No contact clicks yet</div>
                </div>
            ` : `
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">WhatsApp</span>
                        <span style="font-weight: 700;">${whatsappClicks}</span>
                    </div>
                    <div style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; background: var(--success); width: ${(whatsappClicks / totalContactClicks * 100)}%;"></div>
                    </div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">Phone</span>
                        <span style="font-weight: 700;">${phoneClicks}</span>
                    </div>
                    <div style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; background: var(--info); width: ${(phoneClicks / totalContactClicks * 100)}%;"></div>
                    </div>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">Email</span>
                        <span style="font-weight: 700;">${emailClicks}</span>
                    </div>
                    <div style="height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; background: var(--warning); width: ${(emailClicks / totalContactClicks * 100)}%;"></div>
                    </div>
                </div>
            `}
        </div>
    `;
}

// Generate smart recommendations
function generateRecommendations() {
    if (!window.analyticsData) return [];

    const { events, sectionViews, scrollDepth, visitors } = window.analyticsData;
    const recommendations = [];

    const totalVisitors = new Set(visitors.map(v => v.visitor_id)).size;
    if (totalVisitors < 5) return []; // Need minimum data

    const heroViewers = new Set(sectionViews.filter(s => s.section_name === 'hero').map(s => s.visitor_id)).size;
    const portfolioViewers = new Set(sectionViews.filter(s => s.section_name === 'portfolio').map(s => s.visitor_id)).size;
    const contactViewers = new Set(sectionViews.filter(s => s.section_name === 'contact').map(s => s.visitor_id)).size;
    const conversions = events.filter(e => e.event_type === 'form_submit').length;

    // Check Hero → Portfolio conversion
    if (heroViewers > 0 && portfolioViewers / heroViewers < 0.5) {
        recommendations.push({
            icon: '🚀',
            title: 'Improve Hero Section CTA',
            description: `Only ${((portfolioViewers / heroViewers) * 100).toFixed(0)}% of visitors scroll to see your portfolio. Your hero section isn't compelling enough to keep people engaged.`,
            action: 'ACTION: Strengthen your value proposition or CTA button'
        });
    }

    // Check Portfolio → Contact conversion
    if (portfolioViewers > 0 && contactViewers / portfolioViewers < 0.3) {
        recommendations.push({
            icon: '💼',
            title: 'Add CTAs in Portfolio Section',
            description: `${((1 - contactViewers / portfolioViewers) * 100).toFixed(0)}% of portfolio viewers don't reach the contact form. They're interested but not motivated to take action.`,
            action: 'ACTION: Add "Get a Quote" buttons after portfolio items'
        });
    }

    // Check Contact → Conversion rate
    if (contactViewers > 0 && conversions / contactViewers < 0.1) {
        recommendations.push({
            icon: '📝',
            title: 'Simplify Your Contact Form',
            description: `${((1 - conversions / contactViewers) * 100).toFixed(0)}% of people who reach your contact form don't submit it. It might be too intimidating or complex.`,
            action: 'ACTION: Remove unnecessary fields or add trust signals'
        });
    }

    // Check scroll depth
    const reached75 = new Set(scrollDepth.filter(s => s.depth_percentage === 75).map(s => s.visitor_id)).size;
    if (totalVisitors > 0 && reached75 / totalVisitors < 0.4) {
        recommendations.push({
            icon: '📜',
            title: 'Move Important Content Higher',
            description: `Only ${((reached75 / totalVisitors) * 100).toFixed(0)}% of visitors scroll past 75% of the page. Important content might be too far down.`,
            action: 'ACTION: Prioritize key information above the fold'
        });
    }

    // Check for good performance
    if (totalVisitors > 0 && conversions / totalVisitors > 0.05) {
        recommendations.push({
            icon: '🎉',
            title: 'Great Conversion Rate!',
            description: `Your ${((conversions / totalVisitors) * 100).toFixed(1)}% conversion rate is excellent for a service website. Keep doing what you're doing!`,
            action: 'TIP: Monitor which portfolio items lead to most conversions'
        });
    }

    return recommendations.slice(0, 3); // Max 3 recommendations
}

// Load overview data (old function - keeping for compatibility)
function loadOverviewData() {
    if (!window.analyticsData) return;

    const { events, sectionViews } = window.analyticsData;

    // Calculate metrics
    const ctaClicks = events.filter(e => e.event_category === 'cta').length;
    const portfolioClicks = events.filter(e => e.event_category === 'portfolio').length;
    const contactClicks = events.filter(e => e.event_category === 'contact' && e.event_type === 'click').length;
    const formSubmissions = events.filter(e => e.event_type === 'form_submit').length;

    const uniquePortfolioViewers = new Set(sectionViews.filter(s => s.section_name === 'portfolio').map(s => s.visitor_id)).size;
    const uniqueContactViewers = new Set(sectionViews.filter(s => s.section_name === 'contact').map(s => s.visitor_id)).size;

    // Display overview metrics
    const overviewMetrics = document.getElementById('overviewMetrics');
    overviewMetrics.innerHTML = `
        <div class="metric-box">
            <div class="metric-label">CTA Clicks</div>
            <div class="metric-value">${ctaClicks}</div>
            <div class="metric-subtext">Call-to-action interactions</div>
        </div>
        <div class="metric-box">
            <div class="metric-label">Portfolio Views</div>
            <div class="metric-value">${uniquePortfolioViewers}</div>
            <div class="metric-subtext">${portfolioClicks} portfolio interactions</div>
        </div>
        <div class="metric-box">
            <div class="metric-label">Contact Views</div>
            <div class="metric-value">${uniqueContactViewers}</div>
            <div class="metric-subtext">${contactClicks} contact interactions</div>
        </div>
        <div class="metric-box">
            <div class="metric-label">Conversions</div>
            <div class="metric-value">${formSubmissions}</div>
            <div class="metric-subtext">Form submissions (goal!)</div>
        </div>
    `;

    // Top clicks
    const clickEvents = events.filter(e => e.event_type === 'click');
    const clickCounts = {};
    clickEvents.forEach(e => {
        const key = `${e.event_label}_${e.event_category}`;
        if (!clickCounts[key]) {
            clickCounts[key] = { label: e.event_label, category: e.event_category, count: 0, visitors: new Set() };
        }
        clickCounts[key].count++;
        clickCounts[key].visitors.add(e.visitor_id);
    });

    const topClicks = Object.values(clickCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const topClicksList = document.getElementById('topClicksList');
    if (topClicks.length === 0) {
        topClicksList.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-state">
                        <div class="empty-icon">🖱️</div>
                        <div class="empty-title">No click events yet</div>
                        <div class="empty-text">Start tracking user interactions</div>
                    </div>
                </td>
            </tr>
        `;
    } else {
        topClicksList.innerHTML = topClicks.map((click, index) => `
            <tr>
                <td><strong>${escapeHtml(click.label)}</strong></td>
                <td><span class="badge badge-${getBadgeColor(click.category)}">${click.category}</span></td>
                <td><strong>${click.count}</strong></td>
                <td>${click.visitors.size} users</td>
            </tr>
        `).join('');
    }
}

// Load funnel data
function loadFunnelData() {
    if (!window.analyticsData) return;

    const { sectionViews, events } = window.analyticsData;

    // Calculate funnel steps
    const heroViewers = new Set(sectionViews.filter(s => s.section_name === 'hero').map(s => s.visitor_id));
    const portfolioViewers = new Set(sectionViews.filter(s => s.section_name === 'portfolio').map(s => s.visitor_id));
    const contactViewers = new Set(sectionViews.filter(s => s.section_name === 'contact').map(s => s.visitor_id));
    const formSubmitters = new Set(events.filter(e => e.event_type === 'form_submit').map(e => e.visitor_id));

    const step1 = heroViewers.size;
    const step2 = portfolioViewers.size;
    const step3 = contactViewers.size;
    const step4 = formSubmitters.size;

    const rate2 = step1 > 0 ? ((step2 / step1) * 100).toFixed(1) : 0;
    const rate3 = step2 > 0 ? ((step3 / step2) * 100).toFixed(1) : 0;
    const rate4 = step3 > 0 ? ((step4 / step3) * 100).toFixed(1) : 0;

    const funnelContainer = document.getElementById('funnelContainer');

    if (step1 === 0) {
        funnelContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎯</div>
                <div class="empty-title">No funnel data yet</div>
                <div class="empty-text">Start tracking user journeys through your site</div>
            </div>
        `;
        return;
    }

    funnelContainer.innerHTML = `
        <div class="funnel-step step-1" style="--progress: 100%;">
            <div class="funnel-content">
                <div class="funnel-info">
                    <div class="funnel-step-number">1</div>
                    <div class="funnel-title">Hero Section</div>
                    <div class="funnel-desc">Landing page visitors</div>
                </div>
                <div class="funnel-stats">
                    <div class="funnel-count">${step1}</div>
                    <div class="funnel-rate">100% baseline</div>
                </div>
            </div>
        </div>
        
        <div class="funnel-step step-2" style="--progress: ${rate2}%;">
            <div class="funnel-content">
                <div class="funnel-info">
                    <div class="funnel-step-number">2</div>
                    <div class="funnel-title">Portfolio Section</div>
                    <div class="funnel-desc">Viewed our work</div>
                </div>
                <div class="funnel-stats">
                    <div class="funnel-count">${step2}</div>
                    <div class="funnel-rate">${rate2}% conversion</div>
                </div>
            </div>
        </div>
        
        <div class="funnel-step step-3" style="--progress: ${step1 > 0 ? (step3 / step1 * 100).toFixed(1) : 0}%;">
            <div class="funnel-content">
                <div class="funnel-info">
                    <div class="funnel-step-number">3</div>
                    <div class="funnel-title">Contact Section</div>
                    <div class="funnel-desc">Reached contact form</div>
                </div>
                <div class="funnel-stats">
                    <div class="funnel-count">${step3}</div>
                    <div class="funnel-rate">${rate3}% from portfolio</div>
                </div>
            </div>
        </div>
        
        <div class="funnel-step step-4" style="--progress: ${step1 > 0 ? (step4 / step1 * 100).toFixed(1) : 0}%;">
            <div class="funnel-content">
                <div class="funnel-info">
                    <div class="funnel-step-number">4</div>
                    <div class="funnel-title">Form Submission 🎉</div>
                    <div class="funnel-desc">Successfully converted!</div>
                </div>
                <div class="funnel-stats">
                    <div class="funnel-count">${step4}</div>
                    <div class="funnel-rate">${rate4}% from contact</div>
                </div>
            </div>
        </div>
    `;
}

// Load engagement data
function loadEngagementData() {
    if (!window.analyticsData) return;

    const { events, sectionViews, scrollDepth, visitors } = window.analyticsData;

    // User Journey Visualization
    const totalVisitors = new Set(visitors.map(v => v.visitor_id)).size;
    const heroViewers = new Set(sectionViews.filter(s => s.section_name === 'hero').map(s => s.visitor_id)).size;
    const portfolioViewers = new Set(sectionViews.filter(s => s.section_name === 'portfolio').map(s => s.visitor_id)).size;
    const contactViewers = new Set(sectionViews.filter(s => s.section_name === 'contact').map(s => s.visitor_id)).size;
    const conversions = events.filter(e => e.event_type === 'form_submit').length;

    // Calculate average time per section
    const sections = ['hero', 'portfolio', 'testimonials', 'team', 'contact'];
    const sectionTimes = sections.map(section => {
        const views = sectionViews.filter(s => s.section_name === section && s.view_duration);
        const avgTime = views.length > 0 ? (views.reduce((sum, v) => sum + v.view_duration, 0) / views.length).toFixed(0) : 0;
        const viewers = new Set(sectionViews.filter(s => s.section_name === section).map(s => s.visitor_id)).size;
        return { section, avgTime, viewers };
    });

    document.getElementById('journeyVisualization').innerHTML = `
        <div style="padding: 1.5rem;">
            ${sectionTimes.map(stat => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--dashboard-bg); border-radius: 8px; margin-bottom: 0.75rem;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">
                            ${stat.section.charAt(0).toUpperCase() + stat.section.slice(1)}
                        </div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">
                            ${stat.viewers} visitors • ${stat.avgTime}s avg time
                        </div>
                    </div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">
                        ${totalVisitors > 0 ? ((stat.viewers / totalVisitors) * 100).toFixed(0) : 0}%
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // What's Working
    const clickEvents = events.filter(e => e.event_type === 'click');
    const clickCounts = {};
    clickEvents.forEach(e => {
        if (!clickCounts[e.event_label]) clickCounts[e.event_label] = 0;
        clickCounts[e.event_label]++;
    });

    const topClicks = Object.entries(clickCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    document.getElementById('whatWorking').innerHTML = `
        <div style="padding: 1rem;">
            ${topClicks.length === 0 ? `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
                    <div>Collecting engagement data...</div>
                </div>
            ` : topClicks.map((click, index) => `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; ${index < topClicks.length - 1 ? 'border-bottom: 1px solid var(--border-color);' : ''}">
                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--success); width: 30px;">${index + 1}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(click[0])}</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">${click[1]} clicks</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // What Needs Attention
    const issues = [];

    // Check scroll depth
    const reached50 = new Set(scrollDepth.filter(s => s.depth_percentage === 50).map(s => s.visitor_id)).size;
    if (totalVisitors > 0 && reached50 / totalVisitors < 0.6) {
        issues.push({
            title: 'Low Scroll Depth',
            description: `Only ${((reached50 / totalVisitors) * 100).toFixed(0)}% scroll halfway`,
            severity: 'high'
        });
    }

    // Check portfolio engagement
    if (totalVisitors > 0 && portfolioViewers / totalVisitors < 0.5) {
        issues.push({
            title: 'Portfolio Not Reaching Users',
            description: `${((1 - portfolioViewers / totalVisitors) * 100).toFixed(0)}% don't see your work`,
            severity: 'critical'
        });
    }

    // Check contact form conversion
    if (contactViewers > 0 && conversions / contactViewers < 0.15) {
        issues.push({
            title: 'Low Form Completion',
            description: `${((1 - conversions / contactViewers) * 100).toFixed(0)}% abandon the form`,
            severity: 'high'
        });
    }

    // Check if portfolio has low engagement time
    const portfolioTime = sectionTimes.find(s => s.section === 'portfolio');
    if (portfolioTime && portfolioTime.avgTime < 10 && portfolioTime.viewers > 5) {
        issues.push({
            title: 'Portfolio Not Engaging',
            description: `Users spend only ${portfolioTime.avgTime}s viewing`,
            severity: 'medium'
        });
    }

    document.getElementById('whatNotWorking').innerHTML = `
        <div style="padding: 1rem;">
            ${issues.length === 0 ? `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
                    <div>Everything looks good!</div>
                </div>
            ` : issues.map(issue => `
                <div style="padding: 1rem; background: rgba(239, 68, 68, 0.05); border-left: 3px solid var(--danger); border-radius: 8px; margin-bottom: 1rem;">
                    <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${issue.title}</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary);">${issue.description}</div>
                </div>
            `).join('')}
        </div>
    `;

    // Top Clicks Visualization
    document.getElementById('topClicksViz').innerHTML = `
        <div style="padding: 1.5rem;">
            ${topClicks.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-icon">🖱️</div>
                    <div class="empty-title">No click data yet</div>
                    <div class="empty-text">User clicks will appear here</div>
                </div>
            ` : topClicks.map(click => {
        const maxClicks = topClicks[0][1];
        const percentage = (click[1] / maxClicks * 100);
        return `
                    <div style="margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="font-weight: 600; color: var(--text-primary);">${escapeHtml(click[0])}</span>
                            <span style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">${click[1]}</span>
                        </div>
                        <div style="height: 12px; background: var(--border-color); border-radius: 6px; overflow: hidden;">
                            <div style="height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); width: ${percentage}%; transition: width 0.5s ease;"></div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

// Filter messages
function filterMessages(filter) {
    messageFilter = filter;

    // Update button states
    document.getElementById('filterAll').classList.remove('active');
    document.getElementById('filterUnread').classList.remove('active');
    document.getElementById('filterRead').classList.remove('active');
    document.getElementById('filter' + filter.charAt(0).toUpperCase() + filter.slice(1)).classList.add('active');

    // Filter and display
    if (window.analyticsData && window.analyticsData.messages) {
        let filtered = window.analyticsData.messages;
        if (filter === 'unread') {
            filtered = filtered.filter(m => !m.is_read);
        } else if (filter === 'read') {
            filtered = filtered.filter(m => m.is_read);
        }
        displayMessages(filtered);

        // Update subtitle
        const subtitle = document.getElementById('messagesSubtitle');
        if (filter === 'all') {
            subtitle.textContent = `${filtered.length} total messages`;
        } else if (filter === 'unread') {
            subtitle.textContent = `${filtered.length} unread messages`;
        } else {
            subtitle.textContent = `${filtered.length} read messages`;
        }
    }
}

// Mark message as read
async function markMessageAsRead(messageId) {
    console.log('Marking message as read:', messageId);

    const supabaseClient = window.getSupabase();
    if (!supabaseClient) {
    }

    // Prevent multiple clicks
    const message = window.analyticsData.messages.find(m => m.id === messageId);
    if (!message) {
        console.error('Message not found:', messageId);
        return;
    }

    if (message.is_read) {
        console.log('Message already read');
        return;
    }

    try {
        console.log('Updating message in Supabase...');
        const { data, error } = await supabaseClient
            .from('messages')
            .update({
                is_read: true,
                read_at: new Date().toISOString()
            })
            .eq('id', messageId)
            .select();

        if (error) {
            console.error('Supabase error:', error);
            alert('Error marking message as read: ' + error.message);
            return;
        }

        console.log('Message marked as read successfully:', data);

        // Update local data
        message.is_read = true;
        message.read_at = new Date().toISOString();

        // Refresh display
        updateHeroStats();
        filterMessages(messageFilter);

        console.log('UI updated');

    } catch (error) {
        console.error('Error marking message as read:', error);
        alert('Unexpected error: ' + error.message);
    }
}

// Display messages
function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    if (messages.length === 0) {
        messagesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✉️</div>
                <div class="empty-title">No messages ${messageFilter !== 'all' ? messageFilter : 'yet'}</div>
                <div class="empty-text">${messageFilter === 'all' ? 'Contact form submissions will appear here' : 'Try changing the filter'}</div>
            </div>
        `;
    } else {
        messagesList.innerHTML = messages.map(msg => `
            <div class="message-card ${msg.is_read ? 'read' : 'unread'}" 
                 onclick="event.stopPropagation(); markMessageAsRead('${msg.id}');"
                 style="text-align: left; padding: 1.5rem; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                            <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">
                                ${escapeHtml(msg.name)}
                            </div>
                            <span class="message-status ${msg.is_read ? 'read' : 'unread'}">
                                ${msg.is_read ? '✓ Read' : '● Unread'}
                            </span>
                        </div>
                        <div style="color: var(--text-secondary); font-size: 0.875rem;">
                            ${escapeHtml(msg.email)}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                            ${formatDate(msg.timestamp)}
                        </div>
                        ${msg.is_read && msg.read_at ? `
                            <div style="font-size: 0.7rem; color: var(--text-muted);">
                                Read: ${formatDate(msg.read_at)}
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div style="color: var(--text-primary); line-height: 1.6; margin-bottom: 1rem; padding: 1rem; background: var(--dashboard-bg); border-radius: 8px; font-size: 0.95rem;">
                    ${escapeHtml(msg.message)}
                </div>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.85rem; color: var(--text-secondary);">
                    <span>📍 ${msg.country || 'Unknown'}, ${msg.city || 'Unknown'}</span>
                    <span>🌐 ${msg.ip || 'Unknown'}</span>
                    <span>🆔 ${msg.visitor_id?.substring(0, 12) || 'unknown'}...</span>
                </div>
            </div>
        `).join('');
    }
}

// Load localStorage data as fallback
function loadLocalStorageData() {
    const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
    const visitors = JSON.parse(localStorage.getItem('portfolioVisitors') || '[]');

    window.analyticsData = {
        messages: messages,
        visitors: visitors,
        events: [],
        sectionViews: [],
        scrollDepth: []
    };

    // Update hero stats
    const unreadMessages = document.getElementById('unreadMessages');
    const conversionRate = document.getElementById('conversionRate');
    const portfolioEngagement = document.getElementById('portfolioEngagement');
    const dropOffPoint = document.getElementById('dropOffPoint');
    const dropOffTrend = document.getElementById('dropOffTrend');

    if (unreadMessages) unreadMessages.textContent = messages.length;
    if (conversionRate) conversionRate.textContent = '0%';
    if (portfolioEngagement) portfolioEngagement.textContent = '0%';
    if (dropOffPoint) dropOffPoint.textContent = 'No Data';
    if (dropOffTrend) dropOffTrend.textContent = 'Collecting data...';

    displayMessages(messages);
    loadInsightsData();
}

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getBadgeColor(category) {
    const colors = {
        'cta': 'primary',
        'portfolio': 'success',
        'contact': 'warning',
        'form': 'danger'
    };
    return colors[category] || 'primary';
}

function getEventTypeBadge(type) {
    const badges = {
        'click': 'primary',
        'form_submit': 'success',
        'video_play': 'warning'
    };
    return badges[type] || 'primary';
}

function refreshData() {
    loadData();
}

// Load data on page load
initAndLoadData();

// Auto-refresh every 30 seconds
setInterval(refreshData, 30000);

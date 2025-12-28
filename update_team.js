const fs = require('fs');

// Read the HTML
let html = fs.readFileSync('index.html', 'utf-8');

// Find the team-grid start
const teamGridStart = html.indexOf('      <div class="team-grid">');
const teamMembersStart = html.indexOf('<div class="team-member">', teamGridStart);

// Find the team-grid end (closing div before team section closes)
const teamSectionEnd = html.indexOf('  </section>', teamMembersStart);
const teamGridEnd = html.lastIndexOf('      </div>', teamSectionEnd);

// Read the new team members
const newTeamMembers = fs.readFileSync('team_members.html', 'utf-8');

// Replace the team members
const before = html.substring(0, teamMembersStart);
const after = html.substring(teamGridEnd);
const updated = before + newTeamMembers + '\n' + after;

// Write back
fs.writeFileSync('index.html', updated, 'utf-8');

console.log('Successfully updated team members!');

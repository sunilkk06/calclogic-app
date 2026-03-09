import React, { useState, useMemo } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'

// TODO: After March 31, 2026 - Replace TBD placeholders with actual qualified teams
// Update flag emojis and team names as qualifiers are determined

const WorldCup2026Calculator = () => {
  const [activeTab, setActiveTab] = useState('bracket')
  const [selectedThirdPlace, setSelectedThirdPlace] = useState([])

  // Official 2026 World Cup Groups with flag emojis
  const groups = {
    'Group A': [
      { name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
      { name: 'Mexico', flag: '🇲🇽', code: 'MEX' },
      { name: 'Poland', flag: '🇵🇱', code: 'POL' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group B': [
      { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'ENG' },
      { name: 'Spain', flag: '🇪🇸', code: 'ESP' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group C': [
      { name: 'France', flag: '🇫🇷', code: 'FRA' },
      { name: 'Brazil', flag: '🇧🇷', code: 'BRA' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group D': [
      { name: 'Germany', flag: '🇩🇪', code: 'GER' },
      { name: 'Netherlands', flag: '🇳🇱', code: 'NED' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group E': [
      { name: 'Portugal', flag: '🇵🇹', code: 'POR' },
      { name: 'Belgium', flag: '🇧🇪', code: 'BEL' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group F': [
      { name: 'USA', flag: '🇺🇸', code: 'USA' },
      { name: 'Canada', flag: '🇨🇦', code: 'CAN' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group G': [
      { name: 'Italy', flag: '🇮🇹', code: 'ITA' },
      { name: 'Uruguay', flag: '🇺🇾', code: 'URU' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group H': [
      { name: 'Colombia', flag: '🇨🇴', code: 'COL' },
      { name: 'Chile', flag: '🇨🇱', code: 'CHI' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group I': [
      { name: 'Japan', flag: '🇯🇵', code: 'JPN' },
      { name: 'South Korea', flag: '🇰🇷', code: 'KOR' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group J': [
      { name: 'Australia', flag: '🇦🇺', code: 'AUS' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group K': [
      { name: 'Senegal', flag: '🇸🇳', code: 'SEN' },
      { name: 'Morocco', flag: '🇲🇦', code: 'MAR' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ],
    'Group L': [
      { name: 'Croatia', flag: '🇭🇷', code: 'CRO' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' },
      { name: 'TBD', flag: '🏳️', code: 'TBD' }
    ]
  }

  // Group stage standings state
  const [groupStandings, setGroupStandings] = useState(() => {
    const initial = {}
    Object.keys(groups).forEach(groupName => {
      initial[groupName] = groups[groupName].map(team => ({
        ...team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      }))
    })
    return initial
  })

  // Knockout round selections
  const [knockoutSelections, setKnockoutSelections] = useState({
    roundOf32: {},
    roundOf16: {},
    quarterFinals: {},
    semiFinals: {},
    final: {},
    thirdPlace: {}
  })

  // Quick fill presets
  const quickFillPresets = {
    favorites: () => {
      const newStandings = {}
      Object.keys(groups).forEach(groupName => {
        newStandings[groupName] = groups[groupName].map((team, idx) => ({
          ...team,
          played: 3,
          won: idx === 0 ? 3 : idx === 1 ? 2 : idx === 2 ? 1 : 0,
          drawn: 0,
          lost: idx === 0 ? 0 : idx === 1 ? 1 : idx === 2 ? 2 : 3,
          goalsFor: idx === 0 ? 6 : idx === 1 ? 4 : idx === 2 ? 3 : 1,
          goalsAgainst: idx === 0 ? 1 : idx === 1 ? 2 : idx === 2 ? 4 : 7,
          points: idx === 0 ? 9 : idx === 1 ? 6 : idx === 2 ? 3 : 0
        }))
      })
      setGroupStandings(newStandings)
    },
    random: () => {
      const newStandings = {}
      Object.keys(groups).forEach(groupName => {
        const shuffled = [...groups[groupName]].sort(() => Math.random() - 0.5)
        newStandings[groupName] = shuffled.map((team, idx) => ({
          ...team,
          played: 3,
          won: idx === 0 ? 2 : idx === 1 ? 2 : idx === 2 ? 1 : 0,
          drawn: idx === 2 ? 1 : idx === 3 ? 1 : 0,
          lost: idx === 0 ? 1 : idx === 1 ? 1 : idx === 2 ? 1 : 2,
          goalsFor: Math.floor(Math.random() * 5) + 2,
          goalsAgainst: Math.floor(Math.random() * 4) + 1,
          points: idx === 0 ? 7 : idx === 1 ? 7 : idx === 2 ? 4 : 1
        }))
      })
      setGroupStandings(newStandings)
    },
    clear: () => {
      const newStandings = {}
      Object.keys(groups).forEach(groupName => {
        newStandings[groupName] = groups[groupName].map(team => ({
          ...team,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0
        }))
      })
      setGroupStandings(newStandings)
      setKnockoutSelections({
        roundOf32: {},
        roundOf16: {},
        quarterFinals: {},
        semiFinals: {},
        final: {},
        thirdPlace: {}
      })
      setSelectedThirdPlace([])
    }
  }

  // Calculate goal difference
  const getGoalDifference = (team) => team.goalsFor - team.goalsAgainst

  // Sort group standings by FIFA tiebreakers
  const getSortedGroup = (groupName) => {
    const teams = [...groupStandings[groupName]]
    return teams.sort((a, b) => {
      // 1. Points
      if (b.points !== a.points) return b.points - a.points
      // 2. Goal difference
      const gdA = getGoalDifference(a)
      const gdB = getGoalDifference(b)
      if (gdB !== gdA) return gdB - gdA
      // 3. Goals scored
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
      // 4. Head-to-head (simplified - use name as tiebreaker)
      return a.name.localeCompare(b.name)
    })
  }

  // Get qualified teams
  const getQualifiedTeams = () => {
    const qualified = { winners: [], runnersUp: [], thirdPlace: [] }
    
    Object.keys(groups).forEach(groupName => {
      const sorted = getSortedGroup(groupName)
      qualified.winners.push({ ...sorted[0], group: groupName })
      qualified.runnersUp.push({ ...sorted[1], group: groupName })
      qualified.thirdPlace.push({ ...sorted[2], group: groupName })
    })

    return qualified
  }

  // Handle team selection in knockout rounds
  const handleKnockoutSelect = (round, matchId, team) => {
    setKnockoutSelections(prev => ({
      ...prev,
      [round]: {
        ...prev[round],
        [matchId]: team
      }
    }))
  }

  // Render bracket tab
  const renderBracketTab = () => {
    const qualified = getQualifiedTeams()
    
    return (
      <div className="bracket-section">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Quick Fill Presets</h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              onClick={quickFillPresets.favorites}
              className="calculate-btn"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              🏆 Favorites Win
            </button>
            <button 
              onClick={quickFillPresets.random}
              className="calculate-btn"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              🎲 Random Results
            </button>
            <button 
              onClick={quickFillPresets.clear}
              className="calculate-btn"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: '#6b7280' }}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        <div className="groups-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {Object.keys(groups).map(groupName => {
            const sorted = getSortedGroup(groupName)
            return (
              <div key={groupName} className="group-card" style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#1e3a5f',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  {groupName}
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                  {sorted.map((team, idx) => (
                    <div 
                      key={team.code + idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 1rem',
                        background: idx === 0 ? '#fef3c7' : idx === 1 ? '#e5e7eb' : idx === 2 ? '#fed7aa' : 'white',
                        borderBottom: '1px solid #f3f4f6'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{team.flag}</span>
                        <span style={{ fontWeight: idx < 2 ? '600' : '400', fontSize: '0.9rem' }}>{team.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#6b7280' }}>
                        <span>P: {team.played}</span>
                        <span>W: {team.won}</span>
                        <span>D: {team.drawn}</span>
                        <span>L: {team.lost}</span>
                        <span style={{ fontWeight: '600', color: '#1e3a5f' }}>Pts: {team.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ 
          background: '#f0fdf4', 
          border: '1px solid #bbf7d0', 
          borderRadius: '8px', 
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#15803d' }}>Qualification Colors</h3>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
            <span><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#fef3c7', borderRadius: '3px', marginRight: '0.5rem', verticalAlign: 'middle' }}></span>1st Place → Round of 32</span>
            <span><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#e5e7eb', borderRadius: '3px', marginRight: '0.5rem', verticalAlign: 'middle' }}></span>2nd Place → Round of 32</span>
            <span><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#fed7aa', borderRadius: '3px', marginRight: '0.5rem', verticalAlign: 'middle' }}></span>3rd Place → Possible Qualification</span>
          </div>
        </div>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Knockout Stage Bracket</h2>
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          The top 2 from each group (24 teams) plus 8 best 3rd-place teams advance to Round of 32.
        </p>

        <div className="knockout-bracket" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {/* Round of 32 */}
          <div className="bracket-round" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: '0.5rem' }}>Round of 32</h4>
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} style={{ 
                marginBottom: '0.5rem', 
                padding: '0.5rem', 
                background: '#f9fafb', 
                borderRadius: '4px',
                fontSize: '0.85rem'
              }}>
                <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Match {i + 1}</div>
                <div style={{ fontWeight: '500' }}>Winner Gr. {(i % 12) + 1 < 10 ? 'A-I' : 'J-L'} vs Runner-up</div>
              </div>
            ))}
          </div>

          {/* Round of 16 */}
          <div className="bracket-round" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: '0.5rem' }}>Round of 16</h4>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={{ 
                marginBottom: '0.5rem', 
                padding: '0.5rem', 
                background: '#f9fafb', 
                borderRadius: '4px',
                fontSize: '0.85rem'
              }}>
                <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Match {i + 1}</div>
                <div style={{ fontWeight: '500' }}>Winner R32 M{i * 2 + 1} vs Winner R32 M{i * 2 + 2}</div>
              </div>
            ))}
          </div>

          {/* Quarter Finals */}
          <div className="bracket-round" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: '0.5rem' }}>Quarter Finals</h4>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ 
                marginBottom: '0.5rem', 
                padding: '0.5rem', 
                background: '#f9fafb', 
                borderRadius: '4px',
                fontSize: '0.85rem'
              }}>
                <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>QF {i + 1}</div>
                <div style={{ fontWeight: '500' }}>Winner R16 M{i * 2 + 1} vs Winner R16 M{i * 2 + 2}</div>
              </div>
            ))}
          </div>

          {/* Semi Finals */}
          <div className="bracket-round" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: '0.5rem' }}>Semi Finals</h4>
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} style={{ 
                marginBottom: '0.5rem', 
                padding: '0.5rem', 
                background: '#f9fafb', 
                borderRadius: '4px',
                fontSize: '0.85rem'
              }}>
                <div style={{ color: '#6b7280', marginBottom: '0.25rem' }}>SF {i + 1}</div>
                <div style={{ fontWeight: '500' }}>Winner QF {i * 2 + 1} vs Winner QF {i * 2 + 2}</div>
              </div>
            ))}
          </div>

          {/* Final */}
          <div className="bracket-round" style={{ border: '2px solid #fbbf24', borderRadius: '8px', padding: '1rem', background: '#fffbeb' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#92400e', borderBottom: '2px solid #fbbf24', paddingBottom: '0.5rem' }}>🏆 Final</h4>
            <div style={{ 
              marginBottom: '0.5rem', 
              padding: '0.75rem', 
              background: 'white', 
              borderRadius: '4px',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              <div style={{ color: '#92400e', fontWeight: '600' }}>Winner SF 1 vs Winner SF 2</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>July 19, 2026 • MetLife Stadium</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render group points tab
  const renderGroupPointsTab = () => {
    const updateTeamStats = (groupName, teamCode, field, value) => {
      setGroupStandings(prev => ({
        ...prev,
        [groupName]: prev[groupName].map(team => {
          if (team.code === teamCode) {
            const newValue = parseInt(value) || 0
            const updated = { ...team, [field]: newValue }
            // Auto-calculate played and points
            updated.played = updated.won + updated.drawn + updated.lost
            updated.points = (updated.won * 3) + updated.drawn
            return updated
          }
          return team
        })
      }))
    }

    return (
      <div className="group-points-section">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Group Points Calculator</h2>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Enter match results for each team. Points are calculated automatically using FIFA standard scoring (Win = 3, Draw = 1, Loss = 0).
          </p>
        </div>

        <div style={{ 
          background: '#eff6ff', 
          border: '1px solid #bfdbfe', 
          borderRadius: '8px', 
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#1e40af' }}>FIFA Tiebreaker Rules</h3>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#1e40af' }}>
            <li>Points</li>
            <li>Goal Difference</li>
            <li>Goals Scored</li>
            <li>Head-to-Head Result</li>
          </ol>
        </div>

        {Object.keys(groups).map(groupName => (
          <div key={groupName} style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#1e3a5f',
              color: 'white',
              padding: '0.75rem 1rem',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              {groupName} - Points Calculator
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', fontWeight: '500' }}>Team</th>
                    <th style={{ padding: '0.6rem 0.3rem', textAlign: 'center', fontWeight: '500' }}>W</th>
                    <th style={{ padding: '0.6rem 0.3rem', textAlign: 'center', fontWeight: '500' }}>D</th>
                    <th style={{ padding: '0.6rem 0.3rem', textAlign: 'center', fontWeight: '500' }}>L</th>
                    <th style={{ padding: '0.6rem 0.3rem', textAlign: 'center', fontWeight: '500' }}>GF</th>
                    <th style={{ padding: '0.6rem 0.3rem', textAlign: 'center', fontWeight: '500' }}>GA</th>
                    <th style={{ padding: '0.6rem 0.3rem', textAlign: 'center', fontWeight: '500' }}>GD</th>
                    <th style={{ padding: '0.6rem 0.3rem', textAlign: 'center', fontWeight: '600', background: '#fef3c7' }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {groupStandings[groupName].map((team, idx) => (
                    <tr key={team.code} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{team.flag}</span>
                        <span>{team.name}</span>
                      </td>
                      <td style={{ padding: '0.3rem', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          max="3"
                          value={team.won}
                          onChange={(e) => updateTeamStats(groupName, team.code, 'won', e.target.value)}
                          style={{ 
                            width: '40px', 
                            padding: '0.25rem', 
                            textAlign: 'center', 
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.3rem', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          max="3"
                          value={team.drawn}
                          onChange={(e) => updateTeamStats(groupName, team.code, 'drawn', e.target.value)}
                          style={{ 
                            width: '40px', 
                            padding: '0.25rem', 
                            textAlign: 'center', 
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.3rem', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          max="3"
                          value={team.lost}
                          onChange={(e) => updateTeamStats(groupName, team.code, 'lost', e.target.value)}
                          style={{ 
                            width: '40px', 
                            padding: '0.25rem', 
                            textAlign: 'center', 
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.3rem', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          value={team.goalsFor}
                          onChange={(e) => updateTeamStats(groupName, team.code, 'goalsFor', e.target.value)}
                          style={{ 
                            width: '45px', 
                            padding: '0.25rem', 
                            textAlign: 'center', 
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.3rem', textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          value={team.goalsAgainst}
                          onChange={(e) => updateTeamStats(groupName, team.code, 'goalsAgainst', e.target.value)}
                          style={{ 
                            width: '45px', 
                            padding: '0.25rem', 
                            textAlign: 'center', 
                            border: '1px solid #d1d5db',
                            borderRadius: '4px'
                          }}
                        />
                      </td>
                      <td style={{ padding: '0.3rem', textAlign: 'center', fontWeight: '500' }}>
                        {getGoalDifference(team) > 0 ? '+' : ''}{getGoalDifference(team)}
                      </td>
                      <td style={{ padding: '0.3rem', textAlign: 'center', fontWeight: '600', background: '#fef3c7' }}>
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Render stats & history tab
  const renderStatsHistoryTab = () => {
    const allTimeWinners = [
      { year: '2022', winner: 'Argentina', flag: '🇦🇷', host: 'Qatar' },
      { year: '2018', winner: 'France', flag: '🇫🇷', host: 'Russia' },
      { year: '2014', winner: 'Germany', flag: '🇩🇪', host: 'Brazil' },
      { year: '2010', winner: 'Spain', flag: '🇪🇸', host: 'South Africa' },
      { year: '2006', winner: 'Italy', flag: '🇮🇹', host: 'Germany' },
      { year: '2002', winner: 'Brazil', flag: '🇧🇷', host: 'South Korea/Japan' },
      { year: '1998', winner: 'France', flag: '🇫🇷', host: 'France' },
      { year: '1994', winner: 'Brazil', flag: '🇧🇷', host: 'USA' },
      { year: '1990', winner: 'Germany', flag: '🇩🇪', host: 'Italy' },
      { year: '1986', winner: 'Argentina', flag: '🇦🇷', host: 'Mexico' },
      { year: '1982', winner: 'Italy', flag: '🇮🇹', host: 'Spain' },
      { year: '1978', winner: 'Argentina', flag: '🇦🇷', host: 'Argentina' },
      { year: '1974', winner: 'Germany', flag: '🇩🇪', host: 'Germany' },
      { year: '1970', winner: 'Brazil', flag: '🇧🇷', host: 'Mexico' },
      { year: '1966', winner: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', host: 'England' },
      { year: '1962', winner: 'Brazil', flag: '🇧🇷', host: 'Chile' },
      { year: '1958', winner: 'Brazil', flag: '🇧🇷', host: 'Sweden' },
      { year: '1954', winner: 'Germany', flag: '🇩🇪', host: 'Switzerland' },
      { year: '1950', winner: 'Uruguay', flag: '🇺🇾', host: 'Brazil' },
      { year: '1938', winner: 'Italy', flag: '🇮🇹', host: 'France' },
      { year: '1934', winner: 'Italy', flag: '🇮🇹', host: 'Italy' },
      { year: '1930', winner: 'Uruguay', flag: '🇺🇾', host: 'Uruguay' }
    ]

    const mostTitles = [
      { country: 'Brazil', flag: '🇧🇷', titles: 5, years: '1958, 1962, 1970, 1994, 2002' },
      { country: 'Germany', flag: '🇩🇪', titles: 4, years: '1954, 1974, 1990, 2014' },
      { country: 'Italy', flag: '🇮🇹', titles: 4, years: '1934, 1938, 1982, 2006' },
      { country: 'Argentina', flag: '🇦🇷', titles: 3, years: '1978, 1986, 2022' },
      { country: 'France', flag: '🇫🇷', titles: 2, years: '1998, 2018' },
      { country: 'Uruguay', flag: '🇺🇾', titles: 2, years: '1930, 1950' },
      { country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', titles: 1, years: '1966' },
      { country: 'Spain', flag: '🇪🇸', titles: 1, years: '2010' }
    ]

    return (
      <div className="stats-history-section">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>2026 FIFA World Cup Tournament Info</h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: '#f9fafb' }}>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Host Countries</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>🇺🇸 USA • 🇨🇦 Canada • 🇲🇽 Mexico</div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: '#f9fafb' }}>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Tournament Dates</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>June 11 – July 19, 2026</div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: '#f9fafb' }}>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Teams</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>48 Nations</div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: '#f9fafb' }}>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Matches</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>104 Total Games</div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: '#f9fafb' }}>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Venues</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>16 Stadiums</div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', background: '#f9fafb' }}>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Final Venue</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>MetLife Stadium, NJ</div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Most World Cup Titles</h2>
        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.6rem 1rem', textAlign: 'left' }}>Country</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.6rem 1rem', textAlign: 'center' }}>Titles</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.6rem 1rem', textAlign: 'left' }}>Years Won</th>
              </tr>
            </thead>
            <tbody>
              {mostTitles.map((team, idx) => (
                <tr key={team.country} style={{ background: idx % 2 === 0 ? 'white' : '#f9fafb' }}>
                  <td style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ marginRight: '0.5rem' }}>{team.flag}</span>
                    {team.country}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #e5e7eb', textAlign: 'center', fontWeight: '600' }}>
                    {team.titles}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#6b7280' }}>
                    {team.years}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>All-Time World Cup Winners</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.6rem 1rem', textAlign: 'left' }}>Year</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.6rem 1rem', textAlign: 'left' }}>Winner</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.6rem 1rem', textAlign: 'left' }}>Host Country</th>
              </tr>
            </thead>
            <tbody>
              {allTimeWinners.map((edition, idx) => (
                <tr key={edition.year} style={{ background: idx % 2 === 0 ? 'white' : '#f9fafb' }}>
                  <td style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>
                    {edition.year}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ marginRight: '0.5rem' }}>{edition.flag}</span>
                    {edition.winner}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                    {edition.host}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>What's New in 2026</h2>
        <div style={{ 
          background: '#fef3c7', 
          border: '1px solid #fcd34d', 
          borderRadius: '8px', 
          padding: '1.25rem' 
        }}>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Expanded Format:</strong> First tournament with 48 teams (up from 32)</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>12 Groups:</strong> Teams divided into 12 groups of 4</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Round of 32:</strong> New knockout round added — top 2 + 8 best 3rd-place advance</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>104 Matches:</strong> Most games in World Cup history</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Three Hosts:</strong> First World Cup hosted by three nations</li>
            <li><strong>Final Venue:</strong> MetLife Stadium (New Jersey) on July 19, 2026</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>World Cup 2026 Bracket Simulator — Predict the Tournament | CalcLogic</title>
        <meta name="description" content="Free World Cup 2026 bracket simulator. Predict group stage results, calculate standings, and simulate the knockout rounds. 48 teams, 12 groups, 104 matches." />
        <link rel="canonical" href="https://calclogic.com/sports/world-cup-2026-bracket" />
        
        {/* Open Graph */}
        <meta property="og:title" content="World Cup 2026 Bracket Simulator — Predict the Tournament | CalcLogic" />
        <meta property="og:description" content="Simulate the 2026 FIFA World Cup bracket. Predict group winners, calculate points, and track your bracket through knockout rounds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/sports/world-cup-2026-bracket" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="World Cup 2026 Bracket Simulator | CalcLogic" />
        <meta name="twitter:description" content="Free bracket simulator for World Cup 2026. Predict group winners and knockout results." />
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many teams are in the 2026 World Cup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 2026 FIFA World Cup features 48 teams, expanded from the previous 32-team format. Teams are divided into 12 groups of 4 teams each, playing 104 total matches."
      }
    },
    {
      "@type": "Question",
      "name": "How does the 2026 World Cup group stage work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Teams are placed in 12 groups of 4. Each team plays 3 group matches. The top 2 teams from each group (24 teams) plus the 8 best 3rd-place teams advance to the Round of 32."
      }
    },
    {
      "@type": "Question",
      "name": "Where is the 2026 World Cup final?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 2026 World Cup final will be held at MetLife Stadium in East Rutherford, New Jersey, USA on July 19, 2026."
      }
    },
    {
      "@type": "Question",
      "name": "Which countries are hosting the 2026 World Cup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 2026 World Cup is jointly hosted by three countries: United States, Canada, and Mexico. Matches will be played across 16 venues in 16 cities."
      }
    },
    {
      "@type": "Question",
      "name": "How many matches are in the 2026 World Cup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 2026 World Cup will feature 104 matches total, making it the largest World Cup in history. This includes 48 group stage matches and 56 knockout stage matches."
      }
    },
    {
      "@type": "Question",
      "name": "What are the FIFA World Cup tiebreaker rules?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Group stage tiebreakers are: 1) Points, 2) Goal difference, 3) Goals scored, 4) Head-to-head result, 5) Fair play points, 6) Drawing of lots."
      }
    }
  ]
}`}
        </script>
        
        {/* SoftwareApplication Schema */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "World Cup 2026 Bracket Simulator",
  "applicationCategory": "SportsApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Free online bracket simulator for the 2026 FIFA World Cup. Predict group stage results, calculate standings with FIFA tiebreakers, and simulate knockout rounds.",
  "browserRequirements": "Requires JavaScript enabled"
}`}
        </script>

        {/* Event Schema for World Cup 2026 */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "2026 FIFA World Cup",
  "startDate": "2026-06-11",
  "endDate": "2026-07-19",
  "location": {
    "@type": "Place",
    "name": "MetLife Stadium",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "East Rutherford",
      "addressRegion": "NJ",
      "addressCountry": "US"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "FIFA"
  },
  "description": "The 23rd FIFA World Cup, hosted by the United States, Canada, and Mexico. First tournament with 48 teams."
}`}
        </script>
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>World Cup 2026 Bracket Simulator</h1>
          <p className="calculator-description">
            Simulate the 2026 FIFA World Cup bracket. Predict group winners, calculate points, and track your bracket through knockout rounds.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #e5e7eb', 
          marginBottom: '1.5rem' 
        }}>
          <button
            onClick={() => setActiveTab('bracket')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === 'bracket' ? '#1e3a5f' : 'transparent',
              color: activeTab === 'bracket' ? 'white' : '#6b7280',
              fontWeight: activeTab === 'bracket' ? '600' : '400',
              cursor: 'pointer',
              borderBottom: activeTab === 'bracket' ? '3px solid #fbbf24' : 'none',
              marginBottom: '-2px'
            }}
          >
            🏆 Bracket Simulator
          </button>
          <button
            onClick={() => setActiveTab('points')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === 'points' ? '#1e3a5f' : 'transparent',
              color: activeTab === 'points' ? 'white' : '#6b7280',
              fontWeight: activeTab === 'points' ? '600' : '400',
              cursor: 'pointer',
              borderBottom: activeTab === 'points' ? '3px solid #fbbf24' : 'none',
              marginBottom: '-2px'
            }}
          >
            📊 Group Points
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === 'stats' ? '#1e3a5f' : 'transparent',
              color: activeTab === 'stats' ? 'white' : '#6b7280',
              fontWeight: activeTab === 'stats' ? '600' : '400',
              cursor: 'pointer',
              borderBottom: activeTab === 'stats' ? '3px solid #fbbf24' : 'none',
              marginBottom: '-2px'
            }}
          >
            📈 Stats & History
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'bracket' && renderBracketTab()}
        {activeTab === 'points' && renderGroupPointsTab()}
        {activeTab === 'stats' && renderStatsHistoryTab()}

        <div className="content-section">
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>About the 2026 FIFA World Cup</h2>
          <p>The 2026 FIFA World Cup will be the largest in history, featuring 48 national teams competing across the United States, Canada, and Mexico. This historic tournament introduces a new format with 12 groups of 4 teams, followed by a Round of 32 knockout stage.</p>
          
          <h3>Tournament Format</h3>
          <p>The expanded 48-team format means more matches (104 total) and more opportunities for underdog stories. The top two teams from each group automatically qualify for the knockout stage, along with the 8 best third-place finishers, creating a 32-team single-elimination bracket.</p>

          <h3>Key Dates</h3>
          <ul>
            <li><strong>Opening Match:</strong> June 11, 2026 at Estadio Azteca, Mexico City</li>
            <li><strong>Final:</strong> July 19, 2026 at MetLife Stadium, New Jersey</li>
            <li><strong>Duration:</strong> 39 days of world-class football</li>
          </ul>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How many teams are in the 2026 World Cup?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>The 2026 FIFA World Cup features <strong>48 teams</strong>, expanded from the previous 32-team format. Teams are divided into 12 groups of 4 teams each, playing 104 total matches across the tournament.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How does the 2026 World Cup group stage work?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>Teams are placed in 12 groups of 4. Each team plays 3 group matches against their group opponents. The top 2 teams from each group (24 teams) plus the 8 best 3rd-place teams advance to the Round of 32, creating a 32-team knockout bracket.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Where is the 2026 World Cup final?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>The 2026 World Cup final will be held at <strong>MetLife Stadium</strong> in East Rutherford, New Jersey, USA on July 19, 2026. The stadium has a capacity of approximately 82,500 spectators.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Which countries are hosting the 2026 World Cup?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>The 2026 World Cup is jointly hosted by <strong>three countries</strong>: United States (11 venues), Canada (2 venues), and Mexico (3 venues). This is the first World Cup hosted by three nations and the first with 48 teams.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>What are the FIFA World Cup tiebreaker rules?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>Group stage tiebreakers follow FIFA rules: 1) Points, 2) Goal difference, 3) Goals scored, 4) Head-to-head result between tied teams, 5) Fair play points (yellow/red cards), 6) Drawing of lots. This calculator uses the first four tiebreakers.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How many matches are in the 2026 World Cup?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>The 2026 World Cup features <strong>104 matches</strong> total — 48 group stage matches (12 groups × 6 matches each) plus 56 knockout stage matches (Round of 32 through Final). This is 40 more matches than the 2022 tournament.</p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.2rem 1.4rem', margin: '2rem 0' }}>
            <h3 style={{ marginTop: '0', color: '#15803d', fontSize: '0.95rem' }}>🔗 Related CalcLogic Sports Calculators</h3>
            <a href="/sports/elo-rating-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Elo Rating Calculator</a>
            <a href="/sports/pickleball-rating-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Pickleball DUPR Calculator</a>
            <a href="/sports" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>All Sports Calculators</a>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2rem' }}>
            <em>This simulator is for entertainment purposes. Official World Cup results may differ. Group assignments and qualified teams will be finalized after all qualification matches are completed.</em>
          </p>
        </div>
        
        <ShareButtons 
          title="World Cup 2026 Bracket Simulator"
          description="Simulate the 2026 FIFA World Cup bracket - predict group winners and knockout results"
          customMessage="Check out this World Cup 2026 Bracket Simulator - predict the tournament winner!"
        />
      </div>
    </>
  )
}

export default WorldCup2026Calculator

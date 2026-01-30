import { useState, useEffect } from 'react'
import { Trophy, Target, Gift, Star, Zap, Lock, Play, CheckCircle, Award, Coins, Flame, TrendingUp, Calendar } from 'lucide-react'

export default function GamificationZonePage() {
  const [userPoints, setUserPoints] = useState(2450)
  const [userLevel, setUserLevel] = useState(12)
  const [dailyStreak, setDailyStreak] = useState(7)
  const [completedMissions, setCompletedMissions] = useState([1, 3])
  const [activeGame, setActiveGame] = useState(null)

  const missions = [
    {
      id: 1,
      title: 'Store Explorer',
      description: 'Visit 5 different stores today',
      progress: 5,
      total: 5,
      reward: 100,
      type: 'daily',
      icon: <StoreIcon />,
      completed: true
    },
    {
      id: 2,
      title: 'Shop & Save',
      description: 'Make a purchase at any store',
      progress: 0,
      total: 1,
      reward: 200,
      type: 'daily',
      icon: <ShoppingIcon />
    },
    {
      id: 3,
      title: 'Social Butterfly',
      description: 'Share 3 products with friends',
      progress: 3,
      total: 3,
      reward: 50,
      type: 'daily',
      icon: <ShareIcon />,
      completed: true
    },
    {
      id: 4,
      title: 'Review Master',
      description: 'Write 2 product reviews',
      progress: 1,
      total: 2,
      reward: 75,
      type: 'daily',
      icon: <ReviewIcon />
    },
    {
      id: 5,
      title: 'Mall Marathon',
      description: 'Visit all 6 MTC malls this week',
      progress: 4,
      total: 6,
      reward: 500,
      type: 'weekly',
      icon: <MallIcon />
    },
    {
      id: 6,
      title: 'Big Spender',
      description: 'Spend $200+ in purchases',
      progress: 145,
      total: 200,
      reward: 300,
      type: 'weekly',
      icon: <CoinIcon />
    }
  ]

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first mission',
      icon: '🎯',
      unlocked: true,
      reward: 50
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Complete all daily missions for 7 days',
      icon: '🔥',
      unlocked: true,
      reward: 500
    },
    {
      id: 3,
      title: 'Social Star',
      description: 'Share 50 products',
      icon: '⭐',
      unlocked: true,
      reward: 200
    },
    {
      id: 4,
      title: 'Shopping Spree',
      description: 'Make 10 purchases',
      icon: '🛍️',
      unlocked: true,
      reward: 300
    },
    {
      id: 5,
      title: 'Mall Explorer',
      description: 'Visit all MTC malls',
      icon: '🏛️',
      unlocked: false,
      reward: 1000
    },
    {
      id: 6,
      title: 'Review Legend',
      description: 'Write 100 reviews',
      icon: '📝',
      unlocked: false,
      reward: 1000
    },
    {
      id: 7,
      title: 'VIP Status',
      description: 'Reach Gold membership tier',
      icon: '👑',
      unlocked: false,
      reward: 2000
    },
    {
      id: 8,
      title: 'Influencer',
      description: 'Get 1000 followers on your profile',
      icon: '🌟',
      unlocked: false,
      reward: 1500
    }
  ]

  const games = [
    {
      id: 'spin-wheel',
      title: 'Lucky Spin',
      description: 'Spin the wheel to win prizes!',
      icon: '🎡',
      cost: 50,
      rewards: ['10 pts', '50 pts', '100 pts', '500 pts', 'Coupon', 'Jackpot!']
    },
    {
      id: 'scratch-card',
      title: 'Scratch & Win',
      description: 'Reveal hidden prizes',
      icon: '🎫',
      cost: 30,
      rewards: ['Free shipping', '5% off', '10% off', '20% off', 'Mystery']
    },
    {
      id: 'memory-game',
      title: 'Memory Match',
      description: 'Match pairs to earn points',
      icon: '🧠',
      cost: 0,
      rewards: ['Points based on time', 'Bonus for perfect game']
    }
  ]

  const rewards = [
    {
      id: 1,
      title: '10% Discount',
      description: 'On any purchase',
      cost: 500,
      icon: <TagIcon />,
      available: true
    },
    {
      id: 2,
      title: 'Free Shipping',
      description: 'On your next order',
      cost: 300,
      icon: <TruckIcon />,
      available: true
    },
    {
      id: 3,
      title: '$20 Gift Card',
      description: 'For any MTC store',
      cost: 2000,
      icon: <GiftIcon />,
      available: false
    },
    {
      id: 4,
      title: 'VIP Day',
      description: 'Exclusive VIP treatment & perks',
      cost: 5000,
      icon: <CrownIcon />,
      available: false
    }
  ]

  return (
    <div className="min-h-screen bg-mtc-bg text-white pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/90 to-orange-900/90" />
        <img
          src="https://images.unsplash.com/photo-1511882150382-421056c89033?w=1920&h=1080&fit=crop"
          alt="Gamification"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <Trophy className="w-16 h-16 text-yellow-400 mb-4 animate-mtc-pulse-glow" />
          <h1 className="mtc-heading-xl mb-4">Gamification Zone</h1>
          <p className="mtc-body-lg max-w-2xl">
            Complete missions, play games, earn rewards, and level up your shopping experience!
          </p>
        </div>
      </div>

      {/* User Stats Bar */}
      <div className="mtc-container -mt-8 relative z-10 mb-8">
        <div className="mtc-glass rounded-3xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Coins className="text-yellow-400" />} label="Points" value={userPoints.toLocaleString()} />
            <StatCard icon={<Trophy className="text-orange-400" />} label="Level" value={userLevel} />
            <StatCard icon={<Flame className="text-red-400" />} label="Streak" value={`${dailyStreak} days`} />
            <StatCard icon={<Award className="text-emerald-400" />} label="Achievements" value={`${achievements.filter(a => a.unlocked).length}/${achievements.length}`} />
          </div>
          
          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Level {userLevel} Progress</span>
              <span className="text-sm text-yellow-400 font-medium">550 pts to Level 13</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                style={{ width: '72%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mtc-container">
        {/* Daily Streak Bonus */}
        <section className="mb-12">
          <div className="mtc-glass p-6 rounded-3xl bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-orange-500/20">
                  <Flame className="text-orange-400" size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-xl">🔥 {dailyStreak} Day Streak!</h3>
                  <p className="text-white/60">Keep it going to unlock streak bonuses</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">Bonus at 10 days</p>
                <p className="text-lg font-bold text-yellow-400">+500 pts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Missions Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="text-blue-400" size={24} />
              <h2 className="mtc-heading-md">Missions</h2>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full bg-blue-500 text-sm font-medium">Daily</button>
              <button className="px-4 py-2 rounded-full bg-white/5 text-white/60 text-sm font-medium">Weekly</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map(mission => (
              <MissionCard 
                key={mission.id} 
                mission={mission}
                completed={completedMissions.includes(mission.id)}
                onToggle={(id) => {
                  if (completedMissions.includes(id)) {
                    setCompletedMissions(prev => prev.filter(m => m !== id))
                  } else {
                    setCompletedMissions([...completedMissions, id])
                    setUserPoints(prev => prev + mission.reward)
                  }
                }}
              />
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-yellow-400" size={24} />
            <h2 className="mtc-heading-md">Achievements</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>

        {/* Mini Games Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Play className="text-purple-400" size={24} />
            <h2 className="mtc-heading-md">Mini Games</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map(game => (
              <GameCard 
                key={game.id} 
                game={game}
                userPoints={userPoints}
                onPlay={(cost) => setUserPoints(prev => prev - cost)}
              />
            ))}
          </div>
        </section>

        {/* Rewards Store */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Gift className="text-emerald-400" size={24} />
            <h2 className="mtc-heading-md">Rewards Store</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rewards.map(reward => (
              <RewardCard 
                key={reward.id} 
                reward={reward}
                userPoints={userPoints}
                onRedeem={(cost) => setUserPoints(prev => prev - cost)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-white/60">{label}</div>
    </div>
  )
}

function MissionCard({ mission, completed, onToggle }) {
  const progressPercent = (mission.progress / mission.total) * 100

  return (
    <div className={`mtc-glass p-5 rounded-2xl transition-all ${completed ? 'border-emerald-500/50 bg-emerald-500/10' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {mission.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{mission.title}</h4>
              <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
                {mission.type}
              </span>
            </div>
            <p className="text-sm text-white/60">{mission.description}</p>
          </div>
        </div>
      </div>
      
      {!completed && (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-white/60">Progress</span>
              <span className="text-blue-400">{mission.progress}/{mission.total}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins size={16} className="text-yellow-400" />
          <span className="text-yellow-400 font-bold">+{mission.reward}</span>
        </div>
        {completed ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <CheckCircle size={16} />
            Completed
          </div>
        ) : (
          <button className="text-blue-400 text-sm font-medium hover:underline">
            Continue
          </button>
        )}
      </div>
    </div>
  )
}

function AchievementCard({ achievement }) {
  return (
    <div className={`mtc-glass p-6 rounded-2xl text-center transition-all ${achievement.unlocked ? '' : 'opacity-50'}`}>
      <div className={`text-4xl mb-3 ${achievement.unlocked ? '' : 'grayscale'}`}>
        {achievement.icon}
      </div>
      <h4 className="font-semibold mb-1">{achievement.title}</h4>
      <p className="text-xs text-white/60 mb-3">{achievement.description}</p>
      <div className={`text-sm font-medium ${achievement.unlocked ? 'text-yellow-400' : 'text-white/40'}`}>
        {achievement.unlocked ? `+${achievement.reward} pts` : <Lock size={14} className="inline" />}
      </div>
    </div>
  )
}

function GameCard({ game, userPoints, onPlay }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="mtc-glass p-6 rounded-3xl text-center">
      <div className="text-5xl mb-4">{game.icon}</div>
      <h3 className="font-bold text-xl mb-2">{game.title}</h3>
      <p className="text-sm text-white/60 mb-4">{game.description}</p>
      
      <div className="mb-4 p-3 rounded-xl bg-white/5">
        <p className="text-xs text-white/40 mb-1">Cost to Play</p>
        <p className="font-bold text-yellow-400">{game.cost === 0 ? 'Free' : `${game.cost} pts`}</p>
      </div>
      
      <button
        onClick={() => {
          if (userPoints >= game.cost) {
            onPlay(game.cost)
            setIsPlaying(true)
            setTimeout(() => setIsPlaying(false), 3000)
          }
        }}
        disabled={userPoints < game.cost}
        className={`w-full py-3 rounded-xl font-semibold transition-all ${
          userPoints >= game.cost
            ? 'bg-purple-500 hover:bg-purple-600 text-white'
            : 'bg-white/5 text-white/40 cursor-not-allowed'
        }`}
      >
        {userPoints < game.cost ? <Lock size={16} className="inline mr-2" /> : ''}
        {isPlaying ? 'Playing...' : 'Play Now'}
      </button>
    </div>
  )
}

function RewardCard({ reward, userPoints, onRedeem }) {
  return (
    <div className={`mtc-glass p-5 rounded-2xl text-center transition-all ${!reward.available ? 'opacity-50' : ''}`}>
      <div className={`p-4 rounded-xl mx-auto w-16 h-16 flex items-center justify-center mb-4 ${
        reward.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'
      }`}>
        {reward.icon}
      </div>
      <h4 className="font-semibold mb-1">{reward.title}</h4>
      <p className="text-xs text-white/60 mb-3">{reward.description}</p>
      
      <div className="mb-4">
        <p className="text-xs text-white/40 mb-1">Cost</p>
        <p className={`font-bold ${reward.available ? 'text-yellow-400' : 'text-white/40'}`}>
          {reward.cost} pts
        </p>
      </div>
      
      <button
        onClick={() => onRedeem(reward.cost)}
        disabled={!reward.available || userPoints < reward.cost}
        className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${
          reward.available && userPoints >= reward.cost
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
            : 'bg-white/5 text-white/40 cursor-not-allowed'
        }`}
      >
        {userPoints < reward.cost ? <Lock size={14} className="inline mr-2" /> : ''}
        Redeem
      </button>
    </div>
  )
}

// Icon Components
function StoreIcon() {
  return <Target size={20} />
}
function ShoppingIcon() {
  return <Gift size={20} />
}
function ShareIcon() {
  return <TrendingUp size={20} />
}
function ReviewIcon() {
  return <Star size={20} />
}
function MallIcon() {
  return <Trophy size={20} />
}
function CoinIcon() {
  return <Coins size={20} />
}
function TagIcon() {
  return <Target size={24} />
}
function TruckIcon() {
  return <Trophy size={24} />
}
function GiftIcon() {
  return <Gift size={24} />
}
function CrownIcon() {
  return <Award size={24} />
}

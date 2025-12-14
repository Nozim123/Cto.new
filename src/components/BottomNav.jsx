import { NavLink } from 'react-router-dom'
import { Compass, Heart, Home, Map, User } from 'lucide-react'

const Item = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition ${
        isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
      }`
    }
  >
    <Icon className="w-5 h-5" aria-hidden="true" />
    <span className="text-[11px] font-semibold">{label}</span>
  </NavLink>
)

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="glass-strong rounded-3xl px-3 py-2 flex items-center justify-between">
        <Item to="/" label="Home" icon={Home} />
        <Item to="/discover" label="Discover" icon={Compass} />
        <Item to="/map" label="Map" icon={Map} />
        <Item to="/favorites" label="Saved" icon={Heart} />
        <Item to="/profile" label="Profile" icon={User} />
      </div>
    </div>
  )
}

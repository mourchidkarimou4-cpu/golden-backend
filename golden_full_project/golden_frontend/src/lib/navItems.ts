// src/lib/navItems.ts
import { LayoutDashboard, FolderOpen, Users, PlusCircle, MessageSquare, Activity, FileText, DollarSign, BarChart2, User, CreditCard, Settings, TrendingUp, Heart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  icon: LucideIcon
  label: string
  to: string
  badge?: number | string
  badgeColor?: string
}

export const NAV_PORTEUR: NavItem[] = [
  { icon: LayoutDashboard, label: "Vue d'ensemble",  to: '/porteur' },
  { icon: FolderOpen,      label: 'Mon projet',      to: '/porteur/projet' },
  { icon: Users,           label: 'Investisseurs',   to: '/porteur/investisseurs', badge: 7 },
  { icon: PlusCircle,      label: 'Nouveau projet',  to: '/porteur/nouveau' },
  { icon: MessageSquare,   label: 'Messages',        to: '/porteur/messages', badge: 3 },
  { icon: Activity,        label: 'Activité',        to: '/porteur/activite', badge: 1, badgeColor: 'green' },
  { icon: FileText,        label: 'Documents',       to: '/porteur/documents' },
  { icon: DollarSign,      label: 'Finances',        to: '/porteur/finances' },
  { icon: BarChart2,       label: 'Rapports',        to: '/porteur/rapports' },
  { icon: User,            label: 'Mon profil',      to: '/porteur/profil' },
  { icon: CreditCard,      label: 'KYC',             to: '/kyc' },
  { icon: Settings,        label: 'Paramètres',      to: '/porteur/parametres' },
]

export const NAV_INVESTISSEUR: NavItem[] = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", to: '/investisseur' },
  { icon: TrendingUp,      label: 'Projets',        to: '/investisseur/projets' },
  { icon: DollarSign,      label: 'Portfolio',      to: '/investisseur/portfolio' },
  { icon: MessageSquare,   label: 'Messages',       to: '/investisseur/messages', badge: 2 },
  { icon: Heart,           label: 'Favoris',        to: '/investisseur/favoris' },
  { icon: BarChart2,       label: 'Rapports',       to: '/investisseur/rapports' },
  { icon: User,            label: 'Mon profil',     to: '/investisseur/profil' },
  { icon: CreditCard,      label: 'KYC',            to: '/kyc' },
  { icon: Settings,        label: 'Paramètres',     to: '/investisseur/parametres' },
]

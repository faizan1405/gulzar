'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '../context/SessionContext';

const NAV_ITEMS = [
  {
    section: 'Operations',
    links: [
      { href: '/admin', label: 'Overview', icon: '📊' },
      { href: '/admin/profiles', label: 'Profiles', icon: '🧑‍🤝‍🧑' },
      { href: '/admin/verification', label: 'Verification Queue', icon: '👤' },
      { href: '/admin/packages', label: 'Premium Packages', icon: '💎' },
      { href: '/admin/leads', label: 'Leads & Inquiries', icon: '📥' },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAdminMobileOpen, setIsAdminMobileOpen } = useSession();

  return (
    <>
      <aside className={`admin-sidebar ${isAdminMobileOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          <Image
            src="/images/rishte-forever-logo.png"
            alt="Rishte Forever"
            width={150}
            height={57}
            className="admin-sidebar__brand-img"
          />
          <span className="admin-sidebar__brand-text">Admin</span>
        </div>

        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <div className="admin-sidebar__section">{group.section}</div>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-sidebar__link ${pathname === link.href ? 'admin-sidebar__link--active' : ''}`}
                onClick={() => setIsAdminMobileOpen(false)}
              >
                <span className="admin-sidebar__link-icon" aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="admin-sidebar__spacer" />
        <div className="admin-sidebar__footer">Rishte Forever Admin</div>
      </aside>

      {isAdminMobileOpen && (
        <div className="admin-drawer-overlay" onClick={() => setIsAdminMobileOpen(false)} />
      )}
    </>
  );
};

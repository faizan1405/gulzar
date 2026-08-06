/**
 * Centralised route constants for the Rishte Forever website.
 *
 * Import from this file instead of hard-coding path strings.
 * This ensures every CTA button redirects to the correct page.
 */

export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  LOGIN: '/login',
  SEARCH: '/search',
  PACKAGES: '/packages',
  HOW_IT_WORKS: '/how-it-works',
  EVENT_MANAGEMENT: '/event-management',
  SAFETY: '/safety',
  ZAICHA: '/zaicha',
  FAQ: '/faq',
  ABOUT: '/about',
  CONTACT: '/contact',
  SUCCESS_STORIES: '/success-stories',
  MY_ACCOUNT: '/my-account',
  ADMIN: '/admin',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];

/**
 * Get the path for a named route.
 *
 * @example
 * getRoute('REGISTER') // => '/register'
 * getRoute('SEARCH')   // => '/search'
 */
export function getRoute(key: RouteKey): RouteValue {
  return ROUTES[key];
}


const SIDEBAR_COOKIE_NAME = "sidebar:state";

export function getSidebarStateFromCookie(): boolean {
  if (typeof document === 'undefined') return true; // SSR fallback
  
  const cookies = document.cookie.split(';');
  const sidebarCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${SIDEBAR_COOKIE_NAME}=`)
  );
  
  if (!sidebarCookie) return true; // default to expanded
  
  const value = sidebarCookie.split('=')[1];
  return value === 'true';
}

export function setSidebarStateCookie(isOpen: boolean): void {
  if (typeof document === 'undefined') return;
  
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${isOpen}; path=/; max-age=${maxAge}`;
}

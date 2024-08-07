import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const useCustomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithNewTab = (path: string) => {
    const currentPath = location.pathname;
    const currentBase = `/${currentPath.split('/')[1]}`;
    const newBase = `/${path.split('/')[1]}`;

    if (currentBase !== newBase) {
      // Check if a tab with this route is already open
      const existingTab = window.open('', newBase);
      if (existingTab && !existingTab.closed) {
        existingTab.focus();
        existingTab.location.href = window.location.origin + path;
      } else {
        window.open(path, newBase);
      }
    } else {
      // If we're already in the same base path, just use normal navigation
      navigate(path);
    }
  };

  return navigateWithNewTab;
};

export default useCustomNavigation;
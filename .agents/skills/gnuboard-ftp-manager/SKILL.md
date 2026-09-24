---
name: gnuboard-ftp-manager
description: Comprehensive workflow for managing GNUBoard 5 themes, safe FTP synchronization, and enforcing strict PC/Mobile Clean Separation Architecture. Use when modifying GNUBoard templates, head/tail files, main visuals, or deploying via FTP to RainHosting servers.
---

# GNUBoard FTP Manager & Clean Separation Skill

This skill provides automated workflows for safely managing, developing, and deploying GNUBoard 5 themes with zero regression between PC and Mobile devices.

## 1. Core Principles: Clean Separation Architecture
When editing GNUBoard theme index files or visuals:
- **Never share container DOMs between PC and Mobile**: Always wrap desktop layout in `.pc-desktop-section` and mobile layout in `.mobile-device-section`.
- **Enforce CSS Isolation**:
  ```css
  @media (min-width: 992px) {
      .pc-desktop-section { display: block !important; }
      .mobile-device-section { display: none !important; }
  }
  @media (max-width: 991px) {
      .pc-desktop-section { display: none !important; }
      .mobile-device-section { display: block !important; }
  }
  ```
- **Strict Header & Footer Isolation**:
  In `mobile.php`, ensure `#mobile, .navbar-fixed-top, .bottom_menu` are forced to `display: none !important;` under `min-width: 992px` to prevent mobile overlay bars from appearing on desktop screens.

## 2. Server Configuration Reference
- **The Creators AI Headquarters (MCN)**:
  - Host: `wesc2.rainhosting.co.kr` (Port 21)
  - User: `rbd_wesc2`
  - Theme Directory: `/www/theme/2001/`
  - URL: `http://thecreator-mcn.com/`
- **The Creators AI Corporate Training Center (Business)**:
  - Host: `wcreator.rainhosting.co.kr` (Port 21)
  - User: `rbd_wcreator`
  - Theme Directory: `/www/theme/basic/`
  - URL: `http://thecreator-business.com/`

## 3. Best Practices
1. Always create a local backup before overwriting any remote file on FTP.
2. After uploading, immediately perform multi-device screen captures to verify both PC (1920x1080) and Mobile (390x844) layouts.

---
name: screen-device-verifier
description: Automated multi-viewport visual testing and screen capture skill. Automatically captures headless Chrome screenshots for Desktop PC (1920x1080), Tablet (768x1024), and Mobile (390x844) to guarantee zero layout breakage.
---

# Screen & Multi-Device Verifier Skill

This skill allows agents to visually inspect web pages across multiple viewport dimensions without requiring manual browser opening.

## 1. Supported Standard Viewports
- **Desktop PC**: `1920x1080` (or `1920x2500` for full page)
  - User-Agent: Modern Chrome Desktop
- **Tablet**: `768x1024` (iPad / Galaxy Tab)
- **Mobile Smartphone**: `390x844` (iPhone 14/15 / Galaxy S23)
  - User-Agent: Mobile Safari / Android Chrome

## 2. Execution Method
Use headless Chrome / Edge via command line:
```bash
chrome.exe --headless=new --disable-gpu --window-size=1920,2500 --screenshot="output.png" "http://target-url"
```

## 3. Visual Checklist
- [ ] No mobile bars or hamburgers visible on desktop view (>992px).
- [ ] No desktop sidebars or broken horizontal grids overflowing on mobile view (<991px).
- [ ] Video banners scale gracefully with proper aspect ratio and hardware acceleration.
- [ ] Tap targets on mobile buttons are at least 44x44px with zero click latency (`touch-action: manipulation`).

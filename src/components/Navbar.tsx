:root {
  /* Hex Palette from User Guidelines */
  --warm - ivory: #FFFDF8;
  --soft - cream: #F8F1E7;
  --blush - pink: #EBC5C8;
  --dusty - rose: #C98F98;
  --sage - green: #91A58F;
  --deep - maroon: #6F1D35;
  --antique - gold: #B8924A;
  --dark - charcoal: #221D1B;
  /* Deeper for better typography contrast */
  --white: #ffffff;

  /* Premium Rishte Forever Brand Colors */
  --primary - brand: var(--deep - maroon);
  --primary - brand - light: var(--soft - cream);
  --cream - bg: var(--warm - ivory);
  --cream - card: var(--soft - cream);
  --text - dark: var(--dark - charcoal);
  --text - muted: #554D49;
  /* Deeper for improved accessibility & premium reading */
  --gold - accent: var(--antique - gold);
  --gold - dark: #8c6a2b;
  --gold - light: #e6d8bc;
  --rose - accent: var(--dusty - rose);
  --border - color: rgba(184, 146, 74, 0.22);
  /* Slightly more visible gold border */
  --border - radius - xl: 24px;
  --border - radius - lg: 16px;
  --border - radius - md: 10px;
  --border - radius - sm: 6px;

  /* Typography */
  --font - serif: var(--font - serif), Georgia, serif;
  --font - sans: var(--font - sans), sans - serif;
  --font - script: var(--font - script), cursive;
  --font - arabic: var(--font - arabic), serif;

  /* Premium Gradients */
  --maroon - gradient: linear - gradient(135deg, var(--deep - maroon) 0 %, #8c1d3c 100 %);
  --gold - gradient: linear - gradient(135deg, var(--gold - accent) 0 %, var(--gold - dark) 100 %);

  /* Premium Shadows & Transitions & Glows */
  --shadow - sm: 0 4px 12px rgba(111, 29, 53, 0.04);
  --shadow - premium: 0 16px 48px - 12px rgba(111, 29, 53, 0.08), 0 8px 24px - 10px rgba(184, 146, 74, 0.06);
  --shadow - hover: 0 30px 70px - 10px rgba(111, 29, 53, 0.18), 0 12px 30px - 8px rgba(184, 146, 74, 0.15);
  --shadow - toast: 0 20px 48px - 10px rgba(111, 29, 53, 0.08);
  --gold - glow - shadow: 0 10px 24px - 5px rgba(184, 146, 74, 0.4);
  --maroon - glow - shadow: 0 10px 24px - 5px rgba(111, 29, 53, 0.3);
  --transition - smooth: all 0.4s cubic - bezier(0.16, 1, 0.3, 1);

  /* Active theme defaults */
  --theme - accent: var(--deep - maroon);
  --theme - accent - light: var(--soft - cream);
  --theme - badge - bg: var(--deep - maroon);
  --theme - badge - text: var(--white);
  --theme - btn - hover: #501223;
}

/* Theme overrides mapped to requested palette values */
.theme - emerald {
  --theme - accent: #2e4d3b;
  --theme - accent - light: #f1f6f3;
  --theme - badge - bg: #2e4d3b;
  --theme - badge - text: var(--white);
  --theme - btn - hover: #1e3327;
}

.theme - crimson {
  --theme - accent: var(--deep - maroon);
  --theme - accent - light: var(--soft - cream);
  --theme - badge - bg: var(--deep - maroon);
  --theme - badge - text: var(--white);
  --theme - btn - hover: #501223;
}

.theme - gold {
  --theme - accent: var(--antique - gold);
  --theme - accent - light: #FAF6EE;
  --theme - badge - bg: var(--antique - gold);
  --theme - badge - text: var(--white);
  --theme - btn - hover: #8e6d2b;
}

.theme - navy {
  --theme - accent: #1D2E3D;
  --theme - accent - light: #F0F4F7;
  --theme - badge - bg: #1D2E3D;
  --theme - badge - text: var(--white);
  --theme - btn - hover: #121F2B;
}

.theme - rose {
  --theme - accent: var(--dusty - rose);
  --theme - accent - light: #FBF5F6;
  --theme - badge - bg: var(--dusty - rose);
  --theme - badge - text: var(--white);
  --theme - btn - hover: #ac737c;
}

.theme - teal {
  --theme - accent: #1f4e5b;
  --theme - accent - light: #eff5f7;
  --theme - badge - bg: #1f4e5b;
  --theme - badge - text: var(--white);
  --theme - btn - hover: #14353e;
}

.theme - plum {
  --theme - accent: #431E3F;
  --theme - accent - light: #F6EFF5;
  --theme - badge - bg: #431E3F;
  --theme - badge - text: var(--white);
  --theme - btn - hover: #2B1228;
}

.theme - saffron {
  --theme - accent: #A5572E;
  --theme - accent - light: #FAF3EE;
  --theme - badge - bg: #A5572E;
  --theme - badge - text: var(--white);
  --theme - btn - hover: #7b3d1c;
}

/* How It Works — full-image cards */
.hiw - card {
  height: 400px;
}

@media(max - width: 640px) {
  .hiw - card {
    height: 300px;
  }
}

/* Reset & Base Elements */
* {
  box- sizing: border - box;
margin: 0;
padding: 0;
scrollbar - width: thin;
scrollbar - color: var(--gold - accent) transparent;
}

img,
  video {
  max - width: 100 %;
  height: auto;
}

h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
  font - family: var(--font - serif);
  font - weight: 700;
  color: var(--primary - brand);
  letter - spacing: -0.01em;
  line - height: 1.25;
}

body {
  font - family: var(--font - sans);
  background - color: var(--cream - bg);
  color: var(--text - dark);
  line - height: 1.65;
  min - height: 100vh;
  display: flex;
  flex - direction: column;
  -webkit - font - smoothing: antialiased;
  background - image: radial - gradient(rgba(181, 145, 76, 0.08) 1.5px, transparent 1.5px);
  background - size: 32px 32px;
  overflow - x: hidden;
  max - width: 100vw;
}

a {
  color: inherit;
  text - decoration: none;
  transition: var(--transition - smooth);
}

.container {
  width: 100 %;
  max - width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Sticky Header with Premium Islamic Redesign */
.header {
  position: sticky;
  top: 0;
  z - index: 100;
  transition: var(--transition - smooth);
  background - color: var(--cream - bg);
  background - image: radial - gradient(rgba(184, 146, 74, 0.04) 1.5px, transparent 1.5px);
  background - size: 24px 24px;
  border - bottom: none;
  box - shadow: none;
  width: 100 %;
  padding - bottom: 8px;
}

body: has(.demo - bar).header {
  top: 36px;
}

.header - top - strip {
  height: 16px;
  background: var(--maroon - gradient);
  border - bottom: 2px solid var(--gold - accent);
  width: 100 %;
  position: relative;
  display: flex;
  justify - content: center;
  align - items: center;
}

.header - top - strip - ornament {
  width: 24px;
  height: 10px;
  background - color: var(--gold - accent);
  clip - path: polygon(50 % 100 %, 0 0, 100 % 0);
  position: absolute;
  bottom: -10px;
  z - index: 2;
}

.nav - outer - container {
  padding: 16px 24px 8px 24px;
  max - width: 1560px;
  margin: 0 auto;
  overflow: visible;
}

.nav - container {
  display: grid;
  grid - template - columns: minmax(0, 1fr) auto minmax(0, 1fr);
  column - gap: 16px;
  align - items: center;
  min - height: 68px;
  background - color: var(--warm - ivory);
  border: 1.5px solid var(--gold - accent);
  border - radius: 20px;
  padding: 10px 16px;
  box - shadow: var(--shadow - premium), 0 10px 30px rgba(111, 29, 53, 0.03);
  position: relative;
  overflow: visible;
  max - width: 1480px;
  margin: 0 auto;
}

.nav - section {
  display: flex;
  align - items: center;
  min - width: 0;
}

.nav - left {
  grid - column: 1;
  justify - self: stretch;
  display: flex;
  align - items: center;
  justify - content: flex - start;
  min - width: 0;
}

.nav - right {
  grid - column: 3;
  justify - self: stretch;
  display: flex;
  align - items: center;
  justify - content: flex - end;
  gap: 10px;
  min - width: 0;
}

/* Mughal Arch Wrapper for Logo centering & cutout effect */
.logo - arch - wrapper {
  grid - column: 2;
  justify - self: center;
  position: relative;
  width: 200px;
  height: 98px;
  margin - top: -38px;
  /* Arch pops above top edge */
  flex - shrink: 0;
  display: flex;
  justify - content: center;
  align - items: center;
  z - index: 2;
  overflow: visible;
}

.logo - arch - bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100 %;
  height: 100 %;
  z - index: 1;
  pointer - events: none;
}

.logo - arch - content {
  position: relative;
  z - index: 2;
  padding - top: 14px;
  display: flex;
  justify - content: center;
  align - items: center;
  width: 170px;
  flex - shrink: 0;
}

.logo - link {
  display: flex;
  align - items: center;
}

.logo {
  font - family: var(--font - serif);
  font - size: 30px;
  font - weight: 700;
  color: var(--primary - brand);
  display: flex;
  align - items: center;
  gap: 4px;
  letter - spacing: 0.5px;
}

.logo span {
  color: var(--gold - accent);
}

.logo img {
  height: auto;
  width: 100 %;
  display: block;
}

.nav - menu {
  display: flex;
  gap: 6px;
  list - style: none;
  align - items: center;
  margin: 0;
  padding: 0;
}

.nav - menu li {
  flex - shrink: 0;
}

.nav - link {
  font - weight: 700;
  font - size: 12.5px;
  line - height: 1;
  color: var(--text - dark);
  padding: 6px 8px;
  border - radius: var(--border - radius - sm);
  transition: var(--transition - smooth);
  letter - spacing: 0.2px;
  position: relative;
  white - space: nowrap;
  display: inline - flex;
  align - items: center;
  gap: 4px;
  flex - shrink: 0;
}

.nav - link:hover {
  color: var(--deep - maroon);
}

.nav - link.active {
  color: var(--deep - maroon);
  background - color: rgba(248, 241, 231, 0.65);
  border: 1px solid rgba(184, 146, 74, 0.4);
  border - radius: 10px;
  padding: 6px 8px;
}

/* Small active indicator line inside active item card boundary */
.nav - link.active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 30 %;
  right: 30 %;
  height: 2.5px;
  background - color: var(--gold - accent);
  border - radius: 2px;
}

.nav - icon {
  color: var(--gold - accent);
  transition: var(--transition - smooth);
  flex - shrink: 0;
}

.nav - link: hover.nav - icon {
  color: var(--deep - maroon);
  transform: translateY(-1px);
}

.nav - link.active.nav - icon {
  color: var(--deep - maroon);
}

/* Navbar specific action styles & highlight helper classes */
.nav - right - desktop - wrapper {
  display: flex;
  align - items: center;
  gap: 16px;
  min - width: 0;
}

.nav - actions - wrapper {
  display: flex;
  align - items: center;
  gap: 8px;
  justify - content: flex - end;
  flex - shrink: 0;
}

.nav - actions - group {
  display: flex;
  align - items: center;
  gap: 5px;
  flex - shrink: 0;
}

.nav - btn {
  padding: 6px 10px!important;
  font - size: 11px!important;
  line - height: 1!important;
  font - weight: 700!important;
  display: inline - flex!important;
  align - items: center!important;
  text - transform: none;
  white - space: nowrap!important;
  gap: 5px!important;
  height: 34px!important;
  border - radius: 8px!important;
  flex - shrink: 0;
}

.btn - icon {
  color: currentColor;
  flex - shrink: 0;
  transition: var(--transition - smooth);
}

.nav - btn.btn - secondary {
  border: 1.5px solid var(--primary - brand)!important;
  color: var(--primary - brand)!important;
  background - color: transparent!important;
}

.nav - btn.btn - secondary:hover {
  background - color: var(--primary - brand - light)!important;
  border - color: var(--primary - brand)!important;
  color: var(--primary - brand)!important;
}

.nav - btn.btn - gold {
  background: var(--gold - gradient)!important;
  color: var(--white)!important;
  box - shadow: 0 4px 12px rgba(184, 146, 74, 0.15)!important;
}

.nav - btn.btn - gold:hover {
  background: var(--gold - dark)!important;
  transform: translateY(-1px)!important;
  box - shadow: 0 6px 16px rgba(184, 146, 74, 0.25)!important;
}

.nav - link - zaicha {
  color: var(--antique - gold)!important;
  font - weight: 700!important;
}

.animate - star {
  animation: starRotate 8s linear infinite;
}

@keyframes starRotate {
  0 % {
    transform: rotate(0deg);
  }

  100 % {
    transform: rotate(360deg);
  }
}

.hamburger - btn {
  background: none;
  border: none;
  font - size: 28px;
  cursor: pointer;
  color: var(--primary - brand);
  transition: var(--transition - smooth);
  display: flex;
  align - items: center;
  justify - content: center;
  width: 44px;
  height: 44px;
  border - radius: 50 %;
}

.hamburger - btn:hover {
  color: var(--gold - accent);
  background - color: var(--soft - cream);
  transform: scale(1.05);
}

#hamburger - btn {
  display: none;
}

/* Premium Buttons */
.btn {
  display: inline - flex;
  align - items: center;
  justify - content: center;
  padding: 12px 24px;
  font - weight: 700;
  /* Bolder button text */
  font - size: 14px;
  border - radius: var(--border - radius - md);
  transition: var(--transition - smooth);
  cursor: pointer;
  border: none;
  font - family: var(--font - sans);
  gap: 8px;
  letter - spacing: 0.5px;
  outline: none;
  text - transform: uppercase;
  /* Premium feel */
}

.btn: focus - visible {
  outline: 2px solid var(--gold - accent);
  outline - offset: 2px;
}

.btn - primary {
  background: var(--maroon - gradient);
  color: var(--white);
  box - shadow: var(--maroon - glow - shadow);
}

.btn - primary:hover {
  transform: translateY(-3px) scale(1.02);
  background: var(--deep - maroon);
  box - shadow: 0 12px 28px rgba(111, 29, 53, 0.4);
}

.btn - secondary {
  background - color: transparent;
  color: var(--primary - brand);
  border: 2px solid var(--primary - brand);
  /* Bolder border */
}

.btn - secondary:hover {
  background - color: var(--primary - brand - light);
  transform: translateY(-2px);
  box - shadow: var(--shadow - sm);
  color: var(--gold - dark);
  border - color: var(--gold - accent);
}

.btn - gold {
  background: var(--gold - gradient);
  color: var(--white);
  box - shadow: var(--gold - glow - shadow);
}

.btn - gold:hover {
  transform: translateY(-3px) scale(1.02);
  background: var(--gold - dark);
  box - shadow: 0 12px 28px rgba(184, 146, 74, 0.45);
}

/* Card Theme Wrapper & Ornaments */
.card - theme - wrapper {
  position: relative;
  background - color: var(--white);
  border: 1.5px solid var(--border - color);
  border - radius: var(--border - radius - xl);
  padding: 40px;
  box - shadow: var(--shadow - premium);
  overflow: hidden;
  transition: var(--transition - smooth);
}

.card - theme - wrapper:hover {
  box - shadow: var(--shadow - hover);
  border - color: var(--gold - accent);
}

.ornament {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--gold - light);
  pointer - events: none;
  opacity: 0.65;
}

.ornament - tl {
  top: 16px;
  left: 16px;
  border - right: none;
  border - bottom: none;
}

.ornament - tr {
  top: 16px;
  right: 16px;
  border - left: none;
  border - bottom: none;
}

.ornament - bl {
  bottom: 16px;
  left: 16px;
  border - right: none;
  border - top: none;
}

.ornament - br {
  bottom: 16px;
  right: 16px;
  border - left: none;
  border - top: none;
}

/* Empty State Styling */
.empty - state {
  text - align: center;
  padding: 48px 24px;
}

.empty - state - icon {
  font - size: 32px;
  color: var(--gold - accent);
  margin - bottom: 16px;
}

.empty - state h3 {
  font - family: var(--font - serif);
  font - size: 22px;
  color: var(--primary - brand);
  margin - bottom: 8px;
}

/* Split-Screen & Layout Visuals */
.hero - split {
  display: grid;
  grid - template - columns: 1.15fr 0.85fr;
  gap: 60px;
  align - items: center;
  padding: 80px 0;
  min - height: calc(100vh - 121px);
}

.hero - content {
  text - align: left;
}

.hero - subtitle {
  font - family: var(--font - serif);
  font - size: 17px;
  font - style: italic;
  color: var(--gold - accent);
  letter - spacing: 0.5px;
  margin - bottom: 16px;
  display: flex;
  align - items: center;
  gap: 12px;
  font - weight: 500;
}

.hero - subtitle::after {
  content: '';
  height: 1px;
  width: 50px;
  background - color: var(--gold - accent);
  display: inline - block;
  opacity: 0.7;
}

.hero - title {
  font - family: var(--font - serif);
  font - size: 56px;
  font - weight: 700;
  line - height: 1.15;
  color: var(--primary - brand);
  margin - bottom: 24px;
  letter - spacing: -0.5px;
}

.hero - description {
  font - size: 16px;
  color: var(--text - muted);
  line - height: 1.8;
  margin - bottom: 36px;
  max - width: 580px;
}

/* Visual Collage Composition */
.hero - visual - container {
  position: relative;
  height: 480px;
  display: flex;
  align - items: center;
  justify - content: center;
}

.hero - visual - frame {
  width: 85 %;
  height: 100 %;
  border - radius: var(--border - radius - xl);
  overflow: hidden;
  position: relative;
  box - shadow: var(--shadow - premium);
  border: 1px solid var(--border - color);
  padding: 8px;
  background - color: var(--white);
}

.hero - visual - frame::before {
  content: '';
  position: absolute;
  inset: 12px;
  border: 1px solid var(--gold - light);
  border - radius: calc(var(--border - radius - xl) - 4px);
  pointer - events: none;
  z - index: 2;
}

.hero - visual - img {
  width: 100 %;
  height: 100 %;
  object - fit: cover;
  border - radius: calc(var(--border - radius - xl) - 6px);
}

.floating - preview - card {
  position: absolute;
  background - color: var(--white);
  padding: 14px 20px;
  border - radius: var(--border - radius - md);
  box - shadow: var(--shadow - toast);
  border: 1px solid var(--border - color);
  display: flex;
  align - items: center;
  gap: 12px;
  z - index: 10;
  animation: float 4s ease -in -out infinite alternate;
}

.floating - card - 1 {
  bottom: 20px;
  left: -10px;
}

.floating - card - 2 {
  top: 40px;
  right: -10px;
  animation - delay: 2s;
}

@keyframes float {
  0 % {
    transform: translateY(0px);
  }

  100 % {
    transform: translateY(-8px);
  }
}

/* Trust Stats Strip */
.trust - strip {
  display: flex;
  gap: 40px;
  margin - top: 48px;
  border - top: 1px solid var(--border - color);
  padding - top: 28px;
}

.stat - item {
  display: flex;
  flex - direction: column;
  gap: 2px;
}

.stat - number {
  font - family: var(--font - serif);
  font - size: 30px;
  font - weight: 700;
  color: var(--gold - dark);
}

.stat - label {
  font - size: 11px;
  font - weight: 700;
  text - transform: uppercase;
  color: var(--text - muted);
  letter - spacing: 0.8px;
}

/* Smart Search Panel (Overlapping hero) */
.search - panel {
  background - color: var(--white);
  padding: 30px 40px;
  border - radius: var(--border - radius - lg);
  border: 1px solid var(--border - color);
  box - shadow: var(--shadow - premium);
  margin - top: -30px;
  position: relative;
  z - index: 20;
}

.search - panel - grid {
  display: grid;
  grid - template - columns: repeat(auto - fit, minmax(180px, 1fr)) 160px;
  gap: 20px;
  align - items: flex - end;
}

/* Sections Styling */
section {
  padding: 120px 0;
}

.section - header {
  text - align: center;
  margin - bottom: 60px;
  position: relative;
  max - width: 650px;
  margin - left: auto;
  margin - right: auto;
}

.section - header h2 {
  font - family: var(--font - serif);
  font - size: 40px;
  color: var(--primary - brand);
  margin - bottom: 14px;
  font - weight: 700;
}

.section - header p {
  color: var(--text - muted);
  font - size: 15.5px;
  line - height: 1.6;
}

.section - header::after {
  content: '❀';
  display: block;
  font - size: 18px;
  color: var(--gold - accent);
  margin - top: 18px;
}

/* Discovery Tabs */
.tabs - container {
  display: flex;
  justify - content: center;
  gap: 12px;
  margin - bottom: 40px;
  flex - wrap: wrap;
}

.tab - btn {
  padding: 10px 24px;
  border - radius: 30px;
  font - size: 13.5px;
  font - weight: 600;
  border: 1.5px solid var(--border - color);
  background - color: var(--white);
  color: var(--text - muted);
  cursor: pointer;
  transition: var(--transition - smooth);
}

.tab - btn.active,
.tab - btn:hover {
  background - color: var(--primary - brand - light);
  border - color: var(--primary - brand);
  color: var(--primary - brand);
}

/* Curated Profile Grid & Sleek Cards */
.grid - 3 {
  display: grid;
  grid - template - columns: repeat(auto - fit, minmax(320px, 1fr));
  gap: 32px;
}

.profile - card {
  border - radius: var(--border - radius - lg);
  overflow: hidden;
  box - shadow: var(--shadow - premium);
  background - color: var(--white);
  border: 1px solid var(--border - color);
  transition: var(--transition - smooth);
  position: relative;
  display: flex;
  flex - direction: column;
  height: 100 %;
}

.profile - card:hover {
  transform: translateY(-8px);
  box - shadow: var(--shadow - hover);
  border - color: var(--profile - theme - color, var(--gold - accent));
}

.profile - card - badge - container {
  position: absolute;
  top: 16px;
  left: 16px;
  z - index: 10;
  display: flex;
  flex - direction: column;
  gap: 6px;
}

.card - badge {
  padding: 5px 12px;
  border - radius: 30px;
  font - size: 11px;
  font - weight: 700;
  text - transform: uppercase;
  letter - spacing: 0.5px;
  display: inline - flex;
  align - items: center;
  gap: 6px;
}

.card - badge - verified {
  background - color: var(--theme - accent, var(--primary - brand));
  color: var(--white);
  border: 1px solid var(--gold - light);
}

.card - badge - distance {
  background - color: rgba(255, 255, 255, 0.95);
  backdrop - filter: blur(4px);
  color: var(--text - dark);
  border: 1px solid var(--border - color);
}

.card - save - btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z - index: 10;
  background - color: rgba(255, 255, 255, 0.95);
  backdrop - filter: blur(4px);
  border: 1px solid var(--border - color);
  width: 36px;
  height: 36px;
  border - radius: 50 %;
  display: flex;
  align - items: center;
  justify - content: center;
  cursor: pointer;
  box - shadow: var(--shadow - sm);
  transition: var(--transition - smooth);
  font - size: 16px;
}

.card - save - btn:hover {
  transform: scale(1.1);
  border - color: var(--rose - accent);
  background - color: var(--white);
}

.profile - image - wrapper {
  position: relative;
  width: 100 %;
  padding - bottom: 105 %;
  /* 4:3.8 premium aspect ratio */
  background - color: hsl(38, 20 %, 94 %);
  overflow: hidden;
}

.profile - img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100 %;
  height: 100 %;
  object - fit: cover;
  object - position: center 20 %;
  transition: transform 0.6s cubic - bezier(0.16, 1, 0.3, 1);
}

.profile - card: hover.profile - img {
  transform: scale(1.05);
}

.blurred - media {
  filter: blur(20px);
  transform: scale(1.1);
}

.blur - blocker {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(18, 30, 24, 0.72);
  backdrop - filter: blur(8px);
  -webkit - backdrop - filter: blur(8px);
  display: flex;
  flex - direction: column;
  justify - content: center;
  align - items: center;
  padding: 24px;
  text - align: center;
  color: var(--white);
  z - index: 5;
}

.blur - blocker - title {
  font - family: var(--font - serif);
  font - size: 18px;
  font - weight: 600;
  color: var(--gold - light);
  margin - bottom: 8px;
  letter - spacing: 0.3px;
}

.blur - blocker p {
  font - size: 12.5px;
  opacity: 0.9;
  margin - bottom: 20px;
  max - width: 240px;
  line - height: 1.5;
}

.profile - card - details {
  padding: 24px;
  display: flex;
  flex - direction: column;
  flex - grow: 1;
}

.profile - card - name {
  font - family: var(--font - serif);
  font - size: 21px;
  color: var(--text - dark);
  font - weight: 700;
  margin - bottom: 4px;
}

.profile - card - subtitle {
  font - size: 13px;
  color: var(--text - muted);
  margin - bottom: 18px;
  font - weight: 500;
}

.profile - specs - grid {
  display: grid;
  grid - template - columns: repeat(2, 1fr);
  gap: 14px;
  margin - bottom: 20px;
}

.spec - cell {
  font - size: 13px;
}

.spec - cell span {
  display: block;
  font - size: 10.5px;
  text - transform: uppercase;
  color: var(--text - muted);
  font - weight: 700;
  letter - spacing: 0.5px;
  margin - bottom: 2px;
}

.spec - cell strong {
  color: var(--text - dark);
  font - weight: 600;
}

.profile - card - footer {
  border - top: 1px solid var(--border - color);
  padding - top: 18px;
  margin - top: auto;
  display: flex;
  align - items: center;
  justify - content: space - between;
  gap: 8px;
}

.theme - accent - border {
  border - top: 4px solid var(--profile - theme - color, var(--gold - accent));
}

/* Connected Journey Timeline */
.timeline - container {
  position: relative;
  max - width: 960px;
  margin: 60px auto 0 auto;
}

.timeline - line {
  position: absolute;
  top: 50 %;
  left: 50px;
  right: 50px;
  height: 2px;
  background - color: var(--gold - light);
  z - index: 1;
  transform: translateY(-50 %);
}

.timeline - grid {
  display: grid;
  grid - template - columns: repeat(3, 1fr);
  gap: 30px;
  position: relative;
  z - index: 2;
}

.timeline - step {
  background - color: var(--white);
  border: 1px solid var(--border - color);
  padding: 40px 24px;
  border - radius: var(--border - radius - lg);
  text - align: center;
  box - shadow: var(--shadow - premium);
  transition: var(--transition - smooth);
}

.timeline - step:hover {
  transform: translateY(-6px);
  box - shadow: var(--shadow - hover);
  border - color: var(--gold - accent);
}

.timeline - number {
  width: 52px;
  height: 52px;
  border - radius: 50 %;
  background - color: var(--primary - brand);
  color: var(--white);
  display: flex;
  align - items: center;
  justify - content: center;
  font - family: var(--font - serif);
  font - size: 22px;
  font - weight: 700;
  margin: 0 auto 20px auto;
  border: 4px solid var(--cream - bg);
  box - shadow: 0 0 0 2px var(--gold - accent);
}

.timeline - step h3 {
  font - family: var(--font - serif);
  font - size: 20px;
  color: var(--primary - brand);
  margin - bottom: 12px;
}

.timeline - step p {
  font - size: 13.5px;
  color: var(--text - muted);
  line - height: 1.6;
}

/* Trust Safety Checklist layout */
.safety - wrapper {
  display: grid;
  grid - template - columns: 0.95fr 1.05fr;
  gap: 48px;
  align - items: center;
  background - color: var(--white);
  border - radius: var(--border - radius - xl);
  border: 1px solid var(--border - color);
  box - shadow: var(--shadow - premium);
  padding: 48px;
}

.safety - list {
  list - style: none;
  display: flex;
  flex - direction: column;
  gap: 24px;
}

.safety - item {
  display: flex;
  gap: 16px;
  align - items: flex - start;
}

.safety - icon {
  width: 28px;
  height: 28px;
  border - radius: 50 %;
  background - color: var(--primary - brand - light);
  color: var(--primary - brand);
  display: flex;
  align - items: center;
  justify - content: center;
  font - weight: bold;
  flex - shrink: 0;
  font - size: 13px;
}

.safety - text h4 {
  font - family: var(--font - serif);
  font - size: 18px;
  color: var(--primary - brand);
  margin - bottom: 4px;
}

.safety - text p {
  font - size: 13.5px;
  color: var(--text - muted);
  line - height: 1.6;
}

/* Pricing Card Layouts */
.grid - 4 {
  display: grid;
  grid - template - columns: repeat(auto - fit, minmax(260px, 1fr));
  gap: 28px;
}

.pkg - card {
  background - color: var(--white);
  border: 1px solid var(--border - color);
  border - radius: var(--border - radius - lg);
  padding: 48px 30px;
  text - align: center;
  position: relative;
  transition: var(--transition - smooth);
  display: flex;
  flex - direction: column;
  box - shadow: var(--shadow - premium);
}

.pkg - card:hover {
  transform: translateY(-8px);
  box - shadow: var(--shadow - hover);
  border - color: var(--gold - accent);
}

.pkg - card - popular {
  border: 2px solid var(--gold - accent);
  background - color: var(--cream - card);
}

.pkg - badge {
  position: absolute;
  top: -13px;
  left: 50 %;
  transform: translateX(-50 %);
  background - color: var(--gold - accent);
  color: var(--white);
  padding: 4px 16px;
  border - radius: 20px;
  font - size: 10.5px;
  font - weight: 700;
  text - transform: uppercase;
  letter - spacing: 0.8px;
}

.pkg - title {
  font - family: var(--font - serif);
  font - size: 22px;
  color: var(--primary - brand);
  margin - bottom: 20px;
  font - weight: 700;
}

.pkg - price {
  font - size: 38px;
  font - weight: 700;
  color: var(--text - dark);
  margin - bottom: 28px;
  line - height: 1.2;
}

.pkg - price span {
  font - size: 13px;
  font - weight: normal;
  color: var(--text - muted);
  display: block;
  margin - top: 6px;
  line - height: 1.4;
}

.pkg - features {
  list - style: none;
  margin - bottom: 36px;
  text - align: left;
  display: flex;
  flex - direction: column;
  gap: 14px;
}

.pkg - features li {
  font - size: 13.5px;
  color: var(--text - dark);
  display: flex;
  align - items: center;
  gap: 10px;
  line - height: 1.4;
}

.pkg - features li::before {
  content: '✓';
  color: var(--gold - accent);
  font - weight: bold;
  font - size: 15px;
}

/* Success Story Cards */
.testimonial - card {
  background - color: var(--white);
  border: 1px solid var(--border - color);
  border - radius: var(--border - radius - lg);
  padding: 44px 32px;
  text - align: center;
  box - shadow: var(--shadow - premium);
  position: relative;
  transition: var(--transition - smooth);
  display: flex;
  flex - direction: column;
  justify - content: space - between;
}

.testimonial - card:hover {
  transform: translateY(-6px);
  box - shadow: var(--shadow - hover);
  border - color: var(--gold - accent);
}

.testimonial - card::before {
  content: '“';
  font - family: var(--font - serif);
  font - size: 80px;
  line - height: 1;
  color: var(--primary - brand - light);
  position: absolute;
  top: 10px;
  left: 20px;
  z - index: 1;
  opacity: 0.5;
}

.testimonial - text {
  position: relative;
  z - index: 2;
  font - style: italic;
  font - size: 14.5px;
  color: var(--text - dark);
  margin - bottom: 24px;
  line - height: 1.8;
}

.testimonial - author {
  font - weight: 600;
  color: var(--primary - brand);
  font - family: var(--font - serif);
  font - size: 15px;
  border - top: 1px solid var(--border - color);
  padding - top: 14px;
}

/* Professional Footer styling */
.footer {
  background - color: var(--primary - brand);
  color: var(--cream - bg);
  padding: 80px 0 40px 0;
  border - top: 4px solid var(--gold - accent);
}

.footer - logo {
  font - family: var(--font - serif);
  font - size: 32px;
  font - weight: 700;
  color: var(--white);
  margin - bottom: 18px;
}

.footer - logo span {
  color: var(--gold - accent);
}

.footer - logo img {
  display: block;
}

.footer - bottom {
  border - top: 1px solid rgba(255, 255, 255, 0.08);
  padding - top: 30px;
  margin - top: 50px;
  font - size: 13px;
  color: rgba(247, 245, 240, 0.55);
  text - align: center;
  letter - spacing: 0.2px;
}

/* Custom inputs & Forms */
.form - group {
  margin - bottom: 24px;
}

.form - label {
  display: block;
  font - weight: 600;
  font - size: 12.5px;
  margin - bottom: 8px;
  text - transform: uppercase;
  letter - spacing: 0.5px;
  color: var(--primary - brand);
}

.form - control {
  width: 100 %;
  max - width: 100 %;
  padding: 12px 16px;
  border: 1.5px solid var(--border - color);
  border - radius: var(--border - radius - md);
  font - family: var(--font - sans);
  font - size: 14px;
  outline: none;
  background - color: var(--white);
  transition: var(--transition - smooth);
  color: var(--text - dark);
}

.form - control:focus {
  border - color: var(--gold - accent);
  box - shadow: 0 0 0 3px var(--primary - brand - light);
}

select.form - control {
  appearance: none;
  background - image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='hsl(42, 38%, 56%)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background - repeat: no - repeat;
  background - position: right 14px center;
  background - size: 16px;
  padding - right: 40px;
}

/* Multistep indicator */
.step - indicator - bar {
  display: flex;
  justify - content: space - between;
  margin - bottom: 36px;
  position: relative;
  max - width: 420px;
  margin - left: auto;
  margin - right: auto;
}

.step - indicator - bar::before {
  content: '';
  position: absolute;
  top: 50 %;
  left: 0;
  right: 0;
  height: 2px;
  background - color: var(--border - color);
  z - index: 1;
  transform: translateY(-50 %);
}

.step - dot {
  width: 36px;
  height: 36px;
  border - radius: 50 %;
  background - color: var(--white);
  border: 2.5px solid var(--border - color);
  display: flex;
  align - items: center;
  justify - content: center;
  font - size: 13.5px;
  font - weight: 700;
  z - index: 2;
  transition: var(--transition - smooth);
  color: var(--text - muted);
}

.step - dot.active {
  border - color: var(--primary - brand);
  background - color: var(--primary - brand);
  color: var(--white);
  box - shadow: 0 0 0 4px var(--primary - brand - light);
}

.step - dot.completed {
  border - color: var(--gold - accent);
  background - color: var(--gold - accent);
  color: var(--white);
}

/* Modals overlays & sizes */
.modal - overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background - color: rgba(18, 30, 24, 0.65);
  backdrop - filter: blur(6px);
  -webkit - backdrop - filter: blur(6px);
  display: flex;
  justify - content: center;
  align - items: center;
  z - index: 1000;
  padding: 20px;
  animation: fadeIn 0.25s ease - out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal - content {
  background - color: var(--white);
  border - radius: var(--border - radius - xl);
  max - width: 600px;
  width: 100 %;
  box - shadow: var(--shadow - toast);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border - color);
  max - height: 90vh;
  display: flex;
  flex - direction: column;
  animation: slideUp 0.3s cubic - bezier(0.25, 1, 0.5, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal - header {
  padding: 20px 28px;
  border - bottom: 1px solid var(--border - color);
  display: flex;
  justify - content: space - between;
  align - items: center;
  background - color: var(--cream - card);
}

.modal - title {
  font - family: var(--font - serif);
  font - size: 22px;
  color: var(--primary - brand);
  font - weight: 700;
}

.modal - close - btn {
  background: none;
  border: none;
  font - size: 24px;
  cursor: pointer;
  color: var(--text - muted);
  transition: var(--transition - smooth);
  display: flex;
  align - items: center;
  justify - content: center;
  width: 32px;
  height: 32px;
  border - radius: 50 %;
}

.modal - close - btn:hover {
  color: var(--primary - brand);
  background - color: var(--primary - brand - light);
  transform: rotate(90deg);
}

.modal - body {
  padding: 28px;
  overflow - y: auto;
  flex - grow: 1;
}

/* Demo preview switcher bar (Sticky top) */
.demo - bar {
  background - color: hsl(150, 45 %, 8 %);
  border - bottom: 1px solid rgba(212, 163, 89, 0.35);
  color: rgba(255, 255, 255, 0.8);
  padding: 6px 20px;
  font - size: 11.5px;
  display: flex;
  justify - content: space - between;
  align - items: center;
  flex - wrap: wrap;
  gap: 12px;
  z - index: 150;
  position: sticky;
  top: 0;
  box - shadow: var(--shadow - sm);
  min - height: 36px;
}

.demo - bar - label {
  color: var(--gold - accent);
  font - weight: 600;
  letter - spacing: 0.5px;
  font - size: 11px;
}

.demo - bar - controls {
  display: flex;
  align - items: center;
  gap: 16px;
  flex - wrap: wrap;
}

.demo - bar - checkbox {
  display: flex;
  align - items: center;
  gap: 6px;
  cursor: pointer;
  font - weight: 500;
  font - size: 11px;
}

/* Admin Panel layout */
.admin - grid {
  display: grid;
  grid - template - columns: 240px 1fr;
  min - height: calc(100vh - 121px);
  background - color: var(--white);
  border - radius: var(--border - radius - xl);
  overflow: hidden;
  box - shadow: var(--shadow - premium);
  border: 1px solid var(--border - color);
  margin - top: 40px;
  margin - bottom: 40px;
}

.admin - nav - list {
  background - color: var(--primary - brand);
  color: var(--white);
  padding: 32px 16px;
  border - right: 1px solid var(--gold - accent);
  display: flex;
  flex - direction: column;
  gap: 6px;
}

.admin - nav - section - title {
  font - size: 10px;
  font - weight: 700;
  text - transform: uppercase;
  color: var(--gold - light);
  opacity: 0.6;
  letter - spacing: 1px;
  margin - top: 18px;
  margin - bottom: 6px;
  padding - left: 12px;
}

.admin - nav - link {
  display: flex;
  align - items: center;
  gap: 10px;
  padding: 12px 16px;
  border - radius: var(--border - radius - md);
  font - weight: 600;
  font - size: 13.5px;
  cursor: pointer;
  transition: var(--transition - smooth);
  color: rgba(255, 255, 255, 0.85);
  border: 1.5px solid transparent;
  outline: none;
}

.admin - nav - link:hover {
  color: var(--white);
  background - color: rgba(255, 255, 255, 0.05);
}

.admin - nav - link.active {
  background - color: var(--gold - accent);
  color: var(--white);
}

.admin - nav - link: focus - visible {
  border - color: var(--gold - accent);
  background - color: rgba(255, 255, 255, 0.1);
}

.admin - view - area {
  padding: 40px;
  background - color: var(--cream - bg);
  overflow - y: auto;
}

.table - responsive {
  overflow - x: auto;
  -webkit - overflow - scrolling: touch;
  width: 100 %;
}

.table - responsive table {
  min - width: 600px;
  /* Forces scrolling on very small screens instead of squishing */
}

/* Admin Overview Stats Grid */
.stats - grid {
  display: grid;
  grid - template - columns: repeat(auto - fill, minmax(220px, 1fr));
  gap: 20px;
  margin - bottom: 32px;
}

.stat - card {
  background - color: var(--white);
  border: 1px solid var(--border - color);
  border - radius: var(--border - radius - md);
  padding: 20px;
  box - shadow: var(--shadow - sm);
  transition: var(--transition - smooth);
  display: flex;
  flex - direction: column;
  justify - content: space - between;
  position: relative;
  overflow: hidden;
  min - height: 110px;
}

.stat - card:hover {
  transform: translateY(-2px);
  box - shadow: var(--shadow - premium);
  border - color: var(--gold - accent);
}

.stat - card - label {
  font - size: 11px;
  font - weight: 700;
  color: var(--text - muted);
  text - transform: uppercase;
  letter - spacing: 0.5px;
  margin - bottom: 8px;
}

.stat - card - value {
  font - family: var(--font - serif);
  font - size: 26px;
  font - weight: 700;
  color: var(--primary - brand);
  line - height: 1.2;
}

.stat - card - icon {
  position: absolute;
  bottom: 12px;
  right: 12px;
  font - size: 24px;
  opacity: 0.12;
  color: var(--gold - accent);
  pointer - events: none;
}

/* Admin Filters */
.admin - filter - bar {
  display: flex;
  gap: 16px;
  flex - wrap: wrap;
  margin - bottom: 24px;
  background - color: var(--white);
  padding: 16px;
  border - radius: var(--border - radius - md);
  border: 1px solid var(--border - color);
  align - items: flex - end;
  box - shadow: var(--shadow - sm);
}

.admin - filter - item {
  display: flex;
  flex - direction: column;
  gap: 6px;
  flex - grow: 1;
  min - width: 160px;
}

.admin - filter - item.button - item {
  flex - grow: 0;
  min - width: auto;
}

.coming - soon - badge {
  font - size: 9px;
  background - color: rgba(212, 163, 89, 0.18);
  color: var(--gold - dark);
  padding: 2px 6px;
  border - radius: 4px;
  margin - left: auto;
  font - weight: 700;
  letter - spacing: 0.2px;
}

/* Mobile Sidebar Drawer CSS */
.admin - mobile - bar {
  display: none;
  background - color: var(--primary - brand);
  padding: 12px 16px;
  border - bottom: 1px solid var(--gold - accent);
  align - items: center;
  justify - content: space - between;
  color: var(--white);
  z - index: 90;
}

.admin - drawer - overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z - index: 998;
  backdrop - filter: blur(4px);
  animation: fadeIn 0.2s ease - out;
}

/* Spinner & Tables */
.loading - spinner {
  width: 44px;
  height: 44px;
  border: 3.5px solid var(--primary - brand - light);
  border - radius: 50 %;
  border - top - color: var(--gold - accent);
  animation: spin 1s cubic - bezier(0.55, 0.085, 0.68, 0.53) infinite;
  margin: 60px auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media(max - width: 991px) {
  .hero - split {
    grid - template - columns: 1fr;
    text - align: center;
    padding: 60px 0;
    gap: 40px;
  }

  .hero - content {
    text - align: center;
    display: flex;
    flex - direction: column;
    align - items: center;
  }

  .hero - subtitle {
    justify - content: center;
  }

  .hero - subtitle::after {
    display: none;
  }

  .hero - visual - container {
    height: 380px;
    margin - top: 20px;
  }

  .hero - visual - frame {
    width: 100 %;
  }

  .timeline - grid {
    grid - template - columns: 1fr;
    gap: 30px;
  }

  .timeline - line {
    display: none;
  }

  .safety - wrapper {
    grid - template - columns: 1fr;
    padding: 28px;
  }

  .admin - grid {
    grid - template - columns: 1fr;
  }
}

@media(max - width: 768px) {
  .nav - menu {
    display: none;
  }

  .search - panel - grid {
    grid - template - columns: 1fr;
  }

  .header {
    top: 0px;
    /* Adjust if demo bar wraps on mobile */
  }
}

/* Onboarding Wizard Card styling */
.reg - wizard - card {
  max - width: 680px;
  margin: 0 auto;
}

/* Premium Form Checkbox overrides */
input[type = "checkbox"] {
  accent - color: var(--gold - accent);
  cursor: pointer;
  width: 16px;
  height: 16px;
  border - radius: 4px;
}

/* Admin Table Responsive Wrapper */
.table - responsive {
  width: 100 %;
  overflow - x: auto;
  -webkit - overflow - scrolling: touch;
}

.admin - view - area table {
  width: 100 %;
  border - collapse: collapse;
  min - width: 600px;
  /* Ensure table doesn't squash too much */
}

.admin - view - area th {
  padding: 12px 16px;
  font - weight: 700;
  text - transform: uppercase;
  font - size: 11px;
  letter - spacing: 0.8px;
  border - bottom: 2px solid var(--border - color);
  color: var(--gold - dark);
  text - align: left;
}

.admin - view - area td {
  padding: 16px;
  border - bottom: 1px solid var(--border - color);
  color: var(--text - dark);
  transition: var(--transition - smooth);
}

.admin - view - area tbody tr {
  transition: var(--transition - smooth);
}

.admin - view - area tbody tr:hover {
  background - color: hsla(42, 55 %, 90 %, 0.15);
}

.modal - details - grid {
  display: grid;
  grid - template - columns: 1fr 1fr;
  gap: 16px;
  font - size: 13.5px;
}

/* Flex and Grid min-width reset to prevent overflow */
.grid - 3 >*,
.grid - 4 >*,
.search - panel - grid >*,
.timeline - grid >*,
.admin - grid >* {
    min- width: 0;
}

/* Media Queries for Responsive Design */
/* Small desktop / laptop tier: the navbar card's own max-width (1480px)
   starts getting constrained by the viewport itself below ~1528px, so
   reclaim a bit more room here before the hamburger cutover. */
@media(max - width: 1600px) {
  .nav - container {
    column - gap: 12px;
    padding: 8px 14px;
    min - height: 64px;
  }

  .logo - arch - wrapper {
    width: 180px;
    height: 90px;
    margin - top: -34px;
  }

  .logo - arch - content {
    padding - top: 10px;
    width: 150px;
  }

  .nav - menu {
    gap: 5px;
  }

  .nav - link {
    padding: 5px 7px;
    font - size: 12px;
  }

  .nav - right {
    gap: 8px;
  }

  .nav - btn {
    padding: 5px 8px!important;
    font - size: 10.5px!important;
    height: 32px!important;
    gap: 4px!important;
  }

  .nav - actions - wrapper {
    gap: 6px;
  }

  .nav - actions - group {
    gap: 4px;
  }
}

/* Tablet / mobile tier: not enough width remains for a 3-column desktop
   layout without crowding the logo, so switch to the hamburger menu here
   rather than let links move underneath the logo. */
@media(max - width: 1400px) {
  .hero - title {
    font - size: 48px;
  }

  .nav - container {
    grid - template - columns: minmax(0, 1fr) auto minmax(0, 1fr);
    grid - template - rows: auto;
    min - height: 64px;
    padding: 8px 16px;
    row - gap: 0;
    column - gap: 10px;
    border - radius: 12px;
    margin: 10px auto 5px auto;
  }

  .logo - arch - wrapper {
    width: 160px;
    height: auto;
    margin - top: 0;
  }

  .logo - arch - content {
    padding - top: 0;
    width: 130px;
  }

  .logo - arch - bg {
    display: none;
  }

  .nav - menu - desktop {
    display: none!important;
  }

  #hamburger - btn {
    display: flex!important;
  }

  .nav - left {
    justify - self: start!important;
    grid - row: 1;
    grid - column: 1;
  }
}

@media(max - width: 991px) {
  .hero - split {
    grid - template - columns: 1fr;
    text - align: center;
    padding: 60px 0 40px 0;
    gap: 40px;
    min - height: auto;
  }

  .hero - content {
    text - align: center;
    display: flex;
    flex - direction: column;
    align - items: center;
  }

  .hero - subtitle {
    justify - content: center;
  }

  .hero - subtitle::after {
    display: none;
  }

  .hero - visual - container {
    height: 380px;
    margin - top: 20px;
  }

  .hero - visual - frame {
    width: 100 %;
  }

  .timeline - grid {
    grid - template - columns: 1fr;
    gap: 30px;
  }

  .timeline - line {
    display: none;
  }

  .safety - wrapper {
    grid - template - columns: 1fr;
    padding: 28px;
  }

  .admin - grid {
    grid - template - columns: 1fr;
    min - height: auto;
  }

  section {
    padding: 80px 0;
  }
}

@media(max - width: 768px) {
  .container {
    padding: 0 16px;
  }

  .nav - menu {
    display: none;
  }

  .search - panel {
    padding: 20px;
    margin - top: -20px;
  }

  .search - panel - grid {
    grid - template - columns: 1fr;
    gap: 16px;
  }

  .search - panel - grid > button {
    width: 100 %;
  }

  .header {
    top: 0px;
    /* Adjust if demo bar wraps on mobile */
  }

  .hero - title {
    font - size: 38px!important;
  }

  .hero - description {
    font - size: 16px!important;
  }

  .section - header h2 {
    font - size: 32px;
  }

  .grid - 3,
  .grid - 4 {
    grid - template - columns: 1fr!important;
  }

  .grid - mobile - 1,
  .form - group - grid,
  .search - panel - grid,
  .profile - specs - grid,
  .safety - wrapper {
    grid - template - columns: 1fr!important;
  }

  /* Aggressively override inline grid columns that cause mobile overflow */
  [style *= "repeat(auto-fit"],
    [style *= "minmax("],
    [style *= "1fr 1fr"] {
    grid - template - columns: 1fr!important;
  }

  .admin - nav - list {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    z - index: 999;
    transform: translateX(-100 %);
    transition: transform 0.3s cubic - bezier(0.25, 1, 0.5, 1);
    box - shadow: 0 0 20px rgba(0, 0, 0, 0.25);
    border - right: 2px solid var(--gold - accent);
    display: flex;
    flex - direction: column;
    padding: 24px 16px;
    gap: 8px;
    white - space: normal;
    background - color: var(--primary - brand);
  }

  .admin - nav - list.open {
    transform: translateX(0);
  }

  .admin - nav - link {
    margin - bottom: 0;
    flex: 0 0 auto;
  }

  .admin - mobile - bar {
    display: flex;
  }

  .admin - view - area {
    padding: 24px 16px;
  }

  .modal - overlay {
    padding: 10px;
  }

  .modal - content {
    max - height: 95vh;
  }

  .modal - header {
    padding: 16px 20px;
  }

  .modal - body {
    padding: 20px;
  }

  .demo - bar {
    justify - content: center;
    padding: 8px 16px;
  }

  .demo - bar - controls {
    flex - wrap: wrap;
    justify - content: center;
    gap: 12px;
  }

  .footer {
    padding: 60px 0 30px 0;
  }

  .trust - strip {
    flex - direction: column;
    gap: 24px;
    align - items: center;
    text - align: center;
  }

  .timeline - container {
    margin - top: 40px;
  }
}

@media(max - width: 480px) {
  .modal - details - grid {
    grid - template - columns: 1fr;
  }

  .hero - title {
    font - size: 32px;
  }

  .hero - description {
    font - size: 15px;
  }

  .btn {
    padding: 10px 20px;
    width: 100 %;
    justify - content: center;
  }

  .tabs - container {
    gap: 8px;
  }

  .tab - btn {
    padding: 8px 16px;
    font - size: 12.5px;
  }

  .pkg - card {
    padding: 32px 20px;
  }

  .pkg - price {
    font - size: 32px;
  }

  .form - group {
    margin - bottom: 16px;
  }

  .step - indicator - bar {
    max - width: 100 %;
  }
}

/* Invitation Redesign Helper Styles */
.script - accent {
  font - family: var(--font - script);
  font - size: 2.8rem;
  color: var(--gold - accent);
  line - height: 1;
}

.arabic - calligraphy {
  font - family: var(--font - arabic);
  font - size: 2.5rem;
  color: var(--primary - brand);
  line - height: 1.4;
  text - align: center;
  direction: rtl;
}

.arch - container {
  border: 1.5px solid var(--gold - accent);
  border - radius: 200px 200px 20px 20px;
  /* Traditional Mughal arch border outline */
  padding: 24px;
  background - color: var(--warm - ivory);
  box - shadow: inset 0 0 40px rgba(184, 146, 74, 0.05);
}

.gold - rim {
  border: 1px solid var(--gold - accent);
  position: relative;
  padding: 12px;
}

.gold - rim::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px dashed var(--gold - light);
  pointer - events: none;
}

.decorative - card {
  background - color: var(--white);
  border: 1px solid var(--border - color);
  border - radius: var(--border - radius - lg);
  position: relative;
  overflow: hidden;
  transition: var(--transition - smooth);
}

.decorative - card:hover {
  transform: translateY(-4px);
  box - shadow: var(--shadow - hover);
  border - color: var(--gold - accent);
}

.badge - hp {
  background - color: var(--gold - accent);
  color: var(--white);
  border: 1px solid var(--gold - light);
}

.badge - sm {
  background - color: var(--dark - charcoal);
  color: var(--white);
}

.gold - glow {
  box - shadow: 0 8px 32px rgba(184, 146, 74, 0.08);
}

/* AI Chatbot Widget Styling */
.chatbot - widget - container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z - index: 9999;
}

.chatbot - trigger {
  display: flex;
  align - items: center;
  gap: 10px;
  background - color: var(--white);
  border: 1.5px solid var(--gold - accent);
  border - radius: 50px;
  padding: 10px 20px;
  box - shadow: 0 8px 32px rgba(111, 29, 53, 0.1);
  cursor: pointer;
  transition: var(--transition - smooth);
}

.chatbot - trigger:hover {
  transform: translateY(-3px) scale(1.02);
  border - color: var(--deep - maroon);
  box - shadow: 0 12px 40px rgba(111, 29, 53, 0.18);
}

.chatbot - trigger - icon {
  font - size: 20px;
  color: var(--gold - accent);
  line - height: 1;
}

.chatbot - trigger - text {
  font - family: var(--font - sans);
  font - weight: 600;
  font - size: 13px;
  color: var(--deep - maroon);
  letter - spacing: 0.2px;
}

.chatbot - window {
  width: 380px;
  height: 520px;
  background - color: var(--warm - ivory);
  border: 1.5px solid var(--gold - accent);
  border - radius: var(--border - radius - xl);
  box - shadow: 0 20px 60px rgba(111, 29, 53, 0.15);
  display: flex;
  flex - direction: column;
  overflow: hidden;
  animation: chatbotSlideIn 0.4s cubic - bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes chatbotSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chatbot - header {
  background - color: var(--deep - maroon);
  color: var(--white);
  padding: 16px 20px;
  display: flex;
  justify - content: space - between;
  align - items: center;
  border - bottom: 1px solid var(--border - color);
}

.chatbot - header - avatar {
  width: 32px;
  height: 32px;
  border - radius: 50 %;
  background - color: var(--white);
  color: var(--gold - accent);
  display: flex;
  align - items: center;
  justify - content: center;
  font - size: 18px;
  border: 1px solid var(--gold - light);
}

.chatbot - header - title {
  font - family: var(--font - serif);
  font - size: 16px;
  font - weight: 600;
  color: var(--soft - cream);
}

.chatbot - status - indicator {
  width: 6px;
  height: 6px;
  border - radius: 50 %;
  background - color: #27ae60;
  display: inline - block;
}

.chatbot - status - text {
  font - size: 10px;
  opacity: 0.85;
  letter - spacing: 0.3px;
  color: var(--soft - cream);
}

.chatbot - clear - btn {
  background: none;
  border: none;
  color: var(--gold - light);
  font - size: 11px;
  cursor: pointer;
  padding: 4px 8px;
  border - radius: var(--border - radius - sm);
  transition: var(--transition - smooth);
}

.chatbot - clear - btn:hover {
  background - color: rgba(255, 255, 255, 0.1);
  color: var(--white);
}

.chatbot - close - btn {
  background: none;
  border: none;
  color: var(--white);
  font - size: 16px;
  cursor: pointer;
  transition: var(--transition - smooth);
}

.chatbot - close - btn:hover {
  color: var(--gold - accent);
}

.chatbot - messages - container {
  flex - grow: 1;
  padding: 20px;
  overflow - y: auto;
  display: flex;
  flex - direction: column;
  gap: 16px;
  background - image: radial - gradient(rgba(184, 146, 74, 0.04) 1px, transparent 1px);
  background - size: 16px 16px;
}

.chatbot - message - row {
  display: flex;
  align - items: flex - end;
  gap: 8px;
  max - width: 85 %;
}

.row - user {
  align - self: flex - end;
  flex - direction: row - reverse;
}

.row - assistant {
  align - self: flex - start;
}

.chatbot - msg - avatar {
  width: 24px;
  height: 24px;
  border - radius: 50 %;
  background - color: var(--soft - cream);
  color: var(--gold - accent);
  display: flex;
  align - items: center;
  justify - content: center;
  font - size: 12px;
  border: 1px solid var(--border - color);
  flex - shrink: 0;
}

.chatbot - message - bubble {
  padding: 10px 14px;
  border - radius: var(--border - radius - md);
  font - size: 12.5px;
  line - height: 1.5;
}

.bubble - user {
  background - color: var(--deep - maroon);
  color: var(--white);
  border - bottom - right - radius: 2px;
  box - shadow: 0 4px 12px rgba(111, 29, 53, 0.08);
}

.bubble - assistant {
  background - color: var(--soft - cream);
  color: var(--text - dark);
  border: 1px solid var(--border - color);
  border - bottom - left - radius: 2px;
  box - shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.chatbot - message - content {
  white - space: pre - line;
}

.chatbot - error - banner {
  font - size: 11px;
  color: #c0392b;
  background - color: #fadbd8;
  padding: 6px 12px;
  border - radius: var(--border - radius - sm);
  text - align: center;
  align - self: center;
  max - width: 90 %;
  border: 1px solid #f5b7b1;
}

/* Typing Dots Animation */
.chatbot - typing - dots {
  display: flex;
  align - items: center;
  gap: 4px;
  padding: 4px 0;
}

.chatbot - typing - dots span {
  width: 6px;
  height: 6px;
  border - radius: 50 %;
  background - color: var(--text - muted);
  display: inline - block;
  animation: chatbotTyping 1.4s infinite ease -in -out both;
}

.chatbot - typing - dots span: nth - child(1) {
  animation - delay: -0.32s;
}

.chatbot - typing - dots span: nth - child(2) {
  animation - delay: -0.16s;
}

@keyframes chatbotTyping {

  0 %,
    80 %,
    100 % {
      transform: scale(0);
    }

  40 % {
    transform: scale(1);
  }
}

/* Chat Input Footer */
.chatbot - input - form {
  padding: 12px 16px;
  border - top: 1px solid var(--border - color);
  background - color: var(--white);
  display: flex;
  align - items: center;
  gap: 8px;
}

.chatbot - input - field {
  flex - grow: 1;
  border: 1px solid var(--border - color);
  border - radius: 30px;
  padding: 8px 16px;
  font - size: 12.5px;
  outline: none;
  font - family: var(--font - sans);
  background - color: var(--warm - ivory);
  transition: var(--transition - smooth);
}

.chatbot - input - field:focus {
  border - color: var(--gold - accent);
  box - shadow: 0 0 0 3px rgba(184, 146, 74, 0.1);
  background - color: var(--white);
}

.chatbot - send - btn {
  background - color: var(--gold - accent);
  color: var(--white);
  border: none;
  border - radius: 50 %;
  width: 32px;
  height: 32px;
  display: flex;
  align - items: center;
  justify - content: center;
  cursor: pointer;
  transition: var(--transition - smooth);
  flex - shrink: 0;
}

.chatbot - send - btn: hover: not(: disabled) {
  background - color: var(--gold - dark);
  transform: scale(1.05);
}

.chatbot - send - btn:disabled {
  background - color: #e6d8bc;
  cursor: not - allowed;
}

/* Mobile responsive media query */
@media(max - width: 480px) {
  .chatbot - widget - container {
    bottom: 16px;
    right: 16px;
  }

  .chatbot - trigger - text {
    display: none;
  }

  .chatbot - trigger {
    padding: 10px;
    border - radius: 50 %;
    width: 48px;
    height: 48px;
    justify - content: center;
  }

  .chatbot - window {
    width: calc(100vw - 32px);
    height: calc(100vh - 120px);
    max - height: 480px;
  }
}

/* Floating Call Button Styling */
.call - button - container {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z - index: 9999;
}

.call - button - trigger {
  display: flex;
  align - items: center;
  gap: 10px;
  background - color: var(--white);
  border: 1.5px solid var(--gold - accent);
  border - radius: 50px;
  padding: 10px 20px;
  box - shadow: 0 8px 32px rgba(111, 29, 53, 0.1);
  cursor: pointer;
  transition: var(--transition - smooth);
  text - decoration: none;
}

.call - button - trigger:hover {
  transform: translateY(-3px) scale(1.02);
  border - color: var(--deep - maroon);
  box - shadow: 0 12px 40px rgba(111, 29, 53, 0.18);
}

.call - button - icon {
  color: var(--gold - accent);
  transition: var(--transition - smooth);
}

.call - button - trigger: hover.call - button - icon {
  color: var(--deep - maroon);
}

.call - button - text {
  font - family: var(--font - sans);
  font - weight: 600;
  font - size: 13px;
  color: var(--deep - maroon);
  letter - spacing: 0.2px;
}

/* Mobile responsive media query for call button */
@media(max - width: 480px) {
  .call - button - container {
    bottom: 16px;
    left: 16px;
  }

  .call - button - text {
    display: none;
  }

  .call - button - trigger {
    padding: 10px;
    border - radius: 50 %;
    width: 48px;
    height: 48px;
    justify - content: center;
  }
}

/* Floating WhatsApp Button Styling */
.whatsapp - button - container {
  position: fixed;
  bottom: 84px;
  left: 24px;
  z - index: 9999;
}

.whatsapp - button - trigger {
  display: flex;
  align - items: center;
  gap: 10px;
  background - color: #25D366;
  border: 1.5px solid #128C7E;
  border - radius: 50px;
  padding: 10px 20px;
  box - shadow: 0 8px 32px rgba(37, 211, 102, 0.20);
  cursor: pointer;
  transition: var(--transition - smooth);
  text - decoration: none;
}

.whatsapp - button - trigger:hover {
  transform: translateY(-3px) scale(1.02);
  background - color: #128C7E;
  border - color: #075E54;
  box - shadow: 0 12px 40px rgba(18, 140, 126, 0.35);
}

.whatsapp - button - icon {
  color: var(--white);
  transition: var(--transition - smooth);
}

.whatsapp - button - text {
  font - family: var(--font - sans);
  font - weight: 600;
  font - size: 13px;
  color: var(--white);
  letter - spacing: 0.2px;
}

/* Comprehensive Mobile overrides for tiny viewports */
@media(max - width: 480px) {
  .hero - title {
    font - size: 32px!important;
  }

  .hero - description {
    font - size: 15px!important;
  }

  .modal - content {
    width: 95vw!important;
    max - width: 95vw!important;
    margin: 10px auto!important;
  }

  .whatsapp - button - container {
    bottom: 76px!important;
    left: 16px!important;
  }

  .whatsapp - button - text {
    display: none;
  }

  .whatsapp - button - trigger {
    padding: 10px;
    border - radius: 50 %;
    width: 48px;
    height: 48px;
    justify - content: center;
  }

  .chatbot - widget {
    bottom: 16px!important;
    right: 16px!important;
  }
}

/* Footer Links */
.footer - link {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  opacity: 0.8;
  padding: 6px 0;
  display: block;
  transition: var(--transition - smooth);
  text - decoration: none;
  width: 100 %;
}

.footer - link: hover,
.footer - link:focus {
  opacity: 1;
  color: var(--gold - accent);
  transform: translateX(4px);
  outline: none;
}

/* ==========================================================================
   PREMIUM MOBILE & TABLET UX/UI OVERRIDES
   ========================================================================== */

/* Tablet & Mobile (max-width: 991px) */
@media(max - width: 991px) {

  /* Layout & Spacing */
  section {
    padding: 80px 0;
  }

  .container {
    padding: 0 20px;
  }

  /* Hero Section */
  .hero - split {
    grid - template - columns: 1fr;
    gap: 40px;
    padding: 40px 0;
    text - align: center;
  }

  .hero - content {
    text - align: center;
  }

  .hero - subtitle {
    justify - content: center;
  }

  /* Typography */
  .hero - title {
    font - size: 42px;
    line - height: 1.2;
  }

  .section - header h2 {
    font - size: 32px;
  }

  /* Cards Grid */
  .grid - 3 {
    grid - template - columns: repeat(auto - fit, minmax(280px, 1fr));
    gap: 24px;
  }
}

/* Mobile Devices (max-width: 767px) */
@media(max - width: 767px) {

  /* Typography Enhancements */
  body {
    font - size: 15px;
    line - height: 1.6;
  }

  .hero - title {
    font - size: 36px!important;
    margin - bottom: 16px;
  }

  .hero - description {
    font - size: 16px!important;
    margin - bottom: 24px;
    margin - left: auto;
    margin - right: auto;
    max - width: 100 %;
  }

  .section - header h2 {
    font - size: 28px;
  }

  .section - header p {
    font - size: 14px;
  }

  /* Spacing */
  section {
    padding: 60px 0;
  }

  .container {
    padding: 0 16px;
  }

  .hero - split {
    padding: 30px 0;
    min - height: auto;
  }

  /* Header & Navigation */
  .nav - container {
    height: 64px;
  }

  .logo {
    font - size: 24px;
  }

  .logo img {
    height: 40px;
  }

  #hamburger - btn {
    font - size: 24px;
    padding: 8px;
    min - height: 48px;
    min - width: 48px;
    display: flex;
    align - items: center;
    justify - content: center;
  }

  /* Buttons - Touch Target Size > 44px */
  .btn {
    padding: 14px 24px;
    min - height: 48px;
    font - size: 15px;
    width: 100 %;
    justify - content: center;
    margin - bottom: 8px;
  }

  .hero - content.btn {
    width: 100 %;
    margin: 0 0 12px 0;
  }

  .hero - content {
    display: flex;
    flex - direction: column;
    align - items: center;
  }

  /* Profile Cards / Product Cards */
  .profile - card {
    border - radius: var(--border - radius - md);
  }

  .profile - image - wrapper {
    padding - bottom: 100 %;
  }

  /* Square on mobile for better visibility */
  .profile - card - details {
    padding: 16px;
  }

  .profile - card - name {
    font - size: 19px;
  }

  .profile - specs - grid {
    grid - template - columns: 1fr 1fr;
    gap: 10px;
    margin - bottom: 16px;
  }

  .card - badge {
    font - size: 10px;
    padding: 4px 10px;
  }

  /* Forms */
  input,
    select,
    textarea {
    font - size: 16px!important;
    /* Prevents iOS zoom */
    padding: 12px 16px!important;
    min - height: 48px;
    border - radius: var(--border - radius - sm);
  }

  .form - group label {
    font - size: 14px;
    margin - bottom: 6px;
  }

  /* Modals & Dialogs */
  .modal - content {
    padding: 24px 16px!important;
    width: 92vw!important;
    max - width: 92vw!important;
    max - height: 90vh;
    overflow - y: auto;
    margin: auto!important;
    border - radius: var(--border - radius - md);
  }

  /* Search Panel */
  .search - panel {
    padding: 20px 16px;
    margin - top: -20px;
    border - radius: var(--border - radius - md);
  }

  .search - panel - grid {
    grid - template - columns: 1fr;
    gap: 16px;
  }

  /* Floating elements adjustments */
  .whatsapp - button - trigger,
  .call - button - trigger,
  .chatbot - trigger {
    min - height: 52px;
    min - width: 52px;
    box - shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border - radius: 50 %;
    padding: 12px;
    justify - content: center;
  }

  .whatsapp - button - text,
  .call - button - text,
  .chatbot - trigger - text {
    display: none;
  }

  .whatsapp - button - container {
    bottom: 84px!important;
    left: 16px!important;
    z - index: 1000;
  }

  .call - button - container {
    bottom: 16px!important;
    left: 16px!important;
    z - index: 1000;
  }

  .chatbot - widget - container {
    bottom: 16px!important;
    right: 16px!important;
    z - index: 1000;
  }
}

/* Very Small Phones (max-width: 375px) */
@media(max - width: 375px) {
  .hero - title {
    font - size: 32px!important;
  }

  .logo {
    font - size: 22px;
  }

  .logo img {
    height: 36px;
  }

  .btn {
    font - size: 14px;
    padding: 12px 20px;
  }

  .profile - specs - grid {
    grid - template - columns: 1fr;
  }
}

/* Quran Verse Full-Image Card */
.quran - verse - split {
  position: relative;
  max - width: 900px;
  margin: 0 auto;
  height: 380px;
  border - radius: var(--border - radius - lg);
  border: 1.5px solid var(--gold - accent);
  box - shadow: var(--shadow - premium);
  overflow: hidden;
}

.quran - verse - image - panel {
  position: absolute;
  inset: 0;
}

@media(max - width: 640px) {
  .quran - verse - split {
    height: 280px;
  }
}

@media(max - width: 768px) {

  .good - profiles - container,
  .second - marriage - container,
  .high - profile - container {
    grid - template - columns: 1fr!important;
  }
}

/* --- Bismillah Calligraphy Section --- */
.bismillah - container {
  display: flex;
  justify - content: center;
  align - items: center;
  width: 100 %;
  max - width: 1240px;
  margin: 0 auto;
  position: relative;
  height: 140px;
  /* 120-180px height as requested */
  overflow: hidden;
  padding: 0 20px;
  box - sizing: border - box;
}

.bismillah - content {
  display: flex;
  flex - direction: column;
  align - items: center;
  justify - content: center;
  z - index: 2;
  text - align: center;
}

.lantern - wrapper {
  position: absolute;
  top: 0;
  z - index: 1;
}

.lantern - left {
  left: 10 %;
}

.lantern - right {
  right: 10 %;
}

@media(max - width: 768px) {
  .lantern - wrapper {
    display: none;
    /* Hide lanterns on mobile */
  }

  .bismillah - container {
    height: 120px;
  }
}

/* Event Management — service card hover lift */
.event - service - card:hover {
  transform: translateY(-6px);
  box - shadow: var(--shadow - hover);
  border - color: var(--gold - accent);
}

/* ================================================================
   Mobile Swipe Carousel — horizontal scroll for card sections
   Only active on screens ≤ 767px. Desktop keeps existing grid.
   ================================================================ */

.mobile - swipe - hint {
  display: none;
}

@media(max - width: 767px) {

  /* Subtle "swipe" nudge above carousel sections */
  .mobile - swipe - hint {
    display: flex;
    align - items: center;
    justify - content: flex - end;
    gap: 4px;
    font - size: 11px;
    color: var(--text - muted);
    margin - bottom: 10px;
    opacity: 0.72;
    letter - spacing: 0.025em;
    user - select: none;
  }

  /* The horizontal swipe row container */
  .mobile - swipe - row {
    display: flex!important;
    flex - direction: row!important;
    overflow - x: auto!important;
    scroll - snap - type: x mandatory;
    scroll - behavior: smooth;
    -webkit - overflow - scrolling: touch;
    gap: 14px!important;
    /* Bleed to container edges so first card aligns with section text */
    padding: 6px 16px 28px 16px!important;
    margin - left: -16px!important;
    margin - right: -16px!important;
    /* Hide scrollbar visually while keeping scroll functional */
    scrollbar - width: none;
    min - width: 0;
    /* Align all cards to top so varying heights don't stretch neighbours */
    align - items: flex - start;
  }

  .mobile - swipe - row:: -webkit - scrollbar {
    display: none;
  }

  /* Default card width — ~84% shows a peek of the next card */
  .mobile - swipe - row >* {
    flex: 0 0 84 % !important;
    width: 84 % !important;
    min- width: 0!important;
  max - width: none!important;
  scroll - snap - align: start!important;
}

  /* Package cards slightly narrower so the next plan peeks through */
  .mobile - swipe - row.swipe - packages >* {
  flex: 0 0 80 % !important;
  width: 80 % !important;
}

  /* Override the grid-3/grid-4 1-column stacking rule for swipe rows */
  .mobile - swipe - row.grid - 3,
  .mobile - swipe - row.grid - 4 {
  grid - template - columns: none!important;
}
}

/* ==========================================================================
   DESKTOP NAVBAR FIX
   Keep this block at the very end of globals.css.
   Navbar.tsx does not need to import a separate CSS file.
   ========================================================================== */

@media(min - width: 1200px) {
  .nav - outer - container {
    width: 100 %;
    max - width: 1920px;
    margin: 0 auto;
    padding: 18px 16px 8px;
    overflow: visible;
  }

  .nav - container {
    position: relative;
    display: grid;
    grid - template - columns:
    minmax(280px, 0.9fr)
    190px
    minmax(650px, 1.8fr);
    align - items: center;
    column - gap: 8px;

    width: 100 %;
    max - width: none;
    min - height: 78px;
    margin: 0;
    padding: 8px 12px;

    background - color: var(--warm - ivory);
    border: 1.5px solid var(--gold - accent);
    border - radius: 22px;
    box - shadow:
    var(--shadow - premium),
      0 10px 30px rgba(111, 29, 53, 0.03);

    overflow: visible;
  }

  .nav - section,
  .nav - left,
  .nav - right,
  .nav - menu - desktop {
    min - width: 0;
  }

  /* Force the complete navigation to remain visible on desktop/laptop. */
  .nav - menu - desktop {
    display: flex!important;
    align - items: center;
  }

  .nav - menu {
    display: flex!important;
  }

  #hamburger - btn {
    display: none!important;
  }

  .nav - left {
    grid - column: 1;
    justify - self: stretch!important;
    display: flex;
    align - items: center;
    justify - content: flex - start;
    padding: 0 4px 0 0;
  }

  .nav - right {
    grid - column: 3;
    justify - self: stretch;
    display: grid;
    grid - template - columns: minmax(0, 1fr) auto;
    align - items: center;
    gap: 5px;
    padding: 0 0 0 2px;
  }

  .nav - left > .nav - menu - desktop {
    justify - content: flex - start;
  }

  .nav - right > .nav - menu - desktop: first - child {
    justify - content: flex - end;
  }

  .nav - menu {
    align - items: center;
    gap: 2px;
    margin: 0;
    padding: 0;
    list - style: none;
    white - space: nowrap;
  }

  .nav - menu li {
    display: flex;
    align - items: center;
    flex: 0 0 auto;
  }

  .nav - link {
    display: inline - flex;
    align - items: center;
    justify - content: center;
    gap: 3px;

    min - height: 36px;
    padding: 5px 3px;

    color: var(--text - dark);
    font - size: 10.5px;
    font - weight: 700;
    line - height: 1;
    letter - spacing: 0;
    white - space: nowrap;

    border - radius: 8px;
  }

  .nav - link.active {
    padding: 5px 4px;
  }

  .nav - icon {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
  }

  .logo - arch - wrapper {
    grid - column: 2;
    justify - self: center;
    align - self: end;

    position: relative;
    width: 190px;
    height: 104px;
    margin - top: -30px;

    display: flex;
    align - items: center;
    justify - content: center;
    flex: none;

    z - index: 5;
    overflow: visible;
    pointer - events: none;
  }

  .logo - arch - bg {
    position: absolute;
    inset: 0;
    display: block!important;
    width: 100 %;
    height: 100 %;
    pointer - events: none;
  }

  .logo - arch - content {
    position: absolute;
    inset: 29px 18px 9px;
    z - index: 2;

    width: auto;
    padding: 0;

    display: flex;
    align - items: center;
    justify - content: center;
  }

  .logo - link {
    display: flex;
    align - items: center;
    justify - content: center;

    width: 100 %;
    max - width: 150px;
    pointer - events: auto;
  }

  .logo - link img {
    display: block;
    width: 100 % !important;
    max - width: 150px!important;
    height: auto!important;
    object - fit: contain;
  }

  .nav - actions - wrapper,
  .nav - actions - group {
    display: flex!important;
    align - items: center;
    justify - content: flex - end;

    gap: 4px;
    min - width: max - content;
    flex: 0 0 auto;
  }

  .nav - greeting,
  .nav - actions - group > span {
    display: none!important;
  }

  .nav - btn {
    display: inline - flex!important;
    align - items: center!important;
    justify - content: center!important;

    width: auto!important;
    min - width: max - content;
    height: 34px!important;
    margin: 0!important;
    padding: 0 7px!important;

    border - radius: 8px!important;
    font - size: 9.5px!important;
    font - weight: 800!important;
    line - height: 1!important;
    letter - spacing: 0;
    white - space: nowrap!important;
    gap: 3px!important;
  }

  .btn - icon {
    width: 13px;
    height: 13px;
    flex: 0 0 auto;
  }
}

/* Roomier styling for large desktop screens. */
@media(min - width: 1500px) {
  .nav - outer - container {
    padding - right: 24px;
    padding - left: 24px;
  }

  .nav - container {
    grid - template - columns:
    minmax(360px, 0.95fr)
    230px
    minmax(720px, 1.65fr);
    column - gap: 12px;
    min - height: 86px;
    padding - right: 18px;
    padding - left: 18px;
  }

  .nav - menu {
    gap: 6px;
  }

  .nav - link {
    gap: 4px;
    padding - right: 5px;
    padding - left: 5px;
    font - size: 12px;
  }

  .nav - link.active {
    padding - right: 7px;
    padding - left: 7px;
  }

  .nav - icon {
    width: 16px;
    height: 16px;
  }

  .logo - arch - wrapper {
    width: 230px;
    height: 116px;
    margin - top: -34px;
  }

  .logo - arch - content {
    inset: 33px 21px 10px;
  }

  .logo - link,
  .logo - link img {
    max - width: 178px!important;
  }

  .nav - right {
    gap: 8px;
  }

  .nav - actions - wrapper,
  .nav - actions - group {
    gap: 6px;
  }

  .nav - greeting,
  .nav - actions - group > span {
    display: inline - flex!important;
    align - items: center;
    white - space: nowrap;
  }

  .nav - btn {
    height: 38px!important;
    padding - right: 10px!important;
    padding - left: 10px!important;
    font - size: 10.5px!important;
    gap: 4px!important;
  }

  .btn - icon {
    width: 14px;
    height: 14px;
  }
}

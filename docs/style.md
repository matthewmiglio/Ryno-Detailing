# Ryno Detailing Style Guide

Derived from the `06-diagonal-dynamic` home page concept. The look is high-energy
and athletic: condensed all-caps display type, a hard orange-on-black palette,
skewed section bands, and clip-path angled image frames. Desktop-first.

---

## 1. Brand personality

| Trait | What it means in the UI |
|-------|-------------------------|
| Aggressive | Big condensed headlines, all caps, tight line-height |
| Fast / kinetic | Skewed bands, angled (clip-path) image edges, hover lifts |
| Honest | Flat prices shown up front, no fluff copy |
| Confident | High contrast, orange used as a punch, not a wash |

Voice: short, punchy, second person. "Detail that hits different." "Pick your weapon." "Ready to roll?"

---

## 2. Design tokens

Drop these into a `:root` block and reference them everywhere. Do not hardcode hex values in components.

```css
:root{
  /* Brand */
  --orange:      #ff7314;  /* primary accent: CTAs, highlights, the skew band */
  --black:       #101010;  /* page background */

  /* Surfaces */
  --surface:     #1a1a1a;  /* cards, panels */
  --border:      #444444;  /* ghost-button outlines, dividers */

  /* Text on dark */
  --text:        #ffffff;  /* headings, primary copy */
  --text-muted:  #bbbbbb;  /* hero / body paragraphs */
  --text-dim:    #aaaaaa;  /* card body copy */
  --text-faint:  #777777;  /* footer, fine print */
  --nav-link:    #dddddd;  /* nav links (resting) */

  /* Text on orange */
  --on-orange:   #111111;  /* anything sitting on an --orange fill */
}
```

### Palette usage rules

- **Black is the canvas.** Pages start on `--black`; sections rarely deviate.
- **Orange is a weapon, not paint.** Use it for the hero highlight word, primary buttons, the skew stat band, prices, and the section-title accent word. Avoid large orange text blocks except the single skew band.
- **White is for headlines and primary copy only.** Body text steps down to `--text-muted` / `--text-dim` so headlines stay loud.
- **Contrast on orange flips to near-black** (`--on-orange`), never pure white.

---

## 3. Typography

Two cuts of one superfamily: condensed for display, normal for everything else.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@500;700;800&family=Saira:wght@300;400;500&display=swap" rel="stylesheet">
```

```css
:root{
  --font-display: 'Saira Condensed', sans-serif; /* all headings, stats, CTA */
  --font-body:    'Saira', sans-serif;           /* body, nav, labels */
}
body{ font-family: var(--font-body); }
.cond{ font-family: var(--font-display); }  /* utility class for display type */
```

### Type scale

| Role | Family | Weight | Size | Transform / spacing | Line-height |
|------|--------|--------|------|---------------------|-------------|
| Hero H1 | Display | 800 | 96px | UPPERCASE | 0.9 |
| CTA banner H2 | Display | 800 | 64px | UPPERCASE | ~1 |
| Section H2 | Display | 800 | 60px | UPPERCASE | ~1 |
| Stat number | Display | 800 | 62px | none | 1 |
| Card H3 | Display | 700 | 26px | UPPERCASE | ~1.1 |
| Logo | Display | 800 | 28px | UPPERCASE, +1px | 1 |
| Body / hero copy | Body | 300 | 18px | none | 1.6 |
| Card body | Body | 400 | 15px | none | 1.6 |
| Price | Body | 700 | 20px | none | 1 |
| Nav link / label | Body | 500 | 13px | UPPERCASE, +2px | 1 |
| Stat label | Body | 500 | 13px | UPPERCASE, +2px | 1 |

Rule of thumb: **display type is always uppercase** (except raw stat numbers). Body copy is never uppercase except small labels, which get `letter-spacing: 2px`.

---

## 4. Layout

- **Desktop-first.** Body uses `min-width: 1280px; overflow-x: hidden;`. (Add breakpoints later if mobile is needed.)
- **Standard horizontal padding: `64px`** on full-width sections (`nav`, `.hero`, `.svc`, `footer`).
- **Section rhythm:** generous vertical padding (`90px`–`130px`) so the skewed band has room to breathe.
- **Grids:** hero and CTA use `1fr 1fr`; stats use `repeat(4,1fr)`; service cards use `repeat(3,1fr)` with `24px` gap.

```css
body{
  font-family: var(--font-body);
  background: var(--black);
  color: var(--text);
  min-width: 1280px;
  overflow-x: hidden;
}
```

---

## 5. Signature effects

These three moves define the look. Reuse them; do not invent new ones per page.

### 5a. Skewed section band

A full-bleed band rotated with `skewY`, content counter-rotated so it reads straight. Negative margins let it bite into the sections above and below.

```css
.angle{
  background: var(--orange);
  color: var(--on-orange);
  transform: skewY(-3deg);
  margin: -40px 0;        /* overlap neighbours for the "slash" effect */
  padding: 90px 0;
}
.angle .inner{
  transform: skewY(3deg); /* cancel the skew so content is level */
  padding: 0 64px;
}
```

### 5b. Clip-path angled image frame

Images are never plain rectangles. Slice them on a diagonal.

```css
/* Hero image: slants top-left to bottom-right */
.heroframe{
  position: relative; height: 460px; overflow: hidden;
  clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
}
/* Full-bleed CTA image: angled top edge */
.ctaimg{
  position: relative; height: 420px; overflow: hidden;
  clip-path: polygon(0 12%, 100% 0, 100% 100%, 0 100%);
}
.heroframe img, .ctaimg img{ width:100%; height:100%; object-fit:cover; }
```

### 5c. Hover lift

Interactive cards rise on hover. Keep it subtle and fast.

```css
.scard{ transition: .2s; }
.scard:hover{ transform: translateY(-8px); }
```

---

## 6. Components

### 6a. Navigation

```html
<nav>
  <div class="logo">RYNO<i>/</i>DETAILING</div>
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Results</a></li>
    <li><a href="#">Book</a></li>
  </ul>
</nav>
```

```css
nav{ display:flex; justify-content:space-between; align-items:center;
     padding:26px 64px; position:relative; z-index:10; }
.logo{ font-family:var(--font-display); font-weight:800; font-size:28px;
       text-transform:uppercase; letter-spacing:1px; }
.logo i{ color:var(--orange); font-style:normal; }   /* the orange slash */
nav ul{ display:flex; gap:34px; list-style:none; }
nav a{ color:var(--nav-link); text-decoration:none; font-size:13px;
       letter-spacing:2px; text-transform:uppercase; }
nav a:hover{ color:var(--orange); }
```

### 6b. Buttons

Two variants: solid (`.b1`) for the primary action, ghost (`.b2`) for the secondary.

```html
<div class="btns">
  <a href="#" class="b1">Book a Detail</a>
  <a href="#" class="b2">See Results</a>
</div>
```

```css
.btns a{ display:inline-block; text-decoration:none; text-transform:uppercase;
         letter-spacing:2px; font-weight:500; font-size:13px;
         padding:16px 36px; margin-right:14px; }
.b1{ background:var(--orange); color:var(--on-orange); }
.b2{ border:2px solid var(--border); color:var(--text); }
```

Large CTA-banner button (used inside `.ctaimg`):

```css
.ctaimg a{ background:var(--orange); color:var(--on-orange);
           padding:18px 44px; text-decoration:none;
           text-transform:uppercase; letter-spacing:2px; font-weight:600; }
```

### 6c. Hero

Split grid: copy left, angled image right. Highlight one word in `--orange`.

```html
<section class="hero">
  <div>
    <h1 class="cond">Detail that<br><span>hits</span> different.</h1>
    <p>High-octane interior detailing for people who actually drive their cars. Fast, thorough, ruthless on grime.</p>
    <div class="btns">
      <a href="#" class="b1">Book a Detail</a>
      <a href="#" class="b2">See Results</a>
    </div>
  </div>
  <div class="heroframe">
    <img src="/images/dashboard-steering-wheel-center-console-clean-after.jpg" alt="Detailed cockpit">
  </div>
</section>
```

```css
.hero{ position:relative; padding:70px 64px 150px;
       display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:center; }
.hero h1{ font-family:var(--font-display); font-weight:800; font-size:96px;
          line-height:.9; text-transform:uppercase; }
.hero h1 span{ color:var(--orange); }
.hero p{ color:var(--text-muted); font-size:18px; margin:24px 0 34px;
         max-width:440px; line-height:1.6; }
```

### 6d. Skewed stat band

Four stats on the orange slash. See 5a for the skew mechanics.

```html
<section class="angle">
  <div class="inner">
    <div class="stat"><b class="cond">2.5K+</b><span>Cars Detailed</span></div>
    <div class="stat"><b class="cond">4.9&#9733;</b><span>Avg Rating</span></div>
    <div class="stat"><b class="cond">12</b><span>Years Running</span></div>
    <div class="stat"><b class="cond">48h</b><span>Booking Window</span></div>
  </div>
</section>
```

```css
.angle .inner{ display:grid; grid-template-columns:repeat(4,1fr);
               gap:30px; text-align:center; }
.angle .stat b{ font-family:var(--font-display); font-weight:800;
                font-size:62px; display:block; line-height:1; }
.angle .stat span{ text-transform:uppercase; letter-spacing:2px;
                   font-size:13px; font-weight:500; }
```

### 6e. Service cards

Dark surface, orange left rule, price in orange. Title accent word in the section heading is also orange.

```html
<section class="svc">
  <h2 class="cond">The <span>menu</span>.</h2>
  <div class="scards">
    <div class="scard">
      <h3 class="cond">Express Interior</h3>
      <p>Vacuum, wipe-down, glass, and a fast reset for the daily driver.</p>
      <div class="pr">$89</div>
    </div>
    <div class="scard">
      <h3 class="cond">Deep Detail</h3>
      <p>Full extraction, leather conditioning, vents, seams, the works.</p>
      <div class="pr">$179</div>
    </div>
    <div class="scard">
      <h3 class="cond">The Full Send</h3>
      <p>Showroom-grade reset, inside out, nothing left behind.</p>
      <div class="pr">$299</div>
    </div>
  </div>
</section>
```

```css
.svc{ padding:130px 64px 90px; }
.svc h2{ font-family:var(--font-display); font-weight:800; font-size:60px;
         text-transform:uppercase; margin-bottom:46px; }
.svc h2 span{ color:var(--orange); }
.scards{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
.scard{ background:var(--surface); border-left:4px solid var(--orange);
        padding:34px; transition:.2s; }
.scard:hover{ transform:translateY(-8px); }
.scard h3{ font-family:var(--font-display); font-weight:700;
           text-transform:uppercase; font-size:26px; margin-bottom:12px; }
.scard p{ color:var(--text-dim); line-height:1.6; font-size:15px; }
.scard .pr{ color:var(--orange); font-weight:700; margin-top:18px; font-size:20px; }
```

### 6f. Angled CTA image

Full-bleed darkened photo with centered overlay copy and button.

```html
<section class="ctaimg">
  <img src="/images/black-leather-driver-seat-console-clean.jpg" alt="">
  <div class="ov">
    <h2 class="cond">Ready to roll?</h2>
    <a href="#">Reserve Your Slot</a>
  </div>
</section>
```

```css
.ctaimg img{ filter:brightness(.4); }   /* darken so text reads */
.ctaimg .ov{ position:absolute; inset:0; display:flex; flex-direction:column;
             justify-content:center; align-items:center; text-align:center; }
.ctaimg h2{ font-family:var(--font-display); font-weight:800;
            font-size:64px; text-transform:uppercase; }
.ctaimg a{ margin-top:24px; }  /* button styles from 6b */
```

### 6g. Footer

```html
<footer>
  <div>RYNO/DETAILING</div>
  <div>&copy; 2026</div>
</footer>
```

```css
footer{ padding:34px 64px; display:flex; justify-content:space-between;
        color:var(--text-faint); text-transform:uppercase;
        letter-spacing:2px; font-size:13px; }
```

---

## 7. Imagery

- Use real interior detail shots from `website/public/`. Prefer clean "after" frames for hero and CTA.
- Every photo gets either a clip-path frame (5b) or a `brightness(.4)` darken when text sits on top.
- `object-fit: cover` always; never letterbox.
- Faces and plates are not a concern here, but keep shots tight on the work (cockpit, seats, console).

---

## 8. Do / Don't

**Do**
- Keep one orange highlight word per headline.
- Reuse the three signature effects (skew band, clip frames, hover lift).
- Show prices in orange, up front.
- Let black dominate; orange punches.

**Don't**
- Add em dashes to UI copy. Use periods, commas, or colons.
- Set body copy in uppercase (labels only).
- Use orange as a large background outside the single skew band.
- Mix in a third typeface. Saira + Saira Condensed is the whole system.

---

## 9. Minimal starter

Paste-ready shell with tokens, fonts, and the body baseline.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Ryno Detailing</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@500;700;800&family=Saira:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --orange:#ff7314; --black:#101010; --surface:#1a1a1a; --border:#444;
    --text:#fff; --text-muted:#bbb; --text-dim:#aaa; --text-faint:#777;
    --nav-link:#ddd; --on-orange:#111;
    --font-display:'Saira Condensed',sans-serif; --font-body:'Saira',sans-serif;
  }
  *{ margin:0; padding:0; box-sizing:border-box; }
  body{ font-family:var(--font-body); background:var(--black); color:var(--text);
        min-width:1280px; overflow-x:hidden; }
  .cond{ font-family:var(--font-display); }
</style>
</head>
<body>
  <!-- sections from section 6 go here -->
</body>
</html>
```

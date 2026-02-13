# LaneLayer – React site

Builder-first LaneLayer website. Routes: `/` (Home), `/how-it-works`, `/developers`, `/use-cases`. `/tosichain` redirects to `/developers`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Structure

- **Header** – Logo (LaneLayer), nav: Home, How it works, Developers, Use cases, Docs, Discord
- **Home** – Hero (one-sentence + bullets), What is LaneLayer, How it works teaser, Use when you need…, FAQ (What is / is not), Builder CTA
- **How it works** – Bitcoin’s role, Intents, Lanes, laneBTC, Failure/degradation
- **Developers** – Start here checklist, workflow, Docs/Discord/Use cases CTAs
- **Use cases** – Africa-first / constraints-first, when to use LaneLayer
- **Footer** – Platform (Docs, How it works, Use cases), Contact (Book a demo, Discord), Legal, newsletter, social, copyright

## Content checklist (prevent regressions)

Before publishing copy changes:

- [ ] No forbidden phrases: “trustless,” “fully decentralized,” “rollup,” “L2,” “sidechain,” “smart contracts on Bitcoin,” “laneBTC = BTC,” “cryptographic finality,” absolute claims. See [src/content/messaging.md](src/content/messaging.md).
- [ ] One-sentence remembered line and “Built for real use cases…” tone preserved where used.
- [ ] Developer onboarding (Docs, Discord, demo) is prominent.
- [ ] All Tosi/Tosichain/TOSI references removed; consistent “LaneLayer” branding.

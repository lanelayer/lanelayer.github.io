---
layout: default
title: Lane Builder Quest
---

<div class="quest-header">
    <span class="quest-badge">🏆 Discord Quest</span>
    <h1>Lane Builder Quest</h1>
    <p class="quest-subtitle">Build and deploy your first lane to earn the Lane Builder role</p>
</div>

## Overview

Complete this quest to prove your skills and unlock exclusive benefits in the LaneLayer community.

**Reward:** **Lane Builder** Discord role + early access to testnet features

**Time:** ~20 minutes (including the tutorial)

---

## Objectives

Complete all 5 objectives to finish the quest:

<div class="quest-checklist">
    <div class="quest-item">
        <span class="quest-number">1</span>
        <div class="quest-content">
            <h3>Install LaneLayer CLI v0.4.0+</h3>
            <code>npm install -g @lanelayer/cli</code>
            <p>Verify with <code>lane --version</code></p>
        </div>
    </div>
    
    <div class="quest-item">
        <span class="quest-number">2</span>
        <div class="quest-content">
            <h3>Create a Lane Project</h3>
            <code>lane create myapp --template python</code>
            <p>Any name works — make it yours!</p>
        </div>
    </div>
    
    <div class="quest-item">
        <span class="quest-number">3</span>
        <div class="quest-content">
            <h3>Use the K/V API</h3>
            <p>Store and retrieve at least one value using the K/V storage:</p>
            <pre><code>curl -X POST http://localhost:8080/kv/my-key -d "my-value"
curl http://localhost:8080/kv/my-key</code></pre>
        </div>
    </div>
    
    <div class="quest-item">
        <span class="quest-number">4</span>
        <div class="quest-content">
            <h3>Deploy to Fly.io</h3>
            <p>Export and deploy your lane to Fly.io:</p>
            <pre><code>lane export prod ./deployment
fly deploy</code></pre>
        </div>
    </div>
    
    <div class="quest-item">
        <span class="quest-number">5</span>
        <div class="quest-content">
            <h3>Share in #quests</h3>
            <p>Post your proof of completion (see below)</p>
        </div>
    </div>
</div>

---

## Proof of Completion

Post the following in the **#quests** channel on Discord:

### Required Screenshots/Info:

1. **Screenshot of `lane up dev` running** — showing your terminal with the lane running locally

2. **Your Fly.io deployment URL** — e.g., `https://my-lane.fly.dev`

3. **Health check result:**

```bash
curl https://your-app.fly.dev/health
```

### Example Submission:

```
🏆 Lane Builder Quest Complete!

1. Lane running locally: [screenshot]
2. Deployed to: https://my-prediction-lane.fly.dev
3. Health check:
   {"status": "OK", "service": "sample-python", "version": "1.0.0"}

Built a prediction market using the K/V API! 🎉
```

---

## Rewards

<div class="rewards-grid">
    <div class="reward-card">
        <span class="reward-icon">🎖️</span>
        <h3>Lane Builder Role</h3>
        <p>Exclusive Discord role with access to builder channels</p>
    </div>
    
    <div class="reward-card">
        <span class="reward-icon">🚀</span>
        <h3>Early Access</h3>
        <p>First look at testnet features and new CLI releases</p>
    </div>
    
    <div class="reward-card">
        <span class="reward-icon">🌟</span>
        <h3>Community Spotlight</h3>
        <p>Featured in our monthly community highlight</p>
    </div>
</div>

---

## Bonus Challenges

Want to go further? Try these bonus challenges for extra recognition:

| Challenge        | Description                               | Bonus                     |
| ---------------- | ----------------------------------------- | ------------------------- |
| **Custom Logic** | Add a unique endpoint beyond the tutorial | 🌟 Mentioned in spotlight |
| **Frontend**     | Build a simple UI for your lane           | 🌟🌟 Featured project     |
| **Open Source**  | Share your code on GitHub                 | 🌟🌟🌟 Contributor badge  |

---

## Need Help?

- **Tutorial:** [Build Your First Lane](./build-first-lane)
- **CLI Docs:** [GitHub Documentation](https://github.com/lanelayer/cli/tree/main/docs)
- **Discord:** Ask in **#help** channel

---

<div class="page-navigation">
    <a href="./build-first-lane" class="nav-prev">← Back to Tutorial</a>
    <a href="/" class="nav-next">Documentation →</a>
</div>

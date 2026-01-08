---
layout: default
title: Build Your First Lane
---

<div class="tutorial-header">
    <span class="tutorial-badge">🚀 Vibecoder Tutorial</span>
    <h1>Build Your First Lane</h1>
    <p class="tutorial-subtitle">15 minutes to mainnet — Create a stateful prediction market with the K/V API</p>
</div>

## What You'll Build

A **prediction market lane** that lets users make predictions and tracks outcomes — all with persistent state on mainnet. This example demonstrates real-world K/V patterns you'll use in production.

**Features:**

- Submit predictions with stake amounts
- Track prediction outcomes
- Leaderboard of top predictors
- Persistent state across restarts

---

## Prerequisites

Before starting, make sure you have:

- **Docker** installed and running
- **Node.js 18+** installed
- **Fly.io account** (free tier works) — [Sign up here](https://fly.io)

---

## Step 1: Install the CLI

```bash
npm install -g @lanelayer/cli
```

Verify the installation:

```bash
lane
# Should show the CLI help menu with available commands
```

---

## Step 2: Create Your Lane

```bash
lane create predictions --template python
cd predictions
```

This creates a Python-based lane project with:

- `app.py` — Your HTTP server with K/V helpers
- `Dockerfile` — Production-ready container configuration
- `package.json` — Lane configuration

---

## Step 3: Start Development Mode

```bash
lane up dev
```

Your lane is now running at `http://localhost:8080`. The K/V service is automatically provisioned.

> **⚠️ Port 8080 in use?** If you get a port conflict error, stop other containers using port 8080:
>
> ```bash
> docker ps --format "{{.Names}}: {{.Ports}}" | grep 8080
> docker stop <container-name>
> ```
>
> Or use `lane prune --local` to stop all LaneLayer environments.

**Test it's working:**

```bash
curl http://localhost:8080/health
# → {"status": "OK", "service": "sample-python", ...}
```

---

## Step 4: Understanding the K/V API

The K/V API provides simple persistent storage for your lane. Here's the complete reference:

| Method   | Path        | Body                       | Description        |
| -------- | ----------- | -------------------------- | ------------------ |
| `GET`    | `/kv/<key>` | —                          | Read value for key |
| `POST`   | `/kv/<key>` | `application/octet-stream` | Set value for key  |
| `DELETE` | `/kv/<key>` | —                          | Delete key         |

### Key Naming

Keys can include path segments for organization:

```
predictions/2024/btc-100k      # Prediction ID
users/alice/stats              # User statistics
leaderboard/top10              # Aggregated data
```

### Storage Behavior

| Environment    | Persistence                       |
| -------------- | --------------------------------- |
| **Dev/Test**   | Ephemeral (resets on `lane down`) |
| **Production** | Persistent (blockchain-anchored)  |

---

## Step 5: Build the Prediction Market

Now let's build something interesting. Open `app.py` and add these endpoints:

### Add the Prediction Endpoints

First, add `uuid` to your imports at the top of `app.py` (the other imports like `datetime` and `json` are already there):

```python
import uuid
```

Then add these route handlers before `app = web.Application()`:

```python
async def create_prediction(request):
    """
    Create a new prediction.
    POST /predict
    Body: {"question": "Will BTC hit $100k?", "user": "alice", "outcome": true}
    """
    try:
        data = await request.json()
        question = data.get("question")
        user = data.get("user")
        outcome = data.get("outcome")  # true/false prediction

        if not all([question, user, outcome is not None]):
            return web.json_response(
                {"error": "Missing required fields: question, user, outcome"},
                status=400
            )

        # Generate prediction ID
        pred_id = str(uuid.uuid4())[:8]

        # Store the prediction
        prediction = {
            "id": pred_id,
            "question": question,
            "user": user,
            "outcome": outcome,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "resolved": False
        }
        await kv_set(f"predictions/{pred_id}", json.dumps(prediction))

        # Update user's prediction count
        user_stats = await kv_get(f"users/{user}/stats")
        if user_stats:
            stats = json.loads(user_stats.decode())
            stats["total_predictions"] = stats.get("total_predictions", 0) + 1
        else:
            stats = {"total_predictions": 1, "correct": 0, "score": 0}
        await kv_set(f"users/{user}/stats", json.dumps(stats))

        logger.info(f"Created prediction {pred_id} by {user}")

        return web.json_response({
            "status": "ok",
            "prediction_id": pred_id,
            "message": f"Prediction recorded for: {question}"
        })
    except Exception as e:
        logger.exception("Error creating prediction")
        return web.json_response({"error": str(e)}, status=500)


async def get_prediction(request):
    """
    Get a prediction by ID.
    GET /predict/<id>
    """
    pred_id = request.match_info.get("id")

    data = await kv_get(f"predictions/{pred_id}")
    if not data:
        return web.json_response({"error": "Prediction not found"}, status=404)

    prediction = json.loads(data.decode())
    return web.json_response(prediction)


async def resolve_prediction(request):
    """
    Resolve a prediction with the actual outcome.
    POST /predict/<id>/resolve
    Body: {"actual_outcome": true}
    """
    pred_id = request.match_info.get("id")

    try:
        data = await request.json()
        actual_outcome = data.get("actual_outcome")

        if actual_outcome is None:
            return web.json_response(
                {"error": "Missing actual_outcome"},
                status=400
            )

        # Get the prediction
        pred_data = await kv_get(f"predictions/{pred_id}")
        if not pred_data:
            return web.json_response({"error": "Prediction not found"}, status=404)

        prediction = json.loads(pred_data.decode())

        if prediction.get("resolved"):
            return web.json_response({"error": "Already resolved"}, status=400)

        # Check if prediction was correct
        was_correct = prediction["outcome"] == actual_outcome

        # Update prediction
        prediction["resolved"] = True
        prediction["actual_outcome"] = actual_outcome
        prediction["was_correct"] = was_correct
        await kv_set(f"predictions/{pred_id}", json.dumps(prediction))

        # Update user stats
        user = prediction["user"]
        user_stats = await kv_get(f"users/{user}/stats")
        stats = json.loads(user_stats.decode()) if user_stats else {"total_predictions": 0, "correct": 0, "score": 0}

        if was_correct:
            stats["correct"] = stats.get("correct", 0) + 1
            stats["score"] = stats.get("score", 0) + 10  # +10 for correct
        else:
            stats["score"] = stats.get("score", 0) - 5   # -5 for incorrect

        await kv_set(f"users/{user}/stats", json.dumps(stats))

        # Update leaderboard
        await update_leaderboard(user, stats["score"])

        logger.info(f"Resolved prediction {pred_id}: {'correct' if was_correct else 'incorrect'}")

        return web.json_response({
            "status": "ok",
            "was_correct": was_correct,
            "user_score": stats["score"]
        })
    except Exception as e:
        logger.exception("Error resolving prediction")
        return web.json_response({"error": str(e)}, status=500)


async def update_leaderboard(user: str, score: int):
    """Update the leaderboard with user's new score."""
    leaderboard_data = await kv_get("leaderboard")
    if leaderboard_data:
        leaderboard = json.loads(leaderboard_data.decode())
    else:
        leaderboard = []

    # Update or add user
    found = False
    for entry in leaderboard:
        if entry["user"] == user:
            entry["score"] = score
            found = True
            break

    if not found:
        leaderboard.append({"user": user, "score": score})

    # Sort by score descending
    leaderboard.sort(key=lambda x: x["score"], reverse=True)

    # Keep top 10
    leaderboard = leaderboard[:10]

    await kv_set("leaderboard", json.dumps(leaderboard))


async def get_leaderboard(request):
    """
    Get the prediction leaderboard.
    GET /leaderboard
    """
    data = await kv_get("leaderboard")
    if not data:
        return web.json_response([])

    return web.json_response(json.loads(data.decode()))


async def get_user_stats(request):
    """
    Get stats for a specific user.
    GET /users/<name>/stats
    """
    user = request.match_info.get("name")

    data = await kv_get(f"users/{user}/stats")
    if not data:
        return web.json_response({"error": "User not found"}, status=404)

    stats = json.loads(data.decode())
    stats["user"] = user
    return web.json_response(stats)
```

### Register the Routes

Update the route registration near the bottom of `app.py`:

```python
app = web.Application()
app.router.add_get("/health", health)
app.router.add_post("/submit", submit_handler)
app.router.add_post("/predict", create_prediction)
app.router.add_get("/predict/{id}", get_prediction)
app.router.add_post("/predict/{id}/resolve", resolve_prediction)
app.router.add_get("/leaderboard", get_leaderboard)
app.router.add_get("/users/{name}/stats", get_user_stats)
```

---

## Step 6: Test Your Prediction Market

Restart your lane to pick up the changes (use `--force-rebuild` to ensure the container is rebuilt with your code changes):

```bash
lane down && lane up dev --force-rebuild
```

**Create some predictions:**

```bash
# Alice predicts BTC will hit $100k
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{"question": "BTC hits $100k by Q2 2025?", "user": "alice", "outcome": true}'
# → {"status": "ok", "prediction_id": "a1b2c3d4", ...}

# Bob predicts it won't
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{"question": "BTC hits $100k by Q2 2025?", "user": "bob", "outcome": false}'

# Charlie agrees with Alice
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{"question": "ETH flips BTC market cap?", "user": "charlie", "outcome": true}'
```

**Resolve a prediction:**

```bash
# BTC did hit $100k! Alice was right
curl -X POST http://localhost:8080/predict/a1b2c3d4/resolve \
  -H "Content-Type: application/json" \
  -d '{"actual_outcome": true}'
# → {"status": "ok", "was_correct": true, "user_score": 10}
```

**Check the leaderboard:**

```bash
curl http://localhost:8080/leaderboard
# → [{"user": "alice", "score": 10}, ...]
```

**View user stats:**

```bash
curl http://localhost:8080/users/alice/stats
# → {"total_predictions": 1, "correct": 1, "score": 10, "user": "alice"}
```

---

## Step 7: Deploy to Fly.io

Now let's deploy your lane to production on Fly.io.

### Export Production Build

```bash
lane export prod ./deployment
```

This creates a production-ready container in the `./deployment` directory.

### Create fly.toml

Create a `fly.toml` file in your project root:

```toml
app = "my-prediction-lane"
primary_region = "iad"

[build]
  dockerfile = "deployment/Dockerfile"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

### Deploy to Fly.io

```bash
# Login to Fly.io (first time only)
fly auth login

# Launch the app
fly launch --name my-prediction-lane --no-deploy

# Deploy
fly deploy
```

### Verify Deployment

```bash
# Health check
curl https://my-prediction-lane.fly.dev/health
# → {"status": "OK", ...}

# Your prediction market is now live!
curl -X POST https://my-prediction-lane.fly.dev/predict \
  -H "Content-Type: application/json" \
  -d '{"question": "LaneLayer launches on mainnet?", "user": "you", "outcome": true}'
```

---

## Python K/V Helper Reference

The sample app includes these ready-to-use helpers:

```python
from app import kv_get, kv_set, kv_delete

# Store any data
await kv_set("users/alice/balance", "1000")

# Read data (returns bytes or None)
balance = await kv_get("users/alice/balance")
if balance:
    print(int(balance.decode()))  # 1000

# Delete data
await kv_delete("users/alice/balance")

# Store structured data
import json
await kv_set("config", json.dumps({"version": 1, "enabled": True}))
config = json.loads((await kv_get("config")).decode())
```

---

## Next Steps

🎉 **Congratulations!** You've built and deployed your first lane to mainnet.

<div class="next-steps">
    <div class="next-step">
        <h3>🏆 Complete the Quest</h3>
        <p>Join our Discord and complete the Lane Builder Quest to earn the Lane Builder role.</p>
        <a href="./quest-first-lane">→ View Quest Details</a>
    </div>
    <div class="next-step">
        <h3>📚 Learn More</h3>
        <p>Explore webhooks, intent payments, and advanced patterns.</p>
        <a href="https://github.com/lanelayer/cli/tree/main/docs">→ CLI Documentation</a>
    </div>
    <div class="next-step">
        <h3>🔗 Connect to Core Lane</h3>
        <p>Learn how to verify payments and interact with the Bitcoin layer.</p>
        <a href="/">→ Core Lane Integration</a>
    </div>
</div>

---

<div class="page-navigation">
    <a href="/" class="nav-prev">← Back to Home</a>
    <a href="./quest-first-lane" class="nav-next">Lane Builder Quest →</a>
</div>

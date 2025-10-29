---
layout: default
title: LaneBTC
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ site.title }} - {{ page.title }}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=3">
    <link rel="alternate icon" href="/favicon.ico">
    <link rel="stylesheet" href="/assets/css/style.css?v=27">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #ff5600;
            --background: #ffffff;
            --surface: #f8f9fa;
            --text-primary: #1a1a1a;
            --text-secondary: #6b7280;
            --border-color: #e5e7eb;
            --code-bg: #f3f4f6;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--background);
        }

        .header {
            background: var(--background);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .logo {
            text-decoration: none;
            color: var(--text-primary);
        }

        .logo-text {
            font-size: 1.25rem;
            font-weight: 600;
        }

        .header-utils {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .version-selector {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: var(--surface);
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
        }

        .external-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            color: var(--text-secondary);
            font-weight: 500;
            transition: color 0.2s;
        }

        .external-link:hover {
            color: var(--primary-color);
        }

        .search-box {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: var(--surface);
            border-radius: 6px;
            border: 1px solid var(--border-color);
        }

        .search-input {
            border: none;
            background: transparent;
            outline: none;
            font-family: inherit;
            font-size: 0.875rem;
            width: 150px;
        }

        .header-nav {
            display: flex;
            gap: 2rem;
        }

        .nav-link {
            text-decoration: none;
            color: var(--text-secondary);
            font-weight: 500;
            transition: color 0.2s;
        }

        .nav-link:hover,
        .nav-link.active {
            color: var(--primary-color);
        }

        .main-layout {
            display: grid;
            grid-template-columns: 250px 1fr;
            max-width: 1400px;
            margin: 0 auto;
        }

        .sidebar {
            border-right: 1px solid var(--border-color);
            padding: 2rem 1rem;
            position: sticky;
            top: 80px;
            height: calc(100vh - 80px);
            overflow-y: auto;
        }

        .sidebar-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .sidebar-nav {
            list-style: none;
        }

        .sidebar-nav li {
            margin-bottom: 0.5rem;
        }

        .sidebar-link {
            text-decoration: none;
            color: var(--text-secondary);
            font-size: 0.9rem;
            transition: color 0.2s;
            display: block;
            padding: 0.25rem 0;
        }

        .sidebar-link:hover,
        .sidebar-link.active {
            color: var(--primary-color);
        }

        .main-content {
            padding: 3rem 4rem;
        }

        .content-wrapper h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: var(--text-primary);
        }

        .content-wrapper h2 {
            font-size: 1.75rem;
            font-weight: 600;
            margin-top: 3rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }

        .content-wrapper h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: var(--text-primary);
        }

        .content-wrapper p {
            color: var(--text-secondary);
            line-height: 1.8;
            margin-bottom: 1.25rem;
        }

        .content-wrapper strong {
            color: var(--text-primary);
            font-weight: 600;
        }

        .content-wrapper ul {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
        }

        .content-wrapper li {
            color: var(--text-secondary);
            line-height: 1.8;
            margin-bottom: 0.5rem;
        }

        .term-entry {
            margin-bottom: 2rem;
        }

        .term-entry strong {
            font-size: 1.1rem;
            display: block;
            margin-bottom: 0.5rem;
        }

        .highlight-box {
            background: var(--surface);
            border-left: 3px solid var(--primary-color);
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 6px;
        }

        .highlight-box p {
            margin-bottom: 0.75rem;
        }

        .highlight-box p:last-child {
            margin-bottom: 0;
        }

        .scenario-box {
            background: var(--code-bg);
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 6px;
            border: 1px solid var(--border-color);
        }

        .scenario-box h4 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 1rem;
        }

        .scenario-box ul {
            margin-top: 0.5rem;
            margin-bottom: 0;
        }

        .page-navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
        }

        .page-navigation .nav-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: var(--surface);
            border-radius: 6px;
            text-decoration: none;
            color: var(--text-secondary);
            font-weight: 500;
            transition: all 0.2s;
            border: 1px solid var(--border-color);
        }

        .page-navigation .nav-link:hover {
            color: var(--primary-color);
            border-color: var(--primary-color);
        }

        .nav-previous {
            margin-right: auto;
        }

        .nav-next {
            margin-left: auto;
        }

        .footer {
            background: var(--surface);
            border-top: 1px solid var(--border-color);
            padding: 2rem;
            margin-top: 4rem;
        }

        .footer-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer-logo {
            font-weight: 600;
            color: var(--text-primary);
            text-decoration: none;
        }

        .footer-copyright {
            color: var(--text-secondary);
            margin-top: 0.5rem;
            font-size: 0.875rem;
        }

        .footer-links {
            display: flex;
            gap: 2rem;
        }

        .footer-link {
            color: var(--text-secondary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: color 0.2s;
            font-size: 0.875rem;
        }

        .footer-link:hover {
            color: var(--primary-color);
        }

        @media (max-width: 1024px) {
            .main-layout {
                grid-template-columns: 1fr;
            }

            .sidebar {
                display: none;
            }

            .main-content {
                padding: 2rem;
            }

            .header-utils {
                display: none;
            }
        }

        @media (max-width: 768px) {
            .header-nav {
                gap: 1rem;
                font-size: 0.875rem;
            }

            .content-wrapper h1 {
                font-size: 2rem;
            }

            .footer-container {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }

            .page-navigation {
                flex-direction: column;
                gap: 1rem;
            }

            .nav-previous,
            .nav-next {
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-container">
            <div class="header-left">
                <a href="/" class="logo">
                    <span class="logo-text">LaneLayer</span>
                </a>

                <div class="header-utils">
                    <div class="version-selector">
                        <span>v1.0</span>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <a href="https://github.com/lanelayer" class="external-link" target="_blank">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span class="github-text">GitHub</span>
                    </a>
                    <div class="search-box" id="searchBox">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input type="text" placeholder="Search" class="search-input" id="searchInput">
                    </div>
                </div>
            </div>

            <nav class="header-nav" id="headerNav">
                <a href="/" class="nav-link">Documentation</a>
                <a href="/terminology.html" class="nav-link">Terminology</a>
                <a href="/riscv-intent.html" class="nav-link">RISC-V Intent</a>
                <a href="/lanebtc.html" class="nav-link{% if page.url == '/lanebtc.html' %} active{% endif %}">LaneBTC</a>
            </nav>
        </div>
    </header>

    <div class="main-layout">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-content">
                <div class="sidebar-section">
                    <h3 class="sidebar-title">Documentation</h3>
                    <ul class="sidebar-nav">
                        <li><a href="/" class="sidebar-link">Home</a></li>
                        <li><a href="/terminology.html" class="sidebar-link">Terminology</a></li>
                        <li><a href="/riscv-intent.html" class="sidebar-link">RISC-V Intent</a></li>
                        <li><a href="/lanebtc.html" class="sidebar-link">LaneBTC</a></li>
                    </ul>
                </div>
            </div>
        </aside>

        <main class="main-content">
            <div class="content-wrapper">
                <h1>The LaneBTC-BTC Peg</h1>
                
                <div class="highlight-box">
                    <p>LaneBTC maintains near 1:1 parity with Bitcoin, not by custody or governance, but through economic symmetry and open-market incentives.</p>
                    <p>The peg persists because every participant in the LaneLayer has a financial motive to keep LaneBTC's value close to BTC. It is also always cheaper to arbitrage away a deviation than to sustain it - rational profit seeking rather than design!</p>
                </div>

                <p>Our LaneBTC-BTC peg works due to the following key factors:</p>

                <h2>1. Two-Asset Symmetry</h2>
                
                <p>LaneBTC exists as a Bitcoin-anchored twin asset. There are only two real assets in the system:</p>
                
                <ul>
                    <li><strong>BTC on the Bitcoin network</strong>, and</li>
                    <li><strong>LaneBTC on LaneLayer</strong>, its verifiable 1:1 counterpart.</li>
                </ul>

                <p>Every new LaneBTC originates from a provable Bitcoin transaction - a burn that deterministically mints its equivalent on-lane. No one can mint LaneBTC arbitrarily; every token maps to real BTC visible on-chain as having become unspendable.</p>

                <p>Solvers may temporarily front LaneBTC from existing float backed by prior burns, but the aggregate supply across the system always remains economically anchored to Bitcoin burns.</p>

                <p>This symmetry ensures that the total LaneBTC in existence always has a direct economic link to real BTC - giving the market a solid foundation for arbitrage whenever there's a price deviation from BTC.</p>

                <h2>2. Solvers and Fillers as Market Makers</h2>

                <p>Two key participants sustain liquidity and keep parity tight:</p>

                <ul>
                    <li><strong>Solver</strong> — short LaneBTC, long BTC; wants LaneBTC ≈ BTC so rebalancing float is loss-free.</li>
                    <li><strong>Filler</strong> — long LaneBTC, short BTC; wants LaneBTC ≈ BTC to avoid losses on BTC payouts.</li>
                </ul>

                <p>Solvers provide LaneBTC to users in exchange for BTC (peg-in), while fillers accept LaneBTC from users in exchange for BTC (peg-out).</p>

                <p>Their opposing exposures resemble buyers and sellers in a foreign-exchange market — each side is motivated to quote prices near 1 BTC to protect inventory value.</p>

                <h2>3. Arbitrage: The Self-Correcting Mechanism</h2>

                <div class="scenario-box">
                    <h4>When LaneBTC &lt; BTC:</h4>
                    <ul>
                        <li><strong>Fillers buy discounted LaneBTC</strong>: Fillers notice that LaneBTC is trading at a discount to BTC. They buy LaneBTC at the lower price.</li>
                        <li><strong>Filling Exit</strong>: Fillers provide liquidity to users by buying LaneBTC from them in exchange for BTC.</li>
                        <li><strong>Resell for profit</strong>: Fillers can later resell the LaneBTC at a higher parity or to solvers needing float, earning the spread.</li>
                        <li><strong>Price rises</strong>: As fillers buy LaneBTC, the demand increases, causing the price of LaneBTC to rise.</li>
                    </ul>
                </div>

                <div class="scenario-box">
                    <h4>When LaneBTC &gt; BTC:</h4>
                    <ul>
                        <li><strong>Solvers mint or release LaneBTC</strong>: Solvers notice that LaneBTC is trading at a premium to BTC. They mint new LaneBTC by burning BTC.</li>
                        <li><strong>Sell at premium</strong>: Solvers sell the LaneBTC at the higher market price.</li>
                        <li><strong>Price falls</strong>: As solvers sell LaneBTC, the supply increases, causing the price of LaneBTC to fall.</li>
                    </ul>
                </div>

                <p>This self-interest loop continually corrects deviations (the larger the deviation, the stronger the arbitrage incentive-pulling prices back to parity). No governance vote or oracle is needed — just open access and verifiable Bitcoin settlement.</p>

                <p>This creates a live, self-balancing market where LaneBTC naturally tracks BTC at parity, without any external stabilizer or discretionary intervention.</p>

                <h2>4. Bitcoin Finality: The Anchor</h2>

                <p>Every burn, transfer, and filler exit settles on Bitcoin; ensuring provable supply, no custodial risk, and immutable accounting. This means all supply operations are verifiable Bitcoin transactions or deterministic on-lane events, making it impossible for any single person or custodian to mint or freeze supply, and ensuring all burns are auditable. As a result, parity is backed by Bitcoin's own trust model, allowing for independent arbitrage without any governance dependency.</p>

                <h2>5. Intuition: "Offshore Bitcoin"</h2>

                <p>LaneBTC functions like offshore BTC — faster and programmable, but always economically tethered to Bitcoin. If its price slips, traders step in because it's cheaper to arbitrage the gap than to tolerate it.</p>

                <p>Just as eurodollars maintain parity with USD through market liquidity and settlement convertibility, LaneBTC maintains parity with Bitcoin through solver and filler arbitrage.</p>

                <p><strong>It's Bitcoin liquidity, unbound from Bitcoin's block time.</strong></p>

                <div class="page-navigation">
                    <div class="nav-previous">
                        <a href="/terminology.html" class="nav-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m15 18-6-6 6-6"/>
                            </svg>
                            <span>Terminology</span>
                        </a>
                    </div>
                    <div class="nav-next">
                        <a href="/" class="nav-link">
                            <span>Home</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m9 18 6-6-6-6"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <footer class="footer">
        <div class="footer-container">
            <div class="footer-left">
                <a href="/" class="footer-logo">LaneLayer</a>
                <p class="footer-copyright">©2025 LaneLayer</p>
            </div>
            <div class="footer-right">
                <div class="footer-links">
                    <div class="footer-column">
                        <a href="https://github.com/lanelayer" target="_blank" class="footer-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                        </a>
                        <a href="/terminology.html" class="footer-link">Terminology</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Search functionality
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('searchInput');
            const searchBox = document.getElementById('searchBox');
            let originalContent = null;

            // Focus search on K key press
            document.addEventListener('keydown', function(e) {
                if (e.key === 'k' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    searchInput.focus();
                }
            });

            // Store original content on first search
            function storeOriginalContent() {
                if (!originalContent) {
                    const content = document.querySelector('.main-content');
                    if (content) {
                        originalContent = content.innerHTML;
                    }
                }
            }

            // Search function
            function performSearch(query) {
                const content = document.querySelector('.main-content');

                if (!content) return;

                storeOriginalContent();

                if (query.length === 0) {
                    if (originalContent) {
                        content.innerHTML = originalContent;
                    }
                    return;
                }

                const searchWords = query.split(/\s+/).filter(word => word.length > 0).map(word => word.toLowerCase());
                const elements = content.querySelectorAll('h1, h2, h3, h4, p, li, div.highlight-box, div.scenario-box, div.page-navigation');
                let hasMatches = false;

                elements.forEach(element => {
                    const text = element.textContent.toLowerCase();
                    const matches = searchWords.every(word => {
                        const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                        return wordRegex.test(text);
                    });

                    if (matches) {
                        element.style.display = '';
                        element.style.backgroundColor = 'rgba(255, 86, 0, 0.1)';
                        hasMatches = true;
                    } else {
                        element.style.display = 'none';
                    }
                });

                const noResults = document.getElementById('no-results');
                if (noResults) {
                    noResults.remove();
                }

                if (!hasMatches) {
                    const noResultsDiv = document.createElement('div');
                    noResultsDiv.id = 'no-results';
                    noResultsDiv.style.cssText = `
                        text-align: center;
                        padding: 2rem;
                        color: var(--text-secondary);
                        font-style: italic;
                    `;
                    noResultsDiv.textContent = `No results found for "${query}"`;
                    content.appendChild(noResultsDiv);
                }
            }

            searchInput.addEventListener('input', function(e) {
                const query = e.target.value.toLowerCase().trim();
                performSearch(query);
            });

            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = e.target.value.toLowerCase().trim();
                    performSearch(query);
                } else if (e.key === 'Escape') {
                    e.target.value = '';
                    e.target.blur();
                    const content = document.querySelector('.main-content');
                    if (originalContent && content) {
                        content.innerHTML = originalContent;
                    }
                }
            });

            document.addEventListener('click', function(e) {
                if (!searchBox.contains(e.target)) {
                    searchInput.value = '';
                    const content = document.querySelector('.main-content');
                    if (originalContent && content) {
                        content.innerHTML = originalContent;
                    }
                }
            });
        });
    </script>
</body>
</html>

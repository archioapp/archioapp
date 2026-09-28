# Draft response to QClay

**Subject: ARCHIO — API, infrastructure, and AI architecture clarifications**

Hi QClay team,

Thank you — these are exactly the right questions to lock before finalizing the architecture and estimate. We've reviewed the current codebase against all three and clarified the MVP boundary. Our answers are below.

### 1. External APIs and services

Several core services are already selected and integrated in the existing codebase:

- **Supabase** for Postgres data storage, authentication, sessions, and Row Level Security
- **Polygon.io** as the primary market-data provider, with Alpha Vantage / Finnhub fallback paths
- **TradingView** for charting
- **Vercel AI Gateway** for hosted foundation-model access (currently OpenAI; model routing can remain provider-flexible)
- **Stripe** for payments and subscriptions

The major integration area still to finalize is **trade-data ingestion**. For the MVP, we have chosen **CSV import plus read-only broker/exchange API connections** for Forex, Crypto, and CFD. The first likely sources are MT4/MT5, cTrader, TradeLocker, Binance, Bybit, and Coinbase, with an agreed priority order to be finalized during technical design. ARCHIO will normalize all sources into one canonical trade schema.

Live trade execution is deliberately outside the MVP. The first release is an intelligence and record platform: it imports what users already traded, stores it securely, and uses that data to power journaling, analytics, AI assistance, and verified records. ARCHIO will not place orders or hold customer funds in the MVP.

### 2. Hosting, infrastructure, and data region

Our decision is **US-first infrastructure with a region-aware architecture**.

The existing application uses Vercel for the Next.js application/API layer and Supabase for Postgres and authentication. The initial production database and application data will be hosted in the US for the first paid release. We want the data model, identity boundaries, and deployment configuration designed so that a separate EU deployment can be added later without rewriting the product.

We are not proposing simultaneous US and EU data planes for the MVP because the required regional routing, separate storage/backups, support/analytics boundaries, and operational duplication would materially increase complexity before product-market validation. We would like QClay to confirm the recommended US region and review the proposed region-aware boundaries. Legal counsel will confirm the final data-residency, retention, and deletion requirements before an EU launch.

For the MVP, ARCHIO's legal posture is **software-only**: tools, records, AI assistance, simulation, communities, and analytics. It will not provide custody, brokerage, live execution, or personalized investment advice.

### 3. AI design, models, and providers

We are **not planning to train proprietary foundation models**. We will use hosted models through Vercel AI Gateway, which lets the application route to OpenAI, Anthropic, or other supported providers per feature without coupling the architecture to one vendor. The existing response engine currently uses OpenAI through the Gateway.

The proprietary AI work is the **grounding and orchestration layer**, not base-model training:

1. deterministically route the user's request to the correct ARCHIO domain and response type;
2. retrieve authorized user data and relevant live market data;
3. provide that data to the model as the only permitted factual grounding;
4. enforce structured output contracts and explicit no-fabrication rules; and
5. render the structured result through the appropriate product interface.

This architecture is already scaffolded in the current codebase. The existing AI endpoint routes prompts, retrieves real Polygon market data, applies strict "never invent numbers" instructions, and streams structured responses. The primary remaining dependency is the canonical trade-data pipeline: a secure `trades` schema, CSV/read-only ingestion, normalization, and replacement of the current demo journal grounding with each authenticated user's real trades.

### Proposed next technical step

We suggest a focused architecture session to confirm:

1. the canonical trade schema and import priority;
2. the US production region and future EU boundary;
3. the crypto market-data provider;
4. security controls for broker credentials, statements, and verified records; and
5. a phased estimate beginning with trade ingestion and real-data AI grounding.

We would value QClay's review of these choices, particularly the security, compliance, and operational assumptions. We see the existing code as a strong product and architecture scaffold, while expecting QClay's team to provide the final production-grade review and implementation accountability.

Best,
ARCHIO team

---

## Internal note — do not send below this line

**What we can prove from the code:** Supabase auth/database patterns, RLS schemas, ~35 API routes, Polygon integration, market fallbacks, Stripe routes/webhook, AI Gateway structured response engine and market grounding.

**What we must not overclaim:** production scale, live broker sync, real user trade grounding, EU data plane, execution, audited compliance, or completed security review.

**Recommended meeting posture:** collaborative, not adversarial. QClay's questions are valid. We are giving them concrete constraints so they can stop estimating an undefined platform.

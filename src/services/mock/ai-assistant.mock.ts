import type {
  AiAssistantService,
  AiCreditsStatus,
  CampaignStrategy,
  GenerateCopyInput,
  GeneratedCopyOutput,
  GenerateSubjectLinesInput,
  GenerateStrategyInput,
  RewriteInput,
  RewriteOutput,
  SubjectLineVariation,
} from "../api/ai-assistant.service";

let creditsState: AiCreditsStatus = {
  totalTokensAllowed: 50000,
  tokensUsed: 8740,
  tokensRemaining: 41260,
  monthlyResetDate: "2026-10-01T00:00:00Z",
  activeModel: "gemini-1.5-pro",
  generationsCountToday: 19,
};

let recentGenerations: GeneratedCopyOutput[] = [
  {
    id: "gen-1",
    channel: "email",
    goal: "welcome",
    tone: "friendly",
    headline: "Welcome to OmniFlow AI — Let's Skyrocket Your Conversions",
    subjectLine: "Welcome aboard! Here are 3 quick wins to start today 🚀",
    previewText: "Your 14-day full access pass is unlocked. Let's get your first campaign live in 5 minutes.",
    body: `Hi {{firstName}},

Welcome to the OmniFlow family! We're thrilled to have you with us.

Over 12,000 top marketing teams rely on OmniFlow to coordinate email broadcasts, WhatsApp concierge messages, and high-CTR SMS flash alerts from a single command center.

Here is your 3-step quick start roadmap:
1. 🔗 Connect your sender domain (takes under 2 minutes).
2. 👥 Import your audience segment or sync your CRM contacts.
3. ⚡ Launch your first automated welcome workflow.

Click below to claim your personalized onboarding walkthrough:`,
    suggestedCtas: ["Launch My First Campaign", "Schedule 1-on-1 Concierge Onboarding", "Explore Template Library"],
    tokensUsed: 420,
    estimatedReadTimeSec: 45,
    createdAt: "2026-09-24T10:15:00Z",
  },
  {
    id: "gen-2",
    channel: "whatsapp",
    goal: "promotional",
    tone: "urgent",
    headline: "⚡ Flash VIP Unlock: 40% Off Ends Tonight",
    body: `Hey {{firstName}}! 👋

Quick heads-up from the OmniFlow team: Your exclusive VIP discount of *40% OFF Enterprise Annual* expires in exactly *6 hours*.

🔥 *What you unlock today:*
• Unlimited WhatsApp Meta Cloud API dispatches
• Intelligent Multi-channel automated journeys
• Dedicated IP pools with 99.8% inbox placement

Ready to lock in the lowest rate of the year?`,
    suggestedCtas: ["Claim 40% Off Now", "Chat with Enterprise Rep", "Remind Me in 2 Hours"],
    tokensUsed: 310,
    estimatedReadTimeSec: 25,
    createdAt: "2026-09-23T18:40:00Z",
  },
  {
    id: "gen-3",
    channel: "sms",
    goal: "abandoned_cart",
    tone: "persuasive",
    headline: "Cart Recovery SMS",
    body: `OmniFlow: Hey {{firstName}}, you left items in your cart! Complete checkout in 2 hrs with code CART15 for 15% off: omni.co/c/{{cartId}} Reply STOP to opt out`,
    suggestedCtas: ["Complete Checkout (15% OFF)"],
    tokensUsed: 110,
    estimatedReadTimeSec: 8,
    createdAt: "2026-09-22T14:10:00Z",
  },
];

export class MockAiAssistantService implements AiAssistantService {
  async getAiCredits(): Promise<AiCreditsStatus> {
    await new Promise((r) => setTimeout(r, 120));
    return { ...creditsState };
  }

  async generateCopy(input: GenerateCopyInput): Promise<GeneratedCopyOutput> {
    await new Promise((r) => setTimeout(r, 600));

    const tokensConsumed = input.channel === "sms" ? 115 : input.channel === "whatsapp" ? 280 : 440;
    creditsState.tokensUsed += tokensConsumed;
    creditsState.tokensRemaining = Math.max(0, creditsState.tokensRemaining - tokensConsumed);
    creditsState.generationsCountToday += 1;

    let headline = "";
    let subjectLine: string | undefined;
    let previewText: string | undefined;
    let body = "";
    let suggestedCtas: string[] = [];
    let readTime = 30;

    const offerSnippet = input.discountOffer ? ` with ${input.discountOffer}` : "";
    const pName = input.productName || "our premier solution";
    const benefits = input.keyBenefits || "boosting engagement, accelerating response rates, and automating repeat sales";

    if (input.channel === "email") {
      subjectLine = `⚡ Elevate your results: Introducing ${pName}${offerSnippet}`;
      previewText = `Discover how ${pName} delivers ${benefits.slice(0, 80)}...`;
      headline = `Transform How You Connect With Your Customers`;
      body = `Hi {{firstName}},

If you've been looking for an unfair advantage in your market, this was built specifically for you.

We are excited to unveil ${pName} — engineered from the ground up to empower your team to achieve extraordinary results.

Here is what you get immediately:
• 🚀 ${benefits.split(",")[0] || "10x Faster campaign execution"}
• 🎯 ${benefits.split(",")[1] || "Guaranteed higher engagement and deliverability"}
• 📊 Real-time telemetry and full ROI attribution

${input.discountOffer ? `Special Offer: Use code ${input.discountOffer} to claim your exclusive perk before midnight Sunday.\n\n` : ""}Ready to see what's possible?`;
      suggestedCtas = [input.ctaLabel || "Get Started Today", "Explore Live Demo", "Talk to Sales Specialist"];
      readTime = 55;
    } else if (input.channel === "whatsapp") {
      headline = `Exclusive Access: ${pName}`;
      body = `Hey {{firstName}}! ✨

Great news: *${pName}* is now officially unlocked for your account${offerSnippet}!

Here is why leading teams are making the switch:
✅ *High Impact*: ${benefits}
✅ *Zero Friction*: Native omnichannel integration in under 5 minutes
✅ *Guaranteed ROI*: 24/7 dedicated support team

${input.discountOffer ? `🎁 *Special VIP Perk*: ${input.discountOffer}\n\n` : ""}Tap below to activate your access directly from WhatsApp:`;
      suggestedCtas = [input.ctaLabel || "Activate Access", "Ask a Question", "View Case Studies"];
      readTime = 25;
    } else if (input.channel === "sms") {
      headline = `Direct SMS Broadcast`;
      const offerTxt = input.discountOffer ? ` Use code ${input.discountOffer}` : "";
      body = `OmniFlow: Hey {{firstName}}, ${pName} is live! Enjoy ${benefits.slice(0, 50)}.${offerTxt}. Claim now: omni.co/x Reply STOP to opt-out.`;
      suggestedCtas = [input.ctaLabel || "Claim Offer Now"];
      readTime = 10;
    } else {
      // Social / Ad copy
      headline = `Stop Leaving Conversions on the Table`;
      body = `Ready to scale your business with ${pName}? 📈

${benefits}

${input.discountOffer ? `🔥 Limited time: ${input.discountOffer} for early adopters!\n\n` : ""}Join over 10,000+ businesses accelerating growth today. 👇

#MarketingAutomation #GrowthHacking #${pName.replace(/\s+/g, "")} #Omnichannel`;
      suggestedCtas = [input.ctaLabel || "Sign Up Free", "Learn More"];
      readTime = 35;
    }

    const output: GeneratedCopyOutput = {
      id: `gen-${Date.now()}`,
      channel: input.channel,
      goal: input.goal,
      tone: input.tone,
      headline,
      subjectLine,
      previewText,
      body,
      suggestedCtas,
      tokensUsed: tokensConsumed,
      estimatedReadTimeSec: readTime,
      createdAt: new Date().toISOString(),
    };

    recentGenerations.unshift(output);
    return output;
  }

  async generateSubjectLines(input: GenerateSubjectLinesInput): Promise<SubjectLineVariation[]> {
    await new Promise((r) => setTimeout(r, 450));

    const topic = input.topic || "Exclusive VIP Update";
    const product = input.productOrOffer || "our special offer";

    creditsState.tokensUsed += 150;
    creditsState.tokensRemaining = Math.max(0, creditsState.tokensRemaining - 150);

    const variations: SubjectLineVariation[] = [
      {
        id: `sub-1-${Date.now()}`,
        hookAngle: "curiosity",
        hookLabel: "Curiosity Gap",
        subjectLine: `The single biggest mistake marketers make with ${topic}`,
        previewText: `Most teams overlook this key strategy until it's too late. Here is the fix...`,
        predictedCtrPct: 96.4,
        explanation: "Triggers strong cognitive curiosity gap, compelling the reader to open to verify their approach.",
      },
      {
        id: `sub-2-${Date.now()}`,
        hookAngle: "fomo_urgency",
        hookLabel: "FOMO / Urgency",
        subjectLine: `⚡ 12 hours left: ${product} is disappearing tonight`,
        previewText: `Don't miss out on the biggest upgrade package we've ever released.`,
        predictedCtrPct: 93.8,
        explanation: "High urgency trigger combined with loss aversion; historically delivers highest immediate click velocity.",
      },
      {
        id: `sub-3-${Date.now()}`,
        hookAngle: "benefit_driven",
        hookLabel: "Benefit-Driven",
        subjectLine: `How to 3x your ${topic} conversion rates with ${product}`,
        previewText: `Step-by-step framework inside, tested on 500,000+ customer touchpoints.`,
        predictedCtrPct: 91.2,
        explanation: "Clear, quantifiable value proposition that sets concrete expectations of positive ROI.",
      },
      {
        id: `sub-4-${Date.now()}`,
        hookAngle: "direct_question",
        hookLabel: "Direct Question",
        subjectLine: `Are you still struggling with ${topic}, {{firstName}}?`,
        previewText: `We analyzed 250 campaigns and noticed an interesting trend...`,
        predictedCtrPct: 89.5,
        explanation: "Personalized inquiry prompts an internal dialogue that increases open affinity.",
      },
      {
        id: `sub-5-${Date.now()}`,
        hookAngle: "personal_story",
        hookLabel: "Personal Story",
        subjectLine: `Why we almost abandoned ${topic} (and what saved us)`,
        previewText: `A candid behind-the-scenes look at the breakthrough that changed everything.`,
        predictedCtrPct: 88.1,
        explanation: "Vulnerability and storytelling build authentic rapport and decrease commercial resistance.",
      },
    ];

    return variations;
  }

  async rewriteCopy(input: RewriteInput): Promise<RewriteOutput> {
    await new Promise((r) => setTimeout(r, 400));

    const originalText = input.originalText.trim();
    creditsState.tokensUsed += 95;
    creditsState.tokensRemaining = Math.max(0, creditsState.tokensRemaining - 95);

    let rewritten = "";
    let summary = "";

    switch (input.mode) {
      case "sms_shorten":
        rewritten = `OmniFlow Alert: ${originalText.slice(0, 95)}... Act now: omni.co/x Reply STOP to opt out.`;
        if (rewritten.length > 158) {
          rewritten = rewritten.slice(0, 155) + "...";
        }
        summary = `Compressed copy to ${rewritten.length} characters (1 GSM-7 SMS segment). Added punchy CTA and STOP compliance.`;
        break;

      case "whatsapp_emojis":
        rewritten = `🔥 *Important Update from OmniFlow* 🔥\n\nHey {{firstName}}! 👋\n\n${originalText}\n\n✨ *Key Highlights:*\n• ⚡ Lightning-fast setup\n• 🎯 High engagement & open rates\n• 🎁 Exclusive VIP perks\n\n👇 Tap below to get started now!`;
        summary = "Injected WhatsApp markdown (*bold* formatting, bulleted perks) and contextual high-engagement emojis.";
        break;

      case "persuasive":
        rewritten = `Don't let another day slip by without taking action.\n\n${originalText}\n\nTime is critical — every moment you delay is revenue left on the table. Secure your advantage now before the current window closes permanently.`;
        summary = "Amplified urgency, sharpened active verbs, and reinforced the cost of inaction.";
        break;

      case "executive":
        rewritten = `Executive Briefing:\n\nOur recent telemetry indicates a strategic opportunity regarding your communication operations:\n\n${originalText}\n\nWe welcome an executive discussion to review the quantifiable business impact and implementation roadmap for your enterprise.`;
        summary = "Refined tone to authoritative C-suite prose with professional terminology and ROI focus.";
        break;

      case "casual":
      default:
        rewritten = `Hey there! 😊 Just wanted to drop a quick line about this:\n\n${originalText}\n\nGive it a try and let us know what you think — we're always here if you have any questions!`;
        summary = "Softened tone to approachable, conversational dialogue with friendly sign-off.";
        break;
    }

    return {
      id: `rew-${Date.now()}`,
      mode: input.mode,
      rewrittenText: rewritten,
      improvementSummary: summary,
      originalCharCount: originalText.length,
      newCharCount: rewritten.length,
      tokensUsed: 95,
    };
  }

  async generateStrategy(input: GenerateStrategyInput): Promise<CampaignStrategy> {
    await new Promise((r) => setTimeout(r, 650));

    creditsState.tokensUsed += 520;
    creditsState.tokensRemaining = Math.max(0, creditsState.tokensRemaining - 520);

    const goal = input.campaignGoal || "Customer Acquisition & Conversion Acceleration";
    const ind = input.industry || "B2B SaaS / E-commerce";

    return {
      id: `strat-${Date.now()}`,
      campaignTitle: `3-Stage Omnichannel Cadence: ${goal}`,
      targetSegment: `${input.targetAudience || "High-Intent Contacts & Engaged Subscribers"} (${ind})`,
      objective: `Maximize conversions through synchronized multi-channel touchpoints across Email, WhatsApp, and SMS.`,
      projectedOpenRate: 64.8,
      projectedClickRate: 18.2,
      recommendedBudgetSplit: [
        { channel: "Email Broadcasts", percentage: 40 },
        { channel: "WhatsApp Direct Marketing", percentage: 35 },
        { channel: "SMS Urgency Triggers", percentage: 25 },
      ],
      cadence: [
        {
          stepNumber: 1,
          dayOffset: 0,
          channel: "email",
          actionTitle: "The Grand Announcement & Core Value Prop",
          focus: "Deep storytelling, product demonstration, and high-trust social proof.",
          timingRecommendation: "Tuesday morning, 09:30 AM local time",
        },
        {
          stepNumber: 2,
          dayOffset: 2,
          channel: "whatsapp",
          actionTitle: "Interactive VIP Concierge Outreach",
          focus: "Direct 1-on-1 engagement with quick reply buttons for leads who opened Step 1.",
          timingRecommendation: "Thursday afternoon, 02:15 PM local time",
        },
        {
          stepNumber: 3,
          dayOffset: 4,
          channel: "sms",
          actionTitle: "Final 6-Hour Urgency & Flash Code",
          focus: "150-character hyper-urgent push with personalized promo link.",
          timingRecommendation: "Saturday evening, 06:00 PM local time",
        },
      ],
      keyAdvice:
        "Segment your list into 'Active Openers' vs 'Cold Dormant' before Step 2. Do not blast SMS to cold contacts to maintain stellar carrier deliverability and lower cost-per-acquisition.",
      createdAt: new Date().toISOString(),
    };
  }

  async getRecentGenerations(): Promise<GeneratedCopyOutput[]> {
    await new Promise((r) => setTimeout(r, 100));
    return [...recentGenerations];
  }

  async starGeneration(_id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 80));
    return true;
  }
}

export const aiAssistantService = new MockAiAssistantService();

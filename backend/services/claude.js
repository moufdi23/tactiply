const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function extractJSON(text) {
  // Try fenced code block first
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    try { return JSON.parse(codeBlock[1].trim()); } catch {}
  }

  // Walk the string character-by-character to find the first complete
  // JSON object or array, counting braces so we stop at exactly the
  // right closing delimiter — not at the last } in the whole response.
  const startObj = text.indexOf('{');
  const startArr = text.indexOf('[');
  let start = -1;
  let open, close;

  if (startObj === -1 && startArr === -1) throw new Error('No JSON found in AI response');
  if (startObj === -1 || (startArr !== -1 && startArr < startObj)) {
    start = startArr; open = '['; close = ']';
  } else {
    start = startObj; open = '{'; close = '}';
  }

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape)          { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true;  continue; }
    if (ch === '"')      { inString = !inString;   continue; }
    if (inString)        continue;
    if (ch === open)     depth++;
    if (ch === close)  {
      depth--;
      if (depth === 0) return JSON.parse(text.slice(start, i + 1));
    }
  }

  throw new Error('Could not extract valid JSON from AI response');
}

async function generateQuestions(businessDescription) {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: 'You are a JSON API. Output ONLY valid raw JSON — no explanation, no markdown, no code fences.',
    messages: [{
      role: 'user',
      content: `Business: "${businessDescription}"

Return a JSON array of exactly 5 marketing questions for this business.

Format: [{"id":1,"question":"...","placeholder":"..."},{"id":2,...},{"id":3,...},{"id":4,...},{"id":5,...}]

Cover these 5 topics in order:
1. Target customer profile (age, location, lifestyle)
2. Monthly marketing budget
3. Current marketing channels being used
4. Primary goal for next 90 days
5. Key competitive advantage

Make every question highly specific to this exact business type — not generic.`,
    }],
  });

  return extractJSON(msg.content[0].text);
}

async function generateStrategy(businessDescription, answers) {
  const qa = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n');

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: `You are a senior marketing strategist. Write a complete, specific marketing strategy for this small business owner. Do NOT add any introduction or closing text — start directly with the first ## section header.

Business: "${businessDescription}"

${qa}

You MUST include ALL 7 sections below using EXACTLY these ## headers in this order. Be highly specific to this business — no generic advice.

## Target Audience
Who is the ideal customer? Write 4-6 bullet points covering: age/gender/location/income level, lifestyle and values, top 3 pain points, what motivates them to buy, where they spend time online.

## Social Media Strategy
**Instagram:** Strategy overview and goal. Then list 5 specific content ideas as bullet points. State posting frequency and best times.
**Facebook:** Strategy overview and goal. Then list 5 specific content ideas as bullet points. Describe ad targeting approach.
**TikTok:** Video style and tone. Then list 5 specific video ideas as bullet points. List 3 trending audio/topics to use.

## 30-Day Content Calendar
**Week 1 – [Theme Name]:**
- Day 1 | [Platform] | [Specific post description]
- Day 3 | [Platform] | [Specific post description]
- Day 5 | [Platform] | [Specific post description]
- Day 7 | [Platform] | [Specific post description]

**Week 2 – [Theme Name]:**
- Day 8 | [Platform] | [Specific post description]
- Day 10 | [Platform] | [Specific post description]
- Day 12 | [Platform] | [Specific post description]
- Day 14 | [Platform] | [Specific post description]

**Week 3 – [Theme Name]:**
- Day 15 | [Platform] | [Specific post description]
- Day 17 | [Platform] | [Specific post description]
- Day 19 | [Platform] | [Specific post description]
- Day 21 | [Platform] | [Specific post description]

**Week 4 – [Theme Name]:**
- Day 22 | [Platform] | [Specific post description]
- Day 24 | [Platform] | [Specific post description]
- Day 26 | [Platform] | [Specific post description]
- Day 28 | [Platform] | [Specific post description]

## Email Marketing Templates
Write 3 short but complete email templates. Each needs Subject: and Body: fields.

1. Welcome Email
Subject: [subject line]
Body: [3-4 sentence email body]

2. Promotional Offer
Subject: [subject line]
Body: [3-4 sentence email body]

3. Re-engagement Email
Subject: [subject line]
Body: [3-4 sentence email body]

## Ad Copy
**Google Search Ads**

Headlines (each must be under 30 characters — write exactly 4, one per line):
- [headline]
- [headline]
- [headline]
- [headline]

Descriptions (each must be under 90 characters — write exactly 2, one per line):
- [description]
- [description]

**Facebook/Instagram Ad**
Headline: [compelling headline]
Body: [2-3 sentence ad copy that hooks the reader and drives action]
CTA Button: [button text e.g. Book Now, Get a Quote, Shop Now]

## SEO Keywords

**Primary (3-4 keywords):**
- [keyword]
- [keyword]
- [keyword]
- [keyword]

**Secondary (4-5 keywords):**
- [keyword]
- [keyword]
- [keyword]
- [keyword]
- [keyword]

**Long-tail phrases (5-6 phrases):**
- [phrase]
- [phrase]
- [phrase]
- [phrase]
- [phrase]

## Marketing Score
Overall Score: [number]/100

Breakdown:
- Brand Clarity: [score]/100
- Target Precision: [score]/100
- Content Strategy: [score]/100
- Digital Presence: [score]/100
- Growth Potential: [score]/100

Explanation: [2-3 sentences explaining what drives this score and what's holding it back]

Quick Wins (implement this week):
1. [specific actionable win]
2. [specific actionable win]
3. [specific actionable win]
4. [specific actionable win]`,
    }],
  });

  return msg.content[0].text;
}

module.exports = { generateQuestions, generateStrategy };

/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';


// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

@Injectable()
export class AiService {

    // openai
    private openAi: OpenAI;
    constructor(
        private configService: ConfigService,
    ) {
        const key = this.configService.get<string>('OPENAI_API_KEY');

        if (!key) {
            throw new Error('OPENAI_API_KEY is missing');
        }

        this.openAi = new OpenAI({ apiKey: key });
    }

    async matchAndExplain(products: any[]) {
        const prompt = `
You are a smart shopping assistant.

Your task:
- Analyze ALL the products provided below
- Compare prices across platforms
- Identify which product(s) offer the best value
- Mention platforms and prices clearly
- Highlight the cheapest option
- If multiple products are very similar, explain the comparison briefly

Rules:
- Treat products as potentially identical even if titles differ slightly
- Ignore marketing words
- Prices are strings; interpret them correctly
- Respond in clear, friendly paragraphs like ChatGPT
- DO NOT return JSON
- DO NOT use bullet lists unless necessary
- DO NOT wrap response in markdown

Products:
${JSON.stringify(products, null, 2)}

Return ONLY valid raw JSON.
No markdown. No backticks.
`;

        const res = await this.openAi.chat.completions.create({
            model: 'gpt-4.1',
            temperature: 0.3,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = res.choices[0]?.message?.content;

        if (!content) {
            throw new Error('AI returned empty response');
        }
        return content;
        // return extractJson(content);
    }

}


function extractJson(content: string) {
    // Remove markdown code fences if present
    const cleaned = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    return JSON.parse(cleaned);
}
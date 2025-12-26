/* eslint-disable prettier/prettier */
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
Group identical products and recommend the best deal.

Products:
${JSON.stringify(products, null, 2)}

Return JSON:
{
  "productName": "",
  "offers": [],
  "recommendation": ""
}
`;

        const res = await this.openAi.chat.completions.create({
            model: 'gpt-4.1',
            temperature: 0,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = res.choices[0]?.message?.content;

        if (!content) {
            throw new Error('AI returned empty response');
        }

        return JSON.parse(content);
    }
}

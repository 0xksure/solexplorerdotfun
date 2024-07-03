import { json } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import * as web3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// USDC token mint address on Solana mainnet

export async function POST({ request }) {
    try {
        const { prompt, projects } = await request.json();

        if (!prompt || !projects || projects.length === 0) {
            return json({ error: 'Invalid input. Please provide a prompt and project list.' }, { status: 400 });
        }



        const projectDescriptions = projects.map(p => `${p.name}: ${p.descriptionShort}`).join('\n');

        const system = `You are an expert in investing in early-stage technology companies. 
        These are the descriptions of some projects you are considering investing in: 
        ${projectDescriptions}. 
        Return a list of project names  that best match the investment thesis. Only return the project names, separated by commas.`

        const message = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 300,
            system,
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `Which projects in the description matches the following investment thesis: ${prompt}. Please list the top 3 projects.`
                        }
                    ]
                }
            ]
        })

        const answerMessage = (message.content.map(ans => {
            if (ans.type === 'text') {
                return ans.text.toLowerCase()
            }
            return null
        }).filter(ans => ans)).join(' ')
        if (!answerMessage || answerMessage.length === 0) {
            return json({ message: 'No answer found.' }, { status: 404 });
        }

        // find all strings after : seperated by a , 
        const answeredProjects = answerMessage?.split(':')?.pop().split(',').map(p => p.trim().toLowerCase()) ?? []
        if (answeredProjects.length === 0) {
            return json({ message: 'No projects found in the answer.' }, { status: 404 });
        }

        const matchingProject = projects
            .filter(p => answeredProjects.includes(p.name.toLowerCase()))


        if (matchingProject.length === 0) {
            return json({ message: 'No matching projects found for the given investment thesis.' }, { status: 404 });
        }

        return json({ projects: matchingProject });
    } catch (error) {
        if (error instanceof Anthropic.APIError) {
            return json({ error: `Anthropic API error: ${error.message}` }, { status: 502 });
        }
        return json({ error: 'An unexpected error occurred. Please try again later.' }, { status: 500 });
    }
}
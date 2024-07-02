import { SOLANA_PRIVATE_KEY, DESTINATION_WALLET } from '$env/static/private';
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

        const completion = await anthropic.completions.create({
            model: "claude-2",
            max_tokens_to_sample: 300,
            prompt: `Human: Given the following investment thesis:

${prompt}

And these project descriptions:

${projectDescriptions}

Return a list of project names that best match the investment thesis. Only return the project names, separated by commas.

Assistant: Based on the investment thesis and project descriptions provided, here are the project names that best match, separated by commas:`,
        });

        const matchingProjects = completion.completion.trim().split(',').map(name => name.trim());

        const matchingProjectIds = projects
            .filter(p => matchingProjects.includes(p.name))
            .map(p => p.id);

        if (matchingProjectIds.length === 0) {
            return json({ message: 'No matching projects found for the given investment thesis.' }, { status: 404 });
        }

        return json({ projectIds: matchingProjectIds });
    } catch (error) {
        console.error('Server error:', error);
        if (error instanceof Anthropic.APIError) {
            return json({ error: `Anthropic API error: ${error.message}` }, { status: 502 });
        }
        return json({ error: 'An unexpected error occurred. Please try again later.' }, { status: 500 });
    }
}
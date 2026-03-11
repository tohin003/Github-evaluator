// API Route: POST /api/analyze
// Main analysis endpoint — fetches GitHub data and runs Gemini analysis

import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubProfile } from '@/lib/github';
import { analyzePortfolio } from '@/lib/gemini';

export const maxDuration = 120; // Allow up to 120 seconds for analysis (includes rate-limit delays)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { githubUsername, targetRole = 'Software Developer' } = body;

        if (!githubUsername || typeof githubUsername !== 'string') {
            return NextResponse.json(
                { error: 'GitHub username is required' },
                { status: 400 }
            );
        }

        // Clean username
        const username = githubUsername.trim().replace(/^@/, '');

        // Get API keys (from env or request body)
        const geminiKey = body.geminiApiKey || process.env.GEMINI_API_KEY;
        const githubToken = process.env.GITHUB_TOKEN;

        if (!geminiKey) {
            return NextResponse.json(
                { error: 'Gemini API key is required. Set GEMINI_API_KEY in your .env.local file.' },
                { status: 400 }
            );
        }

        // Step 1: Fetch GitHub profile data
        const profileData = await fetchGitHubProfile(username, githubToken, targetRole);

        if (profileData.repos.length === 0) {
            return NextResponse.json(
                { error: `No public repositories found for user "${username}". Please check the username.` },
                { status: 404 }
            );
        }

        // Step 2: Analyze portfolio with LLM
        const analysis = await analyzePortfolio(
            profileData.repos,
            targetRole,
            username,
            profileData.totalRepos,
            geminiKey,
            profileData.portfolioCatalog
        );

        // Step 3: Return combined result
        return NextResponse.json({
            success: true,
            data: {
                user: {
                    login: profileData.user.login,
                    name: profileData.user.name,
                    bio: profileData.user.bio,
                    avatarUrl: profileData.user.avatar_url,
                    profileUrl: profileData.user.html_url,
                    publicRepos: profileData.user.public_repos,
                    followers: profileData.user.followers,
                    createdAt: profileData.user.created_at,
                },
                analysis,
                analyzedAt: new Date().toISOString(),
                targetRole,
            },
        });
    } catch (error) {
        console.error('Analysis error:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

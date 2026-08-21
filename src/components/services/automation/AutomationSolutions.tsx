'use client';

import { AccentBr } from '@/components/ui/accent-br';
import { SolutionMarquee } from '@/components/services/shared/SolutionMarquee';

const solutions = [
    {
        title: 'Inbound Lead Capture',
        description: 'Automatically collect and qualify leads from forms, chatbots, and landing pages.',
    },
    {
        title: 'CRM Data Sync',
        description: 'Sync leads, contacts, and deals to HubSpot, Salesforce, or Pipedrive in real time.',
    },
    {
        title: 'Client Onboarding',
        description: 'Trigger welcome sequences, task assignments, and setup docs when a deal closes.',
    },
    {
        title: 'Proposals & Invoices',
        description: 'Auto-generate proposals from templates and send invoices on schedule.',
    },
    {
        title: 'Reporting Dashboards',
        description: 'Pull data from multiple sources into live dashboards that update automatically.',
    },
    {
        title: 'AI Chatbots & Agents',
        description: 'Deploy AI-powered chat that qualifies leads, answers questions, and books calls 24/7.',
    },
    {
        title: 'Custom Integrations',
        description: 'Connect any tools in your stack with custom API integrations built to your workflow.',
    },
];

export function AutomationSolutions() {
    return (
        <SolutionMarquee
            label="SOLUTIONS"
            title={
                <>
                    What would you like to<AccentBr />
                    <span className="text-[#1a1512]/40">automate?</span>
                </>
            }
            items={solutions}
        />
    );
}

export default AutomationSolutions;

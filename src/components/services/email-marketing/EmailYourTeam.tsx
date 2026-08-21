'use client';

import { Calendar, MessageSquare, MapPin } from 'lucide-react';
import { SEOYourTeam } from '@/components/services/seo/SEOYourTeam';

export function EmailYourTeam() {
  return (
    <SEOYourTeam
      strategistBody="The person who builds your lifecycle strategy is the person on your recurring calls, as often as weekly, at whatever cadence matches how much you're shipping, and you can reach them directly in between. Not a coordinator relaying answers from someone you met once during the pitch."
      accessPoints={[
        {
          label: 'Cadence',
          title: 'Recurring strategy calls, up to weekly',
          icon: Calendar,
        },
        {
          label: 'Access',
          title: 'Direct access between meetings, plus a shared Slack channel',
          icon: MessageSquare,
        },
        {
          label: 'US-based',
          title: 'US-based senior strategy at a price that usually buys an offshore team',
          icon: MapPin,
        },
      ]}
    />
  );
}

export default EmailYourTeam;

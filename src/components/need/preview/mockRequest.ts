// Figma "Card/AI Results" (장소 2개일때) 의 예시 문구 그대로 — AI 분석 결과가 연결되면 대체
export type HelpRequest = {
  urgency: string;
  category: string;
  title: string;
  body: string;
  time: { tag: string; value: string };
  date: { tag: string; value: string };
  pickup: string;
  dropoff: string;
};

export const mockRequest: HelpRequest = {
  urgency: 'Critical',
  category: 'Rides & Carpool',
  title: 'Need a Ride to the Hospital',
  body: 'My daughter has had recurring stomach pain, nausea, and dizziness for about three months. Today, the pain became much worse, she vomited several times, and she is too weak to go to school. Her symptoms have not improved for several hours. We need a ride to a nearby hospital as soon as possible.',
  time: { tag: 'As Soon As Possible', value: '3:30 PM' },
  date: { tag: 'Today', value: 'Wed, Nov 4, 2026' },
  pickup: 'Palisades Park, NJ (exact address private)',
  dropoff: 'Nearby ER (about 15 min away)',
};

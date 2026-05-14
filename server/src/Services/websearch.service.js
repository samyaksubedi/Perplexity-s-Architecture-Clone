import { TavilySearch } from '@langchain/tavily';
import { envVariables } from '../Configs/env.config.js';

const tavilySearch = new TavilySearch({
  maxResults: 5,
  topic: 'general',
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // includeImageDescriptions: false,
  searchDepth: 'advanced',
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
  tavilyApiKey: envVariables.TAVILY_API_KEY,
});
const searchWeb = async (userQuery) => {
  return await tavilySearch.invoke({ query: userQuery });
};

// console.log(await searchWeb('New PM of Nepal'));
// result = {
//   query: 'New PM of Nepal',
//   follow_up_questions: null,
//   answer: null,
//   images: [],
//   results: [
//     {
//       url: 'https://www.dw.com/en/nepals-new-pm-inherits-india-china-us-balancing-act/a-76566455',
//       title: "Nepal's new PM inherits India-China-US balancing act",
//       content: `3. Skip to more DW sites. Rapper-turned-politician Balendra Shah is leading Nepal's government, taking office with a youth-led mandate for change. Balendra Shah, an ex-rapper popularly known as "Balen," was sworn in as Nepal's prime minister on Friday, capping off months of political upheaval in the Himalayan nation after a Gen Z-led uprising last year toppled the previous government. Shah, along with RSP chairman Rabi Lamichhane, has challenged the dominance of Nepal's old political guard, which has rotated in and out of power since the country's democratic transition in the 1990s. Both Shah and Lamichhane are relative newcomers to politics. "As both Balen and Lamichhane are new to diplomacy, they have no biases in international relations," Rameshnath Pandey, a former foreign minister of Nepal, told DW. Although it is too early to predict how the new government will frame its foreign policy priorities, the RSP's election manifesto and a recent statement by Lamichhane suggest its focus is more economic than ideological.`,
//       score: 0.99993896,
//       raw_content: null,
//     },
//     {
//       url: 'https://www.youtube.com/watch?v=-_u4vnuvT9Q',
//       title: "Nepal's New PM Balendra Shah Takes Charge After ... - YouTube",
//       content:
//         "Nepal's rapper-turned-politician Balendra Shah was sworn in as prime minister on Friday after sweeping the first election since deadly",
//       score: 0.99992037,
//       raw_content: null,
//     },
//     {
//       url: 'https://www.facebook.com/PradyotBikramManikya/posts/massive-respect-and-congratulations-to-balendra-shah-the-new-prime-minister-of-n/1451202173061509/',
//       title: 'Massive respect and congratulations to Balendra Shah the new ...',
//       content:
//         'Balender Shah who brought wave in Nepal, might become new PM of Nepal. He supported the student protests. He is widely known as Balen. He is',
//       score: 0.9996971,
//       raw_content: null,
//     },
//     {
//       url: 'https://www.aljazeera.com/news/2025/9/17/who-is-sushila-karki-nepals-new-73-year-old-interim-prime-minister',
//       title:
//         'Who is Sushila Karki, Nepal’s new 73-year-old interim prime minister? | Protests News | Al Jazeera',
//       content:
//         "# Who is Sushila Karki, Nepal’s new 73-year-old interim prime minister? *Karki became Nepal’s interim PM after days of deadly ‘Gen Z’ protests.*. Nepal's newly appointed Prime Minister Sushila Karki. Nepal’s former Chief Justice Sushila Karki has been appointed as the country’s new interim prime minister, following days of deadly youth protests. Karki, 73, is the first woman to head the government of Nepal. While the young protesters highlighted the generation gap between them and Nepal’s leaders during their agitation, they ended up picking septuagenarian Karki as their interim leader. “Gen Z protesters rallied behind septuagenarian Sushila Karki because, even in her earlier statements to the press, her image as Nepal’s first woman chief justice symbolised integrity and resistance against corruption,” Yog Raj Lamichhane, an assistant professor at the School of Business in Nepal’s Pokhara University, told Al Jazeera. Getting Nepal’s tourism sector back on its feet after the protests and chaos of last week would be another test for Karki, he said.",
//       score: 0.9996923,
//       raw_content: null,
//     },
//     {
//       url: 'https://www.iiss.org/online-analysis/online-analysis/2026/04/nepals-youngest-prime-minister-wins-but-faces-challenges/',
//       title: 'Nepal’s youngest prime minister wins but faces challenges',
//       content:
//         'With a landslide victory, Nepal’s Prime Minister Balendra Shah, the youngest in the post, has a strong basis from which to enact change. Balendra Shah, a 35-year-old former rapper and mayor of Kathmandu, was sworn in as Nepal’s youngest-ever prime minister – and Nepal’s 15th change of government since 2012 – on 27 March 2026 following a landslide victory for the centrist Rastriya Swatantra Party (RSP). This is the first time that the RSP has been elected to power, and the first time that a single party has formed a majority government since 1999. In a strong first move by the new government, Oli was arrested the day after Shah’s swearing-in ceremony, following recommendations from a commission set up to investigate the deadly police crackdown on protests in September 2025. These include ensuring domestic political stability following the student-led protests in 2025; enhancing economic growth despite limited foreign investment and high unemployment; and balancing Nepal’s relations with its two large neighbours, India and China.',
//       score: 0.9995159,
//       raw_content: null,
//     },
//   ],
//   response_time: 0.02,
//   request_id: '667a853d-79e4-44d7-bebf-85aedc9cb1f8',
// };
export { searchWeb };

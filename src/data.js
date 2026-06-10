/* ─────────────────────────────────────────────
   LISTINGS
   Each listing includes a vibeData block sourced
   from VryfID Vibes: 7-category scores, summary,
   nearby spots, airport, and hidden gem.
───────────────────────────────────────────── */
export const LISTINGS = [
  {
    id: 1,
    badge: "Central Park",
    street: "220 Central Park South",
    unit: "Residence 54W",
    neighborhood: "Billionaires' Row",
    city: "New York, NY 10019",
    price: "$42,000",
    priceNum: 42000,
    period: "/mo",
    beds: 3,
    baths: "3.5",
    sqft: "3,200",
    description:
      "A Robert A.M. Stern masterpiece perched above Central Park. Floor-to-ceiling windows frame unobstructed park views from every room. Signature marble baths, a chef's kitchen with Sub-Zero appliances, and private elevator entry complete this extraordinary residence.",
    lat: 40.7672,
    lng: -73.9812,
    tags: ["Park Views", "Private Terrace", "White Glove"],
    agent: "Victoria Chen",
    agentTitle: "Senior Leasing Advisor",
    area: "upper",
    priorities: ["views", "space"],
    vibeData: {
      vibeScore: 74,
      vibeSummary:
        "Billionaires' Row delivers elite safety and world-class transit through Columbus Circle. The trade-off is real: midtown gridlock and garage-only parking will test patience daily. The payoff — waking up above Central Park every morning — is difficult to argue against.",
      categories: {
        schools:   { rating: 88, description: "PS 199 and Ethical Culture Fieldston feed directly from this corridor. Among the best public school options in Manhattan." },
        crime:     { rating: 90, description: "Extremely safe residential corridor. 24/7 doormen across every building — one of the lowest crime rates in the city." },
        grocery:   { rating: 82, description: "Whole Foods on Columbus Circle, Trader Joe's UWS. Everything within a 6-minute walk." },
        parking:   { rating: 38, description: "Street parking is essentially nonexistent. Garage runs $500-700/month. Budget for it." },
        nightlife: { rating: 65, description: "Quiet luxury zone. A handful of excellent hotel bars nearby; not a scene neighborhood — and that's deliberate." },
        transit:   { rating: 92, description: "A/B/C/D/1 converge at Columbus Circle 3 blocks away. One of the best transit positions in the city." },
        traffic:   { rating: 50, description: "Midtown congestion bleeds north. 57th and Central Park South are both chronic. Expect delays heading south." },
      },
      nearbyGrocery: [
        { name: "Whole Foods Market", distance: "0.3 mi", walkTime: "6 min", address: "10 Columbus Circle, New York, NY 10019" },
        { name: "Trader Joe's", distance: "0.7 mi", walkTime: "14 min", address: "2073 Broadway, New York, NY 10023" },
        { name: "Gristede's", distance: "0.2 mi", walkTime: "4 min", address: "100 W 57th St, New York, NY 10019" },
      ],
      nearbyNightlife: [
        { name: "Bemelmans Bar", vibe: "Old-money timeless classic", address: "35 E 76th St, New York, NY 10021" },
        { name: "The Aviary NYC", vibe: "cocktail-as-theater", address: "35 W 67th St, New York, NY 10023" },
        { name: "Bar Pleiades", vibe: "hushed Upper East elegance", address: "20 E 76th St, New York, NY 10021" },
      ],
      nearestAirport: { name: "LaGuardia Airport", code: "LGA", distance: "8 mi", driveTime: "28 min drive" },
      hiddenGem: "The Rumjungle bar inside the Mandarin Oriental is on the 80th floor and doesn't appear on any 'best bars in NYC' list. Exactly as intended.",
    },
  },
  {
    id: 2,
    badge: "Midtown Icon",
    street: "432 Park Avenue",
    unit: "Residence 68A",
    neighborhood: "Midtown East",
    city: "New York, NY 10022",
    price: "$28,500",
    priceNum: 28500,
    period: "/mo",
    beds: 2,
    baths: "2.5",
    sqft: "2,100",
    description:
      "At 1,396 feet, a global icon. Private elevator opens directly to your foyer on the 68th floor. Twelve-foot ceilings and 360° panoramic views over Manhattan define this extraordinary home. Full concierge and in-building dining available.",
    lat: 40.7616,
    lng: -73.9724,
    tags: ["360° Views", "Full Concierge", "Private Elevator"],
    agent: "Marcus Williams",
    agentTitle: "Luxury Residential Specialist",
    area: "midtown",
    priorities: ["views", "amenities"],
    vibeData: {
      vibeScore: 72,
      vibeSummary:
        "Midtown East's transit access is unmatched — every major subway line within 4 blocks. The address carries its own gravity before you say a word. The honest trade-off: parking is essentially impossible, and 57th Street traffic is some of the worst gridlock in the country.",
      categories: {
        schools:   { rating: 80, description: "Solid school access for Midtown. Several strong options within a 10-minute walk or short commute." },
        crime:     { rating: 85, description: "Very safe. Heavy foot traffic and proximity to commercial zones keeps this corridor well-policed." },
        grocery:   { rating: 88, description: "Whole Foods on 57th, plus a Gristede's and multiple specialty markets. Exceptional grocery access for Manhattan." },
        parking:   { rating: 30, description: "Among the worst parking situations in New York. Nearby garages run $650+/month. Don't own a car here." },
        nightlife: { rating: 76, description: "Strong restaurant and bar scene — The Campbell at Grand Central, Cipriani, and dozens of world-class options within 5 blocks." },
        transit:   { rating: 95, description: "4/5/6 at 51st, E/M at Lexington, N/Q/R/W on 57th. Nearly every line in the system is walkable." },
        traffic:   { rating: 38, description: "57th Street is gridlock from 7am to 8pm. The congestion pricing zone doesn't help. Budget 45 minutes to go 10 blocks." },
      },
      nearbyGrocery: [
        { name: "Whole Foods Market", distance: "0.2 mi", walkTime: "4 min", address: "226 E 57th St, New York, NY 10022" },
        { name: "Gristede's Supermarket", distance: "0.1 mi", walkTime: "2 min", address: "969 Lexington Ave, New York, NY 10021" },
        { name: "Morton Williams", distance: "0.4 mi", walkTime: "8 min", address: "1291 Lexington Ave, New York, NY 10028" },
      ],
      nearbyNightlife: [
        { name: "The Campbell", vibe: "1920s private club inside Grand Central", address: "15 Vanderbilt Ave, New York, NY 10017" },
        { name: "Cipriani 42nd Street", vibe: "old-world power lunch energy", address: "110 E 42nd St, New York, NY 10017" },
        { name: "Avra Madison", vibe: "Greek seafood meets Midtown money", address: "141 E 48th St, New York, NY 10017" },
      ],
      nearestAirport: { name: "LaGuardia Airport", code: "LGA", distance: "9 mi", driveTime: "30 min drive" },
      hiddenGem: "The Campbell bar inside Grand Central's west balcony looks like a 1920s private club — most New Yorkers have walked past the entrance a hundred times and never noticed it.",
    },
  },
  {
    id: 3,
    badge: "Hudson Yards",
    street: "15 Hudson Yards",
    unit: "Residence 35D",
    neighborhood: "West Side",
    city: "New York, NY 10001",
    price: "$19,800",
    priceNum: 19800,
    period: "/mo",
    beds: 2,
    baths: "2",
    sqft: "1,850",
    description:
      "Manhattan's most dynamic new neighborhood. Steps from The Shed, the High Line, and world-class dining. Building amenities span a 75-foot lap pool, private cinema, golf simulator, and a rooftop terrace with Hudson River views.",
    lat: 40.754,
    lng: -74.0021,
    tags: ["High Line Access", "75ft Pool", "Cinema"],
    agent: "Sophia Park",
    agentTitle: "West Side Market Expert",
    area: "west",
    priorities: ["amenities", "neighborhood"],
    vibeData: {
      vibeScore: 74,
      vibeSummary:
        "Hudson Yards is Manhattan's most ambitious new neighborhood — and the safety scores reflect it. José Andrés anchors a food hall 200 feet from your lobby. The transit is solid via the 7 train. The soul is still forming, which is either a problem or an opportunity depending on who you are.",
      categories: {
        schools:   { rating: 76, description: "Newer neighborhood, developing school infrastructure. PS 33 is the primary option; private school commutes are manageable." },
        crime:     { rating: 91, description: "Brand new construction, private security, and heavy foot traffic from the retail complex. Extremely safe." },
        grocery:   { rating: 78, description: "The Shop at Hudson Yards, Agata & Valentina nearby. Good but not the depth of Midtown East or Upper West." },
        parking:   { rating: 44, description: "Structured garages in the development. Better than Midtown core but still expensive (~$450/month)." },
        nightlife: { rating: 74, description: "Mercado Little Spain, the bar at Equinox, and a growing restaurant scene. Still less established than TriBeCa or the Meatpacking District." },
        transit:   { rating: 88, description: "7 train to Grand Central in 7 minutes. A/C/E at Penn Station is a 10-minute walk. Excellent connectivity." },
        traffic:   { rating: 58, description: "The Lincoln Tunnel creates chaos on 34th-38th. Off-peak driving is fine; rush hour is brutal toward Midtown." },
      },
      nearbyGrocery: [
        { name: "The Market at Hudson Yards", distance: "0.1 mi", walkTime: "2 min", address: "20 Hudson Yards, New York, NY 10001" },
        { name: "Agata & Valentina", distance: "0.5 mi", walkTime: "10 min", address: "560 Hudson St, New York, NY 10014" },
        { name: "Whole Foods Market", distance: "0.8 mi", walkTime: "16 min", address: "387 7th Ave, New York, NY 10001" },
      ],
      nearbyNightlife: [
        { name: "Mercado Little Spain", vibe: "Spanish food hall, always buzzing", address: "10 Hudson Yards, New York, NY 10001" },
        { name: "The Bar at Equinox", vibe: "sleek hotel bar, strong playlist", address: "35 Hudson Yards, New York, NY 10001" },
        { name: "Catch Steak", vibe: "see-and-be-seen carnivore energy", address: "21 W 20th St, New York, NY 10011" },
      ],
      nearestAirport: { name: "Newark Liberty International", code: "EWR", distance: "11 mi", driveTime: "32 min drive" },
      hiddenGem: "Vessel opens at 6:30 AM. Walk it alone before the crowds arrive and it's a completely different structure. New Yorkers almost never do this.",
    },
  },
  {
    id: 4,
    badge: "TriBeCa",
    street: "56 Leonard Street",
    unit: "Residence 47A",
    neighborhood: "TriBeCa",
    city: "New York, NY 10013",
    price: "$25,000",
    priceNum: 25000,
    period: "/mo",
    beds: 2,
    baths: "2",
    sqft: "2,300",
    description:
      "Herzog & de Meuron's iconic 'Jenga Tower' — residences unlike any other in New York. Cantilevering floors, double-height ceilings, and loft-scale proportions in the heart of TriBeCa.",
    lat: 40.7183,
    lng: -74.0089,
    tags: ["Architecture Icon", "Loft Scale", "TriBeCa Core"],
    agent: "James Okafor",
    agentTitle: "Downtown Specialist",
    area: "downtown",
    priorities: ["neighborhood", "views"],
    vibeData: {
      vibeScore: 82,
      vibeSummary:
        "TriBeCa consistently ranks as Manhattan's safest, most livable, and most expensive neighborhood per square foot — and 56 Leonard sits at its center. The nightlife and restaurant scene are genuinely world-class. The only friction is parking, and the subtle awareness that everyone you pass in the lobby has a more interesting job than you.",
      categories: {
        schools:   { rating: 92, description: "PS 234 is one of the top-rated public elementary schools in New York City. The school district alone adds significant real estate value." },
        crime:     { rating: 93, description: "TriBeCa is one of the safest neighborhoods in any American city. Crime here is genuinely exceptional." },
        grocery:   { rating: 84, description: "Whole Foods on Tribeca's edge, Dean & DeLuca, and a strong greenmarket presence on Wednesday and Saturdays." },
        parking:   { rating: 52, description: "More street parking than Midtown. Garages available at $350-450/month. Doable." },
        nightlife: { rating: 90, description: "Some of NYC's most acclaimed restaurants and bars. Nobu, Locanda Verde, Marc Forgione — and that's just within 3 blocks." },
        transit:   { rating: 88, description: "1/2/3 at Chambers, A/C/E at Canal, N/Q/R/W at Canal Street. Downtown is extremely well-served." },
        traffic:   { rating: 65, description: "Significantly calmer than Midtown. Worth the tradeoff." },
      },
      nearbyGrocery: [
        { name: "Whole Foods Market", distance: "0.3 mi", walkTime: "6 min", address: "270 Greenwich St, New York, NY 10007" },
        { name: "TriBeCa Greenmarket", distance: "0.4 mi", walkTime: "8 min", address: "Greenwich St & Chambers St, New York, NY 10013" },
        { name: "Gourmet Garage", distance: "0.2 mi", walkTime: "4 min", address: "453 Broome St, New York, NY 10013" },
      ],
      nearbyNightlife: [
        { name: "Locanda Verde", vibe: "rustic Italian, always electric", address: "377 Greenwich St, New York, NY 10013" },
        { name: "Marc Forgione", vibe: "no sign outside, no Instagram", address: "134 Reade St, New York, NY 10013" },
        { name: "The Brandy Library", vibe: "300 spirits, hushed and reverent", address: "25 N Moore St, New York, NY 10013" },
      ],
      nearestAirport: { name: "LaGuardia Airport", code: "LGA", distance: "12 mi", driveTime: "38 min drive" },
      hiddenGem: "Marc Forgione on Reade Street has no sign outside and no Instagram presence. Regulars have been protecting it for 15 years. The food is exceptional.",
    },
  },
  {
    id: 5,
    badge: "FiDi",
    street: "30 Park Place",
    unit: "Residence 52B",
    neighborhood: "Financial District",
    city: "New York, NY 10007",
    price: "$17,500",
    priceNum: 17500,
    period: "/mo",
    beds: 2,
    baths: "2",
    sqft: "1,950",
    description:
      "Four Seasons Private Residences in the heart of Lower Manhattan. Robert A.M. Stern-designed tower with direct hotel service, signature restaurant access, and stunning harbor and skyline views.",
    lat: 40.7131,
    lng: -74.0091,
    tags: ["Four Seasons Service", "Harbor Views", "Hotel Amenities"],
    agent: "Priya Mehta",
    agentTitle: "Lower Manhattan Expert",
    area: "downtown",
    priorities: ["amenities", "neighborhood"],
    vibeData: {
      vibeScore: 78,
      vibeSummary:
        "FiDi might have the best transit access of any neighborhood in Manhattan — nearly every line in the system runs through within 4 blocks. Post-2010, the neighborhood genuinely reinvented itself as a place to live, not just work. The grocery situation is the one honest weak point. Everything else is surprisingly good.",
      categories: {
        schools:   { rating: 82, description: "Stuyvesant High School is within walking distance — one of the most competitive public schools in the country. Strong middle school options too." },
        crime:     { rating: 88, description: "FiDi has transformed completely since 2010. Heavy security presence, active streets, very safe." },
        grocery:   { rating: 76, description: "Brookfield Place has a gourmet market. Whole Foods Tribeca is a 10-minute walk. Not a grocery-rich neighborhood by Manhattan standards." },
        parking:   { rating: 50, description: "City Hall area has better garage availability and pricing than Midtown. Downtown parking is more manageable." },
        nightlife: { rating: 86, description: "Pier 17, Stone Street, The Dead Rabbit, Bathtub Gin — FiDi and its surrounding blocks punch well above their weight at night." },
        transit:   { rating: 96, description: "Fulton Center is one of the most connected transit hubs in New York. 2/3/4/5/A/C/E/J/Z/R/W all within walking distance." },
        traffic:   { rating: 58, description: "Downtown Manhattan is calmer than Midtown except for morning rush hour on the FDR. Weekends are quiet." },
      },
      nearbyGrocery: [
        { name: "Hudson Eats at Brookfield Place", distance: "0.3 mi", walkTime: "6 min", address: "230 Vesey St, New York, NY 10281" },
        { name: "Whole Foods Market", distance: "0.8 mi", walkTime: "16 min", address: "270 Greenwich St, New York, NY 10007" },
        { name: "Jubilee Marketplace", distance: "0.2 mi", walkTime: "4 min", address: "99 John St, New York, NY 10038" },
      ],
      nearbyNightlife: [
        { name: "The Dead Rabbit", vibe: "world's best cocktail bar, period", address: "30 Water St, New York, NY 10004" },
        { name: "Pier 17 Rooftop", vibe: "best unobstructed bridge views", address: "89 South St, New York, NY 10038" },
        { name: "Stone Street", vibe: "cobblestone outdoor drinking district", address: "Stone St, New York, NY 10004" },
      ],
      nearestAirport: { name: "LaGuardia Airport", code: "LGA", distance: "11 mi", driveTime: "35 min drive" },
      hiddenGem: "Pier 17's rooftop clears out by 7:30 PM on weeknights. The view of the Brooklyn Bridge from there — with no crowds — is better than anywhere else in the city.",
    },
  },
  {
    id: 6,
    badge: "57th Street",
    street: "157 West 57th Street",
    unit: "Residence 60A",
    neighborhood: "Billionaires' Row",
    city: "New York, NY 10019",
    price: "$38,000",
    priceNum: 38000,
    period: "/mo",
    beds: 3,
    baths: "3",
    sqft: "3,100",
    description:
      "One57's iconic glass tower rises above Central Park. Hyatt-serviced building with panoramic park and city views, attended lobby, concierge, and private dining available through the hotel.",
    lat: 40.7655,
    lng: -73.9799,
    tags: ["Park Views", "Hyatt Service", "Central Location"],
    agent: "Elena Rossi",
    agentTitle: "57th Street Specialist",
    area: "midtown",
    priorities: ["views", "amenities"],
    vibeData: {
      vibeScore: 73,
      vibeSummary:
        "One57 is a masterclass in access without livability. The grocery situation is genuinely elite — Whole Foods and Trader Joe's within 3 blocks. Transit is exceptional. The honest reality: 57th Street has some of the worst traffic in Manhattan, and the address itself has little neighborhood soul. Your soul, however, is probably fine at 60 floors up.",
      categories: {
        schools:   { rating: 86, description: "Proximity to several strong public options and easy access to the best private schools in the city." },
        crime:     { rating: 88, description: "Very safe corridor. 24/7 doorman building, high-visibility location, minimal crime." },
        grocery:   { rating: 91, description: "Whole Foods two blocks west, Trader Joe's three blocks east. Arguably the best grocery access in Manhattan." },
        parking:   { rating: 34, description: "57th Street parking is abysmal. Valets exist but options are few and costs are high." },
        nightlife: { rating: 68, description: "Excellent for hotel bars and fine dining. Not a 'go out and end up somewhere unexpected' neighborhood." },
        transit:   { rating: 94, description: "N/Q/R/W at 57th/7th, B/D/E at 57th/6th. Truly exceptional coverage for the entire city." },
        traffic:   { rating: 38, description: "57th Street is legendary for gridlock. Congestion pricing has not fixed it. Budget extra time heading south." },
      },
      nearbyGrocery: [
        { name: "Whole Foods Market", distance: "0.2 mi", walkTime: "4 min", address: "226 E 57th St, New York, NY 10022" },
        { name: "Trader Joe's", distance: "0.3 mi", walkTime: "6 min", address: "675 6th Ave, New York, NY 10010" },
        { name: "Eataly NYC Flatiron", distance: "0.7 mi", walkTime: "14 min", address: "200 5th Ave, New York, NY 10010" },
      ],
      nearbyNightlife: [
        { name: "The Modern at MoMA", vibe: "art world's favorite power dinner", address: "9 W 53rd St, New York, NY 10019" },
        { name: "Bar SixtyFive", vibe: "Rainbow Room, 65th floor", address: "30 Rockefeller Plaza, New York, NY 10112" },
        { name: "Nordstrom Whisky Bar", vibe: "floor 7, unknown to most locals", address: "225 W 57th St, New York, NY 10019" },
      ],
      nearestAirport: { name: "LaGuardia Airport", code: "LGA", distance: "9 mi", driveTime: "28 min drive" },
      hiddenGem: "Nordstrom's 57th Street flagship has a Japanese whisky bar on the 7th floor that virtually no New Yorkers know about. Open weekdays until 8pm. Never crowded.",
    },
  },
  {
    id: 7,
    badge: "Midtown East",
    street: "252 East 57th Street",
    unit: "Residence 24D",
    neighborhood: "Midtown East",
    city: "New York, NY 10022",
    price: "$12,000",
    priceNum: 12000,
    period: "/mo",
    beds: 2,
    baths: "2",
    sqft: "1,600",
    description:
      "Sleek Midtown tower with generous proportions at an accessible price point. Steps from Whole Foods, express subway lines, and some of Manhattan's best restaurants.",
    lat: 40.758,
    lng: -73.9672,
    tags: ["Great Value", "Transit Access", "Midtown Location"],
    agent: "Daniel Park",
    agentTitle: "Midtown Residential",
    area: "midtown",
    priorities: ["space", "neighborhood"],
    vibeData: {
      vibeScore: 70,
      vibeSummary:
        "252 East 57th is Midtown East at its most functional: world-class transit, solid grocery, and enough restaurants within a 5-minute walk to never cook again. The neighborhood is more utilitarian than atmospheric, which many people find a relief after a long day. Traffic on 57th remains the unavoidable tax.",
      categories: {
        schools:   { rating: 78, description: "Decent school options for Midtown. Stuyvesant is a 20-minute commute for qualifying students." },
        crime:     { rating: 82, description: "Safe Midtown corridor. Well-policed with good visibility. Standard Manhattan caution applies." },
        grocery:   { rating: 86, description: "Whole Foods directly across the street. Gristede's one block away. Exceptional convenience." },
        parking:   { rating: 32, description: "Midtown East parking is expensive and scarce. Garages run $600-750/month." },
        nightlife: { rating: 75, description: "Solid neighborhood bars and excellent restaurants (Sparks Steakhouse, Casa Lever). Good without being exceptional." },
        transit:   { rating: 92, description: "4/5/6 at 59th and Lexington, N/Q/R at 59th. The Lexington express is 3 blocks away." },
        traffic:   { rating: 40, description: "East 57th feeds toward the Queensboro Bridge — expect backups daily. Not as bad as 57th west of Lex." },
      },
      nearbyGrocery: [
        { name: "Whole Foods Market", distance: "0.1 mi", walkTime: "2 min", address: "226 E 57th St, New York, NY 10022" },
        { name: "Gristede's", distance: "0.1 mi", walkTime: "2 min", address: "969 Lexington Ave, New York, NY 10021" },
        { name: "Agata & Valentina", distance: "0.5 mi", walkTime: "10 min", address: "1505 1st Ave, New York, NY 10075" },
      ],
      nearbyNightlife: [
        { name: "Sparks Steak House", vibe: "New York institution since 1966", address: "210 E 46th St, New York, NY 10017" },
        { name: "Casa Lever", vibe: "Warhol prints, perfect pasta", address: "390 Park Ave, New York, NY 10022" },
        { name: "The Sutton", vibe: "neighborhood locals who've been coming 20 years", address: "311 E 58th St, New York, NY 10022" },
      ],
      nearestAirport: { name: "LaGuardia Airport", code: "LGA", distance: "8 mi", driveTime: "25 min drive" },
      hiddenGem: "The Sutton Park dog run on 57th and Sutton Place is somehow never on any NYC list — a peaceful, well-maintained park with unobstructed river views, almost always calm.",
    },
  },
  {
    id: 8,
    badge: "TriBeCa North",
    street: "111 Murray Street",
    unit: "Residence 31D",
    neighborhood: "TriBeCa",
    city: "New York, NY 10007",
    price: "$22,000",
    priceNum: 22000,
    period: "/mo",
    beds: 3,
    baths: "3",
    sqft: "2,800",
    description:
      "Kohn Pedersen Fox's soaring tower above TriBeCa. Expansive proportions, dramatic skyline views, and a full suite of amenities including a 75-foot pool, residents' lounge, and private dining room.",
    lat: 40.7157,
    lng: -74.0085,
    tags: ["Huge Proportions", "Skyline Views", "75ft Pool"],
    agent: "Rachel Torres",
    agentTitle: "TriBeCa Specialist",
    area: "downtown",
    priorities: ["space", "neighborhood"],
    vibeData: {
      vibeScore: 83,
      vibeSummary:
        "111 Murray sits at the intersection of the best neighborhood in Manhattan and one of the best transit hubs downtown. The school district is genuinely elite. Safety is exceptional. The restaurant and nightlife scene is world-class. The 75-foot pool in the building is almost redundant when your neighborhood looks like this.",
      categories: {
        schools:   { rating: 93, description: "PS 234 is the crown jewel — one of the top-rated public schools in New York. The district is the reason families pay a premium to live here." },
        crime:     { rating: 94, description: "TriBeCa is among the safest neighborhoods in any major American city. Exceptional by any measure." },
        grocery:   { rating: 82, description: "Whole Foods on the edge of TriBeCa, Wednesday/Saturday greenmarket at Chambers. Very good." },
        parking:   { rating: 55, description: "TriBeCa has the most manageable parking in lower Manhattan. Garages at $350-420/month. Some street parking exists." },
        nightlife: { rating: 90, description: "Nobu, Locanda Verde, The Brandy Library, Tiny's — world-class without trying. TriBeCa's nightlife is defined by quality, not volume." },
        transit:   { rating: 90, description: "1/2/3 at Chambers Street, A/C/E at Canal, N/R/W at City Hall. Downtown transit is genuinely excellent." },
        traffic:   { rating: 66, description: "TriBeCa's quiet cobblestone streets are a genuine contrast to Midtown. Light traffic by Manhattan standards." },
      },
      nearbyGrocery: [
        { name: "Whole Foods Market", distance: "0.3 mi", walkTime: "6 min", address: "270 Greenwich St, New York, NY 10007" },
        { name: "Chambers Street Wines", distance: "0.1 mi", walkTime: "2 min", address: "148 Chambers St, New York, NY 10007" },
        { name: "TriBeCa Greenmarket", distance: "0.3 mi", walkTime: "6 min", address: "Greenwich St & Chambers St, NY 10013" },
      ],
      nearbyNightlife: [
        { name: "Tiny's & The Bar Upstairs", vibe: "cash only, no reservations, since 1984", address: "135 W Broadway, New York, NY 10013" },
        { name: "The Brandy Library", vibe: "300 spirits in hushed amber light", address: "25 N Moore St, New York, NY 10013" },
        { name: "Nobu Tribeca", vibe: "legendary, still earns it every time", address: "105 Hudson St, New York, NY 10013" },
      ],
      nearestAirport: { name: "John F. Kennedy International", code: "JFK", distance: "15 mi", driveTime: "42 min drive" },
      hiddenGem: "Tiny's & The Bar Upstairs on West Broadway: cash only, no reservations, no website, no Instagram. Open since 1984. Every local agrees it's TriBeCa's best-kept secret.",
    },
  },
];

// Q1 → location, Q2 → priority, Q3 → budget (practical question lands last)
export const QUESTIONS = [
  {
    id: "location",
    question: "Your Sunday morning looks like…",
    options: [
      { value: "upper",    label: "Central Park walk",         sub: "Coffee in hand. City just waking up." },
      { value: "downtown", label: "Brunch in TriBeCa",         sub: "Somewhere nobody's reviewed yet." },
      { value: "west",     label: "The High Line early",       sub: "Before the crowds hit." },
      { value: "midtown",  label: "Room service. Do not disturb.", sub: "No apologies." },
    ],
  },
  {
    id: "priority",
    question: "Your apartment needs one thing above all else…",
    options: [
      { value: "views",       label: "A view that stops me cold", sub: "Every single morning." },
      { value: "neighborhood",label: "The right block",           sub: "I need to love coming home." },
      { value: "space",       label: "Room to actually exhale",   sub: "Four walls that don't close in." },
      { value: "amenities",   label: "Service that anticipates",  sub: "I shouldn't have to ask." },
    ],
  },
  {
    id: "budget",
    question: "Realistically, your monthly budget…",
    options: [
      { value: "under15", label: "Under $15,000" },
      { value: "15to22",  label: "$15,000 – $22,000" },
      { value: "22to35",  label: "$22,000 – $35,000" },
      { value: "35plus",  label: "$35,000 and up" },
    ],
  },
];

export const ARCHETYPES = {
  elevated: {
    name: "The Elevated",
    tagline: "You don't live near the city. You live above it.",
    description:
      "Every morning starts with a view that stops you cold. You chose this address because standing above the skyline isn't a luxury — it's a requirement. The rest of the city can look up.",
  },
  powerbroker: {
    name: "The Power Broker",
    tagline: "The address isn't a detail. It's the whole point.",
    description:
      "Midtown is the center of everything that matters and you know it. Your apartment isn't where you sleep — it's where you operate from. The doorman knows your name before you tell him.",
  },
  downtownnative: {
    name: "The Downtown Native",
    tagline: "You chose character over convenience. On purpose.",
    description:
      "These streets had stories before you arrived and they'll have more after. You're not renting square footage — you're buying into a neighborhood. The coffee place knows your order. That matters more than marble.",
  },
  modernist: {
    name: "The New Yorkist",
    tagline: "New isn't a compromise. It's the whole point.",
    description:
      "You want the city designed exactly right — the pool, the service, the roof terrace. You're not nostalgic about grit. You're already building what comes next.",
  },
};

const LOCATION_TO_KEY = {
  upper:    "elevated",
  midtown:  "powerbroker",
  downtown: "downtownnative",
  west:     "modernist",
};

export function getArchetypeKey(location) {
  return LOCATION_TO_KEY[location] ?? "elevated";
}

export function getArchetype(location) {
  return ARCHETYPES[getArchetypeKey(location)];
}

const BUDGET_RANGES = {
  under15:  [0, 14999],
  "15to22": [15000, 22000],
  "22to35": [22001, 35000],
  "35plus": [35001, Infinity],
};

export function scoreAndRank(answers) {
  return [...LISTINGS]
    .map((l) => {
      let pts = 0;
      const [lo, hi] = BUDGET_RANGES[answers.budget] ?? [0, Infinity];
      if (l.priceNum >= lo && l.priceNum <= hi) pts += 4;
      else if (l.priceNum < lo && lo - l.priceNum <= 5000) pts += 2;
      else if (l.priceNum > hi && l.priceNum - hi <= 8000) pts += 2;
      if (l.priorities[0] === answers.priority) pts += 3;
      else if (l.priorities[1] === answers.priority) pts += 1;
      if (l.area === answers.location) pts += 3;
      return { ...l, score: pts };
    })
    .sort((a, b) => b.score - a.score);
}

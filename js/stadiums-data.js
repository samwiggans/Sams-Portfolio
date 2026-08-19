/* ===========================================================
   Stadium Checklist — the grounds
   -----------------------------------------------------------
   Clubs and grounds for the top five English leagues, taken from
   the 2026–27 season tables. When clubs go up, down or move house,
   edit this file: change the stadium, or move a club between
   leagues. Ticks are stored against the club id, so a club keeps
   its ticks when it changes division — but renaming an id loses
   whatever was ticked against the old one.
   =========================================================== */

const LEAGUES = [
  {
    name: "Premier League",
    tier: "Tier 1",
    clubs: [
      { id: "arsenal",            club: "Arsenal",                  stadium: "Emirates Stadium" },
      { id: "aston-villa",        club: "Aston Villa",              stadium: "Villa Park" },
      { id: "bournemouth",        club: "Bournemouth",              stadium: "Dean Court" },
      { id: "brentford",          club: "Brentford",                stadium: "Brentford Community Stadium" },
      { id: "brighton",           club: "Brighton & Hove Albion",   stadium: "Falmer Stadium" },
      { id: "chelsea",            club: "Chelsea",                  stadium: "Stamford Bridge" },
      { id: "coventry-city",      club: "Coventry City",            stadium: "Coventry Building Society Arena" },
      { id: "crystal-palace",     club: "Crystal Palace",           stadium: "Selhurst Park" },
      { id: "everton",            club: "Everton",                  stadium: "Hill Dickinson Stadium" },
      { id: "fulham",             club: "Fulham",                   stadium: "Craven Cottage" },
      { id: "hull-city",          club: "Hull City",                stadium: "MKM Stadium" },
      { id: "ipswich-town",       club: "Ipswich Town",             stadium: "Portman Road" },
      { id: "leeds-united",       club: "Leeds United",             stadium: "Elland Road" },
      { id: "liverpool",          club: "Liverpool",                stadium: "Anfield" },
      { id: "manchester-city",    club: "Manchester City",          stadium: "City of Manchester Stadium" },
      { id: "manchester-united",  club: "Manchester United",        stadium: "Old Trafford" },
      { id: "newcastle-united",   club: "Newcastle United",         stadium: "St James' Park" },
      { id: "nottingham-forest",  club: "Nottingham Forest",        stadium: "City Ground" },
      { id: "sunderland",         club: "Sunderland",               stadium: "Stadium of Light" },
      { id: "tottenham",          club: "Tottenham Hotspur",        stadium: "Tottenham Hotspur Stadium" }
    ]
  },
  {
    name: "Championship",
    tier: "Tier 2",
    clubs: [
      { id: "birmingham-city",    club: "Birmingham City",          stadium: "St Andrew's" },
      { id: "blackburn-rovers",   club: "Blackburn Rovers",         stadium: "Ewood Park" },
      { id: "bolton-wanderers",   club: "Bolton Wanderers",         stadium: "Toughsheet Community Stadium" },
      { id: "bristol-city",       club: "Bristol City",             stadium: "Ashton Gate" },
      { id: "burnley",            club: "Burnley",                  stadium: "Turf Moor" },
      { id: "cardiff-city",       club: "Cardiff City",             stadium: "Cardiff City Stadium" },
      { id: "charlton-athletic",  club: "Charlton Athletic",        stadium: "The Valley" },
      { id: "derby-county",       club: "Derby County",             stadium: "Pride Park Stadium" },
      { id: "lincoln-city",       club: "Lincoln City",             stadium: "Sincil Bank" },
      { id: "middlesbrough",      club: "Middlesbrough",            stadium: "Riverside Stadium" },
      { id: "millwall",           club: "Millwall",                 stadium: "The Den" },
      { id: "norwich-city",       club: "Norwich City",             stadium: "Carrow Road" },
      { id: "portsmouth",         club: "Portsmouth",               stadium: "Fratton Park" },
      { id: "preston-north-end",  club: "Preston North End",        stadium: "Deepdale" },
      { id: "qpr",                club: "Queens Park Rangers",      stadium: "Loftus Road" },
      { id: "sheffield-united",   club: "Sheffield United",         stadium: "Bramall Lane" },
      { id: "southampton",        club: "Southampton",              stadium: "St Mary's Stadium" },
      { id: "stoke-city",         club: "Stoke City",               stadium: "bet365 Stadium" },
      { id: "swansea-city",       club: "Swansea City",             stadium: "Swansea.com Stadium" },
      { id: "watford",            club: "Watford",                  stadium: "Vicarage Road" },
      { id: "west-brom",          club: "West Bromwich Albion",     stadium: "The Hawthorns" },
      { id: "west-ham",           club: "West Ham United",          stadium: "London Stadium" },
      { id: "wolves",             club: "Wolverhampton Wanderers",  stadium: "Molineux Stadium" },
      { id: "wrexham",            club: "Wrexham",                  stadium: "Racecourse Ground" }
    ]
  },
  {
    name: "League One",
    tier: "Tier 3",
    clubs: [
      { id: "afc-wimbledon",      club: "AFC Wimbledon",            stadium: "Plough Lane" },
      { id: "barnsley",           club: "Barnsley",                 stadium: "Oakwell" },
      { id: "blackpool",          club: "Blackpool",                stadium: "Bloomfield Road", home: true },
      { id: "bradford-city",      club: "Bradford City",            stadium: "Valley Parade" },
      { id: "bromley",            club: "Bromley",                  stadium: "Hayes Lane" },
      { id: "burton-albion",      club: "Burton Albion",            stadium: "Pirelli Stadium" },
      { id: "cambridge-united",   club: "Cambridge United",         stadium: "Abbey Stadium" },
      { id: "doncaster-rovers",   club: "Doncaster Rovers",         stadium: "Eco-Power Stadium" },
      { id: "huddersfield-town",  club: "Huddersfield Town",        stadium: "Kirklees Stadium" },
      { id: "leicester-city",     club: "Leicester City",           stadium: "King Power Stadium" },
      { id: "leyton-orient",      club: "Leyton Orient",            stadium: "Brisbane Road" },
      { id: "luton-town",         club: "Luton Town",               stadium: "Kenilworth Road" },
      { id: "mansfield-town",     club: "Mansfield Town",           stadium: "Field Mill" },
      { id: "mk-dons",            club: "Milton Keynes Dons",       stadium: "Stadium MK" },
      { id: "notts-county",       club: "Notts County",             stadium: "Meadow Lane" },
      { id: "oxford-united",      club: "Oxford United",            stadium: "Kassam Stadium" },
      { id: "peterborough",       club: "Peterborough United",      stadium: "London Road Stadium" },
      { id: "plymouth-argyle",    club: "Plymouth Argyle",          stadium: "Home Park" },
      { id: "reading",            club: "Reading",                  stadium: "Madejski Stadium" },
      { id: "sheffield-wednesday",club: "Sheffield Wednesday",      stadium: "Hillsborough Stadium" },
      { id: "stevenage",          club: "Stevenage",                stadium: "Broadhall Way" },
      { id: "stockport-county",   club: "Stockport County",         stadium: "Edgeley Park" },
      { id: "wigan-athletic",     club: "Wigan Athletic",           stadium: "Brick Community Stadium" },
      { id: "wycombe-wanderers",  club: "Wycombe Wanderers",        stadium: "Adams Park" }
    ]
  },
  {
    name: "League Two",
    tier: "Tier 4",
    clubs: [
      { id: "accrington-stanley", club: "Accrington Stanley",       stadium: "Crown Ground" },
      { id: "barnet",             club: "Barnet",                   stadium: "The Hive Stadium" },
      { id: "bristol-rovers",     club: "Bristol Rovers",           stadium: "Memorial Stadium" },
      { id: "cheltenham-town",    club: "Cheltenham Town",          stadium: "Whaddon Road" },
      { id: "chesterfield",       club: "Chesterfield",             stadium: "SMH Group Stadium" },
      { id: "colchester-united",  club: "Colchester United",        stadium: "Colchester Community Stadium" },
      { id: "crawley-town",       club: "Crawley Town",             stadium: "Broadfield Stadium" },
      { id: "crewe-alexandra",    club: "Crewe Alexandra",          stadium: "Gresty Road" },
      { id: "exeter-city",        club: "Exeter City",              stadium: "St James Park" },
      { id: "fleetwood-town",     club: "Fleetwood Town",           stadium: "Highbury Stadium" },
      { id: "gillingham",         club: "Gillingham",               stadium: "Priestfield Stadium" },
      { id: "grimsby-town",       club: "Grimsby Town",             stadium: "Blundell Park" },
      { id: "newport-county",     club: "Newport County",           stadium: "Rodney Parade" },
      { id: "northampton-town",   club: "Northampton Town",         stadium: "Sixfields Stadium" },
      { id: "oldham-athletic",    club: "Oldham Athletic",          stadium: "Boundary Park" },
      { id: "port-vale",          club: "Port Vale",                stadium: "Vale Park" },
      { id: "rochdale",           club: "Rochdale",                 stadium: "Spotland Stadium" },
      { id: "rotherham-united",   club: "Rotherham United",         stadium: "New York Stadium" },
      { id: "salford-city",       club: "Salford City",             stadium: "Moor Lane" },
      { id: "shrewsbury-town",    club: "Shrewsbury Town",          stadium: "New Meadow" },
      { id: "swindon-town",       club: "Swindon Town",             stadium: "County Ground" },
      { id: "tranmere-rovers",    club: "Tranmere Rovers",          stadium: "Prenton Park" },
      { id: "walsall",            club: "Walsall",                  stadium: "Bescot Stadium" },
      { id: "york-city",          club: "York City",                stadium: "York Community Stadium" }
    ]
  },
  {
    name: "National League",
    tier: "Tier 5",
    clubs: [
      { id: "afc-fylde",          club: "AFC Fylde",                stadium: "Mill Farm Sports Village" },
      { id: "aldershot-town",     club: "Aldershot Town",           stadium: "The Recreation Ground" },
      { id: "altrincham",         club: "Altrincham",               stadium: "Moss Lane" },
      { id: "barrow",             club: "Barrow",                   stadium: "Holker Street" },
      { id: "boreham-wood",       club: "Boreham Wood",             stadium: "Meadow Park" },
      { id: "boston-united",      club: "Boston United",            stadium: "Boston Community Stadium" },
      { id: "carlisle-united",    club: "Carlisle United",          stadium: "Brunton Park" },
      { id: "eastleigh",          club: "Eastleigh",                stadium: "Ten Acres" },
      { id: "halifax-town",       club: "FC Halifax Town",          stadium: "The Shay" },
      { id: "forest-green",       club: "Forest Green Rovers",      stadium: "The New Lawn" },
      { id: "gateshead",          club: "Gateshead",                stadium: "Gateshead International Stadium" },
      { id: "harrogate-town",     club: "Harrogate Town",           stadium: "Wetherby Road" },
      { id: "hartlepool-united",  club: "Hartlepool United",        stadium: "Victoria Park" },
      { id: "hornchurch",         club: "Hornchurch",               stadium: "Hornchurch Stadium" },
      { id: "kidderminster",      club: "Kidderminster Harriers",   stadium: "Aggborough Stadium" },
      { id: "scunthorpe-united",  club: "Scunthorpe United",        stadium: "Glanford Park" },
      { id: "solihull-moors",     club: "Solihull Moors",           stadium: "Damson Park" },
      { id: "southend-united",    club: "Southend United",          stadium: "Roots Hall" },
      { id: "sutton-united",      club: "Sutton United",            stadium: "Gander Green Lane" },
      { id: "tamworth",           club: "Tamworth",                 stadium: "The Lamb Ground" },
      { id: "wealdstone",         club: "Wealdstone",               stadium: "Grosvenor Vale" },
      { id: "woking",             club: "Woking",                   stadium: "Kingfield Stadium" },
      { id: "worthing",           club: "Worthing",                 stadium: "Woodside Road" },
      { id: "yeovil-town",        club: "Yeovil Town",              stadium: "Huish Park" }
    ]
  }
];

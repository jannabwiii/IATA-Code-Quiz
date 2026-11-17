// Source data from the World Geography handout (codes + pronunciation pages).
// Code suffixes: "~" metro code (blue), "*" airport-name code (orange), "^" old/local name (purple), none = from city name (green).
/** Supplemental memory notes; the original handout rows below remain unchanged. */
export const CODE_ORIGINS: Record<string, { name: string; note: string }> = {
  BOM: { name: "Bombay", note: "Mumbai was formerly called Bombay. BOM keeps the first three letters of that older English name." },
  PEK: { name: "Peking", note: "Peking is an older English spelling of Beijing. PEK preserves that spelling." },
  SGN: { name: "Saigon", note: "Ho Chi Minh City was formerly called Saigon. SGN retains letters from the old name." },
  CAN: { name: "Canton", note: "Canton is an older English name for Guangzhou. CAN comes from that older name." },
  LED: { name: "Leningrad", note: "Saint Petersburg was called Leningrad when LED was assigned. The airport kept the code after the city was renamed." },
  MUC: { name: "Munich", note: "Munich is München in German. MUC is associated with the city's name, rather than an airport founder." },
  NUE: { name: "Nuernberg", note: "Nuremberg is Nürnberg in German, also written Nuernberg. NUE matches the start of that spelling." },
  TNR: { name: "Tananarive", note: "Tananarive is the former French name of Antananarivo. TNR retains letters from that name." },
  SSG: { name: "Santa Isabel", note: "Malabo was formerly called Santa Isabel. SSG is a legacy code from that earlier name." },
  JFK: { name: "John F. Kennedy", note: "JFK comes from John F. Kennedy, the US president after whom the airport is named." },
  CDG: { name: "Charles de Gaulle", note: "CDG comes from Charles de Gaulle, the French president after whom the airport is named." },
  NRT: { name: "Narita", note: "NRT comes from Narita, the location and name of this Tokyo-area airport." },
  HND: { name: "Haneda", note: "HND comes from Haneda, the name of this Tokyo airport." },
  ORD: { name: "Orchard Field", note: "Chicago O’Hare was previously called Orchard Field. ORD keeps that earlier airport name." },
  MCO: { name: "McCoy", note: "Orlando's MCO code comes from the former McCoy Air Force Base on the airport site." },
  BNA: { name: "Berry Field", note: "Nashville's BNA comes from Berry Field Nashville, the airport's original name." },
  FCO: { name: "Fiumicino", note: "FCO comes from Fiumicino, the town where Rome's main airport is located." },
  ICN: { name: "Incheon", note: "ICN comes from Incheon, the city where this Seoul-area airport is located." },
  CGK: { name: "Cengkareng", note: "CGK comes from Cengkareng, the area associated with Jakarta's Soekarno–Hatta airport." },
  YYZ: { name: "Toronto Pearson", note: "YYZ does not spell Toronto. YZ was the local station identifier; the Canadian airport code added Y. Memorize it as a legacy identifier." },
};

/** Extra explanations revealed by quizzes only; no changes to the handout or study tables. */
export const QUIZ_CODE_ORIGINS: Record<string, { name: string; note: string }> = {
  ...CODE_ORIGINS,
  CVG: { name: "Covington", note: "CVG comes from Covington, Kentucky, the nearest sizeable city when the airport opened in 1947. It serves Cincinnati but is in Northern Kentucky." },
  MDW: { name: "Midway", note: "Chicago's MDW comes from Midway Airport, named in honor of the World War II Battle of Midway." },
  BWI: { name: "Baltimore Washington International", note: "BWI stands for Baltimore–Washington International, the airport serving the Baltimore and Washington region." },
  MSP: { name: "Minneapolis Saint Paul", note: "MSP combines Minneapolis and Saint Paul, the two cities served by this airport." },
  EWR: { name: "Newark", note: "EWR uses interior letters of Newark. N-initial identifiers were reserved for the US Navy, so it could not simply start with N." },
  LGA: { name: "LaGuardia", note: "LGA comes from LaGuardia Airport, named after former New York mayor Fiorello La Guardia." },
  PDX: { name: "Portland", note: "Portland's old two-letter identifier was PD. X was added when airport identifiers expanded to three letters; it does not stand for a word." },
  LAX: { name: "Los Angeles", note: "Los Angeles used the two-letter identifier LA. X was added when identifiers expanded to three letters; it does not stand for a word." },
  IAD: { name: "International Airport Dulles", note: "IAD stands for International Airport Dulles. The original DIA was rearranged to avoid confusion with nearby Washington National's DCA." },
  IAH: { name: "Intercontinental Airport Houston", note: "IAH comes from Intercontinental Airport Houston, now named George Bush Intercontinental Airport." },
  YYC: { name: "Calgary", note: "YYC is Calgary's legacy Canadian identifier. Canadian airport codes commonly start with Y; the remaining letters need not spell the city." },
  YUL: { name: "Montreal Dorval", note: "YUL is the legacy identifier for Montreal's Dorval airport, now Montréal–Trudeau. It follows Canada's Y-prefix convention, not the letters of Montreal." },
  YOW: { name: "Ottawa", note: "YOW is Ottawa's legacy Canadian airport identifier. Y is the common Canadian prefix; OW is the retained local identifier." },
  YVR: { name: "Vancouver", note: "YVR follows Canada's Y-prefix convention, with VR as Vancouver's local identifier. It is not a three-letter abbreviation of the city name." },
  YMQ: { name: "Montreal", note: "YMQ is a metropolitan booking code for Montreal's airport group, not the name of a single airport. YUL identifies Montréal–Trudeau." },
  YTO: { name: "Toronto", note: "YTO is Toronto's metropolitan booking code, not a single airport. YYZ identifies Toronto Pearson." },
  DTT: { name: "Detroit", note: "DTT groups Detroit-area airports for booking. DTW identifies Detroit Metropolitan Wayne County Airport." },
  NYC: { name: "New York City", note: "NYC stands for New York City and groups its airports for booking. JFK and LGA identify individual airports." },
  WAS: { name: "Washington", note: "WAS groups Washington-area airports for booking; IAD identifies Dulles specifically." },
  PUJ: { name: "Punta Cana", note: "PUJ identifies Punta Cana International Airport. The exact reason for the final J is not established here; learn the airport–code pair rather than inventing a word for J." },
  SXM: { name: "Sint Maarten", note: "SXM identifies Princess Juliana Airport on Sint Maarten. SM recalls Sint Maarten, with X distinguishing the identifier; it is not the initials of Princess Juliana." },
  BUE: { name: "Buenos Aires", note: "BUE is the metropolitan booking code for Buenos Aires, while EZE identifies Ezeiza Airport." },
  EZE: { name: "Ezeiza", note: "EZE comes from Ezeiza, the location of Buenos Aires' Ministro Pistarini International Airport." },
  RIO: { name: "Rio de Janeiro", note: "RIO is the metropolitan booking code for Rio de Janeiro, rather than one airport. GIG identifies Galeão." },
  GIG: { name: "Galeão Ilha do Governador", note: "GIG refers to Galeão on Ilha do Governador (Governor's Island), the location of Rio de Janeiro's international airport." },
  SAO: { name: "São Paulo", note: "SAO groups São Paulo-area airports for booking. GRU identifies Guarulhos specifically." },
  GRU: { name: "Guarulhos", note: "GRU comes from Guarulhos, the city where São Paulo's main international airport is located." },
  UIO: { name: "Quito", note: "UIO uses letters from Quito, omitting Q and T. It identifies Quito's airport; no separate historical name is needed to remember it." },
  PTY: { name: "Panama City", note: "PTY identifies Tocumen International Airport serving Panama City. Treat PTY as the assigned city–airport identifier, not the initials of the airport's full name." },
  RIX: { name: "Riga", note: "RIX identifies Riga Airport. RI recalls Riga, but X does not represent another letter in the city name." },
  TRF: { name: "Torp Sandefjord", note: "TRF identifies Torp Airport near Sandefjord, marketed as an Oslo-area airport. It is not Oslo Gardermoen (OSL)." },
  RYG: { name: "Rygge", note: "RYG comes from Rygge, the location of the airport listed as Oslo–Moss Rygge in the handout." },
  STO: { name: "Stockholm", note: "STO groups Stockholm-area airports for booking; ARN identifies Arlanda specifically." },
  ARN: { name: "Arlanda", note: "ARN comes from Arlanda, the name of Stockholm's main international airport." },
  BHX: { name: "Birmingham", note: "BHX identifies Birmingham Airport. BH recalls Birmingham; X distinguishes the code rather than spelling a word in the city name." },
  MME: { name: "Teesside", note: "MME is associated with Middlesbrough, a town served by Teesside International Airport. The handout lists the airport under Durham." },
  HUY: { name: "Humberside", note: "HUY identifies Humberside Airport. HU recalls Humberside; the code is not a complete ordered spelling from that name." },
  LBA: { name: "Leeds Bradford Airport", note: "LBA stands for Leeds Bradford Airport, combining the two cities it serves." },
  LON: { name: "London", note: "LON groups London airports for booking. LHR is Heathrow; LCY is London City Airport." },
  LHR: { name: "London Heathrow", note: "LHR comes from London Heathrow, not London alone." },
  LCY: { name: "London City", note: "LCY identifies London City Airport; distinguish it from London's metropolitan code LON." },
  MSE: { name: "Manston", note: "MSE is Manston Airport's assigned identifier, also associated with its former Kent International name. Its exact letter origin is not established here." },
  MSQ: { name: "Minsk", note: "MSQ identifies Minsk's airport. MS recalls Minsk; the Q is part of the assigned identifier, not a letter from a separate airport name." },
  TXL: { name: "Tegel", note: "TXL identifies Berlin's former Tegel Airport. It remains in the handout as a historical airport code, rather than Berlin's current BER." },
  WAW: { name: "Warszawa", note: "Warszawa is the Polish name for Warsaw. WAW uses letters from that local name." },
  BUH: { name: "Bucharest", note: "BUH is Bucharest's metropolitan booking code. OTP identifies Henri Coandă Airport at Otopeni." },
  OTP: { name: "Otopeni", note: "OTP comes from Otopeni, the town where Bucharest's Henri Coandă Airport is located." },
  MOW: { name: "Moscow", note: "MOW groups Moscow-area airports for booking; SVO identifies Sheremetyevo." },
  SVO: { name: "Sheremetyevo", note: "SVO comes from Sheremetyevo, the name of this Moscow airport." },
  IEV: { name: "Kiev", note: "IEV preserves letters from Kiev, the older English spelling of Kyiv. It identifies Kyiv's airport at Zhuliany, not Boryspil." },
  KBP: { name: "Kyiv Boryspil", note: "KBP identifies Boryspil Airport serving Kyiv, distinguishing it from the city's Zhuliany airport (IEV)." },
  BLQ: { name: "Bologna", note: "BLQ identifies Bologna's airport. BL recalls Bologna; the exact historical reason for Q is not established here." },
  FLR: { name: "Florence", note: "FLR uses letters from Florence, the English name of Firenze. It does not come from the airport's Amerigo Vespucci name." },
  GOA: { name: "Genoa", note: "GOA uses letters from Genoa, the English name of Genova. It is not the initials of the airport's Christopher Columbus name." },
  MIL: { name: "Milan", note: "MIL groups Milan-area airports for booking; the other codes in this row identify separate airports." },
  LIN: { name: "Linate", note: "LIN comes from Linate, the name and location of this Milan airport." },
  MXP: { name: "Malpensa", note: "MXP identifies Milan Malpensa Airport. M and P recall Malpensa; X is part of the assigned identifier, not a letter in the name." },
  BGY: { name: "Bergamo", note: "BGY identifies the airport at Bergamo (Orio al Serio), often marketed as Milan Bergamo. It is not derived from Milan." },
  PMF: { name: "Parma", note: "PMF identifies Parma Airport, another airport in the handout's Milan group. Do not read it as an abbreviation of Milan." },
  ROM: { name: "Rome", note: "ROM is Rome's metropolitan booking code, while FCO identifies Fiumicino Airport." },
  TRN: { name: "Torino", note: "Torino is the Italian name for Turin. TRN follows letters from that local name." },
  VCE: { name: "Venice", note: "VCE uses letters from Venice, the English name of Venezia. The airport is named Marco Polo, but its code is city-based." },
  CMN: { name: "Casablanca Mohammed V", note: "CMN identifies Casablanca's Mohammed V Airport. CAS is a different city/airport identifier in the handout; CMN does not spell Casablanca in order." },
  OPO: { name: "Oporto", note: "Oporto is an older English form of Porto. OPO retains letters from that form." },
  AGP: { name: "Málaga", note: "AGP identifies Málaga Airport. AG can be found in Málaga, but P is not in the city name; the exact historical choice of P is not established here." },
  SAW: { name: "Sabiha Gökçen", note: "SAW identifies Istanbul's Sabiha Gökçen Airport, distinct from IST. The code should not be read as three initials of Sabiha Gökçen." },
  AGF: { name: "Agen La Garenne", note: "AGF identifies Agen–La Garenne Airport. Its assigned identifier is not a complete ordered abbreviation of Agen." },
  BES: { name: "Brest", note: "BES uses letters from Brest. Although marked as an airport-name code in the handout, the letters also appear in the city name." },
  CFR: { name: "Caen Carpiquet", note: "CFR identifies Caen–Carpiquet Airport. Learn it with Carpiquet, the airport's location, rather than trying to spell all three letters from Caen." },
  DCM: { name: "Castres Mazamet", note: "DCM identifies Castres–Mazamet Airport, serving both towns. It is not a simple three-letter abbreviation of Castres alone." },
  LDE: { name: "Lourdes", note: "LDE uses letters from Lourdes. The airport serves both Tarbes and Lourdes and is also called Tarbes–Lourdes–Pyrénées." },
  LYS: { name: "Lyon Satolas", note: "LYS retains Lyon–Satolas, the airport's earlier name before it became Lyon–Saint Exupéry." },
  ETZ: { name: "Metz Nancy Lorraine", note: "ETZ identifies Metz–Nancy–Lorraine Airport. The handout's train label is retained, but ETZ itself is an airport code." },
  BSL: { name: "Basel", note: "BSL comes from Basel, one of the cities served by EuroAirport Basel–Mulhouse–Freiburg." },
  EAP: { name: "EuroAirport", note: "EAP is the shared EuroAirport booking identifier, associated with the Basel and Mulhouse airport identifiers BSL and MLH." },
  MLH: { name: "Mulhouse", note: "MLH comes from Mulhouse, the French city served by EuroAirport alongside Basel and Freiburg." },
  PAR: { name: "Paris", note: "PAR groups Paris-area airports for booking; CDG and ORY identify individual airports." },
  ORY: { name: "Orly", note: "ORY comes from Orly, the name and location of this Paris airport." },
  PUF: { name: "Pau France", note: "PUF identifies Pau–Pyrénées Airport. PU recalls Pau; use France as a memory cue for F, not as a claim about its documented historical origin." },
  PGF: { name: "Perpignan France", note: "PGF identifies Perpignan–Rivesaltes Airport. PG recalls Perpignan; France is a memory cue for F rather than a verified historical expansion." },
  UIP: { name: "Quimper", note: "UIP uses interior letters of Quimper, omitting the initial Q. It identifies Quimper's airport at Pluguffan." },
  SXB: { name: "Strasbourg", note: "SXB identifies Strasbourg Airport. S and B recall Strasbourg; X distinguishes the assigned identifier rather than spelling the city." },
  NSI: { name: "Nsimalen", note: "NSI comes from Nsimalen, the location and name of Yaoundé's international airport." },
  FIH: { name: "N’djili", note: "FIH identifies Kinshasa's N’djili Airport. It is a legacy identifier, not the initials of Kinshasa or N’djili; its exact letter origin is not established here." },
  MLW: { name: "Monrovia", note: "MLW identifies Monrovia's Spriggs Payne Airport. It is distinct from Roberts International (ROB)." },
  ROB: { name: "Roberts", note: "ROB comes from Roberts International Airport, named after Liberia's first president, Joseph Jenkins Roberts." },
  FNA: { name: "Freetown", note: "FNA identifies Freetown's international airport at Lungi. The final A does not complete a spelling from Freetown; learn the city–airport pair." },
  LFW: { name: "Lomé", note: "LFW identifies Lomé's international airport. Its exact letter origin is not established here; it is not a complete abbreviation of Lomé." },
  JRO: { name: "Kilimanjaro", note: "JRO comes from the ending of Kilimanjaro, the mountain and region served by this airport." },
  MRU: { name: "Mauritius", note: "MRU uses letters from Mauritius. The airport is named Sir Seewoosagur Ramgoolam, but the code recalls the island, not his initials." },
  SEZ: { name: "Seychelles", note: "SEZ identifies Seychelles International Airport on Mahé. SE recalls Seychelles; the final Z is part of the identifier, not Mahé's name." },
  RUN: { name: "Réunion", note: "RUN uses letters from Réunion, the island where Saint-Denis and Roland Garros Airport are located." },
  DXB: { name: "Dubai", note: "Dubai could not use DUB, which belongs to Dublin. DXB is its distinct assigned identifier; X does not stand for a separate word in Dubai." },
  BJS: { name: "Beijing", note: "BJS is Beijing's metropolitan booking code. PEK identifies Beijing Capital Airport and preserves the older spelling Peking." },
  SHA: { name: "Shanghai Hongqiao", note: "SHA identifies Shanghai Hongqiao Airport and is also used for Shanghai's city booking group; PVG identifies Pudong separately." },
  PVG: { name: "Pudong", note: "PVG identifies Shanghai Pudong Airport. P and G recall Pudong; V is part of the assigned identifier, not a letter from Shanghai." },
  XMN: { name: "Xiamen", note: "XMN uses letters from Xiamen, the city's modern romanized name. You do not need an older name to remember it." },
  BLR: { name: "Bangalore", note: "BLR retains letters from Bangalore, the older English name of Bengaluru." },
  JKT: { name: "Jakarta", note: "JKT is Jakarta's metropolitan booking code; CGK identifies Soekarno–Hatta Airport at Cengkareng." },
  OSA: { name: "Osaka", note: "OSA groups Osaka-area airports for booking. KIX identifies Kansai International." },
  KIX: { name: "Kansai International", note: "KIX comes from Kansai International, the airport serving the Osaka region. KI recalls its name; X completes its distinct identifier." },
  TYO: { name: "Tokyo", note: "TYO groups Tokyo's airports for booking. NRT identifies Narita and HND identifies Haneda." },
  SEL: { name: "Seoul", note: "SEL is Seoul's metropolitan booking code. ICN identifies Incheon International Airport." },
};

export const SECTIONS: [string, number, string][] = [
["NORTH AMERICA",1,`Canada: Calgary@Alberta YYC^; Montreal@Quebec YMQ~/YUL^; Ottawa (bus)@Ontario YOW^; Toronto@Ontario YTO~/YYZ^; Vancouver@British Columbia YVR^
Mexico: Cancún@Quintana Roo CUN; Mexico City@Ciudad de México MEX
United States: Phoenix@AZ – Arizona PHX; Los Angeles@CA – California LAX; San Francisco@CA – California SFO; San Diego@CA – California SAN; Denver@CO – Colorado DEN; Orlando@FL – Florida MCO*; Miami@FL – Florida MIA; Fort Lauderdale@FL – Florida FLL; Tampa@FL – Florida TPA; Atlanta@GA – Georgia ATL; Chicago@IL – Illinois ORD*; Chicago@IL – Illinois MDW*; Boston@MA – Massachusetts BOS; Baltimore@MD – Maryland BWI*; Detroit@MI – Michigan DTT~/DTW; Minneapolis@MN – Minnesota MSP*; Charlotte@NC – North Carolina CLT; Newark@NJ – New Jersey EWR*; Las Vegas@NV – Nevada LAS; New York@NY – New York NYC~/JFK*/LGA*; Cincinnati@OH – Ohio CVG*; Portland@OR – Oregon PDX*; Philadelphia@PA – Pennsylvania PHL; Pittsburgh@PA – Pennsylvania PIT; Nashville@TN – Tennessee BNA*; Dallas@TX – Texas DFW; Houston@TX – Texas HOU/IAH*; Salt Lake City@UT – Utah SLC; Washington D.C.@VA – Virginia WAS~/IAD*; Seattle@WA – Washington SEA`],
["CARIBBEAN & FRENCH GUIANA",1,`Aruba: Aruba AUA
Bonaire: Bonaire BON
Cuba: Havana HAV
Curaçao: Curaçao CUR
Dominican Rep.: Punta Cana PUJ*
French Guiana: Cayenne CAY
Guadeloupe: Pointe-à-Pitre PTP
Haiti: Port-au-Prince PAP
Martinique: Fort de France FDF
Sint Maarten: Saint Maarten SXM*
Suriname: Paramaribo PBM`],
["SOUTH AMERICA",1,`Argentina: Buenos Aires BUE~/EZE*
Brazil: Brasilia BSB; Fortaleza FOR; Rio de Janeiro RIO~/GIG*; São Paulo SAO~/GRU*
Chile: Santiago SCL
Colombia: Bogota BOG
Ecuador: Guayaquil GYE; Quito UIO*
Panama: Panama City PTY*
Peru: Lima LIM
Uruguay: Montevideo MVD
Venezuela: Caracas CCS`],
["NORTH EUROPE",2,`Belgium: Antwerp ANR; Brussels BRU
Denmark: Aalborg AAL; Billund BLL; Copenhagen CPH
Estonia: Tallinn TLL
Finland: Helsinki HEL
Ireland: Cork ORK; Dublin DUB
Latvia: Riga RIX*
Luxembourg: Luxembourg LUX
Netherlands: Amsterdam AMS; Rotterdam RTM
Norway: Aalesund AES; Bergen BGO; Kristiansand KRS; Oslo-Gardermoen OSL; Oslo-Sandefjord OSL/TRF*; Oslo-Moss Rygge RYG*; Stavanger SVG; Trondheim TRD
Sweden: Goteborg GOT; Linkoping LPI; Stockholm STO~/ARN*
United Kingdom: Aberdeen ABZ; Belfast BFS; Birmingham BHX*; Bristol BRS; Cardiff CWL; Durham MME*; Edinburgh EDI; Exeter EXT; Glasgow GLA; Humberside HUY*; Inverness INV; Leeds LBA*; London-Heathrow LON~/LHR*; London City LON~/LCY*; Manchester MAN; Manston MSE*; Newcastle NCL; Norwich NWI; Southampton SOU`],
["CENTRAL & EASTERN EUROPE",2,`Austria: Vienna VIE
Armenia: Yerevan EVN
Azerbaijan: Baku BAK
Belarus: Minsk MSQ*
Bulgaria: Sofia SOF
Croatia: Zagreb ZAG
Czech Republic: Prague PRG
Georgia: Tbilisi TBS
Germany: Berlin BER/TXL*; Bremen BRE; Cologne CGN; Dusseldorf DUS; Frankfurt FRA; Hamburg HAM; Hanover HAJ; Munich MUC^; Nuremberg NUE^; Stuttgart STR
Hungary: Budapest BUD
Poland: Gdansk GDN; Krakow KRK; Warsaw WAW^
Romania: Bucharest BUH~/OTP*
Russia: Moscow MOW~/SVO*; Saint Petersburg LED^
Serbia: Belgrade BEG
Slovenia: Ljubljana LJU
Switzerland: Bern BRN; Geneva GVA; Zurich ZRH
Ukraine: Kyiv IEV^/KBP*`],
["SOUTHERN EUROPE & NORTH AFRICA",2,`Algeria: Algiers ALG
Cyprus: Larnaca LCA
Greece: Athens ATH
Israel: Tel Aviv TLV
Italy: Bologna BLQ*; Florence FLR^; Genoa GOA^; Milan MIL~/LIN*/MXP*/BGY*/PMF*; Naples NAP; Pisa PSA; Rome ROM~/FCO*; Turin TRN^; Venice VCE^; Verona VRN
Malta: Malta MLA
Morocco: Casablanca CAS/CMN*; Rabat RBA
Portugal: Lisbon LIS; Porto OPO^
Spain: Barcelona BCN; Bilbao BIO; Madrid MAD; Malaga AGP*; Palma de Mallorca PMI; Valencia VLC; Vigo VGO
Tunisia: Tunis TUN
Türkiye: Antalya AYT; Istanbul IST/SAW*`],
["CONTINENTAL FRANCE & CORSICA",2,`France: Ajaccio AJA; Agen AGF*; Aurillac AUR; Avignon* (train) AVN; Bastia BIA; Biarritz BIQ; Bordeaux BOD; Brest BES*; Brive BVE; Caen CFR*; Calvi CLY; Castres DCM*; Clermont Ferrand CFE; Figari FSC; La Rochelle LRH; Lannion LAI; Lille* (train) LIL; Lorient LRT; Lourdes/Tarbes LDE*; Lyon LYS*; Marseille** MRS; Metz Nancy* (train) ETZ*; Montpellier MPL; Mulhouse Basel BSL*/EAP*/MLH*; Nantes NTE; Nice** NCE; Paris PAR~/CDG*/ORY*; Pau PUF*; Perpignan PGF*; Poitiers* (train) PIS; Quimper UIP*; Rennes RNS; Rodez RDZ; Strasbourg SXB*; Toulon TLN; Toulouse** TLS`],
["AFRICA",2,`Angola: Luanda LAD
Benin: Cotonou COO
Burkina Faso: Ouagadougou OUA
Cameroon: Douala DLA; Yaounde YAO/NSI*
Central African Rep.: Bangui BGF
Chad: N’Djamena NDJ
Congo Brazzaville: Brazzaville BZV; Kinshasa FIH*; Pointe Noire PNR
Côte d’Ivoire: Abidjan ABJ
Egypt: Cairo CAI
Equatorial Guinea: Malabo SSG^
Gabon: Libreville LBV
Ghana: Accra ACC
Guinea: Conakry CKY
Kenya: Nairobi NBO
Liberia: Monrovia MLW*/ROB*
Mali: Bamako BKO
Mauritania: Nouakchott NKC
Niger: Niamey NIM
Nigeria: Abuja ABV; Lagos LOS; Port Harcourt PHC
Rwanda: Kigali KGL
Senegal: Dakar DKR
Sierra Leone: Freetown FNA*
Tanzania: Dar es Salaam DAR; Kilimanjaro JRO
Togo: Lome LFW*
Uganda: Entebbe EBB
Zambia: Lusaka LUN
Zimbabwe: Harare HRE`],
["INDIAN OCEAN (note: Maldives is Area 3)",2,`Madagascar: Antananarivo TNR^
Maldives: Male MLE
Mauritius: Mauritius MRU*
Reunion: Saint Denis RUN
Seychelles: Mahe Island SEZ*`],
["MIDDLE EAST",2,`Bahrain: Bahrain BAH
Djibouti: Djibouti JIB
Jordan: Amman AMM
Kuwait: Kuwait KWI
Lebanon: Beirut BEY
Oman: Muscat MCT
Qatar: Doha DOH
Saudi Arabia: Dammam DMM; Jeddah JED; Riyadh RUH
Syria: Damascus DAM
UAE: Abu Dhabi AUH; Dubai DXB`],
["ASIA",3,`China: Beijing BJS~/PEK^; Chengdu CTU; Guangzhou CAN^; Hangzhou HGH; Shanghai SHA~/PVG*; Wuhan WUH; Xiamen XMN^
Hong Kong SAR: Hong Kong HKG
India: Bangalore BLR^; Delhi DEL; Mumbai BOM^
Indonesia: Denpasar DPS; Jakarta JKT~/CGK*
Japan: Fukuoka FUK; Osaka OSA~/KIX*; Tokyo TYO~/NRT*/HND*
Kazakhstan: Almaty ALA
Malaysia: Kuala Lumpur KUL
Philippines: Manila MNL
Singapore: Singapore SIN
South Korea: Seoul SEL~/ICN*
Taiwan: Taipei TPE
Thailand: Bangkok BKK
Vietnam: Hanoi HAN; Ho Chi Minh SGN^`],
["AUSTRALIA & THE PACIFIC",3,`Australia: Adelaide ADL; Brisbane BNE; Cairns CNS; Darwin DRW; Melbourne MEL; Perth PER; Sydney SYD
French Polynesia: Papeete (Tahiti) PPT
New Caledonia: Noumea NOU
New Zealand: Auckland AKL`]
];

export const HINTS_RAW = "Qatar=KUH-ter;Haiti=HAY-tee;Curaçao=KYOOR-uh-sow;Guadeloupe=GWAH-duh-loop;Türkiye=TUR-kee-yeh;Côte d’Ivoire=koht dee-VWAHR;Burkina Faso=boor-KEE-nuh FAH-soh;Niger=nee-ZHAIR;Guinea=GIN-ee;Djibouti=jih-BOO-tee;Oman=oh-MAHN;Kuwait=koo-WAYT;Bahrain=bah-RAYN;Rwanda=roo-AHN-duh;Uganda=yoo-GAN-duh;Zimbabwe=zim-BAHB-way;Kazakhstan=KAH-zahk-stahn;Uruguay=YOOR-uh-gway;Venezuela=ven-eh-ZWAY-luh;Peru=peh-ROO;Suriname=SOOR-ih-nahm;Seychelles=say-SHELZ;Maldives=MAWL-deevz;Slovenia=sloh-VEE-nee-uh;Croatia=kroh-AY-shuh;Azerbaijan=ah-zer-by-JAHN;Belarus=bel-uh-ROOS;Kyiv=KEEV;Gdansk=guh-DANSK;Aalesund=OH-leh-sund;Ouagadougou=WAH-gah-DOO-goo;Antananarivo=AHN-tah-NAH-nah-REE-voh;Cancún=kan-KOON;Montreal=MUN-tree-AWL;Ho Chi Minh=HOH chee MIN;Doha=DOH-hah;Dubai=doo-BY;Abu Dhabi=AH-boo DAH-bee;Beijing=bay-JING;Guangzhou=gwahng-JOH;Hangzhou=hahng-JOH;Chengdu=chung-DOO;Xiamen=shyah-MUN;Wuhan=WOO-hahn;Nairobi=ny-ROH-bee;Kilimanjaro=kil-ih-mun-JAR-oh;Zagreb=ZAH-greb;Budapest=BOO-dah-pest;Krakow=KRAH-koof;Ljubljana=lyoo-BLYAH-nah;Tbilisi=tuh-BIL-ih-see;Yerevan=yeh-reh-VAHN;Baku=bah-KOO;Beirut=bay-ROOT;Amman=ah-MAHN;Muscat=MUS-kat;Riyadh=ree-YAHD;Jeddah=JED-uh;Dammam=dah-MAHM;Abuja=ah-BOO-jah;Lagos=LAY-gos;Dakar=dah-KAR;Libreville=LEE-bruh-veel;Abidjan=AB-ih-jahn;Accra=AK-rah;Conakry=KON-uh-kree;Kigali=kih-GAH-lee;Lusaka=loo-SAH-kah;Harare=hah-RAH-ray;Entebbe=en-TEB-ay;Kinshasa=kin-SHAH-sah;Marseille=mar-SAY;Lyon=lee-OHN;Toulouse=too-LOOZ;Bordeaux=bor-DOH;Nantes=NAHNT;Strasbourg=STRAHZ-boor;Biarritz=bee-ah-RITS;Cologne=kuh-LOHN;Dusseldorf=DOO-sel-dorf;Munich=MYOO-nik;Nuremberg=NYOOR-um-berg;Stuttgart=SHTUT-gart;Zurich=ZYOOR-ik;Turin=TYOOR-in;Verona=veh-ROH-nah;Genoa=JEN-oh-ah;Bologna=boh-LOHN-yah;Pisa=PEE-zah;Porto=POR-too;Barcelona=bar-seh-LOH-nah;Bilbao=bil-BAH-oh;Malaga=MAH-lah-gah;Rabat=rah-BAHT;Antalya=AN-tahl-yah;Istanbul=iss-tan-BOOL;Larnaca=LAR-nah-kah;Algiers=al-JEERZ;Noumea=noo-MAY-ah;Seoul=SOHL;Taipei=ty-PAY;Osaka=oh-SAH-kah;Fukuoka=foo-koo-OH-kah;Tokyo=TOH-kyoh;Denpasar=den-PAH-sar;Jakarta=juh-KAR-tuh;Almaty=al-MAH-tee;Mumbai=MUM-by;Bangalore=BANG-uh-lor;Delhi=DEL-ee;Bogota=boh-goh-TAH;Quito=KEE-toh;Guayaquil=gwy-ah-KEEL;Buenos Aires=BWAY-nos EYE-rez;Caracas=kah-RAH-kahs;Brasilia=brah-ZEEL-yah;Fortaleza=for-tah-LAY-zah;São Paulo=sow POW-loo;Port-au-Prince=por-toh-PRANS;Pointe-à-Pitre=pwant-ah-PEE-truh;Paramaribo=pah-rah-MAH-ree-boh;Cayenne=ky-EN;Aruba=ah-ROO-bah;Bonaire=boh-NAIR;Edinburgh=ED-in-bruh;Brisbane=BRIZ-bun;Melbourne=MEL-bun;Trondheim=TRON-haym;Stavanger=stah-VANG-er;Bergen=BAIR-gen";

export const LANGS_RAW = "en-GB:United Kingdom,Ghana,Kenya,Nigeria,Sierra Leone,Tanzania,Uganda,Zambia,Zimbabwe,Maldives,Mauritius,Seychelles,Singapore,Malta;en-IE:Ireland;en-IN:India;en-AU:Australia;en-NZ:New Zealand;en-CA:Canada;fr-FR:France,French Guiana,Guadeloupe,Haiti,Martinique,Luxembourg,Benin,Burkina Faso,Cameroon,Central African Rep.,Chad,Congo Brazzaville,Côte d’Ivoire,Gabon,Guinea,Mali,Niger,Rwanda,Senegal,Togo,Madagascar,Reunion,Djibouti,French Polynesia,New Caledonia;es-MX:Mexico,Cuba,Dominican Rep.,Ecuador,Panama,Peru,Venezuela,Colombia;es-AR:Argentina,Uruguay;es-CL:Chile;es-ES:Spain,Equatorial Guinea;pt-BR:Brazil;pt-PT:Portugal,Angola;nl-NL:Netherlands,Aruba,Bonaire,Sint Maarten,Suriname;nl-BE:Belgium;de-DE:Germany;de-AT:Austria;de-CH:Switzerland;it-IT:Italy;da-DK:Denmark;et-EE:Estonia;fi-FI:Finland;lv-LV:Latvia;nb-NO:Norway;sv-SE:Sweden;pl-PL:Poland;ro-RO:Romania;cs-CZ:Czech Republic;hu-HU:Hungary;hr-HR:Croatia;sl-SI:Slovenia;tr-TR:Türkiye;id-ID:Indonesia;ms-MY:Malaysia;vi-VN:Vietnam";

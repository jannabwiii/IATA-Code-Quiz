// Source data from the World Geography handout (codes + pronunciation pages).
// Code suffixes: "~" metro code (blue), "*" airport-name code (orange), "^" old/local name (purple), none = from city name (green).
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

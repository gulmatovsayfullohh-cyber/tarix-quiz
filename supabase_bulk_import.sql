-- =============================================
-- TARIX QUIZ — Barcha savollar bulk import
-- Supabase SQL Editor ga yapishtirib Run bosing
-- =============================================

-- Avvalgi test savollarni o'chirish (agar bo'lsa)
DELETE FROM public.questions WHERE mavzu LIKE '%XIII asr%' OR mavzu LIKE '%Mo%g%ul%' OR mavzu LIKE '%Temur%' OR mavzu LIKE '%Ulug%' OR mavzu LIKE '%Fran%' OR mavzu LIKE '%jahon urush%' OR mavzu LIKE '%Sanoat%';

INSERT INTO public.questions (fan, mavzu, savol, variantlar, javob, izoh, sinf) VALUES

-- ============================================================
-- O'ZBEKISTON TARIXI — 8-sinf
-- ============================================================

-- Mavzu 1: XIII asr boshlarida Xorazm davlatida siyosiy vaziyat
('O''zbekiston tarixi', 'XIII asr boshlarida Xorazm davlatida siyosiy vaziyat',
 'Sulton Muhammad Xorazmshoh qaysi sulola vakili bo''lgan?',
 ARRAY['Afrig''iylar', 'Oltintoshiylar', 'Ma''muniylar', 'Anushteginiylar'], 3,
 '1017-yil Anushteginiylar sulolasiga Muhammad otasi Takash asos soladi.', 8),

('O''zbekiston tarixi', 'XIII asr boshlarida Xorazm davlatida siyosiy vaziyat',
 'Alouddin Muhammad nechanchi yili Movarounnahrda Qoraxoniylar boshqaruviga chek qo''ydi?',
 ARRAY['1216-yil', '1210-yil', '1212-yil', '1217-yil'], 2,
 'Alouddin Muhammad 1212-yili Qoraxoniylarni haydab chiqaradi.', 8),

('O''zbekiston tarixi', 'XIII asr boshlarida Xorazm davlatida siyosiy vaziyat',
 'Muhammad Xorazmshoh 1212-yil qaysi hududlarni egalladi?',
 ARRAY['Kirmon, Bomiyon', 'Xuroson, Balujiston', 'Kirmon, Balujiston', 'Mozandaron, Seyiston'], 2,
 'Muhammad Xorazmshoh 1212-yili Eronning Kirmon viloyatini, so''ng Balujistonni egalladi.', 8),

('O''zbekiston tarixi', 'XIII asr boshlarida Xorazm davlatida siyosiy vaziyat',
 'Alouddin Muhammad nechanchi yili G''azna, G''ur, Bomiyon yerlarini egalladi?',
 ARRAY['1212', '1217', '1216', '1221'], 2,
 'Alouddin Muhammad 1216-yilda G''azna, G''ur va Bomiyon yerlarini o''z davlatiga qo''shib oladi.', 8),

('O''zbekiston tarixi', 'XIII asr boshlarida Xorazm davlatida siyosiy vaziyat',
 'Xorazm davlatining poytaxti qaysi shahar bo''lgan?',
 ARRAY['Samarqand', 'Buxoro', 'Urganch (Ko''hna Urganch)', 'Termiz'], 2,
 'Ko''hna Urganch (Gurganj) Xorazm davlatining poytaxti bo''lgan.', 8),

('O''zbekiston tarixi', 'XIII asr boshlarida Xorazm davlatida siyosiy vaziyat',
 'Muhammad Xorazmshohning onasi kim bo''lgan?',
 ARRAY['Zuhra Malik', 'Turkon Xotun', 'Oydin Begim', 'Mohlaroyim'], 1,
 'Turkon Xotun Muhammad Xorazmshohning onasi bo''lib, davlat boshqaruvida katta ta''sirga ega bo''lgan.', 8),

-- Mavzu 2: Mo'g'ullar istilosi va uning oqibatlari
('O''zbekiston tarixi', 'Mo''g''ullar istilosi va uning oqibatlari',
 'Chingizxon Xorazm davlatiga qachon bostirib kirdi?',
 ARRAY['1219-yil', '1215-yil', '1221-yil', '1210-yil'], 0,
 'Chingizxon 1219-yilda Xorazm davlatiga yurish boshladi.', 8),

('O''zbekiston tarixi', 'Mo''g''ullar istilosi va uning oqibatlari',
 'Mo''g''ullar istilosiga qarshi Jaloliddin Manguberdi qaysi jangda g''alaba qozondi?',
 ARRAY['Qoradaryo jangi', 'Parvonajangi', 'Sind daryosi jangi', 'Qipchoq jangi'], 2,
 'Jaloliddin Manguberdi 1221-yilda Sind daryosi bo''yidagi jangda mo''g''ullarga qarshi g''alaba qozondi.', 8),

('O''zbekiston tarixi', 'Mo''g''ullar istilosi va uning oqibatlari',
 'Jaloliddin Manguberdining otasi kim?',
 ARRAY['Chingizxon', 'Muhammad Xorazmshoh', 'Takash', 'Otsiz'], 1,
 'Jaloliddin Manguberdi Muhammad Xorazmshohning o''g''li bo''lgan.', 8),

('O''zbekiston tarixi', 'Mo''g''ullar istilosi va uning oqibatlari',
 'Mo''g''ullar istilosidan keyin Movarounnahr qanday ma''muriy birlikka bo''lindi?',
 ARRAY['Viloyatlarga', 'Tumanlarga', 'Ulus va tumanlarga', 'Hokimliklarga'], 2,
 'Mo''g''ullar Movarounnahrni ulus va tumanlarga bo''lib boshqardilar.', 8),

-- Mavzu 3: Temuriylar davri. Amir Temur
('O''zbekiston tarixi', 'Temuriylar davri. Amir Temur',
 'Amir Temur qaysi yili tug''ilgan?',
 ARRAY['1320', '1336', '1370', '1405'], 1,
 'Amir Temur 1336-yil 9-aprelda Kesh (hozirgi Shahrisabz) shahrida tug''ilgan.', 8),

('O''zbekiston tarixi', 'Temuriylar davri. Amir Temur',
 'Amir Temur qaysi yili Movarounnahrda hokimiyatni o''z qo''liga oldi?',
 ARRAY['1360', '1365', '1370', '1380'], 2,
 'Amir Temur 1370-yilda Balx qurultoyida Movarounnahr hukmdori deb e''lon qilindi.', 8),

('O''zbekiston tarixi', 'Temuriylar davri. Amir Temur',
 'Amir Temur imperiyasining poytaxti qaysi shahar bo''lgan?',
 ARRAY['Buxoro', 'Urganch', 'Samarqand', 'Hirot'], 2,
 'Samarqand Amir Temur imperiyasining poytaxti bo''lgan.', 8),

('O''zbekiston tarixi', 'Temuriylar davri. Amir Temur',
 'Amir Temur qaysi yili vafot etgan?',
 ARRAY['1400', '1402', '1405', '1410'], 2,
 'Amir Temur 1405-yil 18-fevralda Sayram (O''tror) shahrida vafot etgan.', 8),

('O''zbekiston tarixi', 'Temuriylar davri. Amir Temur',
 'Amir Temur qaysi qabilaga mansub edi?',
 ARRAY['Jaloyir', 'Barlos', 'Qiyot', 'Qo''ng''irot'], 1,
 'Amir Temur barlos qabilasiga mansub edi.', 8),

-- Mavzu 4: Mirzo Ulug'bek — olim va hukmdor
('O''zbekiston tarixi', 'Mirzo Ulug''bek — olim va hukmdor',
 'Mirzo Ulug''bek kimning nabirasi?',
 ARRAY['Bobur', 'Shayboniyxon', 'Amir Temur', 'Husayn Boyqaro'], 2,
 'Mirzo Ulug''bek Amir Temurning nabirasi, Shohruxning o''g''li bo''lgan.', 8),

('O''zbekiston tarixi', 'Mirzo Ulug''bek — olim va hukmdor',
 'Mirzo Ulug''bek Samarqandda qachon rasadxona qurdirdi?',
 ARRAY['1417-yil', '1420-yil', '1428-yil', '1424-yil'], 2,
 'Ulug''bek rasadxonasi 1428-1429-yillarda qurib bitkazildi.', 8),

('O''zbekiston tarixi', 'Mirzo Ulug''bek — olim va hukmdor',
 'Mirzo Ulug''bekning mashhur astronomik asari qanday nomlanadi?',
 ARRAY['Ziji Ko''ragoniy', 'Kitob ul-Idrisi', 'Al-Qonun', 'Avesto'], 0,
 '"Ziji Ko''ragoniy" — Ulug''bekning asosiy astronomik asari, unda 1018 yulduz koordinatalari keltirilgan.', 8),

('O''zbekiston tarixi', 'Mirzo Ulug''bek — olim va hukmdor',
 'Ulug''bek qaysi yili Samarqand hukmdori bo''ldi?',
 ARRAY['1409', '1415', '1420', '1447'], 0,
 'Mirzo Ulug''bek 1409-yilda otasi Shohrux tomonidan Samarqand hokimi etib tayinlandi.', 8),

-- ============================================================
-- JAHON TARIXI — 8-sinf
-- ============================================================

-- Mavzu 5: Buyuk Fransuz inqilobi
('Jahon tarixi', 'Buyuk Fransuz inqilobi',
 'Buyuk Fransuz inqilobi qaysi yilda boshlangan?',
 ARRAY['1689', '1776', '1789', '1815'], 2,
 '1789-yil 14-iyulda Bastiliya qamalishi bilan boshlangan.', 8),

('Jahon tarixi', 'Buyuk Fransuz inqilobi',
 'Fransuz inqilobi davrida qamal qilingan mashhur qamoqxona qaysi?',
 ARRAY['Tauer', 'Bastiliya', 'Alkatras', 'Kreml'], 1,
 'Bastiliya qal''asi 1789-yil 14-iyulda xalq tomonidan qamal qilindi.', 8),

('Jahon tarixi', 'Buyuk Fransuz inqilobi',
 'Fransuz inqilobi qaysi shior ostida amalga oshdi?',
 ARRAY['Erkinlik, Tenglik, Birodarlik', 'Xudo, Qirol, Vatan', 'Tinchlik, Mehnat, Baxt', 'Adolat, Qonun, Tartib'], 0,
 '"Erkinlik, Tenglik, Birodarlik" — Fransuz inqilobining asosiy shiori.', 8),

('Jahon tarixi', 'Buyuk Fransuz inqilobi',
 'Inqilob davrida Fransiya qiroli kim bo''lgan?',
 ARRAY['Lui XIV', 'Lui XV', 'Lui XVI', 'Napoleon I'], 2,
 'Lui XVI inqilob davrida Fransiya qiroli bo''lgan va 1793-yilda giyotin bilan qatl etilgan.', 8),

-- Mavzu 6: Birinchi jahon urushi
('Jahon tarixi', 'Birinchi jahon urushi (1914–1918)',
 'Birinchi jahon urushi qaysi yilda boshlangan?',
 ARRAY['1904', '1914', '1918', '1939'], 1,
 'Birinchi jahon urushi 1914-yil 28-iyulda boshlangan.', 8),

('Jahon tarixi', 'Birinchi jahon urushi (1914–1918)',
 'Birinchi jahon urushi qaysi yilda tugagan?',
 ARRAY['1916', '1917', '1918', '1920'], 2,
 'Birinchi jahon urushi 1918-yil 11-noyabrda tugagan.', 8),

('Jahon tarixi', 'Birinchi jahon urushi (1914–1918)',
 'Birinchi jahon urushining boshlanishiga sabab bo''lgan voqea qaysi?',
 ARRAY['Fransiya-Germaniya mojarosi', 'Avstriya-Vengriya Serbiyaga urush e''lon qilishi', 'Arxiduk Frans Ferdinandning o''ldirilishi', 'Rossiyaning Turkiyaga hujumi'], 2,
 'Avstriya-Vengriya valiahdi Frans Ferdinand 1914-yil 28-iyunda Sarayevoda o''ldirilishi urushga sabab bo''ldi.', 8),

('Jahon tarixi', 'Birinchi jahon urushi (1914–1918)',
 'Birinchi jahon urushida Antanta blokiga qaysi davlatlar kirgan?',
 ARRAY['Germaniya, Avstriya-Vengriya, Italiya', 'Fransiya, Buyuk Britaniya, Rossiya', 'Turkiya, Bolgariya, Avstriya', 'AQSH, Yaponiya, Germaniya'], 1,
 'Antanta — Fransiya, Buyuk Britaniya va Rossiya ittifoqi.', 8),

-- Mavzu 7: Ikkinchi jahon urushi
('Jahon tarixi', 'Ikkinchi jahon urushi (1939–1945)',
 'Ikkinchi jahon urushi qaysi yilda boshlangan?',
 ARRAY['1933', '1937', '1939', '1941'], 2,
 'Ikkinchi jahon urushi 1939-yil 1-sentyabrda Germaniyaning Polshaga hujumi bilan boshlangan.', 8),

('Jahon tarixi', 'Ikkinchi jahon urushi (1939–1945)',
 'Ikkinchi jahon urushi qachon tugagan?',
 ARRAY['1944', '1945', '1946', '1947'], 1,
 'Ikkinchi jahon urushi 1945-yil 2-sentyabrda Yaponiyaning taslim bo''lishi bilan tugagan.', 8),

('Jahon tarixi', 'Ikkinchi jahon urushi (1939–1945)',
 'AQSH Ikkinchi jahon urushiga qaysi voqeadan so''ng kirdi?',
 ARRAY['Fransiyaning bosib olinishi', 'Pearl-Harbor hujumi', 'Britaniya jangi', 'Stalingrad jangi'], 1,
 '1941-yil 7-dekabrda Pearl-Harbordagi harbiy bazaga Yaponiya hujumidan so''ng AQSH urushga kirdi.', 8),

-- Mavzu 8: Sanoat inqilobi
('Jahon tarixi', 'Sanoat inqilobi',
 'Sanoat inqilobi birinchi qaysi mamlakatda boshlangan?',
 ARRAY['Fransiya', 'Germaniya', 'Buyuk Britaniya', 'AQSH'], 2,
 'Sanoat inqilobi XVIII asr o''rtalarida Buyuk Britaniyada boshlangan.', 8),

('Jahon tarixi', 'Sanoat inqilobi',
 'Bug'' mashinasini kim ixtiro qilgan?',
 ARRAY['Tomas Edison', 'Jeyms Uatt', 'Jorj Stefenson', 'Isak Nyuton'], 1,
 'Jeyms Uatt 1769-yilda bug'' mashinasini takomillashtirdi.', 8),

('Jahon tarixi', 'Sanoat inqilobi',
 'Sanoat inqilobi qaysi asrlarda sodir bo''ldi?',
 ARRAY['XVI-XVII asrlar', 'XVII-XVIII asrlar', 'XVIII-XIX asrlar', 'XIX-XX asrlar'], 2,
 'Sanoat inqilobi XVIII asr o''rtasidan XIX asr o''rtasiga qadar davom etdi.', 8);

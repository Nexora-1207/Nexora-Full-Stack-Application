import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, StatusBar,
  useColorScheme, SafeAreaView
} from 'react-native';
import TopNavBar from '../components/TopNavBar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const ORANGE_DARK  = '#FFAA00';
const ORANGE_LIGHT = '#C68000';

// ─── DATA ────────────────────────────────────────────────────────────────────

const WHY_OPTIONS = [
  { id: 'hands',   text: 'I love working with tools & machinery' },
  { id: 'job',     text: 'I want quick employment after 10th' },
  { id: 'practical', text: 'I prefer practical skills over theory' },
  { id: 'earn',    text: 'I want to earn stipend while learning' },
  { id: 'business', text: 'I want to start my own workshop/service' },
  { id: 'explore', text: 'I am exploring vocational trades' },
];

const WHAT_CARDS = [
  { icon: 'lightning-bolt-outline', label: 'Electrician' },
  { icon: 'hammer-wrench',          label: 'Fitter & Assembly' },
  { icon: 'fire',                   label: 'Welding & Fab' },
  { icon: 'cog-sync',               label: 'Machinist & Lathe' },
  { icon: 'snowflake',              label: 'HVAC & RAC' },
  { icon: 'car-wash',               label: 'Auto Mechanic' },
];

const CHECKLIST_Q = [
  'Do you enjoy fixing or assembling mechanical objects?',
  'Are you comfortable working with power tools and machinery?',
  'Do you prefer physical hands-on learning over long lectures?',
  'Can you follow safety protocols meticulously?',
  'Do you want early financial independence through apprenticeships?',
  'Are you interested in technical industrial operations?',
];

const PERSONALITY = [
  { skill: 'Practical Logic',   icon: 'wrench-outline',       why: 'Diagnose and fix real-world mechanical and electrical faults.' },
  { skill: 'Technical Precision',icon: 'target',               why: 'Operate precision lathes, multimeters, and fitting tools.' },
  { skill: 'Safety Discipline', icon: 'shield-alert-outline', why: 'Adhere strict industrial safety and electrical insulation standards.' },
  { skill: 'Hand-Eye Coordination', icon: 'gesture-tap',       why: 'Master intricate welding, wiring, and machining processes.' },
  { skill: 'Troubleshooting',   icon: 'head-cog-outline',     why: 'Rapidly identify machine breakdowns and execute field repairs.' },
  { skill: 'Work Ethic',        icon: 'account-hard-hat-outline', why: 'Demonstrate reliability on manufacturing floors and construction sites.' },
];

const CHECKPOINTS = [
  {
    id: 1, label: 'Complete Class 10',
    icon: 'school-outline',
    detail: 'Pass Class 10 with Science and Mathematics as core subjects.',
  },
  {
    id: 2, label: 'Choose ITI Trade or Diploma',
    icon: 'book-outline',
    detail: 'Enroll in NCVT/SCVT recognized Industrial Training Institutes (ITI) or 3-year Polytechnic Diplomas.',
    sub: ['ITI Electrician', 'ITI Fitter', 'ITI Welder', 'Polytechnic Diploma'],
    note: '✅ Early entry into industrial workforce right after 10th.',
  },
  {
    id: 3, label: 'Hands-on Workshop Training',
    icon: 'sparkles-outline',
    detail: 'Master practical metal fitting, electrical wiring, blueprint reading, and safety standards.',
    sub: ['Blueprint Reading', 'Electrical Wiring', 'CNC Machining', 'Arc/MIG Welding'],
  },
  {
    id: 4, label: 'NCVT National Trade Certificate (NTC)',
    icon: 'medal-outline',
    detail: 'Clear AITT (All India Trade Test) to earn your government trade certification.',
    degrees: [
      { name: 'ITI Electrician Trade', dur: '2 yrs', subjects: 'Electrical Circuits, Motors, Transformers, Panel Wiring', careers: 'Plant Electrician, Maintenance Tech, Substation Attendant' },
      { name: 'ITI Fitter Trade', dur: '2 yrs', subjects: 'Bench Work, Precision Measurement, Lathe Ops, Assembly', careers: 'Assembly Fitter, Machine Maintenance, Production Tech' },
      { name: 'ITI Welder Trade', dur: '1 yr', subjects: 'TIG, MIG, Gas Welding, Fabrication, Inspection', careers: 'Structural Welder, Pipeline Inspector, Fabrication Lead' },
      { name: 'Diploma Mechanical / Electrical', dur: '3 yrs', subjects: 'Thermodynamics, CAD, Power Systems, Industrial Eng', careers: 'Junior Engineer, Shift Supervisor, Workshop Manager' },
    ],
  },
  {
    id: 5, label: 'NAPS Apprenticeship Scheme',
    icon: 'briefcase-outline',
    detail: 'Undergo 1-year paid industrial apprenticeship in PSUs or private industrial plants.',
    sub: ['Railways', 'BHEL', 'Tata Motors', 'L&T', 'Maruti Suzuki', 'HAL'],
  },
  {
    id: 6, label: 'National Apprenticeship Certificate (NAC)',
    icon: 'ribbon-outline',
    detail: 'Obtain NAC credential for high-grade technician eligibility in government sectors.',
  },
  {
    id: 7, label: 'Industrial Employment',
    icon: 'briefcase-check-outline',
    detail: 'Join manufacturing, power plants, railways, automotive, or construction firms.',
    companies: ['Indian Railways', 'BHEL', 'L&T Heavy Engineering', 'Tata Steel', 'Mahindra', 'Schneider Electric'],
  },
  {
    id: 8, label: 'Career Advancement & Entrepreneurship',
    icon: 'trending-up',
    detail: 'Rise to plant supervisor or launch an independent technical enterprise.',
    growth: ['Junior Technician', 'Senior Trade Tech', 'Shift Supervisor', 'Plant Inspector', 'Workshop Business Owner'],
  },
];

const SKILLS = [
  { icon: 'lightning-bolt-outline',     skill: 'Electrical Wiring' },
  { icon: 'hammer-wrench',              skill: 'Precision Fitting' },
  { icon: 'fire',                       skill: 'Welding & Fabrication' },
  { icon: 'cog-sync',                   skill: 'CNC & Lathe Ops' },
  { icon: 'snowflake',                  skill: 'HVAC Maintenance' },
  { icon: 'shield-check-outline',       skill: 'Industrial Safety' },
  { icon: 'clipboard-text-outline',     skill: 'Blueprint Reading' },
  { icon: 'tools',                      skill: 'Machine Overhaul' },
];

const CAREERS = [
  { role: 'Master Electrician',     icon: 'lightning-bolt-outline', what: 'Installs and maintains high-voltage industrial panels and wiring.', skills: 'Wiring, Circuit Diagrams, Multimeters, Safety' },
  { role: 'Industrial Fitter',      icon: 'hammer-wrench',          what: 'Assembles machine components, aligns shafts, and maintains production gear.', skills: 'Micrometers, Bench Fitting, Lathe, Blueprints' },
  { role: 'Precision Welder',       icon: 'fire',                   what: 'Performs TIG/MIG pressure vessel and structural steel fabrication.', skills: 'TIG/MIG Welding, Metallurgy, Safety Equipment' },
  { role: 'CNC Machine Operator',   icon: 'cog-sync',               what: 'Programs and operates CNC lathes to manufacture high-precision metal parts.', skills: 'G-Code, Precision Gauges, Tool Setup' },
  { role: 'HVAC Technician',        icon: 'snowflake',              what: 'Services commercial air conditioning, chillers, and cold storage units.', skills: 'Refrigeration, Piping, Compressors' },
  { role: 'Automotive Specialist', icon: 'car-wash',               what: 'Diagnoses engine faults, transmission systems, and EV battery packs.', skills: 'OBD Scanners, Engine Overhaul, EV Systems' },
];

const CHALLENGES = [
  { icon: 'alert-circle-outline',       title: 'Physical Demands',          desc: 'Manual work requires physical stamina and outdoor/factory environment resilience.' },
  { icon: 'shield-alert-outline',       title: 'Strict Safety Risks',       desc: 'Handling high voltage, heat, and heavy machinery demands constant vigilance.' },
  { icon: 'clock-alert-outline',        title: 'Shift Schedules',           desc: 'Factories operate in rotational 24/7 shifts including night duties.' },
];

const COLLEGES = [
  { name: 'NSTI Mumbai',         city: 'Mumbai',    desc: 'Premier National Skill Training Institute with advanced CNC labs.' },
  { name: 'Govt ITI Pusa',       city: 'New Delhi', desc: 'India’s flagship ITI known for 100% placement in top industries.' },
  { name: 'NSTI Hyderabad',      city: 'Hyderabad', desc: 'Specialized training in electronics, fitting, and automation.' },
  { name: 'Govt ITI Trichy',     city: 'Trichy',    desc: 'Strong tie-ups with BHEL and manufacturing hubs.' },
  { name: 'Govt ITI Chandigarh', city: 'Chandigarh',desc: 'Excellence in refrigeration, HVAC, and automotive trades.' },
  { name: 'NSTI Chennai',        city: 'Chennai',   desc: 'Top facility for welding inspection and precision tool making.' },
];

const SALARY_TIERS = [
  { level: 'Apprentice / Trainee',  range: '₹1.8–3 LPA' },
  { level: 'Junior Technician',     range: '₹3–5 LPA' },
  { level: 'Senior Specialist',     range: '₹5–8 LPA' },
  { level: 'Shift Supervisor',      range: '₹8–12 LPA' },
  { level: 'Workshop / Business Owner', range: '₹15+ LPA' },
];

const SUCCESS_TIPS = [
  'Focus 100% on practical hand skills during your ITI training.',
  'Clear the All India Trade Test (AITT) with top marks to earn NCVT certification.',
  'Complete a 1-year paid apprenticeship with railways or top PSUs.',
  'Learn CNC programming and basic automation alongside core fitting skills.',
  'Strictly follow safety protocols and wear Personal Protective Equipment (PPE).',
  'Build network with factory floor managers during your industrial visits.',
  'Consider upgrading to a Diploma via lateral entry for engineering growth.',
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const SkilledTradesPathScreen = ({ navigation }: any) => {
  const isDark = useColorScheme() === 'dark';
  const C = isDark ? ORANGE_DARK : ORANGE_LIGHT;

  useEffect(() => {
    const saveSector = async () => {
      try {
        await AsyncStorage.setItem('activeSector', 'SKILLED TRADES');
      } catch (_) {}
    };
    saveSector();
  }, []);

  const scrollRef = useRef<ScrollView>(null);
  const [whySelected, setWhySelected]       = useState<string[]>([]);
  const [checkAnswers, setCheckAnswers]      = useState<{ [k: number]: boolean | null }>({});
  const [expandedCP, setExpandedCP]         = useState<number | null>(null);
  const [expandedDegree, setExpandedDegree] = useState<number | null>(null);
  const [scrollPct, setScrollPct]           = useState(0);

  const answered = Object.keys(checkAnswers).length;
  const yesCount = Object.values(checkAnswers).filter(v => v === true).length;

  const handleScroll = (e: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const total = contentSize.height - layoutMeasurement.height;
    if (total > 0) setScrollPct(Math.min(Math.max(contentOffset.y / total, 0), 1));
  };

  const restart = () => {
    setWhySelected([]); setCheckAnswers({}); setExpandedCP(null); setExpandedDegree(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const bg   = isDark ? '#020209' : '#F5F8FC';
  const card = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const bdr  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const txt  = isDark ? '#FFFFFF' : '#0F172A';
  const sub  = isDark ? 'rgba(255,255,255,0.55)' : '#475569';

  return (
    <SafeAreaView style={[s.root, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={isDark ? ['#020209', '#05050F'] : ['#F5F8FC', '#EBF0F8']}
        style={StyleSheet.absoluteFill}
      />

      <View style={s.navWrap}>
        <TopNavBar title="Skilled Trades Career Guide" />
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${scrollPct * 100}%`, backgroundColor: C }]} />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* HERO */}
        <LinearGradient
          colors={isDark ? ['rgba(0,240,255,0.10)', 'transparent'] : ['rgba(0,139,139,0.07)', 'transparent']}
          style={s.heroSection}
        >
          <LinearGradient
            colors={isDark ? ['rgba(0,240,255,0.15)', 'rgba(0,0,0,0)'] : ['rgba(0,139,139,0.12)', 'rgba(0,0,0,0)']}
            style={s.heroOrb}
          >
            <View style={[s.heroRing1, { borderColor: C + '30' }]} />
            <View style={[s.heroRing2, { borderColor: C + '60' }]} />
            <MaterialCommunityIcons name="hammer-wrench" size={68} color={C} />
          </LinearGradient>

          <Text style={[s.heroTitle, { color: txt }]}>Skilled Trades Career Roadmap</Text>
          <Text style={[s.heroSub, { color: sub }]}>
            Master industrial trades, practical machinery, electrical fitting, and technical manufacturing after Class 10.
          </Text>

          <View style={s.heroBtnRow}>
            <TouchableOpacity
              style={[s.heroBtnPrimary, { backgroundColor: C }]}
              onPress={() => scrollRef.current?.scrollTo({ y: 600, animated: true })}
            >
              <Text style={[s.heroBtnPrimaryTxt, { color: isDark ? '#000' : '#FFF' }]}>Start Journey</Text>
              <Ionicons name="arrow-down" size={16} color={isDark ? '#000' : '#FFF'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.heroBtnSecondary, { borderColor: C }]}
              onPress={() => scrollRef.current?.scrollTo({ y: 1600, animated: true })}
            >
              <Text style={[s.heroBtnSecondaryTxt, { color: C }]}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* SECTION 2 – BEFORE YOU BEGIN */}
        <Section title="Before We Begin..." color={C} textColor={txt}>
          <Text style={[s.sectionSub, { color: sub }]}>
            Understand your interest in vocational and industrial trades.
          </Text>
          <GlassCard bg={card} border={bdr}>
            <Text style={[s.questionLabel, { color: txt }]}>💬 Why are you choosing Skilled Trades?</Text>
            <Text style={[s.helperTxt, { color: sub }]}>Select all that apply</Text>
            <View style={s.chipGrid}>
              {WHY_OPTIONS.map(o => {
                const sel = whySelected.includes(o.id);
                return (
                  <TouchableOpacity
                    key={o.id}
                    activeOpacity={0.8}
                    onPress={() => setWhySelected(prev =>
                      prev.includes(o.id) ? prev.filter(x => x !== o.id) : [...prev, o.id]
                    )}
                    style={[s.chip, { backgroundColor: sel ? C : (isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9'), borderColor: sel ? C : bdr }]}
                  >
                    {sel && <Ionicons name="checkmark-circle" size={14} color={isDark ? '#000' : '#FFF'} style={{ marginRight: 4 }} />}
                    <Text style={[s.chipTxt, { color: sel ? (isDark ? '#000' : '#FFF') : sub }]}>{o.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {whySelected.length > 0 && (
              <LinearGradient
                colors={isDark ? ['rgba(0,240,255,0.10)', 'rgba(0,240,255,0.04)'] : ['rgba(0,139,139,0.07)', 'rgba(0,139,139,0.02)']}
                style={[s.feedbackBanner, { borderColor: C + '50' }]}
              >
                <Ionicons name="sparkles" size={16} color={C} />
                <Text style={[s.feedbackTxt, { color: isDark ? '#FFF' : '#005C5C' }]}>
                  {'  '}Great choice! Skilled trades offer fast-track employment, hands-on mastery, and high industrial demand.
                </Text>
              </LinearGradient>
            )}
          </GlassCard>
        </Section>

        {/* SECTION 3 – WHAT IS SKILLED TRADES? */}
        <Section title="What is Skilled Trades?" color={C} textColor={txt}>
          <Text style={[s.sectionSub, { color: sub }]}>
            Skilled trades encompass essential technical domains powering manufacturing, power plants, assembly, and infrastructure.
          </Text>
          <View style={s.iconGrid}>
            {WHAT_CARDS.map((c2, i) => (
              <GlassCard key={i} bg={card} border={bdr} style={s.whatCard}>
                <MaterialCommunityIcons name={c2.icon as any} size={32} color={C} />
                <Text style={[s.whatLabel, { color: txt }]}>{c2.label}</Text>
              </GlassCard>
            ))}
          </View>
        </Section>

        {/* SECTION 4 – IS SKILLED TRADES RIGHT FOR YOU? */}
        <Section title="Is Skilled Trades Right For You?" color={C} textColor={txt}>
          <GlassCard bg={card} border={bdr}>
            <Text style={[s.helperTxt, { color: sub, marginBottom: 14 }]}>Answer honestly:</Text>
            {CHECKLIST_Q.map((q, i) => {
              const ans = checkAnswers[i];
              return (
                <View key={i} style={[s.checkRow, { borderBottomColor: bdr }]}>
                  <Text style={[s.checkQ, { color: txt }]}>{q}</Text>
                  <View style={s.yesNo}>
                    {[true, false].map(val => (
                      <TouchableOpacity
                        key={String(val)}
                        activeOpacity={0.8}
                        onPress={() => setCheckAnswers(prev => ({ ...prev, [i]: val }))}
                        style={[
                          s.pill,
                          {
                            backgroundColor: ans === val
                              ? (val ? C : '#EF4444')
                              : (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'),
                            borderColor: ans === val
                              ? (val ? C : '#EF4444')
                              : bdr,
                          },
                        ]}
                      >
                        <Text style={[s.pillTxt, { color: ans === val ? '#FFF' : sub, fontWeight: ans === val ? '700' : '500' }]}>
                          {val ? 'YES' : 'NO'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}

            <View style={s.progressMeter}>
              <View style={s.progressLabels}>
                <Text style={[s.helperTxt, { color: sub }]}>Progress</Text>
                <Text style={[s.helperTxt, { color: C }]}>{answered} / 6</Text>
              </View>
              <View style={[s.meterBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : '#E2E8F0' }]}>
                <View style={[s.meterFill, { width: `${(answered / 6) * 100}%`, backgroundColor: C }]} />
              </View>
            </View>

            {answered === 6 && (
              <LinearGradient
                colors={isDark ? ['rgba(0,240,255,0.12)', 'rgba(0,240,255,0.04)'] : ['rgba(0,139,139,0.08)', 'rgba(0,139,139,0.02)']}
                style={[s.resultBanner, { borderColor: C + '60' }]}
              >
                <Ionicons name="ribbon-outline" size={22} color={C} />
                <Text style={[s.resultTxt, { color: txt }]}>
                  {' '}{yesCount >= 4
                    ? '🎉 You have ideal traits for a successful career in skilled trades!'
                    : '💪 Hands-on trade skills can be built rapidly through ITI courses and practice.'}
                </Text>
              </LinearGradient>
            )}
          </GlassCard>
        </Section>

        {/* SECTION 5 – PERSONALITY MATCH */}
        <Section title="Personality Match" color={C} textColor={txt}>
          <Text style={[s.sectionSub, { color: sub }]}>Key traits that excel in industrial trades:</Text>
          <View style={s.personalityGrid}>
            {PERSONALITY.map((p, i) => (
              <GlassCard key={i} bg={card} border={bdr} style={s.personalityCard}>
                <LinearGradient
                  colors={isDark ? ['rgba(0,240,255,0.12)', 'transparent'] : ['rgba(0,139,139,0.08)', 'transparent']}
                  style={s.personalityIconBg}
                >
                  <MaterialCommunityIcons name={p.icon as any} size={26} color={C} />
                </LinearGradient>
                <Text style={[s.personalitySkill, { color: txt }]}>{p.skill}</Text>
                <Text style={[s.personalityWhy, { color: sub }]}>{p.why}</Text>
              </GlassCard>
            ))}
          </View>
        </Section>

        {/* SECTION 6 – CAREER ROADMAP */}
        <Section title="Career Roadmap" color={C} textColor={txt}>
          <Text style={[s.sectionSub, { color: sub }]}>📍 Tap any checkpoint to expand it:</Text>
          <View style={s.cpWrapper}>
            <View style={[s.spine, { backgroundColor: C + '40' }]} />
            {CHECKPOINTS.map((cp, idx) => {
              const open = expandedCP === cp.id;
              return (
                <View key={cp.id} style={s.cpRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setExpandedCP(open ? null : cp.id)}
                    style={[s.pin, { backgroundColor: open ? C : (isDark ? '#12121E' : '#FFF'), borderColor: C }]}
                  >
                    <Ionicons name={cp.icon as any} size={16} color={open ? (isDark ? '#000' : '#FFF') : C} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setExpandedCP(open ? null : cp.id)}
                    style={[s.cpCard, { backgroundColor: card, borderColor: open ? C : bdr }]}
                  >
                    <View style={s.cpCardHeader}>
                      <View>
                        <Text style={[s.cpIdx, { color: C }]}>Checkpoint {idx + 1}</Text>
                        <Text style={[s.cpLabel, { color: txt }]}>{cp.label}</Text>
                      </View>
                      <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={sub} />
                    </View>

                    {open && (
                      <View style={s.cpDetail}>
                        <Text style={[s.cpDetailTxt, { color: sub }]}>{cp.detail}</Text>
                        {cp.sub && (
                          <View style={s.tagRow}>
                            {cp.sub.map((t, ti) => (
                              <View key={ti} style={[s.tag, { backgroundColor: C + '18', borderColor: C + '40' }]}>
                                <Text style={[s.tagTxt, { color: C }]}>{t}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                        {cp.note && <Text style={[s.cpNote, { color: C }]}>{cp.note}</Text>}
                        {cp.companies && (
                          <View style={s.tagRow}>
                            {cp.companies.map((co, ci) => (
                              <View key={ci} style={[s.tag, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9', borderColor: bdr }]}>
                                <Text style={[s.tagTxt, { color: txt }]}>{co}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                        {cp.growth && (
                          <View style={s.growthPath}>
                            {cp.growth.map((g, gi) => (
                              <View key={gi} style={s.growthItem}>
                                <View style={[s.growthDot, { backgroundColor: C }]} />
                                {gi < cp.growth!.length - 1 && <View style={[s.growthLine, { backgroundColor: C + '30' }]} />}
                                <Text style={[s.growthTxt, { color: gi === cp.growth!.length - 1 ? C : txt }]}>{g}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                        {cp.degrees && (
                          <View style={{ marginTop: 12 }}>
                            {cp.degrees.map((deg, di) => (
                              <TouchableOpacity
                                key={di}
                                activeOpacity={0.85}
                                onPress={() => setExpandedDegree(expandedDegree === di ? null : di)}
                                style={[s.degreeCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC', borderColor: expandedDegree === di ? C : bdr }]}
                              >
                                <View style={s.degreeHeader}>
                                  <Text style={[s.degreeName, { color: txt, flex: 1 }]}>{deg.name}</Text>
                                  <Ionicons name={expandedDegree === di ? 'chevron-up' : 'chevron-down'} size={14} color={sub} />
                                </View>
                                {expandedDegree === di && (
                                  <View style={{ marginTop: 8 }}>
                                    <DetailRow label="Duration" value={deg.dur} color={C} sub={sub} />
                                    <DetailRow label="Subjects" value={deg.subjects} color={C} sub={sub} />
                                    <DetailRow label="Careers" value={deg.careers} color={C} sub={sub} />
                                  </View>
                                )}
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </Section>

        {/* SECTION 7 – SKILLS YOU WILL BUILD */}
        <Section title="Skills You Will Build" color={C} textColor={txt}>
          <View style={s.skillGrid}>
            {SKILLS.map((sk, i) => (
              <GlassCard key={i} bg={card} border={bdr} style={s.skillCard}>
                <View style={[s.skillIconBg, { backgroundColor: C + '18' }]}>
                  <MaterialCommunityIcons name={sk.icon as any} size={24} color={C} />
                </View>
                <Text style={[s.skillLabel, { color: txt }]}>{sk.skill}</Text>
              </GlassCard>
            ))}
          </View>
        </Section>

        {/* SECTION 8 – CAREER OPPORTUNITIES */}
        <Section title="Career Opportunities" color={C} textColor={txt}>
          {CAREERS.map((cr, i) => (
            <GlassCard key={i} bg={card} border={bdr} style={{ marginBottom: 12 }}>
              <View style={s.careerRow}>
                <LinearGradient
                  colors={isDark ? ['rgba(0,240,255,0.15)', 'rgba(0,240,255,0.05)'] : ['rgba(0,139,139,0.10)', 'rgba(0,139,139,0.02)']}
                  style={s.careerIconBox}
                >
                  <MaterialCommunityIcons name={cr.icon as any} size={26} color={C} />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={[s.careerRole, { color: txt }]}>{cr.role}</Text>
                  <Text style={[s.careerWhat, { color: sub }]}>{cr.what}</Text>
                  <View style={[s.skillsBadge, { backgroundColor: C + '15', borderColor: C + '40' }]}>
                    <Text style={[s.skillsBadgeTxt, { color: C }]}>🎯 {cr.skills}</Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          ))}
        </Section>

        {/* SECTION 9 – CHALLENGES */}
        <Section title="Challenges You Should Know" color={C} textColor={txt}>
          <Text style={[s.sectionSub, { color: sub }]}>Realities of a Skilled Trades career:</Text>
          {CHALLENGES.map((ch, i) => (
            <View key={i} style={[s.challengeCard, { backgroundColor: isDark ? 'rgba(239,68,68,0.06)' : '#FFF5F5', borderColor: 'rgba(239,68,68,0.18)' }]}>
              <Ionicons name={ch.icon as any} size={20} color="#EF4444" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={[s.challengeTitle, { color: isDark ? '#FFF' : '#1E293B' }]}>{ch.title}</Text>
                <Text style={[s.challengeDesc, { color: sub }]}>{ch.desc}</Text>
              </View>
            </View>
          ))}
        </Section>

        {/* SECTION 10 – TOP COLLEGES */}
        <Section title="Top Skill Institutes" color={C} textColor={txt}>
          {COLLEGES.map((col, i) => (
            <GlassCard key={i} bg={card} border={bdr} style={{ marginBottom: 10 }}>
              <View style={s.collegeRow}>
                <View style={[s.collegeNumBg, { backgroundColor: C + '18' }]}>
                  <Text style={[s.collegeNum, { color: C }]}>#{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.collegeNameRow}>
                    <Text style={[s.collegeName, { color: txt }]}>{col.name}</Text>
                    <View style={[s.cityTag, { backgroundColor: C + '15' }]}>
                      <Text style={[s.cityTagTxt, { color: C }]}>{col.city}</Text>
                    </View>
                  </View>
                  <Text style={[s.collegeDesc, { color: sub }]}>{col.desc}</Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </Section>

        {/* SECTION 11 – SALARY OVERVIEW */}
        <Section title="Salary Overview" color={C} textColor={txt}>
          <GlassCard bg={card} border={bdr}>
            {SALARY_TIERS.map((s2, i) => (
              <View key={i} style={s.salaryRow}>
                <View style={s.salaryDotCol}>
                  <View style={[s.salaryDot, { backgroundColor: C }]} />
                  {i < SALARY_TIERS.length - 1 && <View style={[s.salaryLine, { backgroundColor: C + '35' }]} />}
                </View>
                <View style={s.salaryInfo}>
                  <Text style={[s.salaryLevel, { color: txt }]}>{s2.level}</Text>
                  <View style={[s.salaryBadge, { backgroundColor: C + '15', borderColor: C + '40' }]}>
                    <Text style={[s.salaryRange, { color: C }]}>{s2.range}</Text>
                  </View>
                </View>
              </View>
            ))}
            <Text style={[s.salaryNote, { color: sub }]}>
              * Salaries grow rapidly with NCVT certification, NAPS apprenticeship, and workshop mastery.
            </Text>
          </GlassCard>
        </Section>

        {/* SECTION 12 – SUCCESS TIPS */}
        <Section title="Success Tips" color={C} textColor={txt}>
          <GlassCard bg={card} border={bdr}>
            {SUCCESS_TIPS.map((tip, i) => (
              <View key={i} style={[s.tipRow, { borderBottomColor: bdr }]}>
                <View style={[s.tipCheck, { backgroundColor: C + '20', borderColor: C + '50' }]}>
                  <Ionicons name="checkmark" size={12} color={C} />
                </View>
                <Text style={[s.tipTxt, { color: sub }]}>{tip}</Text>
              </View>
            ))}
          </GlassCard>
        </Section>

        {/* FINAL MOTIVATION */}
        <View style={[s.sectionWrap, { marginBottom: 50 }]}>
          <LinearGradient
            colors={isDark
              ? ['rgba(0,240,255,0.14)', 'rgba(0,240,255,0.04)', '#020209']
              : ['rgba(0,139,139,0.10)', 'rgba(0,139,139,0.03)', '#F5F8FC']}
            style={[s.motCard, { borderColor: C + '40' }]}
          >
            <MaterialCommunityIcons name="trophy-outline" size={44} color={C} />
            <Text style={[s.motTitle, { color: txt }]}>
              Skilled Technicians Build The Backbone of Modern Industry
            </Text>
            <Text style={[s.motBody, { color: sub }]}>
              From electric grids and robotics workshops to heavy machinery and auto plants, skilled trades experts keep the world moving. Master your trade and build a lucrative future.
            </Text>
            <TouchableOpacity
              style={[s.restartBtn, { backgroundColor: C }]}
              activeOpacity={0.85}
              onPress={restart}
            >
              <Ionicons name="refresh-outline" size={18} color={isDark ? '#000' : '#FFF'} />
              <Text style={[s.restartTxt, { color: isDark ? '#000' : '#FFF' }]}>  Restart Roadmap</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title, color, textColor, children }: any) => (
  <View style={s.sectionWrap}>
    <View style={s.sectionTitleRow}>
      <View style={[s.sectionAccent, { backgroundColor: color }]} />
      <Text style={[s.sectionTitle, { color: textColor }]}>{title}</Text>
    </View>
    {children}
  </View>
);

const GlassCard = ({ bg, border, style, children }: any) => (
  <View style={[s.glassCard, { backgroundColor: bg, borderColor: border }, style]}>
    {children}
  </View>
);

const DetailRow = ({ label, value, color, sub }: any) => (
  <View style={s.detailRow}>
    <Text style={[s.detailLabel, { color }]}>{label}: </Text>
    <Text style={[s.detailValue, { color: sub, flex: 1 }]}>{value}</Text>
  </View>
);

const s = StyleSheet.create({
  root:             { flex: 1 },
  navWrap:          { zIndex: 10 },
  progressTrack:    { height: 3, width: '100%', backgroundColor: 'rgba(255,255,255,0.06)' },
  progressFill:     { height: 3 },
  scroll:           { paddingBottom: 20 },

  heroSection:      { alignItems: 'center', paddingTop: 30, paddingBottom: 24, paddingHorizontal: 24 },
  heroOrb:          { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  heroRing1:        { position: 'absolute', width: 150, height: 150, borderRadius: 75, borderWidth: 1, borderStyle: 'dashed' },
  heroRing2:        { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 1 },
  heroTitle:        { fontSize: 24, fontWeight: '900', textAlign: 'center', letterSpacing: 0.5, marginBottom: 10 },
  heroSub:          { fontSize: 13.5, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10, marginBottom: 22 },
  heroBtnRow:       { flexDirection: 'row', gap: 12 },
  heroBtnPrimary:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 22, borderRadius: 30, gap: 6 },
  heroBtnPrimaryTxt:{ fontSize: 14, fontWeight: '800' },
  heroBtnSecondary: { paddingVertical: 12, paddingHorizontal: 22, borderRadius: 30, borderWidth: 1.5 },
  heroBtnSecondaryTxt: { fontSize: 14, fontWeight: '700' },

  sectionWrap:      { paddingHorizontal: 20, marginTop: 32 },
  sectionTitleRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionAccent:    { width: 4, height: 22, borderRadius: 2, marginRight: 10 },
  sectionTitle:     { fontSize: 19, fontWeight: '900', letterSpacing: 0.4 },
  sectionSub:       { fontSize: 13, lineHeight: 20, marginBottom: 16 },

  glassCard:        { borderRadius: 18, borderWidth: 1, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },

  questionLabel:    { fontSize: 14, fontWeight: '800', marginBottom: 6 },
  helperTxt:        { fontSize: 11.5, marginBottom: 10 },
  chipGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip:             { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, paddingVertical: 8, borderRadius: 30, borderWidth: 1 },
  chipTxt:          { fontSize: 12, fontWeight: '600' },
  feedbackBanner:   { flexDirection: 'row', alignItems: 'flex-start', padding: 12, borderRadius: 12, borderWidth: 1 },
  feedbackTxt:      { fontSize: 12, fontWeight: '700', flex: 1 },

  iconGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  whatCard:         { width: (width - 60) / 3, alignItems: 'center', paddingVertical: 16 },
  whatLabel:        { fontSize: 11, fontWeight: '700', marginTop: 8, textAlign: 'center' },

  checkRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  checkQ:           { fontSize: 12.5, fontWeight: '600', flex: 1, marginRight: 10 },
  yesNo:            { flexDirection: 'row', gap: 6 },
  pill:             { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  pillTxt:          { fontSize: 11 },
  progressMeter:    { marginTop: 16 },
  progressLabels:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  meterBg:          { height: 6, borderRadius: 3 },
  meterFill:        { height: 6, borderRadius: 3 },
  resultBanner:     { flexDirection: 'row', alignItems: 'flex-start', padding: 14, borderRadius: 12, borderWidth: 1, marginTop: 14 },
  resultTxt:        { fontSize: 13, fontWeight: '700', flex: 1 },

  personalityGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  personalityCard:  { width: (width - 60) / 2, padding: 14 },
  personalityIconBg:{ width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  personalitySkill: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  personalityWhy:   { fontSize: 11, lineHeight: 16 },

  cpWrapper:        { position: 'relative', paddingLeft: 36 },
  spine:            { position: 'absolute', left: 17, top: 20, bottom: 20, width: 2, borderRadius: 1 },
  cpRow:            { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  pin:              { width: 34, height: 34, borderRadius: 17, borderWidth: 2, alignItems: 'center', justifyContent: 'center', position: 'absolute', left: -36, top: 12 },
  cpCard:           { flex: 1, borderRadius: 16, borderWidth: 1, padding: 14 },
  cpCardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cpIdx:            { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.8 },
  cpLabel:          { fontSize: 14, fontWeight: '800', marginTop: 2 },
  cpDetail:         { marginTop: 12 },
  cpDetailTxt:      { fontSize: 12.5, lineHeight: 19, marginBottom: 10 },
  cpNote:           { fontSize: 12, fontWeight: '700', marginTop: 8 },
  tagRow:           { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tag:              { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  tagTxt:           { fontSize: 11, fontWeight: '600' },
  growthPath:       { marginTop: 10 },
  growthItem:       { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  growthDot:        { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  growthLine:       { position: 'absolute', left: 3, top: 8, width: 2, height: 20, borderRadius: 1 },
  growthTxt:        { fontSize: 12.5, fontWeight: '600' },
  degreeCard:       { borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8 },
  degreeHeader:     { flexDirection: 'row', alignItems: 'center' },
  degreeName:       { fontSize: 12, fontWeight: '700' },
  detailRow:        { flexDirection: 'row', marginTop: 4 },
  detailLabel:      { fontSize: 11, fontWeight: '700' },
  detailValue:      { fontSize: 11 },

  skillGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skillCard:        { width: (width - 60) / 2, alignItems: 'center', paddingVertical: 18 },
  skillIconBg:      { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  skillLabel:       { fontSize: 12, fontWeight: '800', textAlign: 'center' },

  careerRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  careerIconBox:    { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  careerRole:       { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  careerWhat:       { fontSize: 12, lineHeight: 17, marginBottom: 8 },
  skillsBadge:      { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  skillsBadgeTxt:   { fontSize: 10.5, fontWeight: '700' },

  challengeCard:    { flexDirection: 'row', alignItems: 'flex-start', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  challengeTitle:   { fontSize: 13, fontWeight: '800', marginBottom: 3 },
  challengeDesc:    { fontSize: 11.5, lineHeight: 17 },

  collegeRow:       { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  collegeNumBg:     { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  collegeNum:       { fontSize: 13, fontWeight: '900' },
  collegeNameRow:   { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  collegeName:      { fontSize: 13, fontWeight: '800' },
  cityTag:          { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  cityTagTxt:       { fontSize: 10, fontWeight: '700' },
  collegeDesc:      { fontSize: 11.5, lineHeight: 17 },

  salaryRow:        { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  salaryDotCol:     { alignItems: 'center', marginRight: 14, width: 14 },
  salaryDot:        { width: 12, height: 12, borderRadius: 6 },
  salaryLine:       { width: 2, height: 30, borderRadius: 1, marginTop: 2 },
  salaryInfo:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 18 },
  salaryLevel:      { fontSize: 13, fontWeight: '700' },
  salaryBadge:      { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  salaryRange:      { fontSize: 12, fontWeight: '800' },
  salaryNote:       { fontSize: 11, marginTop: 10, fontStyle: 'italic' },

  tipRow:           { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1 },
  tipCheck:         { width: 22, height: 22, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 1 },
  tipTxt:           { fontSize: 12.5, lineHeight: 19, flex: 1 },

  motCard:          { borderRadius: 24, borderWidth: 1, padding: 26, alignItems: 'center' },
  motTitle:         { fontSize: 18, fontWeight: '900', textAlign: 'center', marginTop: 14, marginBottom: 12, lineHeight: 26 },
  motBody:          { fontSize: 13, lineHeight: 21, textAlign: 'center', marginBottom: 22 },
  restartBtn:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 30 },
  restartTxt:       { fontSize: 14, fontWeight: '800' },
});

export default SkilledTradesPathScreen;

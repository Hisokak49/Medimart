/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

export const AppContext = createContext();

const normalizeRole = (role) => {
  const value = String(role || '').trim().toLowerCase();

  if (!value) return 'user';
  if (['admin', 'super_admin', 'super-admin', 'super admin'].includes(value)) {
    return 'admin';
  }

  return value;
};

/* ── Local product images for first 30 counters ── */
import photo1 from '../assets/photo1.png';
import photo2 from '../assets/photo2.png';
import photo3 from '../assets/photo3.png';
import photo4 from '../assets/photo4.png';
import photo5 from '../assets/photo5.png';
import photo6 from '../assets/photo6.png';
import photo8 from '../assets/photo8.png';
import photo9 from '../assets/photo9.png';
import photo10 from '../assets/photo10.png';
import photo11 from '../assets/photo11.png';
import photo13 from '../assets/photo13.png';
import photo14 from '../assets/photo14.png';
import photo15 from '../assets/photo15.png';
import photo16 from '../assets/photo16.png';
import photo17 from '../assets/photo17.png';
import photo18 from '../assets/photo18.png';
import photo19 from '../assets/photo19.png';
import photo20 from '../assets/photo20.png';
import photo21 from '../assets/photo21.png';
import photo22 from '../assets/photo22.png';
import photo23 from '../assets/photo23.png';
import photo25 from '../assets/photo25.png';
import photo26 from '../assets/photo26.png';
import photo27 from '../assets/photo27.png';
import photo28 from '../assets/photo28.png';
import photo29 from '../assets/photo29.png';
import photo30 from '../assets/photo30.png';
import photo31 from '../assets/photo31.png';
import photo32 from '../assets/photo32.png';
import photo33 from '../assets/photo33.png';
import photo34 from '../assets/photo34.png';
import photo35 from '../assets/photo35.png';
import photo36 from '../assets/photo36.png';
import photo37 from '../assets/photo37.png';
import photo38 from '../assets/photo38.png';
import photo39 from '../assets/photo39.png';
import photo40 from '../assets/photo40.png';
import photo41 from '../assets/photo41.png';
import photo42 from '../assets/photo42.png';
import photo43 from '../assets/photo43.png';
import photo45 from '../assets/photo45.png';
import photo47 from '../assets/photo47.png';
import photo48 from '../assets/photo48.png';
import photo49 from '../assets/photo49.png';
import photo50 from '../assets/photo50.png';
import photo51 from '../assets/photo51.png';
import photo52 from '../assets/photo52.png';
import photo53 from '../assets/photo53.png';
import photo54 from '../assets/photo54.png';
import photo55 from '../assets/photo55.png';
import photo56 from '../assets/photo56.png';
import photo57 from '../assets/photo57.png';
import photo59 from '../assets/photo59.png';
import photo60 from '../assets/photo60.png';
import photo61 from '../assets/photo61.png';

/* ── Placeholder fallback ── */
import placeholder from '../assets/medicine-placeholder.svg';

/* ── Bump this version whenever initialMedicines data changes ── */
const DATA_VERSION = 6;

const initialMedicines = [
  // ═══════════════════════════ OVER-THE-COUNTER (OTC) ═══════════════════════════
  {
    id: 'med-1', name: 'Dolo 650mg (Paracetamol)', category: 'Over-the-Counter (OTC)',
    price: 30, stock: 120, minThreshold: 15, rating: 4.8, reviewsCount: 142,
    dosage: '1 tablet every 4-6 hours as needed. Max 4 tablets in 24 hours.',
    description: 'Effective fever reducer and pain reliever for headaches, toothaches, backaches, and cold/flu aches.',
    ingredients: 'Paracetamol (Acetaminophen) 650mg',
    warnings: 'Avoid alcohol. Overdose can cause severe liver damage.',
    image: photo25
  },
  {
    id: 'med-2', name: 'Combiflam (Ibuprofen + Paracetamol)', category: 'Over-the-Counter (OTC)',
    price: 42, stock: 150, minThreshold: 20, rating: 4.8, reviewsCount: 310,
    dosage: '1 tablet every 8 hours after meals. Do not take on empty stomach.',
    description: 'Dual-action analgesic combining Ibuprofen and Paracetamol for effective relief from pain and fever.',
    ingredients: 'Ibuprofen 400mg + Paracetamol 325mg',
    warnings: 'Not for prolonged use. May cause gastric upset. Avoid in kidney/liver disease.',
    image: photo18
  },
  {
    id: 'med-3', name: 'Crocin Advance 500mg', category: 'Over-the-Counter (OTC)',
    price: 28, stock: 200, minThreshold: 25, rating: 4.7, reviewsCount: 189,
    dosage: '1-2 tablets every 4-6 hours as needed. Max 8 tablets in 24 hours.',
    description: 'Fast-acting paracetamol tablet for relief from headache, body ache, and mild fever.',
    ingredients: 'Paracetamol 500mg',
    warnings: 'Do not exceed 8 tablets in 24 hours. Avoid if you have liver problems.',
    image: photo19
  },
  {
    id: 'med-4', name: 'Alerid 10mg (Cetirizine)', category: 'Over-the-Counter (OTC)',
    price: 25, stock: 80, minThreshold: 12, rating: 4.7, reviewsCount: 78,
    dosage: '1 tablet daily at bedtime.',
    description: 'Antihistamine that reduces histamine in the body. Treats sneezing, itching, watery eyes, and runny nose.',
    ingredients: 'Cetirizine Hydrochloride 10mg',
    warnings: 'May cause drowsiness. Avoid driving after consumption.',
    image: photo2
  },
  {
    id: 'med-5', name: 'Digene Gel Mint Syrup', category: 'Over-the-Counter (OTC)',
    price: 120, stock: 55, minThreshold: 10, rating: 4.6, reviewsCount: 94,
    dosage: 'Take 10ml after meals or at bedtime.',
    description: 'Quick relief from acidity, gas, heartburn, and stomach discomfort.',
    ingredients: 'Magnesium Hydroxide, Aluminium Hydroxide, Simethicone',
    warnings: 'Shake well before use. Do not exceed daily dose.',
    image: photo22
  },
  {
    id: 'med-6', name: 'Volini Pain Relief Spray 40g', category: 'Over-the-Counter (OTC)',
    price: 145, stock: 3, minThreshold: 8, rating: 4.9, reviewsCount: 184,
    dosage: 'Spray on affected area 3-4 times daily. Do not massage.',
    description: 'Instant relief from joint pain, back pain, shoulder pain, sprains, and muscle pulls.',
    ingredients: 'Diclofenac Diethylamine, Methyl Salicylate, Menthol',
    warnings: 'External use only. Do not spray on open wounds.',
    image: photo59
  },
  {
    id: 'med-7', name: 'Vicks Vaporub 50g', category: 'Over-the-Counter (OTC)',
    price: 95, stock: 110, minThreshold: 15, rating: 4.7, reviewsCount: 220,
    dosage: 'Rub gently on chest, neck, and back for cold symptoms.',
    description: 'Menthol-based ointment for head cold, nasal congestion, cough, and body aches.',
    ingredients: 'Menthol, Camphor, Eucalyptus Oil',
    warnings: 'External use only. Keep out of nostrils of children under 2.',
    image: photo57
  },
  {
    id: 'med-8', name: 'Burnol Antiseptic Cream 20g', category: 'Over-the-Counter (OTC)',
    price: 55, stock: 65, minThreshold: 10, rating: 4.5, reviewsCount: 72,
    dosage: 'Apply thin layer on affected area 2-3 times daily.',
    description: 'Antiseptic cream for minor burns, scalds, sunburns, and skin abrasions.',
    ingredients: 'Aminacrine Hydrochloride, Cetrimide Cream Base',
    warnings: 'External use only. Do not apply on large burns.',
    image: photo13
  },
  {
    id: 'med-9', name: 'ORS Electrolyte Powder (Nimbu Pani)', category: 'Over-the-Counter (OTC)',
    price: 18, stock: 300, minThreshold: 30, rating: 4.9, reviewsCount: 415,
    dosage: 'Dissolve 1 sachet in 1 litre of clean water. Drink throughout the day.',
    description: 'Oral rehydration salts to replenish electrolytes lost during diarrhea, vomiting, or sweating.',
    ingredients: 'Sodium Chloride, Potassium Chloride, Glucose, Sodium Bicarbonate',
    warnings: 'Do not use in severely dehydrated patients without medical supervision.',
    image: photo49
  },
  {
    id: 'med-10', name: 'Lopamide (Loperamide 2mg)', category: 'Over-the-Counter (OTC)',
    price: 35, stock: 90, minThreshold: 12, rating: 4.4, reviewsCount: 58,
    dosage: '2 tablets initially, then 1 tablet after each loose stool. Max 8/day.',
    description: 'Anti-diarrheal medication that slows intestinal movement to reduce loose stools.',
    ingredients: 'Loperamide Hydrochloride 2mg',
    warnings: 'Not for children under 6. Seek advice if diarrhea lasts >48 hours.',
    image: photo35
  },
  {
    id: 'med-11', name: 'Strepsils Honey & Lemon Lozenges', category: 'Over-the-Counter (OTC)',
    price: 65, stock: 130, minThreshold: 15, rating: 4.6, reviewsCount: 98,
    dosage: 'Dissolve 1 lozenge slowly in the mouth every 2-3 hours.',
    description: 'Antiseptic throat lozenges with dual antibacterial action for sore throat and mouth infections.',
    ingredients: '2,4-Dichlorobenzyl Alcohol, Amylmetacresol, Honey & Lemon Flavour',
    warnings: 'Not recommended for children under 6. Max 12 lozenges per day.',
    image: photo54
  },
  {
    id: 'med-12', name: 'Disprin (Aspirin 350mg)', category: 'Over-the-Counter (OTC)',
    price: 20, stock: 180, minThreshold: 20, rating: 4.5, reviewsCount: 132,
    dosage: 'Dissolve 2 tablets in water. Repeat after 4-6 hours if needed.',
    description: 'Effervescent aspirin for fast pain relief, headache, migraine, and cold aches.',
    ingredients: 'Aspirin 350mg, Citric Acid, Sodium Bicarbonate',
    warnings: 'Not for children under 16. Avoid if allergic to aspirin.',
    image: photo27
  },
  {
    id: 'med-13', name: 'Gelusil MPS Antacid Tablets', category: 'Over-the-Counter (OTC)',
    price: 55, stock: 95, minThreshold: 12, rating: 4.4, reviewsCount: 73,
    dosage: 'Chew 1-2 tablets after meals and at bedtime.',
    description: 'Chewable antacid for fast relief from acidity, heartburn, and flatulence.',
    ingredients: 'Magnesium Hydroxide, Aluminium Hydroxide Gel, Simethicone',
    warnings: 'Max 16 tablets per day. May cause constipation with extended use.',
    image: photo28
  },
  {
    id: 'med-14', name: 'Nasivion 0.05% Nasal Drops', category: 'Over-the-Counter (OTC)',
    price: 48, stock: 70, minThreshold: 10, rating: 4.6, reviewsCount: 67,
    dosage: '2-3 drops in each nostril 2-3 times daily for max 5 days.',
    description: 'Fast-acting relief from nasal congestion due to cold, sinusitis, and allergic rhinitis.',
    ingredients: 'Xylometazoline Hydrochloride 0.05%',
    warnings: 'Do not use more than 5 consecutive days. May cause rebound congestion.',
    image: photo42
  },
  {
    id: 'med-15', name: 'Avomine (Promethazine 25mg)', category: 'Over-the-Counter (OTC)',
    price: 38, stock: 85, minThreshold: 10, rating: 4.5, reviewsCount: 48,
    dosage: '1 tablet the night before travel or 1-2 hours before journey.',
    description: 'Anti-nausea and motion sickness tablet for travel by sea, air, or road.',
    ingredients: 'Promethazine Theoclate 25mg',
    warnings: 'Causes severe drowsiness. Do not drive. Avoid alcohol.',
    image: photo6
  },
  {
    id: 'med-16', name: 'Moov Fast Pain Relief Cream 50g', category: 'Over-the-Counter (OTC)',
    price: 110, stock: 80, minThreshold: 10, rating: 4.7, reviewsCount: 229,
    dosage: 'Apply on affected area and massage gently 3-4 times daily.',
    description: 'Rapid pain relief cream for joint pain, muscular pain, back pain, and sprains.',
    ingredients: 'Diclofenac Diethylamine 1.16%, Methyl Salicylate, Menthol',
    warnings: 'External use only. Do not apply on broken skin. Wash hands after use.',
    image: photo38
  },
  {
    id: 'med-17', name: 'Calpol 250mg Suspension 60ml', category: 'Over-the-Counter (OTC)',
    price: 58, stock: 100, minThreshold: 15, rating: 4.9, reviewsCount: 302,
    dosage: '5-10ml every 4-6 hours based on child weight. Max 4 doses/day.',
    description: 'Children\'s paracetamol suspension for reducing fever and mild pain in infants and children.',
    ingredients: 'Paracetamol 250mg/5ml',
    warnings: 'Not for children under 3 months. Shake well. Use measuring syringe.',
    image: photo14
  },
  {
    id: 'med-18', name: 'Chericof Cough Syrup 100ml', category: 'Over-the-Counter (OTC)',
    price: 88, stock: 65, minThreshold: 10, rating: 4.4, reviewsCount: 85,
    dosage: '10ml 3-4 times daily after meals.',
    description: 'Non-drowsy cough syrup for productive and dry cough. Soothes throat irritation.',
    ingredients: 'Dextromethorphan, Chlorpheniramine Maleate, Phenylephrine HCl',
    warnings: 'Do not exceed recommended dose. Not for children under 6.',
    image: photo16
  },
  {
    id: 'med-19', name: 'Zandu Balm Ultra Power', category: 'Over-the-Counter (OTC)',
    price: 60, stock: 140, minThreshold: 15, rating: 4.6, reviewsCount: 265,
    dosage: 'Apply gently on forehead, temples, or affected area. Use 2-3 times daily.',
    description: 'Ayurvedic head and body pain balm with powerful menthol action for instant relief from headaches and body aches.',
    ingredients: 'Menthol, Camphor, Ajwain Satva, Pudina Ka Phool',
    warnings: 'External use only. Avoid eyes and mucous membranes. Not for children under 2.',
    image: photo60
  },
  {
    id: 'med-20', name: 'Benadryl Cough Syrup 150ml', category: 'Over-the-Counter (OTC)',
    price: 115, stock: 55, minThreshold: 8, rating: 4.7, reviewsCount: 187,
    dosage: '10ml every 6-8 hours. Do not exceed 40ml per day.',
    description: 'Relieves cough due to minor throat and bronchial irritation. Dry and wet cough formula.',
    ingredients: 'Diphenhydramine HCl 14.08mg/5ml, Ammonium Chloride, Sodium Citrate',
    warnings: 'May cause drowsiness. Do not drive or operate machinery. Avoid alcohol.',
    image: photo9
  },

  // ═══════════════════════════ PRESCRIPTION DRUGS ═══════════════════════════
  {
    id: 'med-21', name: 'Amoxyclav 625 (Amoxicillin + Clavulanate)', category: 'Prescription Drugs',
    price: 180, stock: 8, minThreshold: 10, rating: 4.5, reviewsCount: 89,
    dosage: '1 tablet twice daily for 5-7 days as prescribed.',
    description: 'Penicillin-type antibiotic for bacterial infections. Requires valid doctor prescription.',
    ingredients: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
    warnings: 'Complete entire course. Do not use if allergic to penicillin.',
    image: photo3
  },
  {
    id: 'med-22', name: 'Atorva 10mg (Atorvastatin)', category: 'Prescription Drugs',
    price: 90, stock: 90, minThreshold: 15, rating: 4.7, reviewsCount: 62,
    dosage: '1 tablet daily at evening/night as recommended by cardiologist.',
    description: 'Lowers "bad" cholesterol (LDL, triglycerides) and raises "good" cholesterol (HDL).',
    ingredients: 'Atorvastatin Calcium 10mg',
    warnings: 'Do not take if pregnant or having liver disease.',
    image: photo5
  },
  {
    id: 'med-23', name: 'Metformin 500mg (Glycomet)', category: 'Prescription Drugs',
    price: 55, stock: 110, minThreshold: 20, rating: 4.6, reviewsCount: 145,
    dosage: '1 tablet twice daily with meals.',
    description: 'Oral antidiabetic drug to control blood sugar in Type 2 diabetes mellitus.',
    ingredients: 'Metformin Hydrochloride 500mg',
    warnings: 'Do not use in kidney failure. Monitor blood sugar regularly.',
    image: photo36
  },
  {
    id: 'med-24', name: 'Pantop 40mg (Pantoprazole)', category: 'Prescription Drugs',
    price: 75, stock: 85, minThreshold: 15, rating: 4.7, reviewsCount: 193,
    dosage: '1 tablet daily 30-60 minutes before a meal.',
    description: 'Proton pump inhibitor (PPI) for acid reflux, GERD, peptic ulcers.',
    ingredients: 'Pantoprazole Sodium Sesquihydrate 40mg',
    warnings: 'Long-term use may cause magnesium deficiency. Not for children under 5.',
    image: photo50
  },
  {
    id: 'med-25', name: 'Telma 40mg (Telmisartan)', category: 'Prescription Drugs',
    price: 130, stock: 75, minThreshold: 12, rating: 4.5, reviewsCount: 87,
    dosage: '1 tablet once daily with or without food.',
    description: 'Angiotensin receptor blocker (ARB) for hypertension and cardiovascular risk reduction.',
    ingredients: 'Telmisartan 40mg',
    warnings: 'Do not use during pregnancy. May cause dizziness.',
    image: photo55
  },
  {
    id: 'med-26', name: 'Azithromycin 500mg (Zithromax)', category: 'Prescription Drugs',
    price: 95, stock: 60, minThreshold: 10, rating: 4.6, reviewsCount: 124,
    dosage: '1 tablet once daily for 3-5 days as prescribed.',
    description: 'Macrolide antibiotic for respiratory, ear, skin infections, and STDs.',
    ingredients: 'Azithromycin Dihydrate 500mg',
    warnings: 'Complete full course. Avoid antacids within 2 hours.',
    image: photo5
  },
  {
    id: 'med-27', name: 'Thyronorm 50mcg (Levothyroxine)', category: 'Prescription Drugs',
    price: 48, stock: 95, minThreshold: 15, rating: 4.8, reviewsCount: 176,
    dosage: '1 tablet daily on empty stomach, 30-60 min before breakfast.',
    description: 'Synthetic thyroid hormone replacement for hypothyroidism.',
    ingredients: 'Levothyroxine Sodium 50mcg',
    warnings: 'Take at same time daily. Avoid calcium/iron within 4 hours.',
    image: photo56
  },
  {
    id: 'med-28', name: 'Ecosprin 75mg (Aspirin)', category: 'Prescription Drugs',
    price: 22, stock: 200, minThreshold: 25, rating: 4.6, reviewsCount: 98,
    dosage: '1 tablet once daily after meals.',
    description: 'Low-dose aspirin as antiplatelet therapy to prevent heart attacks and strokes.',
    ingredients: 'Aspirin (Acetylsalicylic Acid) 75mg',
    warnings: 'May cause gastric bleeding. Not for children under 12.',
    image: photo27
  },
  {
    id: 'med-29', name: 'Ciprodac 500mg (Ciprofloxacin)', category: 'Prescription Drugs',
    price: 85, stock: 7, minThreshold: 10, rating: 4.4, reviewsCount: 67,
    dosage: '1 tablet twice daily for 5-10 days as prescribed.',
    description: 'Fluoroquinolone antibiotic for UTI, typhoid, and respiratory infections.',
    ingredients: 'Ciprofloxacin Hydrochloride 500mg',
    warnings: 'Avoid dairy within 2 hours. May cause tendon damage. Not for under 18.',
    image: photo17
  },
  {
    id: 'med-30', name: 'Mupirocin 2% Ointment (Bactroban)', category: 'Prescription Drugs',
    price: 125, stock: 50, minThreshold: 8, rating: 4.6, reviewsCount: 56,
    dosage: 'Apply small amount to affected area 2-3 times daily for 7-10 days.',
    description: 'Topical antibiotic for impetigo, infected wounds, folliculitis, and bacterial skin infections.',
    ingredients: 'Mupirocin 2% w/w',
    warnings: 'Not for ophthalmic use. May cause mild burning.',
    image: photo41
  },
  {
    id: 'med-31', name: 'Duphalac (Lactulose Oral Solution 200ml)', category: 'Prescription Drugs',
    price: 190, stock: 40, minThreshold: 6, rating: 4.4, reviewsCount: 42,
    dosage: '15-30ml once daily in the morning.',
    description: 'Osmotic laxative for chronic constipation and hepatic encephalopathy.',
    ingredients: 'Lactulose 10g/15ml',
    warnings: 'Drink plenty of water. May cause bloating initially.',
    image: photo26
  },
  {
    id: 'med-32', name: 'Montair LC (Montelukast + Levocetirizine)', category: 'Prescription Drugs',
    price: 160, stock: 70, minThreshold: 10, rating: 4.7, reviewsCount: 112,
    dosage: '1 tablet daily in the evening.',
    description: 'Combination tablet for allergic rhinitis, asthma prevention, and chronic urticaria.',
    ingredients: 'Montelukast 10mg + Levocetirizine 5mg',
    warnings: 'May cause drowsiness and headache. Report mood changes immediately.',
    image: photo37
  },
  {
    id: 'med-33', name: 'Omnacortil 10mg (Prednisolone)', category: 'Prescription Drugs',
    price: 35, stock: 60, minThreshold: 8, rating: 4.3, reviewsCount: 44,
    dosage: 'As prescribed by physician. Usually 10-40mg daily with food.',
    description: 'Corticosteroid for allergies, asthma, arthritis, inflammatory conditions, and autoimmune disorders.',
    ingredients: 'Prednisolone 10mg',
    warnings: 'Do not stop suddenly. Long-term use causes bone loss. Monitor blood sugar.',
    image: photo47
  },

  // ═══════════════════════════ VITAMINS & SUPPLEMENTS ═══════════════════════════
  {
    id: 'med-34', name: 'Limcee 500mg Vitamin C Chewable', category: 'Vitamins & Supplements',
    price: 45, stock: 250, minThreshold: 30, rating: 4.9, reviewsCount: 215,
    dosage: 'Chew 1 tablet daily.',
    description: 'Antioxidant booster for immune function, skin vitality, and cellular health.',
    ingredients: 'Ascorbic Acid (Vitamin C) 500mg',
    warnings: 'Do not swallow whole. Excess may cause stomach upset.',
    image: photo33
  },
  {
    id: 'med-35', name: 'Becosules Capsules (B-Complex + Vit C)', category: 'Vitamins & Supplements',
    price: 52, stock: 140, minThreshold: 20, rating: 4.8, reviewsCount: 312,
    dosage: '1 capsule daily.',
    description: 'Vitamin B-Complex with Vitamin C. Improves energy levels and heals mouth ulcers.',
    ingredients: 'Thiamine, Riboflavin, Niacinamide, Pyridoxine, B12, Vitamin C',
    warnings: 'Urine may temporarily appear bright yellow (harmless).',
    image: photo8
  },
  {
    id: 'med-36', name: 'Shelcal 500 (Calcium + Vitamin D3)', category: 'Vitamins & Supplements',
    price: 110, stock: 2, minThreshold: 10, rating: 4.6, reviewsCount: 154,
    dosage: '1 tablet daily after lunch/dinner.',
    description: 'Calcium and Vitamin D3 for strong bones and teeth. Treats osteoporosis.',
    ingredients: 'Elemental Calcium 500mg + Vitamin D3 250 IU',
    warnings: 'Avoid with iron supplements (keep 4hr gap).',
    image: photo53
  },
  {
    id: 'med-37', name: 'Liv 52 Tablets (Himalaya Herbal)', category: 'Vitamins & Supplements',
    price: 150, stock: 75, minThreshold: 15, rating: 4.8, reviewsCount: 198,
    dosage: '2 tablets twice or thrice daily before meals.',
    description: 'Restores liver function, promotes appetite, and protects from alcohol-induced damage.',
    ingredients: 'Himsra (Capparis spinosa), Kasani (Cichorium intybus), Mandur bhasma',
    warnings: 'Store in cool dry place. Safe herbal formulation.',
    image: photo34
  },
  {
    id: 'med-38', name: 'Vitamin C + Zinc Gummies', category: 'Vitamins & Supplements',
    price: 399, stock: 60, minThreshold: 8, rating: 4.7, reviewsCount: 82,
    dosage: '2 gummies daily after a meal. Do not exceed stated dose.',
    description: 'Delicious immunity-boosting gummies combining Vitamin C and Zinc for daily immune support.',
    ingredients: 'Vitamin C 40mg, Zinc (as Zinc Citrate) 5mg per gummy',
    warnings: 'Supplement, not medicine. Keep out of reach of children.',
    image: photo10
  },
  {
    id: 'med-39', name: 'Omega-3 Fish Oil 1000mg (MaxO)', category: 'Vitamins & Supplements',
    price: 480, stock: 45, minThreshold: 8, rating: 4.5, reviewsCount: 103,
    dosage: '1 capsule daily after meals.',
    description: 'High-purity fish oil for heart health, brain function, and joint mobility.',
    ingredients: 'Fish Oil 1000mg (EPA 180mg, DHA 120mg)',
    warnings: 'May cause fishy aftertaste. Consult if on blood thinners.',
    image: photo39
  },
  {
    id: 'med-40', name: 'Iron + Folic Acid Tablets (Feronia)', category: 'Vitamins & Supplements',
    price: 70, stock: 120, minThreshold: 15, rating: 4.6, reviewsCount: 88,
    dosage: '1 tablet daily after meals.',
    description: 'For iron-deficiency anemia and healthy pregnancy support.',
    ingredients: 'Ferrous Sulfate 150mg, Folic Acid 0.5mg',
    warnings: 'May cause dark stools. Keep 2hr gap from antacids.',
    image: photo32
  },
  {
    id: 'med-41', name: 'Neurobion Forte (B-Complex)', category: 'Vitamins & Supplements',
    price: 65, stock: 160, minThreshold: 20, rating: 4.8, reviewsCount: 254,
    dosage: '1 tablet once daily.',
    description: 'Powerful B vitamins for nerve repair, energy metabolism, and reducing fatigue.',
    ingredients: 'Vitamin B1 10mg, B2 10mg, B3 45mg, B5 50mg, B6 3mg, B12 15mcg',
    warnings: 'May cause bright yellow urine (harmless).',
    image: photo45
  },
  {
    id: 'med-42', name: 'D3 Must 60000 IU (Vitamin D3)', category: 'Vitamins & Supplements',
    price: 145, stock: 70, minThreshold: 10, rating: 4.7, reviewsCount: 178,
    dosage: '1 capsule once weekly for 8-12 weeks.',
    description: 'High-strength Vitamin D3 for deficiency, calcium absorption, and bone health.',
    ingredients: 'Cholecalciferol 60000 IU',
    warnings: 'Do not exceed prescribed dose. Monitor serum Vitamin D levels.',
    image: photo20
  },
  {
    id: 'med-43', name: 'Glucon-D Instant Energy Powder', category: 'Vitamins & Supplements',
    price: 55, stock: 160, minThreshold: 20, rating: 4.5, reviewsCount: 193,
    dosage: 'Mix 2-3 tablespoons in water. Drink 2-3 times daily.',
    description: 'Instant glucose energy drink to fight fatigue and weakness.',
    ingredients: 'Dextrose Monohydrate, Sucrose, Vitamin D, Calcium',
    warnings: 'Diabetics should consult physician before use.',
    image: photo30
  },
  {
    id: 'med-44', name: 'Biotin 10000mcg (HealthVit)', category: 'Vitamins & Supplements',
    price: 320, stock: 55, minThreshold: 8, rating: 4.5, reviewsCount: 134,
    dosage: '1 tablet daily after meals.',
    description: 'High-strength biotin for hair growth, nail strengthening, and healthy skin.',
    ingredients: 'Biotin (Vitamin B7) 10000mcg',
    warnings: 'Excess biotin may interfere with lab tests. Inform doctor before testing.',
    image: photo11
  },
  {
    id: 'med-45', name: 'Ashwagandha Capsules (Himalaya)', category: 'Vitamins & Supplements',
    price: 210, stock: 85, minThreshold: 12, rating: 4.7, reviewsCount: 245,
    dosage: '1 capsule twice daily after meals.',
    description: 'Adaptogenic herb to reduce stress, improve stamina, boost immunity, and enhance vitality.',
    ingredients: 'Ashwagandha (Withania somnifera) Root Extract 250mg',
    warnings: 'Not for pregnant or lactating women. May enhance sedative effects.',
    image: photo4
  },
  {
    id: 'med-46', name: 'Multivitamin Daily (Supradyn)', category: 'Vitamins & Supplements',
    price: 185, stock: 100, minThreshold: 15, rating: 4.6, reviewsCount: 328,
    dosage: '1 tablet daily with breakfast.',
    description: 'Complete daily multivitamin with 12 vitamins and 8 minerals for overall health and energy.',
    ingredients: 'Vitamins A, B1, B2, B3, B5, B6, B12, C, D, E, Folic Acid, Biotin, Iron, Zinc, Calcium, Magnesium',
    warnings: 'Do not exceed recommended dose. Keep away from children.',
    image: photo40
  },

  // ═══════════════════════════ MEDICAL DEVICES ═══════════════════════════
  {
    id: 'med-47', name: 'Accu-Chek Active Test Strips (50s)', category: 'Medical Devices',
    price: 975, stock: 22, minThreshold: 5, rating: 4.4, reviewsCount: 36,
    dosage: 'Insert strip into glucometer. Apply blood drop to green pad.',
    description: 'Blood glucose test strips for Accu-Chek Active glucometer. Fast and precise.',
    ingredients: '50 Glucose test strips, code key chip, manuals',
    warnings: 'Keep sealed. Do not use expired strips.',
    image: photo1
  },
  {
    id: 'med-48', name: 'Omron BP Monitor (HEM-7120)', category: 'Medical Devices',
    price: 1850, stock: 15, minThreshold: 3, rating: 4.7, reviewsCount: 142,
    dosage: 'Measure BP twice daily (morning & evening) in seated position.',
    description: 'Automatic upper arm blood pressure monitor with Intellisense technology.',
    ingredients: 'Digital BP monitor, adult arm cuff, 4x AA batteries, manual',
    warnings: 'Not a substitute for clinical diagnosis. Store away from moisture.',
    image: photo48
  },
  {
    id: 'med-49', name: 'Pulse Oximeter (ChoiceMMed)', category: 'Medical Devices',
    price: 650, stock: 30, minThreshold: 5, rating: 4.5, reviewsCount: 89,
    dosage: 'Clip onto fingertip. Wait 10-15 seconds for SpO2 and pulse reading.',
    description: 'Compact fingertip pulse oximeter for blood oxygen saturation monitoring.',
    ingredients: 'Oximeter unit, Lanyard, 2x AAA batteries',
    warnings: 'Not for medical diagnosis. Nail polish may affect readings.',
    image: photo51
  },
  {
    id: 'med-50', name: 'Digital Thermometer (Dr. Morepen)', category: 'Medical Devices',
    price: 180, stock: 55, minThreshold: 8, rating: 4.6, reviewsCount: 204,
    dosage: 'Place under tongue or armpit for 60 seconds.',
    description: 'Fast, accurate digital thermometer with LCD display and beep alert.',
    ingredients: 'Digital thermometer, LR41 battery',
    warnings: 'Disinfect with alcohol before and after each use.',
    image: photo23
  },
  {
    id: 'med-51', name: 'Nebulizer Machine (Philips)', category: 'Medical Devices',
    price: 2400, stock: 8, minThreshold: 2, rating: 4.8, reviewsCount: 56,
    dosage: 'Use as directed by physician. 5-10 min sessions, 2-4 times daily.',
    description: 'Compressor nebulizer for asthma, COPD, and respiratory conditions.',
    ingredients: 'Compressor unit, nebulizer kit, adult/child masks, tubing',
    warnings: 'Clean after every use. Replace kit every 6 months.',
    image: photo61
  },
  {
    id: 'med-52', name: 'Glucometer Kit (OneTouch Select Plus)', category: 'Medical Devices',
    price: 1299, stock: 12, minThreshold: 3, rating: 4.6, reviewsCount: 87,
    dosage: 'Test blood glucose before and after meals.',
    description: 'Easy-to-use glucose meter with no coding, 5-second results, and backlit display.',
    ingredients: 'Meter device, 10 test strips, 10 lancets, lancing device, case',
    warnings: 'Store strips in cool dry place. Dispose lancets safely.',
    image: photo29
  },

  // ═══════════════════════════ PERSONAL CARE ═══════════════════════════
  {
    id: 'med-53', name: 'Himalaya Neem Face Wash 150ml', category: 'Personal Care',
    price: 175, stock: 90, minThreshold: 12, rating: 4.5, reviewsCount: 324,
    dosage: 'Apply on wet face, massage for 20 seconds, rinse. Use twice daily.',
    description: 'Ayurvedic neem and turmeric face wash that purifies skin and prevents acne.',
    ingredients: 'Neem (Azadirachta indica), Turmeric (Curcuma longa)',
    warnings: 'External use only. Avoid contact with eyes.',
    image: photo31
  },
  {
    id: 'med-54', name: 'Sensodyne Toothpaste (Rapid Relief)', category: 'Personal Care',
    price: 195, stock: 75, minThreshold: 10, rating: 4.8, reviewsCount: 512,
    dosage: 'Brush twice daily with pea-sized amount for 2 minutes.',
    description: 'Clinically proven toothpaste for sensitive teeth. Fast relief from dentine hypersensitivity.',
    ingredients: 'Stannous Fluoride 0.454%, Potassium Nitrate',
    warnings: 'Do not swallow. Children under 6 use under adult supervision.',
    image: photo52
  },
  {
    id: 'med-55', name: 'Betadine Antiseptic Solution 100ml', category: 'Personal Care',
    price: 115, stock: 45, minThreshold: 8, rating: 4.7, reviewsCount: 164,
    dosage: 'Apply with cotton swab on wound or affected area.',
    description: 'Broad-spectrum antiseptic with povidone-iodine for skin disinfection and wound care.',
    ingredients: 'Povidone-Iodine 10% w/v',
    warnings: 'External use only. May stain skin and fabric.',
    image: photo10
  },
  {
    id: 'med-56', name: 'Dettol Hand Sanitizer 500ml', category: 'Personal Care',
    price: 175, stock: 200, minThreshold: 25, rating: 4.6, reviewsCount: 278,
    dosage: 'Apply palm-sized amount. Rub hands for 20 seconds until dry.',
    description: '70% alcohol-based sanitizer. Kills 99.9% of germs without water.',
    ingredients: 'Ethanol 70% v/v, Glycerol, Hydrogen Peroxide',
    warnings: 'Flammable. Keep from heat and flame. External use only.',
    image: photo21
  },
  {
    id: 'med-57', name: 'Candid Powder (Clotrimazole)', category: 'Personal Care',
    price: 85, stock: 60, minThreshold: 10, rating: 4.5, reviewsCount: 142,
    dosage: 'Apply thin layer on affected area twice daily for 2-4 weeks.',
    description: 'Antifungal dusting powder for ringworm, athlete\'s foot, and jock itch.',
    ingredients: 'Clotrimazole 1% w/w',
    warnings: 'External use only. Avoid inhaling the powder.',
    image: photo15
  },
  {
    id: 'med-58', name: 'Boroline Antiseptic Cream 40g', category: 'Personal Care',
    price: 65, stock: 100, minThreshold: 12, rating: 4.8, reviewsCount: 345,
    dosage: 'Apply thin layer on dry/cracked skin at night.',
    description: 'Classic Indian antiseptic moisturizing cream for healing dry, cracked skin, lips, and heels.',
    ingredients: 'Boric Acid, Zinc Oxide, Lanolin, Perfume',
    warnings: 'External use only. Not for deep wounds or infected skin.',
    image: photo13
  },
  {
    id: 'med-59', name: 'Navratna Cool Hair Oil 200ml', category: 'Personal Care',
    price: 95, stock: 120, minThreshold: 15, rating: 4.6, reviewsCount: 186,
    dosage: 'Massage into scalp and hair. Leave for 30 min or overnight before washing.',
    description: 'Cooling herbal hair oil with 9 ayurvedic herbs for headache relief and hair nourishment.',
    ingredients: 'Bhringraj, Amla, Brahmi, Neem, Pudina, Sat Ajwain, Camphor, Menthol',
    warnings: 'External use only. Avoid contact with eyes. Keep in cool place.',
    image: photo43
  },
  {
    id: 'med-60', name: 'Moov Spray (Fast Pain Relief 80g)', category: 'Personal Care',
    price: 210, stock: 50, minThreshold: 8, rating: 4.7, reviewsCount: 156,
    dosage: 'Spray on affected area from 10-15cm distance. Use 3-4 times daily.',
    description: 'Quick-action spray for instant relief from muscular pain, joint stiffness, and sprains.',
    ingredients: 'Diclofenac Diethylamine, Methyl Salicylate, Menthol, Benzyl Alcohol',
    warnings: 'Highly flammable. Do not use near heat or fire. External use only.',
    image: photo39
  },
];

const initialOrders = [
  {
    id: 'ORD-9831', date: '2026-07-10T14:32:00.000Z',
    userEmail: 'user@medimart.com',
    items: [
      { id: 'med-1', name: 'Dolo 650mg (Paracetamol)', price: 30, quantity: 2 },
      { id: 'med-4', name: 'Alerid 10mg (Cetirizine)', price: 25, quantity: 1 }
    ],
    subtotal: 85, discount: 8.50, tax: 6.80, total: 83.30,
    paymentMethod: 'Credit Card', paymentStatus: 'Paid',
    deliveryAddress: 'Flat 402, Sunshine Apartments, Bandra West, Mumbai',
    status: 'Delivered', receiptId: 'REC-9831-409'
  },
  {
    id: 'ORD-4029', date: '2026-07-12T09:15:00.000Z',
    userEmail: 'user@medimart.com',
    items: [
      { id: 'med-34', name: 'Limcee 500mg Vitamin C Chewable', price: 45, quantity: 1 }
    ],
    subtotal: 45, discount: 0, tax: 3.60, total: 48.60,
    paymentMethod: 'Cash on Delivery (Offline)', paymentStatus: 'Pending',
    deliveryAddress: 'Flat 402, Sunshine Apartments, Bandra West, Mumbai',
    status: 'Shipped', receiptId: 'REC-4029-772'
  }
];

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const normalizeMedicine = (item) => ({
  ...item,
  id: item.id || item._id,
  _id: item._id,
});

const normalizeOrder = (order) => ({
  ...order,
  id: order.id || order._id,
  date: order.date || order.createdAt || order.updatedAt || new Date().toISOString(),
  deliveryAddress: order.deliveryAddress || [order.shippingDetails?.address, order.shippingDetails?.city, order.shippingDetails?.zipCode].filter(Boolean).join(', '),
});

export const AppProvider = ({ children }) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken, signOut } = useAuth();

  const [medicines, setMedicines] = useState(() => {
    const savedVersion = localStorage.getItem('mm_data_version');
    if (savedVersion !== String(DATA_VERSION)) {
      localStorage.removeItem('mm_medicines');
      localStorage.setItem('mm_data_version', String(DATA_VERSION));
      return initialMedicines;
    }
    const saved = localStorage.getItem('mm_medicines');
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  const [users, setUsers] = useState([
    {
      name: 'Alex Johnson', email: 'user@medimart.com', role: 'user',
      phone: '+91 98765 43210', address: 'Flat 402, Sunshine Apartments, Bandra West',
      city: 'Mumbai', zipCode: '400050',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60'
    }
  ]);

  const [currentUser, setCurrentUser] = useState(null);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('mm_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(initialOrders);
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineCartQueue, setOfflineCartQueue] = useState([]);
  const [promoApplied, setPromoApplied] = useState(null);

  const getAuthHeaders = async (includeAuth = false) => {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth) {
      const token = await getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  const parseApiResponse = async (res) => {
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(payload?.message || 'Request failed.');
    }
    return payload;
  };

  // Sync profile metadata with the backend whenever Clerk user is loaded
  useEffect(() => {
    const syncProfile = async () => {
      if (!user) {
        setCurrentUser(null);
        return;
      }

      // First optimistic update using Clerk fields
      setCurrentUser({
        id: user.id,
        _id: user.id,
        name: user.fullName || user.firstName || 'Customer',
        email: user.primaryEmailAddress?.emailAddress || '',
        avatar: user.imageUrl,
        role: normalizeRole(user.publicMetadata?.role || 'user'),
        phone: '',
        address: '',
        city: '',
        zipCode: ''
      });

      // Fetch additional profile details (address, city, phone) from the backend
      try {
        const token = await getToken();
        if (token) {
          const res = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const payload = await res.json();
          if (payload?.success && payload?.data?.user) {
            const dbUser = payload.data.user;
            setCurrentUser({
              id: dbUser.id || dbUser._id,
              _id: dbUser._id,
              name: dbUser.name || user.fullName || 'Customer',
              email: dbUser.email || user.primaryEmailAddress?.emailAddress || '',
              avatar: dbUser.image || user.imageUrl,
              role: normalizeRole(dbUser.role || 'user'),
              phone: dbUser.phone || '',
              address: dbUser.address || '',
              city: dbUser.city || '',
              zipCode: dbUser.zipCode || ''
            });
          }
        }
      } catch (err) {
        console.error("Failed to load user profile details:", err.message);
      }
    };

    if (userLoaded) {
      syncProfile();
    }
  }, [user, userLoaded]);

  // Load medicines from backend
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const headers = await getAuthHeaders(false);
        const res = await fetch(`${API_BASE_URL}/medicines`, { headers });
        const payload = await parseApiResponse(res);

        const serverMedicines = Array.isArray(payload?.data) ? payload.data : [];
        if (serverMedicines.length > 0) {
          setMedicines(serverMedicines.map(normalizeMedicine));
        }
      } catch {
        // Keep local fallback data when the backend is unavailable
      }
    };

    loadMedicines();
  }, []);

  // Load orders from backend
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    const loadOrders = async () => {
      try {
        const headers = await getAuthHeaders(true);
        const res = await fetch(`${API_BASE_URL}/orders`, { headers });
        const payload = await parseApiResponse(res);

        const serverOrders = Array.isArray(payload?.data) ? payload.data : [];
        setOrders(serverOrders.map(normalizeOrder));
      } catch (error) {
        console.error("Failed to load orders:", error.message);
      }
    };

    loadOrders();
  }, [currentUser]);

  // ── Persist local items to localStorage ──
  useEffect(() => { localStorage.setItem('mm_medicines', JSON.stringify(medicines)); }, [medicines]);
  useEffect(() => { localStorage.setItem('mm_cart', JSON.stringify(cart)); }, [cart]);

  // ── Online/Offline sync ──
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (offlineCartQueue.length > 0) {
        setCart(prev => {
          let updated = [...prev];
          offlineCartQueue.forEach(offlineItem => {
            const existing = updated.find(item => item.id === offlineItem.id);
            if (existing) { existing.quantity += offlineItem.quantity; }
            else { updated.push(offlineItem); }
          });
          return updated;
        });
        setOfflineCartQueue([]);
      }
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, [offlineCartQueue]);

  const toggleOnlineStatus = () => {
    const next = !isOnline;
    setIsOnline(next);
    if (next && offlineCartQueue.length > 0) {
      setCart(prev => {
        let updated = [...prev];
        offlineCartQueue.forEach(oi => {
          const existing = updated.find(item => item.id === oi.id);
          if (existing) existing.quantity += oi.quantity; else updated.push(oi);
        });
        return updated;
      });
      setOfflineCartQueue([]);
    }
  };

  // ── Auth wrappers ──
  const registerUser = async () => {
    throw new Error('Please register via the Clerk registration portal.');
  };

  const loginUser = async () => {
    throw new Error('Please log in via the Clerk login portal.');
  };

  const logoutUser = async () => {
    await signOut();
    setCurrentUser(null);
    setCart([]);
    setPromoApplied(null);
    setOrders([]);
  };

  const updateProfile = async (data) => {
    if (!currentUser) return;
    const optimistic = { ...currentUser, ...data };
    setCurrentUser(optimistic);

    try {
      const headers = await getAuthHeaders(true);
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      const payload = await parseApiResponse(res);

      if (payload?.success && payload?.data?.user) {
        const dbUser = payload.data.user;
        setCurrentUser(prev => ({
          ...prev,
          ...dbUser,
          id: dbUser.id || dbUser._id,
          avatar: dbUser.image || prev.avatar
        }));
      }
    } catch (error) {
      throw new Error(error.message || 'Unable to sync profile changes with server.');
    }
  };

  // ── Cart ──
  const addToCart = (medicineId, quantity = 1) => {
    const med = medicines.find(m => m.id === medicineId);
    if (!med) return;
    if (!isOnline) {
      setOfflineCartQueue(prev => {
        const ex = prev.find(i => i.id === medicineId);
        if (ex) return prev.map(i => i.id === medicineId ? { ...i, quantity: i.quantity + quantity } : i);
        return [...prev, { id: medicineId, quantity }];
      });
      return;
    }
    setCart(prev => {
      const ex = prev.find(i => i.id === medicineId);
      const total = (ex ? ex.quantity : 0) + quantity;
      if (total > med.stock) throw new Error(`Only ${med.stock} units available in stock.`);
      if (ex) return prev.map(i => i.id === medicineId ? { ...i, quantity: total } : i);
      return [...prev, { id: medicineId, quantity }];
    });
  };

  const updateCartQuantity = (medicineId, quantity) => {
    const med = medicines.find(m => m.id === medicineId);
    if (!med) return;
    if (quantity <= 0) { removeFromCart(medicineId); return; }
    if (quantity > med.stock) throw new Error(`Only ${med.stock} units available in stock.`);
    setCart(prev => prev.map(i => i.id === medicineId ? { ...i, quantity } : i));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  // ── Promo ──
  const applyPromo = (code) => {
    const c = code.toUpperCase();
    if (c === 'WELCOME10') { setPromoApplied({ code: c, type: 'percentage', value: 10 }); return { success: true, message: '10% Discount applied!' }; }
    if (c === 'HEALTH20') { setPromoApplied({ code: c, type: 'percentage', value: 20 }); return { success: true, message: '20% Discount applied!' }; }
    return { success: false, message: 'Invalid coupon code.' };
  };
  const removePromo = () => setPromoApplied(null);

  // ── Orders ──
  const placeOrder = async (ship, payMethod) => {
    if (cart.length === 0) throw new Error('Your cart is empty.');
    const items = cart.map(ci => { const m = medicines.find(x => x.id === ci.id); return { id: m.id, name: m.name, price: m.price, quantity: ci.quantity }; });
    const sub = items.reduce((a, i) => a + i.price * i.quantity, 0);
    const disc = promoApplied ? (sub * promoApplied.value) / 100 : 0;
    const tax = sub * 0.08;
    const tot = sub - disc + tax;

    try {
      const headers = await getAuthHeaders(true);
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items,
          shippingDetails: ship,
          paymentMethod: payMethod,
          paymentStatus: payMethod === 'Cash on Delivery (Offline)' ? 'Pending' : 'Paid',
          subtotal: +sub.toFixed(2),
          discount: +disc.toFixed(2),
          tax: +tax.toFixed(2),
          total: +tot.toFixed(2),
        }),
      });
      const payload = await parseApiResponse(res);

      const order = payload?.data || null;
      if (order) {
        const normalized = normalizeOrder(order);
        setOrders(prev => [normalized, ...prev]);
        setMedicines(prev => prev.map(m => {
          const ci = cart.find(c => c.id === m.id);
          return ci ? { ...m, stock: Math.max(0, m.stock - ci.quantity) } : m;
        }));
        clearCart();
        setPromoApplied(null);
        return normalized;
      }

      throw new Error(payload?.message || 'Order could not be placed.');
    } catch (error) {
      console.error("Failed to place order on server, using fallback:", error.message);
      const fallbackOrder = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString(),
        userEmail: currentUser?.email || '',
        items,
        subtotal: +sub.toFixed(2), discount: +disc.toFixed(2), tax: +tax.toFixed(2), total: +tot.toFixed(2),
        paymentMethod: payMethod,
        paymentStatus: payMethod === 'Cash on Delivery (Offline)' ? 'Pending' : 'Paid',
        deliveryAddress: `${ship.address}, ${ship.city} - ${ship.zipCode}`,
        status: payMethod === 'Cash on Delivery (Offline)' ? 'Processing' : 'Shipped',
        receiptId: 'REC-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(100 + Math.random() * 899)
      };
      setOrders(prev => [fallbackOrder, ...prev]);
      clearCart();
      setPromoApplied(null);
      return fallbackOrder;
    }
  };

  // ── Medicine CRUD ──
  const addMedicine = async (d) => {
    try {
      const headers = await getAuthHeaders(true);
      const res = await fetch(`${API_BASE_URL}/medicines`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...d,
          price: parseFloat(d.price) || 0,
          stock: parseInt(d.stock) || 0,
          minThreshold: parseInt(d.minThreshold) || 10,
          rating: 5.0,
          reviewsCount: 0,
          image: d.image || placeholder,
        }),
      });
      const payload = await parseApiResponse(res);

      const newMed = payload?.data ? normalizeMedicine(payload.data) : null;
      if (newMed) {
        setMedicines(prev => [...prev, newMed]);
        return newMed;
      }

      throw new Error(payload?.message || 'Unable to add medicine.');
    } catch (error) {
      console.error("Failed to add medicine on server, using fallback:", error.message);
      const fallbackMed = {
        id: 'med-' + Date.now(), rating: 5.0, reviewsCount: 0,
        image: d.image || placeholder,
        stock: parseInt(d.stock) || 0, minThreshold: parseInt(d.minThreshold) || 10,
        price: parseFloat(d.price) || 0, ...d
      };
      setMedicines(prev => [...prev, fallbackMed]);
      return fallbackMed;
    }
  };

  const updateMedicine = async (id, d) => {
    try {
      const headers = await getAuthHeaders(true);
      const res = await fetch(`${API_BASE_URL}/medicines/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(d),
      });
      const payload = await parseApiResponse(res);

      const updatedMed = payload?.data ? normalizeMedicine(payload.data) : null;
      if (updatedMed) {
        setMedicines(prev => prev.map(m => m.id === id ? updatedMed : m));
        return updatedMed;
      }

      throw new Error(payload?.message || 'Unable to update medicine.');
    } catch (error) {
      console.error("Failed to update medicine on server, using fallback:", error.message);
      setMedicines(prev => prev.map(m => m.id === id ? {
        ...m, ...d,
        stock: d.stock !== undefined ? parseInt(d.stock) : m.stock,
        minThreshold: d.minThreshold !== undefined ? parseInt(d.minThreshold) : m.minThreshold,
        price: d.price !== undefined ? parseFloat(d.price) : m.price
      } : m));
    }
  };

  const deleteMedicine = async (id) => {
    try {
      const headers = await getAuthHeaders(true);
      const res = await fetch(`${API_BASE_URL}/medicines/${id}`, {
        method: 'DELETE',
        headers,
      });
      await parseApiResponse(res);
      setMedicines(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Failed to delete medicine on server, using fallback:", error.message);
      setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  const restockMedicine = (id, amt) => setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock: m.stock + parseInt(amt) } : m));

  return (
    <AppContext.Provider value={{
      medicines, users, currentUser, cart, orders, isOnline, promoApplied, offlineCartQueue,
      toggleOnlineStatus,
      register: registerUser, login: loginUser, logout: logoutUser, updateProfile,
      addToCart, updateCartQuantity, removeFromCart, clearCart,
      applyPromo, removePromo, placeOrder,
      addMedicine, updateMedicine, deleteMedicine, restockMedicine
    }}>
      {children}
    </AppContext.Provider>
  );
};

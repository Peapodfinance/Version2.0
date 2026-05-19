import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const lenders = [
  ['one-team', 'One Team', { personalCredit: 650, monthlyRevenue: 25000, deposits: 2, nsfs: 2, avgBalance: 1000, monthsBusiness: 12 }, ['Law Firms', 'Pawn Shops', 'Finance/Investment/Banks', 'Non-Profit', 'Real Estate', 'Money Services Businesses', 'Marijuana/CBD', 'Trucking', 'Transportation', 'Bail-Bonds', 'Auto Sales']],
  ['rtmi-capital', 'RTMI Capital', { personalCredit: 640, monthlyRevenue: 50000, deposits: 2, nsfs: 2, avgBalance: 3000, monthsBusiness: 24 }, ['Law Firms', 'Pawn Shops', 'Finance/Investment/Banks', 'Non-Profit', 'Money Services Businesses', 'Marijuana/CBD', 'Trucking', 'Transportation', 'Bail-Bonds', 'Auto Sales']],
  ['peac-solutions', 'PEAC Solutions', { personalCredit: 675, monthlyRevenue: 42000, deposits: 5, nsfs: 3, avgBalance: 4200, monthsBusiness: 36 }, ['Auto Sales', 'Cleaning and Maintenance', 'Construction', 'Farming', 'Finance/Investment/Banks', 'Hotels & Lodging Memberships', 'Law Firms', 'Mining & Quarries', 'Non-Profit', 'Trucking', 'Transportation', 'Casino/ Gambling', 'Adult Entertainment']],
  ['idea-financial', 'IDEA Financial', { personalCredit: 625, monthlyRevenue: 15000, deposits: 6, nsfs: 3, avgBalance: 4000, monthsBusiness: 24 }, ['Farming', 'Contractors', 'Auto Sales', 'Auto Rentals', 'Oil & Gas', 'Finance/Investment/Banks', 'Bail-Bonds', 'Finance', 'Property Management', 'Real Estate', 'Education', 'Marijuana/CBD', 'Multi-Level Marketing Sales', 'Brokers', 'Mining & Quarries', 'Government Services', 'Gold Dealers', 'Gun Sales', 'Trucking', 'Transportation', 'Truck Leasing']],
  ['kapitus', 'Kapitus', { personalCredit: 625, monthlyRevenue: 10000, deposits: 5, nsfs: 3, avgBalance: 600, monthsBusiness: 12 }, ['Adult Entertainment', 'Auto Sales', 'Marijuana/CBD', 'Cell Phone Stores', 'Colleges/Universities', 'Credit Repair', 'Finance/Investment/Banks', 'Government Services', 'Insurance', 'Boat Sales', 'Non-Profit', 'Auto Rentals', 'Casino/ Gambling']],
  ['fox-business-funding', 'Fox Business Funding', { personalCredit: 550, monthlyRevenue: 50000, deposits: 5, nsfs: 3, avgBalance: 2000, monthsBusiness: 12 }, ['Adult Entertainment', 'Auto Sales', 'Marijuana/CBD', 'Colleges/Universities', 'Credit Repair', 'Finance/Investment/Banks', 'Boat Sales', 'Non-Profit', 'Auto Rentals', 'Casino/ Gambling']],
  ['ondeck', 'OnDeck', { personalCredit: 625, monthlyRevenue: 15000, deposits: 5, nsfs: 3, avgBalance: 1000, monthsBusiness: 24 }, ['Adult Entertainment', 'Art Dealer', 'Auto Sales', 'Bail-Bonds', 'Birth Tourism', 'Boat Sales', 'Brokers', 'Marijuana/CBD', 'Casino/ Gambling', 'Cell Phone Stores', 'Gold Dealers', 'Gun Sales', 'Horoscope/ Fortune Telling', 'Money Services Businesses', 'Multi-Level Marketing Sales', 'Non-Profit', 'Outdoor Power Equipment Stores', 'Pawn Shops', 'Private Households', 'Religious/Civic Organizations', 'RV Dealer']],
  ['headway-capital', 'Headway Capital', { personalCredit: 600, monthlyRevenue: 5000, deposits: 1, nsfs: 3, avgBalance: 500, monthsBusiness: 6 }, ['Adult Entertainment', 'Art Dealer', 'Auto Sales', 'Bail-Bonds', 'Birth Tourism', 'Boat Sales', 'Brokers', 'Marijuana/CBD', 'Casino/ Gambling', 'Cell Phone Stores', 'Gold Dealers', 'Gun Sales', 'Horoscope/ Fortune Telling', 'Money Services Businesses', 'Multi-Level Marketing Sales', 'Non-Profit', 'Outdoor Power Equipment Stores', 'Pawn Shops', 'Private Households', 'Religious/Civic Organizations', 'RV Dealer']],
  ['credibly', 'Credibly', { personalCredit: 550, monthlyRevenue: 20000, deposits: 4, nsfs: 7, avgBalance: 1000, monthsBusiness: 6 }, ['Auto Sales', 'Adult Entertainment', 'Bail-Bonds', 'Brokers', 'Casino/ Gambling', 'Credit Repair', 'Dating Services', "Dickey's BBQ Franchises", 'Government Agencies', 'Gun Sales', 'Law Firms', 'Marijuana/CBD', 'Multi-Level Marketing Sales', 'Non-Profit', 'Oil & Gas', 'Religious/Civic Organizations', 'Vape Shop', 'Warrenty Services', 'Trucking', 'Transportation']],
  ['spartan-capital', 'Spartan Capital', { personalCredit: 500, monthlyRevenue: 10000, deposits: 3, nsfs: 5, avgBalance: 1000, monthsBusiness: 12 }, ['Auto Sales', 'Adult Entertainment', 'Bail-Bonds', 'Brokers', 'Casino/ Gambling', 'Credit Repair', 'Dating Services', 'Government Agencies', 'Gun Sales', 'Law Firms', 'Marijuana/CBD', 'Multi-Level Marketing Sales', 'Non-Profit', 'Oil & Gas', 'Religious/Civic Organizations', 'Vape Shop', 'Warrenty Services']],
  ['mulligan', 'Mulligan', { personalCredit: 625, monthlyRevenue: 25000, deposits: 4, nsfs: 3, avgBalance: 3000, monthsBusiness: 6 }, ['Adult Entertainment', 'Art Dealer', 'Auto Sales', 'Bail-Bonds', 'Birth Tourism', 'Boat Sales', 'Brokers', 'Marijuana/CBD', 'Casino/ Gambling', 'Cell Phone Stores', 'Gold Dealers', 'Gun Sales', 'Horoscope/ Fortune Telling', 'Money Services Businesses', 'Multi-Level Marketing Sales', 'Non-Profit', 'Outdoor Power Equipment Stores', 'Pawn Shops', 'Private Households', 'Religious/Civic Organizations', 'RV Dealer', 'Finance/Investment/Banks', 'Food Trucks', 'Law Firms', 'Real Estate', 'Trucking', 'Transportation', 'Vending', 'Vape Shop', 'Insurance']],
  ['rapid-finance', 'Rapid Finance', { personalCredit: 600, monthlyRevenue: 10000, deposits: 3, nsfs: 5, avgBalance: 1000, monthsBusiness: 24 }, ['Adult Entertainment', 'Auto Sales', 'Bail-Bonds', 'Casino/ Gambling', 'Collections', 'Finance/Investment/Banks', 'Gun Sales', 'Influencers', 'Law Firms', 'Marijuana/CBD', 'Multi-Level Marketing Sales', 'Nightclub', 'Non-Profit', 'Real Estate', 'Religious/Civic Organizations', 'Trucking', 'Transportation', 'Vape Shop', 'Property Management']],
  ['expansion', 'Expansion', { personalCredit: 550, monthlyRevenue: 6000, deposits: 2, nsfs: 6, avgBalance: 550, monthsBusiness: 6 }, ['Adult Entertainment', 'Auto Sales', 'Bail-Bonds', 'Boat Sales', 'Business Associations/Unions', 'Call Centers', 'Card Processors', 'Casino/ Gambling', 'Collections', 'Finance/Investment/Banks', 'Government Agencies', 'Law Firms', 'Lead Generators', 'Lease-to-own Businesses', 'Marijuana/CBD', 'Mining & Quarries', 'Multi-Level Marketing Sales', 'Non-Profit', 'Pawn Shops', 'PREC.METALS', 'Religious/Civic Organizations', 'Brokers', 'Travel Agencies']],
  ['kalamata', 'Kalamata', { personalCredit: 600, monthlyRevenue: 18000, deposits: 4, nsfs: 3, avgBalance: 750, monthsBusiness: 12 }, ['Adult Entertainment', 'Education', 'Auto Sales', 'Farming', 'Gas & Oil', 'Gun Sales', 'Law Firms', 'Marijuana/CBD', 'Non-Profit', 'Pawn Shops', 'PREC.METALS', 'Real Estate', 'Retail', 'Religious/Civic Organizations', 'Trucking', 'Transportation', 'Towing']],
  ['fundation-mca', 'Fundation MCA', { personalCredit: 600, monthlyRevenue: 20000, deposits: 2, nsfs: 2, avgBalance: 1000, monthsBusiness: 6 }, ['Law Firms', 'Gun Sales', 'Pawn Shops', 'Non-Profit', 'Real Estate', 'Money Services Businesses', 'Marijuana/CBD', 'Trucking', 'Transportation', 'Bail-Bonds', 'Finance/Investment/Banks']],
  ['greenwich-capital', 'Greenwich Capital', { personalCredit: 600, monthlyRevenue: 50000, deposits: 3, nsfs: 3, avgBalance: 1000, monthsBusiness: 24 }, ['Accounting', 'Auto Rentals', 'Auto Sales', 'Bail-Bonds', 'Brokers', 'Cell Phone Stores', 'Finance/Investment/Banks', 'Food Trucks', 'Law Firms', 'Non-Profit', 'Real Estate', 'Trucking', 'Transportation', 'Vending']],
  ['cfg', 'CFG', { personalCredit: 500, monthlyRevenue: 15000, deposits: 3, nsfs: 4, avgBalance: 1000, monthsBusiness: 6 }, ['Auto Sales', 'Bail-Bonds', 'Collections', 'Non-Profit', 'Religious/Civic Organizations', 'Travel Agencies', 'Wholesale', 'Brokers']],
  ['edge', 'Edge', { personalCredit: 500, monthlyRevenue: 6000, deposits: 2, nsfs: 5, avgBalance: 600, monthsBusiness: 6 }, ['Adult Entertainment', 'Auto Sales', 'Auto Rentals', 'Casino/ Gambling', 'Trucking', 'Transportation', 'Brokers']],
  ['gfe', 'GFE', { personalCredit: 500, monthlyRevenue: 30000, deposits: 3, nsfs: 3, avgBalance: 1000, monthsBusiness: 12 }, []],
  ['legend', 'Legend', { personalCredit: 650, monthlyRevenue: 30000, deposits: 3, nsfs: 3, avgBalance: 1000, monthsBusiness: 36 }, ['Adult Entertainment', 'Auto Sales', 'Education', 'Farming', 'Oil & Gas', 'Gun Sales', 'Law Firms', 'Marijuana/CBD', 'Non-Profit', 'Pawn Shops', 'Real Estate', 'Brokers', 'Religious/Civic Organizations', 'Trucking', 'Transportation']],
  ['everest', 'Everest', { personalCredit: 550, monthlyRevenue: 5000, deposits: 3, nsfs: 10, avgBalance: 1000, monthsBusiness: 3 }, ['Adult Entertainment', 'Finance/Investment/Banks', 'Auto Sales', 'Education', 'Gun Sales', 'Law Firms', 'Non-Profit', 'Pawn Shops', 'Real Estate', 'Brokers', 'Religious/Civic Organizations']],
  ['vader-mountain-capital', 'Vader Mountain Capital', { personalCredit: 500, monthlyRevenue: 3000, deposits: 3, nsfs: 10, avgBalance: 500, monthsBusiness: 3 }, ['Adult Entertainment', 'Finance/Investment/Banks', 'Auto Sales', 'Education', 'Gun Sales', 'Law Firms', 'Non-Profit', 'Pawn Shops', 'Real Estate', 'Brokers', 'Religious/Civic Organizations']],
  ['bitty', 'Bitty', { personalCredit: 450, monthlyRevenue: 1000, deposits: 1, nsfs: 10, avgBalance: 100, monthsBusiness: 1 }, ['Auto Sales', 'Accounting']],
  ['good-funding', 'Good Funding', { personalCredit: 600, monthlyRevenue: 5000, deposits: 4, nsfs: 3, avgBalance: 1200, monthsBusiness: 18 }, []],
  ['cashflo-it', 'Cashflo It', { personalCredit: 500, monthlyRevenue: 35000, deposits: 5, nsfs: 2, avgBalance: 600, monthsBusiness: 12 }, ['Adult Entertainment', 'Auto Sales', 'Casino/ Gambling', 'Collections', 'Construction', 'Contractors', 'Roofing', 'Electrician', 'Landscaping', 'Farming', 'Finance/Investment/Banks', 'Gas Stations', 'Insurance', 'Law Firms', 'Marijuana/CBD', 'Real Estate', 'Brokers', 'Title Companies', 'Trucking', 'Transportation']],
  ['dexly-finance', 'Dexly Finance', { personalCredit: 600, monthlyRevenue: 200000, deposits: 2, nsfs: 5, avgBalance: 1000, monthsBusiness: 12 }, ['Construction', 'Consulting', 'Finance/Investment/Banks', 'Non-Profit', 'Contractors', 'Money Services Businesses', 'Marijuana/CBD', 'Trucking', 'Transportation', 'Bail-Bonds', 'Auto Sales']],
  ['capital-assist', 'Capital Assist', { personalCredit: 500, monthlyRevenue: 75000, deposits: 3, nsfs: 6, avgBalance: 1000, monthsBusiness: 6 }, ['Adult Entertainment', 'Auto Sales', 'Casino/ Gambling', 'Collections', 'Construction', 'Contractors', 'Farming', 'Finance/Investment/Banks', 'Gas Stations', 'Insurance', 'Law Firms', 'Marijuana/CBD', 'Real Estate', 'Brokers', 'Title Companies', 'Trucking', 'Transportation']],
  ['greenbox', 'GreenBOX', { personalCredit: 500, monthlyRevenue: 10000, deposits: 2, nsfs: 7, avgBalance: 150, monthsBusiness: 5 }, ['Bail-Bonds', 'Collections', 'Credit Repair', 'Finance/Investment/Banks', 'Marijuana/CBD', 'Religious/Civic Organizations', 'Trucking', 'Transportation', 'Real Estate', 'Brokers']],
  ['last-chance-funding', 'Last Chance Funding', { personalCredit: 450, monthlyRevenue: 1000, deposits: 1, nsfs: 10, avgBalance: 500, monthsBusiness: 1 }, ['Finance/Investment/Banks', 'Medical/Healthcare', 'Restaurant']],
  ['torro', 'Torro', { personalCredit: 500, monthlyRevenue: 15000, deposits: 3, nsfs: 2, avgBalance: 500, monthsBusiness: 4 }, ['Trucking', 'Transportation', 'Finance/Investment/Banks']],
];

const defaultWeights = {
  personalCredit: 0.25,
  monthlyRevenue: 0.3,
  deposits: 0.1,
  nsfs: 0.2,
  avgBalance: 0.05,
  monthsBusiness: 0.1,
};

const out = lenders.map(([id, name, criteria, restrictedIndustries]) => ({
  id,
  name,
  criteria,
  restrictedIndustries,
  weights: { ...defaultWeights },
  metadata: {
    riskTolerance: criteria.personalCredit >= 625 ? 'medium' : 'high',
    speed: criteria.monthsBusiness <= 6 ? 'fast' : 'standard',
    maxPosition: 2,
    preferredIndustries: ['Retail', 'Restaurant', 'Professional Services'],
  },
}));

writeFileSync(join(__dirname, '../data/lenders.json'), JSON.stringify(out, null, 2));
console.log(`Generated ${out.length} lenders`);

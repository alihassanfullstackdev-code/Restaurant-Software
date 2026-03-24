/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Pizza, 
  ShoppingCart, 
  Menu as MenuIcon, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MapPin, 
  Search, 
  Send, 
  Star, 
  Clock, 
  Tag, 
  Users,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Page = 'home' | 'menu' | 'deals' | 'locations';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  bestseller?: boolean;
  new?: boolean;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  tag: string;
  tagColor: string;
  items: string[];
}

// --- Constants ---
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'BBQ Chicken Pizza',
    price: 16.99,
    description: 'Smoked chicken, red onions, cilantro, and our signature smoked BBQ sauce on mozzarella.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIBaTF1YLZQxA4zOTdu51a8L19LNywoL6Who_m45CTIPQhpimM--Ti8Nq_ZQyy4OYcd4CtTXIG1G_ap5OwYJTSzEw59FsumFAdBSXBb-zIkYS-_nALuCZpc75WABLyblRd6Jf1oqs3cSryr5PEjttOdTpONk32jPguIYg_2yxG-HSCSzj-UfipU4Tf_Gxd_MWO23NY8TMk44qjofrRFANndM7eeDS8h9aGmVLQVOxieEZuugezJLkXdPRPHkPNZO2-jpQqkRkZ17E',
    category: 'Signature Pizzas',
    bestseller: true
  },
  {
    id: '2',
    name: 'California Veggie',
    price: 14.99,
    description: 'Fresh avocado, red peppers, sun-dried tomatoes, and grilled zucchini with pesto sauce.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT95GH3CdQxcXRI_ZgBy-tnPYlOIUgJtIwOpPDL_2KcgoEVudemhDkMD7G9kc0nygYrtxtR-xRs-AL8rY2AMayZNKLI5G9SbDkZg4Bbxr59cZZoIhi680rAhquNh_3SzZHDfUxdKeIVMv-wuVAfjBn0cdfNdwvP1-1JDhstARsdOvuFCx6qB_GnGdBp4rrCfS_wiGkb9bsjWlQ63gQCKh4KOUIsRrNddE0vxzcmoi1wuxDg7AVTblcMqYoeLG8RTjXh5XqOcZ7Jtg',
    category: 'Signature Pizzas'
  },
  {
    id: '3',
    name: 'Pepperoni Feast',
    price: 15.99,
    description: 'Double portion of premium pepperoni and extra mozzarella on our spicy marinara base.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACDavOnDMI4sBypHwZWGzv2eXqs8lKcuUS77AMAjo0ZDl8Y5O9vA5URWZQ5i6xEzZky6tdo7syZVKhlv0wdrpszm9Emrcc444wg7S2fPGuJRVQuKzhwakUvWpNfCOsT0_P4pwK5rh9V4gPjnuuDx3SUYuh8FjoynZ03y1EFSqV2TL9KzN9_JZqJXsh0sOVgHKidQxxvwejY0dify2BXNf4ShNurm5M9Tok5owAyynXMKAXFMLxh3hMnJYs-9XlogbHmNgvphBXKAI',
    category: 'Signature Pizzas'
  },
  {
    id: '4',
    name: 'Hollywood Truffle',
    price: 19.99,
    description: 'Wild mushrooms, black truffle oil, and roasted garlic.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLQBm8Tbsn3eGXsUztI3pzIb5Vw-bYVqKvWQEH3NU4_v_spCh8RcmHuSfyiS7JeyC8zYirciASx4FEHJpJcvZpAltvDwVj6QXOflii8nscUOvSIBTfUcQe-_PMy0n-wt50QZGiyMuDlZvpZsbJbz9iYQNRKzxqMS-LWZSJ20E7HlkHE2J_5N8FJ9vLlb4RWVty0ge7mGe1OiC7j2x8niaNIWQ2Fq6Qcl4T7rGIKNhcjiy4ipwtJ5w_JJ30ASBmh-g4ifidmbzbGT8',
    category: 'Local Flavors',
    new: true
  }
];

const DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'The Night Owl Feast',
    description: 'Perfect for late night gaming or study sessions. Valid 10 PM - 3 AM daily.',
    price: '$14.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBptQvcNMn2yH2-NSDS8ytwV-Qb9kQ7RqWhdpyZPW55G5LbzTqob_749plvCDfKQC0r4HTG7RcjsIOUI5dYtLJQpQCpwqruijceN-61sfOyvseyIFjhihTj85N-F16JcFYKldcnNPcKpINV6pSFwgUT3Sm1nVGba-sNbVJvGjlWzlESPewdz8I7rmZ4EW5Sv8dUHZgcgDspQ2bJ1km3VXwe2dnI6hXfPcBUTy3vOMKpk64LImhZG99VF_BtRzu3V726Bo3RSFWbZPs',
    tag: 'Midnight Only',
    tagColor: 'bg-slate-900',
    items: ['1 Medium 2-Topping Pizza', '1 Portion Garlic Knots (4 pcs)', '500ml Soda of choice']
  },
  {
    id: 'd2',
    title: 'Solo Lunch Power Pack',
    description: 'The ultimate quick lunch break solution. Available Monday to Friday, 11 AM - 3 PM.',
    price: '$9.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZegUaKrRM4JmBXrsUNmHw7GVPK7XjtLaBjJdud5U4c8JX1Xk8v3y1Fs1jaqU3OCWRsNNLaNdAF8v3PVcXReFOeMa-vm52rW5Vv0BMzy7GN8uvitl5VkLaPCYEASfti-KxAhi_9o-5-S9pYfrjQNNnuUPOvnz3nZyjnVdnKYxrqj9SAjfUmC3FepCCVAzuus3L9E80c41BexV8o6fsBJrYijmvzt1SM2Mwv0339mWaWH0wAcH3PWhUhgLJC1Uo33fQSjN6gI2k8i0',
    tag: 'Best Seller',
    tagColor: 'bg-green-600',
    items: ['1 Personal Pan Pizza', 'Side Garden Salad', 'Iced Tea or Fountain Soda']
  }
];

// --- Components ---

const Navbar = ({ currentPage, setPage }: { currentPage: Page, setPage: (p: Page) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav border-b border-primary/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setPage('home')}>
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Pizza className="size-6" />
          </div>
          <h1 className="text-white text-xl font-black tracking-tight uppercase italic">California Pizza</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-10">
          {(['home', 'menu', 'deals', 'locations'] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === p ? 'text-primary' : 'text-slate-100 hover:text-primary'}`}
            >
              {p}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button className="relative text-white hover:text-primary transition-colors">
            <ShoppingCart className="size-6" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold size-5 rounded-full flex items-center justify-center border-2 border-background-dark">3</span>
          </button>
          <button 
            onClick={() => setPage('menu')}
            className="bg-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all active:scale-95 shadow-lg shadow-primary/30"
          >
            ORDER NOW
          </button>
        </div>
      </div>
    </header>
  );
};

const Hero = ({ onOrder }: { onOrder: () => void }) => (
  <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0 scale-105">
      <img 
        className="w-full h-full object-cover brightness-[0.4]" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCet6CNXP0h1esVv_C7D72llxiP5HWMro9cZa_a55c1751AHTk-sHZk_nPZQwSpAbMIhqKOlpCo4QnzGti8alPEAu_hiAM3sONRIhTthmh48HG7yEnFaY1UWYETPZaqQwn6eU8cbBEl4KsVNOeBKcEQ894o6uZqpY6Uft5Jslbhb0bQaveJe01UKhtrG72jfFOSe0ymQuQR4xGSb-A-x-ephKyq3wXDrhiux3lg3eZcjoerhgniTHc8Aye3CKCXJ9FOdPSk_g50VBA" 
        alt="Delicious Pizza"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark/60"></div>
    </div>
    <div className="relative z-10 text-center px-6 max-w-4xl">
      <motion.span 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block px-4 py-1.5 bg-primary/20 border border-primary text-primary font-bold text-xs tracking-widest uppercase rounded-full mb-6"
      >
        EST. 1994 • LOS ANGELES
      </motion.span>
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-8 drop-shadow-2xl"
      >
        THE GOLDEN STATE'S <span className="text-primary">FINEST SLICES.</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-200 text-lg md:text-xl font-normal max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Experience artisanal sourdough crusts, sun-ripened tomatoes, and locally-sourced California produce delivered straight to your doorstep.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <button 
          onClick={onOrder}
          className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-red-700 text-white font-black text-lg rounded-xl transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-2 group"
        >
          START YOUR ORDER
          <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-xl backdrop-blur-md transition-all">
          VIEW MENU
        </button>
      </motion.div>
    </div>
  </section>
);

const DealsSection = () => (
  <section className="py-24 bg-background-light overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-slate-900 text-4xl font-black tracking-tight mb-2">HOT OFF THE OVEN</h2>
          <p className="text-slate-500 font-medium">Limited time offers you can't resist.</p>
        </div>
        <div className="flex gap-2">
          <button className="size-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
            <ChevronLeft />
          </button>
          <button className="size-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-8 snap-x">
        {DEALS.map((deal) => (
          <div key={deal.id} className="min-w-[380px] snap-start group">
            <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-xl">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={deal.image} alt={deal.title} />
              <div className={`absolute top-4 left-4 ${deal.tagColor} text-white font-black px-3 py-1 rounded text-xs`}>{deal.tag}</div>
              <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-xl shadow-lg">
                <span className="text-primary font-black text-xl">{deal.price}</span>
              </div>
            </div>
            <h3 className="text-slate-900 text-xl font-bold mb-2">{deal.title}</h3>
            <p className="text-slate-500 text-sm mb-6">{deal.description}</p>
            <button className="w-full py-4 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <Plus className="size-5" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const MenuCategories = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-slate-900 text-4xl font-black tracking-tight mb-12 text-center uppercase">Explore the Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Artisanal Pizzas', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHY-kuclcWfA-1XmX-avLFMt5SfYjDr6AbPSUmkmmkQKG3qj_ruGbXORKQzbtpUJCHSh_dj6YpJqcqGOLGJHEMB9GqS_0Z4mmoFHWOgWpqnNChnBxBwOwi-l2P4cdx-OzYbEQ7xLp8kg-RqLwghCcKfgpNcUf1f-KsRlazW9rq7k-QS7brlZsQaW6gQ7XQQTuq3stelaC05TjiT7cLYSGWyewidMueHIraAwLLV0NurVN7i3N57Ogl6K8VQxPLVoZ_THCYChyuk74' },
          { name: 'Starters', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPPhGUXE4BTLeYv21UDQgr9yIEvXb8Zs8yD2WJn7AorrXaSK-Gv2j86rVKx4FDX4mft4rkzLaK-i6EUbYeARlAO7g7K2yos8w2stHAVNQ7KUPW-HnfcIC2Wv3j_PN82chlY6nlsiqkO89NUJq1vwslDgzyk6khlZnX4wVO0fH57PdIlika1RV0G7i01RdICvzAUdBeff6uFd8OTyCR5rOsXIjSPCMrqKbL5zs-1Ncq4IpxUej-I-8tl3mR8QhOPDFNubLJZaC2IY8' },
          { name: 'Pasta & Bowls', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcK8eIOUDGZvOI3DMK1NsrKcjQek0Ab3BPq37dFokDn3fi7WQbXurevvxciH6udo5H0z5ija9E_8tSqmLbI-PpnmhouUR_WkwvYW25i10zgi170j8MalcABVsyCHQd2AvYKSED7U6HfRZCVy2y1tAe7fj7Cxz0N2YKtiCMisW0Gjj74zFyfj06Z4iqMuF6IycS4EmswII8N1KXFfYLO0h_rHa__Z_TT4KJo2m_zZPv4xcgUo-NHK5GI6HiWyNO6O0jTG8ipW7y-XM' }
        ].map((cat) => (
          <div key={cat.name} className="group relative h-96 rounded-3xl overflow-hidden flex flex-col items-center justify-end p-8 shadow-2xl cursor-pointer">
            <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75" src={cat.img} alt={cat.name} />
            <div className="relative z-10 text-center">
              <h3 className="text-white text-3xl font-black mb-2 uppercase tracking-tighter">{cat.name}</h3>
              <div className="h-1 w-0 group-hover:w-full bg-primary mx-auto transition-all duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const LocationBanner = () => (
  <section className="py-16 bg-primary text-white overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-6">
        <MapPin className="size-16" />
        <div>
          <h3 className="text-3xl font-black tracking-tight">FIND A PIZZERIA NEAR YOU</h3>
          <p className="text-white/80 font-medium">Over 40 locations across the Golden State.</p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="relative">
          <input className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl px-6 py-4 w-64 focus:ring-0 focus:border-white transition-all" placeholder="Enter Zip Code" type="text" />
        </div>
        <button className="bg-white text-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Search</button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#1a0c0c] text-slate-400 py-20 border-t border-primary/10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <div className="flex items-center gap-2 mb-8">
          <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
            <Pizza className="size-5" />
          </div>
          <h2 className="text-white text-lg font-black uppercase tracking-tight">California Pizza</h2>
        </div>
        <p className="text-sm leading-relaxed mb-8">Bringing the authentic taste of California to your table since 1994. Quality ingredients, bold flavors, and a slice of sunshine in every bite.</p>
        <div className="flex gap-4">
          <a className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#"><Instagram className="size-5" /></a>
          <a className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#"><Facebook className="size-5" /></a>
          <a className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all" href="#"><Twitter className="size-5" /></a>
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Explore</h4>
        <ul className="space-y-4 text-sm">
          <li><a className="hover:text-primary transition-colors" href="#">Our Menu</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Special Offers</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Catering</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Nutrition Info</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Company</h4>
        <ul className="space-y-4 text-sm">
          <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Franchising</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Join the Club</h4>
        <p className="text-xs mb-4">Get the latest deals and pizza news delivered to your inbox.</p>
        <div className="flex gap-2">
          <input className="bg-white/5 border-white/10 text-white rounded-lg px-4 py-2 w-full focus:ring-primary focus:border-primary text-sm" placeholder="Your Email" type="email" />
          <button className="bg-primary text-white p-2 rounded-lg"><Send className="size-5" /></button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
      <p>© 2024 California Pizza. All rights reserved.</p>
      <div className="flex gap-6">
        <a className="hover:text-white" href="#">Privacy Policy</a>
        <a className="hover:text-white" href="#">Terms of Service</a>
        <a className="hover:text-white" href="#">Cookies</a>
      </div>
    </div>
  </footer>
);

const MenuPage = () => {
  const categories = ['Special Deals', 'Signature Pizzas', 'Local Flavors', 'Sides & Starters', 'Desserts', 'Beverages'];
  const [activeCategory, setActiveCategory] = useState('Signature Pizzas');

  return (
    <div className="pt-24 min-h-screen bg-background-light">
      <div className="max-w-[1440px] mx-auto px-6 py-8 flex gap-10">
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Explore Menu</h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeCategory === cat ? 'bg-primary/10 text-primary' : 'hover:bg-white text-slate-600'}`}
                    >
                      {cat === 'Special Deals' && <Tag className="size-5" />}
                      {cat === 'Signature Pizzas' && <Star className="size-5" />}
                      {cat === 'Local Flavors' && <MapPin className="size-5" />}
                      <span className={activeCategory === cat ? 'font-bold' : 'font-medium'}>{cat}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-primary rounded-2xl text-white">
              <h4 className="font-bold mb-2">Order Tracking</h4>
              <p className="text-xs text-white/80 mb-4 leading-relaxed">Check the status of your hot pizza in real-time.</p>
              <button className="w-full bg-white text-primary py-2 rounded-lg text-sm font-bold">Track Now</button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">{activeCategory}</h2>
              <p className="text-slate-500">Our world-famous original recipes made with premium ingredients.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {PRODUCTS.filter(p => p.category === activeCategory || activeCategory === 'Special Deals').map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="relative h-56 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={product.image} alt={product.name} />
                  {product.bestseller && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                      Bestseller
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <span className="text-primary font-bold text-lg">${product.price}</span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6">{product.description}</p>
                  <button className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                    <Plus className="size-5" />
                    <span>Add to Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

const DealsPage = () => (
  <div className="pt-24 min-h-screen bg-background-light">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-black tracking-tight mb-4">Exclusive Deals</h2>
        <p className="text-slate-500">The best value for your pizza cravings.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DEALS.map((deal) => (
          <div key={deal.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform">
            <div className="relative h-56 overflow-hidden">
              <img className="w-full h-full object-cover" src={deal.image} alt={deal.title} />
              <div className="absolute top-4 left-4">
                <span className={`${deal.tagColor} text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider`}>{deal.tag}</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-black text-xl shadow-lg">
                {deal.price}
              </div>
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">{deal.description}</p>
              <ul className="space-y-2 mb-6 text-sm font-medium">
                {deal.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700">
                    <Star className="size-4 text-primary fill-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 pb-6 mt-auto">
              <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">Claim Deal</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LocationsPage = () => (
  <div className="pt-24 min-h-screen bg-background-light">
    <div className="max-w-[1600px] mx-auto px-6 py-12">
      <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-8">Find Your Nearest Slice</h2>
      
      <div className="flex flex-col lg:flex-row gap-8 h-[700px] mb-20">
        <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="City, state, or zip code" type="text" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <button className="flex items-center gap-2 whitespace-nowrap bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">
                <MapPin className="size-4" /> Near Me
              </button>
              <button className="flex items-center gap-2 whitespace-nowrap bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:border-primary">
                Open Now
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {[
              { name: 'Santa Monica Pier', addr: '1200 Ocean Ave, Santa Monica, CA 90401', dist: '0.8 miles', open: true },
              { name: 'Beverly Hills Square', addr: '255 N Canon Dr, Beverly Hills, CA 90210', dist: '4.2 miles', open: true },
              { name: 'Pasadena Central', addr: '99 S Los Robles Ave, Pasadena, CA 91101', dist: '12.5 miles', open: false }
            ].map((loc) => (
              <div key={loc.name} className={`p-5 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${loc.name === 'Santa Monica Pier' ? 'border-primary bg-primary/[0.02]' : 'border-slate-100 bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{loc.name}</h3>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${loc.open ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {loc.open ? 'Open Now' : 'Opens at 11 AM'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-3 flex items-start gap-2">
                  <MapPin className="size-4 mt-0.5" />
                  {loc.addr}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium">Distance</span>
                    <span className="text-sm font-bold">{loc.dist}</span>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${loc.open ? 'bg-primary text-white hover:bg-red-700' : 'bg-slate-100 text-slate-900'}`}>Order Here</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-slate-200 rounded-2xl relative overflow-hidden shadow-inner border border-slate-100">
          <div className="absolute inset-0 bg-cover bg-center grayscale-[0.5]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwx1-3Mane4a1-mTlwJeFuFsNjGj4MRkMYI0EDaJgo_vf4b7TrspzM-nNpjnBds9Ftf7mLgev5KHIJhjQIkVhE_PAtl6_0iyShZdzJEA4UQW617atMVzAsQKpLlia3bWpI7zkgUNvqlyEKNIBz-Rk9jVJG6NR4WcjbtKY-blf-eq6nIDvEudh9mNUGEFyt08RaWbRwRizAosyokFbfw7R44Fs-xvrS2jlhpzmUdfqOc4Dscr99MRINm5Eq22Z9JG6-Rb-y6TcSbNM')" }}></div>
          <div className="absolute top-[30%] left-[25%] animate-bounce">
            <MapPin className="size-12 text-primary drop-shadow-lg fill-primary" />
          </div>
        </div>
      </div>

      <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 lg:p-16 flex flex-col lg:flex-row gap-16 overflow-hidden relative">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="w-full lg:w-1/3">
          <h3 className="text-3xl font-black tracking-tight text-slate-900 mb-6">Get in Touch</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">Have a question about our menu? Want to host an event? We're here for you.</p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Phone /></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Call Us</p><p className="font-bold text-slate-900">1-800-CA-PIZZA</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Mail /></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Us</p><p className="font-bold text-slate-900">hello@californiapizza.com</p></div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/3">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20" placeholder="Full Name" type="text" />
            <input className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20" placeholder="Email Address" type="email" />
            <textarea className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 md:col-span-2 resize-none" placeholder="How can we help you today?" rows={4}></textarea>
            <button className="w-full bg-primary hover:bg-red-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 md:col-span-2">
              <Send className="size-5" /> Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  </div>
);

export default function App() {
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen">
      <Navbar currentPage={page} setPage={setPage} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {page === 'home' && (
            <>
              <Hero onOrder={() => setPage('menu')} />
              <DealsSection />
              <MenuCategories />
              <LocationBanner />
            </>
          )}
          {page === 'menu' && <MenuPage />}
          {page === 'deals' && <DealsPage />}
          {page === 'locations' && <LocationsPage />}
        </motion.div>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

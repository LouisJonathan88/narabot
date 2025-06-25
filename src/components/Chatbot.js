import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { Send, SmartToy, Person, Close, ExpandLess, ExpandMore } from '@mui/icons-material';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      text: 'Halo! Saya NaraBot, asisten virtual Anda. Ada yang bisa saya bantu?', 
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const formRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    const chatContainer = document.querySelector('.chatbot-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Daftar pertanyaan dan jawaban
    const responses = {
      // ========== UMUM ==========
      // Sapaan
      'hai|halo|hi|hello|pagi|siang|sore|malam': [
        'Halo! Ada yang bisa saya bantu?',
        'Hai! Senang bertemu dengan Anda. Ada yang bisa saya bantu?',
        'Halo! Saya NaraBot, asisten virtual Anda. Ada yang bisa saya bantu?'
      ],
      // Perkenalan
      'siapa kamu|kamu siapa|nama kamu|kamu namanya apa': [
        'Saya NaraBot, asisten virtual yang siap membantu Anda kapan saja!',
        'Nama saya NaraBot, asisten digital yang siap membantu Anda.'
      ],
      // Bantuan
      'bisa bantu apa|bisa apa aja|fitur|bantuan|help|tolong': [
        'Saya bisa membantu dengan berbagai hal seperti menjawab pertanyaan umum, memberikan informasi, atau menghubungkan Anda dengan tim dukungan.',
        'Saya siap membantu Anda dengan berbagai pertanyaan. Silakan tanyakan apa saja!' 
      ],
      // Jam operasional
      'buka jam|jam operasional|jam buka|jam kerja': [
        'Kami buka 24/7 untuk melayani Anda!',
        'Layanan kami tersedia setiap hari selama 24 jam.'
      ],
      // Kontak
      'kontak|telepon|email|alamat|hubungi|kontak kami':
        'Anda dapat menghubungi kami melalui:\n' +
        '\n📞 Telepon: (021) 1234-5678\n' +
        '📧 Email: info@narabot.com\n' +
        '📍 Alamat: Jl. Contoh No. 123, Jakarta',
      // Harga
      'harga|biaya|tarif|berapa harganya|berapa biayanya':
        'Untuk informasi harga terbaru, Anda bisa mengunjungi halaman harga di website kami atau menghubungi tim penjualan kami.',
      
      // ========== PRODUK & LAYANAN ==========
      'produk|layanan|jasa|apa saja yang ditawarkan': [
        'Kami menawarkan berbagai produk dan layanan digital untuk kebutuhan bisnis Anda, termasuk pengembangan website, aplikasi mobile, dan konsultasi IT.',
        'Produk dan layanan kami mencakup solusi IT lengkap untuk bisnis Anda, mulai dari website hingga aplikasi custom.'
      ],
      'website|buat website|pembuatan web|web development': [
        'Kami menyediakan jasa pembuatan website profesional untuk berbagai kebutuhan bisnis Anda, mulai dari company profile, toko online, hingga website custom.',
        'Layanan pembuatan website kami mencakup desain responsif, SEO friendly, dan fitur keamanan terbaik.'
      ],
      'aplikasi|mobile app|aplikasi android|aplikasi ios': [
        'Kami mengembangkan aplikasi mobile untuk platform Android dan iOS dengan performa optimal dan user experience terbaik.',
        'Layanan pengembangan aplikasi mobile kami mencakup UI/UX design, backend development, hingga maintenance.'
      ],
      'desain|desain grafis|banner|logo': [
        'Kami menyediakan jasa desain grafis profesional untuk kebutuhan branding bisnis Anda, termasuk logo, banner, brosur, dan materi pemasaran lainnya.',
        'Tim desainer kami siap membantu menciptakan identitas visual yang menarik untuk bisnis Anda.'
      ],
      'digital marketing|pemasaran digital|sosial media': [
        'Layanan digital marketing kami mencakup manajemen media sosial, iklan berbayar, SEO, dan strategi pemasaran online lainnya.',
        'Tingkatkan penjualan Anda dengan strategi digital marketing yang tepat sasaran.'
      ],
      'hosting|domain|server|vps': [
        'Kami menyediakan layanan hosting, domain, VPS, dan server dengan performa tinggi dan keamanan terjamin.',
        'Dapatkan paket hosting terbaik dengan uptime 99.9% dan support 24/7.'
      ],
      'maintenance|perawatan|support teknis': [
        'Tim support teknis kami siap membantu perawatan dan perbaikan sistem IT Anda kapan saja.',
        'Layanan maintenance kami mencakup update sistem, backup data, dan perbaikan bug.'
      ],
      'konsultasi it|konsultasi teknologi': [
        'Dapatkan solusi IT terbaik untuk bisnis Anda melalui layanan konsultasi dari tim ahli kami.',
        'Konsultasikan kebutuhan teknologi bisnis Anda dan dapatkan rekomendasi solusi terbaik.'
      ],
      'ecommerce|toko online|marketplace': [
        'Kembangkan bisnis online Anda dengan solusi e-commerce lengkap, dari website toko online hingga integrasi pembayaran.',
        'Kami membantu Anda membangun dan mengoptimalkan toko online untuk meningkatkan penjualan.'
      ],
      'seo|optimasi mesin pencari|google ranking': [
        'Tingkatkan peringkat website Anda di mesin pencari dengan layanan SEO profesional kami.',
        'Layanan SEO kami mencakup riset kata kunci, optimasi on-page, dan pembuatan backlink berkualitas.'
      ],

      // ========== CARA PEMESANAN ==========
      'cara pesan|bagaimana memesan|cara order|cara beli':
        'Anda bisa memesan dengan cara:\n' +
        '1. Kunjungi website kami di www.narabot.com\n' +
        '2. Pilih produk/layanan yang diinginkan\n' +
        '3. Isi form pemesanan\n' +
        '4. Tim kami akan menghubungi Anda untuk konfirmasi',
      'prosedur|tahapan pengerjaan|alur kerja':
        'Berikut alur pengerjaan proyek di kami:\n' +
        '1. Konsultasi kebutuhan\n' +
        '2. Penawaran harga dan kesepakatan\n' +
        '3. Pembayaran awal (DP)\n' +
        '4. Proses pengerjaan\n' +
        '5. Review dan revisi\n' +
        '6. Pelunasan\n' +
        '7. Serah terima proyek',
      'syarat|persyaratan|dokumen yang dibutuhkan':
        'Untuk memulai proyek, biasanya kami membutuhkan:\n' +
        '• Kebutuhan dan tujuan proyek\n' +
        '• Referensi desain (jika ada)\n' +
        '• Konten teks dan gambar\n' +
        '• Akses ke domain/hosting (jika sudah ada)',
      'waktu pengerjaan|berapa lama|deadline':
        'Waktu pengerjaan bervariasi tergantung kompleksitas proyek:\n' +
        '• Website Sederhana: 1-2 minggu\n' +
        '• Website Kompleks: 2-4 minggu\n' +
        '• Aplikasi Mobile: 1-3 bulan\n' +
        '• Proyek Kustom: Diskusikan lebih lanjut',
      'revisi|perubahan|modifikasi':
        'Kami memberikan kesempatan revisi untuk memastikan hasil sesuai ekspektasi Anda:\n' +
        '• Website: 3x revisi desain\n' +
        '• Aplikasi: 2x revisi fitur utama\n' +
        '• Desain: 2x revisi minor',

      // ========== PEMBAYARAN ==========
      'pembayaran|bayar|metode pembayaran|transfer':
        'Kami menerima berbagai metode pembayaran:\n' +
        '• Transfer Bank (BCA, Mandiri, BNI, BRI)\n' +
        '• E-Wallet (OVO, Gopay, Dana, ShopeePay)\n' +
        '• Kartu Kredit (Visa, Mastercard)',
      'dp|uang muka|pembayaran awal|down payment':
        'Syarat pembayaran biasanya:\n' +
        '• DP 50% di awal pengerjaan\n' +
        '• Pelunasan 50% setelah proyek selesai\n' +
        '• Untuk proyek besar, bisa dibagi menjadi beberapa termin',
      'invoice|tagihan|kwitansi|bukti pembayaran':
        'Kami akan mengirimkan invoice resmi setelah kesepakatan tercapai. Setiap pembayaran akan mendapatkan bukti resmi dari kami.',
      'pajak|ppn|pph|faktur pajak':
        'Harga sudah termasuk PPN 11%. Kami akan menerbitkan e-Faktur untuk setiap transaksi yang memenuhi syarat.',
      'refund|pengembalian dana|garansi uang kembali':
        'Kebijakan pengembalian dana akan disesuaikan dengan kesepakatan di awal dan ketentuan yang berlaku.',

      // ========== PENGIRIMAN ==========
      'pengiriman|ongkir|ongkos kirim|berapa lama sampai':
        'Waktu pengiriman tergantung lokasi Anda. Rata-rata:\n' +
        '• Jabodetabek: 1-2 hari kerja\n' +
        '• Pulau Jawa: 2-3 hari kerja\n' +
        '• Luar Jawa: 3-7 hari kerja',
      'tracking|cek pengiriman|lacak pesanan':
        'Anda bisa mengecek status pengiriman dengan nomor resi yang kami berikan melalui:\n' +
        '• Website resmi jasa pengiriman\n' +
        '• Aplikasi mobile jasa pengiriman\n' +
        '• Hubungi customer service kami',
      'gratis ongkir|free shipping|promo ongkir':
        'Kami sering mengadakan promo gratis ongkir untuk pembelian tertentu. Cek halaman promo kami atau tanyakan ke tim penjualan untuk info lebih lanjut.',
      'pengiriman cepat|same day|instant delivery':
        'Kami menyediakan layanan pengiriman same day untuk wilayah tertentu dengan biaya tambahan. Hubungi tim kami untuk info lebih lanjut.',

      // ========== GARANSI ==========
      'garansi|garansi apa|garansi berapa lama':
        'Kami memberikan garansi untuk produk dan layanan kami:\n' +
        '• Website: 3 bulan maintenance gratis\n' +
        '• Aplikasi: 6 bulan bug fixing\n' +
        '• Hardware: Sesuai ketentuan pabrik',
      'klaim garansi|garansi rusak|servis':
        'Untuk klaim garansi, silakan hubungi tim support kami dengan menyertakan:\n' +
        '1. Nomor invoice/pembelian\n' +
        '2. Foto/video kerusakan\n' +
        '3. Deskripsi masalah',
      'perpanjangan garansi|extend warranty':
        'Anda bisa memperpanjang masa garansi dengan biaya tertentu. Hubungi tim penjualan kami untuk penawaran terbaik.',

      // ========== TESTIMONI ==========
      'testimoni|review|ulasan|pengalaman pelanggan':
        'Berikut beberapa testimoni dari pelanggan kami:\n' +
        '\n"Pelayanan sangat memuaskan, hasilnya melebihi ekspektasi!" - Budi, Jakarta\n' +
        '\n"Tim responsif dan profesional, sangat direkomendasikan" - Siti, Bandung',
      'portofolio|hasil kerja|contoh proyek':
        'Anda bisa melihat portofolio lengkap kami di website resmi atau media sosial kami. Beberapa klien kami termasuk perusahaan ternama di berbagai industri.',
      'klien|perusahaan mitra|partner':
        'Kami telah dipercaya oleh berbagai perusahaan ternama, termasuk:\n' +
        '• Perusahaan Retail Nasional\n' +
        '• Startup Teknologi\n' +
        '• Lembaga Pendidikan\n' +
        '• UMKM Lokal',

      // ========== TAMBAHAN ==========
      'promo|diskon|potongan harga|voucher':
        'Kami sering mengadakan promo menarik setiap bulannya. Daftar newsletter kami untuk mendapatkan update promo terbaru!',
      'karir|lowongan kerja|rekrutmen|bergabung':
        'Kami selalu mencari talenta-talenta berbakat. Kirimkan CV dan portofoliomu ke karir@narabot.com',
      'mitra|kerja sama|partnership|reseller':
        'Kami membuka peluang kerjasama dengan berbagai pihak. Hubungi tim partnership kami di partnership@narabot.com',
      'blog|artikel|tips|tutorial':
        'Kunjungi blog kami di blog.narabot.com untuk berbagai artikel menarik seputar teknologi dan bisnis digital.',
      'event|webinar|workshop|pelatihan':
        'Ikuti event dan workshop terbaru kami untuk menambah wawasan seputar teknologi digital. Cek jadwalnya di website kami!',
      'aplikasi mobile|unduh|download|play store|app store':
        'Aplikasi mobile kami tersedia di:\n' +
        '• Google Play Store\n' +
        '• Apple App Store\n' +
        '• Huawei AppGallery',
      'sosial media|medsos|instagram|facebook|twitter|linkedin|tiktok|youtube':
        'Ikuti akun sosial media kami untuk update terbaru:\n' +
        '• Instagram: @narabot.id\n' +
        '• Facebook: NaraBot Official\n' +
        '• LinkedIn: NaraBot Indonesia\n' +
        '• YouTube: NaraBot Channel',
      'brosur|katalog|company profile|profil perusahaan':
        'Anda bisa mengunduh brosur dan company profile terbaru kami di website resmi atau memintanya langsung ke tim marketing kami.',
      'faq|pertanyaan umum|yang sering ditanyakan':
        'Beberapa pertanyaan yang sering diajukan:\n' +
        '\n1. Berapa lama proses pengerjaan?\n' +
        '2. Apakah ada biaya tambahan?\n' +
        '3. Bagaimana cara tracking pesanan?\n' +
        '4. Apakah bisa minta revisi?\n' +
        '5. Bagaimana cara pembayarannya?\n' +
        '\nSilakan tanyakan salah satu pertanyaan di atas atau ajukan pertanyaan spesifik Anda.',

      // ========== DEFAULT RESPONSE ==========
      'default': [
        'Maaf, saya belum mengerti pertanyaan Anda. Bisakah Anda menjelaskannya dengan kata-kata yang berbeda?',
        'Saya belum sepenuhnya memahami pertanyaan Anda. Bisakah Anda mengulanginya?',
        'Mohon maaf, saya membutuhkan informasi lebih lanjut untuk bisa membantu Anda.'
      ]
    };

    // Cari pola yang cocok
    for (const [pattern, response] of Object.entries(responses)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(message)) {
        if (Array.isArray(response)) {
          return response[Math.floor(Math.random() * response.length)];
        }
        return response;
      }
    }

    // Jika tidak ada yang cocok, kembalikan default response
    const defaultResponses = responses['default'];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = (e) => {
    e.preventDefault();
    
    // Dapatkan nilai input dari form
    const formData = new FormData(e.target);
    const messageText = formData.get('message')?.trim() || '';
    
    if (!messageText) return;

    // Tambahkan pesan pengguna
    const userMessage = { 
      text: messageText, 
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    
    // Reset form
    if (formRef.current) {
      formRef.current.reset();
    }

    // Respon dari bot
    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      setMessages(prevMessages => [...prevMessages, { 
        text: botResponse, 
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div className="chatbot-minimized" onClick={toggleMinimize}>
        <div className="minimized-content">
          <SmartToy className="bot-icon" />
          <span>NaraBot</span>
          <ExpandLess className="toggle-icon" />
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-left">
          <SmartToy className="bot-icon" />
          <div>
            <h3>NaraBot</h3>
            <small>Asisten Virtual Siap Bantu</small>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-button" onClick={toggleMinimize}>
            <ExpandMore />
          </button>
        </div>
      </div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-icon">
              {message.sender === 'bot' ? <SmartToy /> : <Person />}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">{message.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form ref={formRef} onSubmit={handleSend} className="chatbot-input">
        <input
          type="text"
          name="message"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ketik pesan Anda..."
          autoComplete="off"
        />
        <button type="submit" className="send-button" disabled={!inputValue.trim()}>
          <Send />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;

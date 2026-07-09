// Data Mock & LocalStorage Management
const initialData = {
    mountains: [
        { id: 'm1', name: 'Jalur Kampung IV', jalur: 'Kampung IV', kuota: 200, harga: 25000, img: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=600&q=80' },
        { id: 'm2', name: 'Jalur Tugu Rimau', jalur: 'Tugu Rimau', kuota: 150, harga: 25000, img: 'https://images.unsplash.com/photo-1542302302-7634f1dbde98?auto=format&fit=crop&w=600&q=80' },
        { id: 'm3', name: 'Jalur Jarai (Lahat)', jalur: 'Jarai', kuota: 100, harga: 25000, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' }
    ],
    equipment: [
        { id: 'e1', name: 'Tenda Dome 4 Orang', cat: 'Tenda', harga: 45000, stok: 15, img: 'https://images.unsplash.com/photo-1504280390227-361001402ea8?auto=format&fit=crop&w=400&q=80' },
        { id: 'e2', name: 'Carrier Eiger 60L', cat: 'Tas', harga: 35000, stok: 10, img: 'https://images.unsplash.com/photo-1622560867828-57d69d4cb7e3?auto=format&fit=crop&w=400&q=80' },
        { id: 'e3', name: 'Sleeping Bag Polar', cat: 'Tidur', harga: 15000, stok: 30, img: 'https://images.unsplash.com/photo-1626010022378-5e921d15c7a5?auto=format&fit=crop&w=400&q=80' },
        { id: 'e4', name: 'Kompor Portable', cat: 'Logistik', harga: 20000, stok: 20, img: 'https://images.unsplash.com/photo-1582239327856-32491bbccf4b?auto=format&fit=crop&w=400&q=80' }
    ],
    bookings: [
        { id: 'B-001', nama: 'Andi Saputra', gunung: 'Jalur Kampung IV', tgl: '2026-08-15', status_bayar: 'Lunas', status_izin: 'Disetujui' },
        { id: 'B-002', nama: 'Budi Raharjo', gunung: 'Jalur Tugu Rimau', tgl: '2026-08-20', status_bayar: 'Menunggu Verifikasi', status_izin: 'Pending' }
    ],
    rentalBookings: [
        { id: 'R-001', nama: 'Siska Amelia', items: 'Tenda Dome 4 Orang (1)', total: 45000, status: 'Disetujui' }
    ]
};

// Initialize DB
if (!localStorage.getItem('summit_data_v2')) {
    localStorage.setItem('summit_data_v2', JSON.stringify(initialData));
}

let db = JSON.parse(localStorage.getItem('summit_data_v2'));
if (!db.rentalBookings) {
    db.rentalBookings = initialData.rentalBookings;
    localStorage.setItem('summit_data_v2', JSON.stringify(db));
}

let cart = [];

// App Logic
const app = {
    init() {
        this.navigate('home');
        
        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('cart-dropdown');
            if (dropdown && !dropdown.classList.contains('hidden') && !e.target.closest('.group')) {
                dropdown.classList.add('hidden');
            }
        });

        // Image upload preview handler (Event Delegation for dynamic elements)
        document.addEventListener('change', function(e) {
            if (e.target && e.target.id === 'eq-img') {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const base64 = event.target.result;
                        const base64Input = document.getElementById('eq-img-base64');
                        const preview = document.getElementById('eq-img-preview');
                        
                        if (base64Input && preview) {
                            base64Input.value = base64;
                            preview.classList.remove('hidden');
                            preview.querySelector('img').src = base64;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } else if (e.target && e.target.id === 'reg-health-doc') {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const base64 = event.target.result;
                        document.getElementById('reg-health-base64').value = base64;
                        
                        const placeholder = document.getElementById('reg-health-placeholder');
                        const preview = document.getElementById('reg-health-preview');
                        const filename = document.getElementById('reg-health-filename');
                        
                        if (placeholder && preview && filename) {
                            filename.innerText = file.name;
                            placeholder.classList.add('hidden');
                            preview.classList.remove('hidden');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } else if (e.target && e.target.id === 'reg-bukti-bayar') {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const base64 = event.target.result;
                        const base64Input = document.getElementById('reg-bukti-base64');
                        const preview = document.getElementById('reg-bukti-preview');
                        
                        if (base64Input && preview) {
                            base64Input.value = base64;
                            preview.classList.remove('hidden');
                            preview.querySelector('img').src = base64;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    },

    saveDB() {
        localStorage.setItem('summit_data_v2', JSON.stringify(db));
    },

    viewBooking(id) {
        const b = db.bookings.find(x => x.id === id);
        if (b) {
            const content = document.getElementById('view-booking-content');
            if (content) {
                content.innerHTML = `
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-xs text-slate-400 mb-1">ID Booking</p>
                            <p class="font-bold text-brand-400">${b.id}</p>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 mb-1">Tanggal Pendakian</p>
                            <p class="font-medium text-white">${b.tgl}</p>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 mb-1">Nama Ketua</p>
                            <p class="font-medium text-white">${b.nama}</p>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 mb-1">Via Pendakian</p>
                            <p class="font-medium text-white">${b.gunung}</p>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 mb-1">Status Pembayaran</p>
                            <span class="px-2 py-1 text-xs rounded-full inline-block ${b.status_bayar === 'Lunas' ? 'bg-green-500/20 text-green-400' : (b.status_bayar === 'Menunggu Verifikasi' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400')}">${b.status_bayar}</span>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 mb-1">Status Izin (SIMAKSI)</p>
                            <span class="px-2 py-1 text-xs rounded-full inline-block ${b.status_izin === 'Disetujui' ? 'bg-green-500/20 text-green-400' : (b.status_izin === 'Ditolak' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400')}">${b.status_izin}</span>
                        </div>
                        ${b.bukti ? `
                        <div class="col-span-2 mt-2 pt-4 border-t border-white/10">
                            <p class="text-xs text-slate-400 mb-2">Bukti Pembayaran</p>
                            <img src="${b.bukti}" class="w-full h-48 object-cover rounded-lg border border-white/10 cursor-pointer" onclick="window.open('${b.bukti}', '_blank')" title="Klik untuk memperbesar">
                        </div>
                        ` : ''}
                        ${b.sks ? `
                        <div class="col-span-2 mt-2">
                            <p class="text-xs text-slate-400 mb-2">Surat Keterangan Sehat (SKS)</p>
                            <img src="${b.sks}" class="w-full h-48 object-cover rounded-lg border border-white/10 cursor-pointer" onclick="window.open('${b.sks}', '_blank')" title="Klik untuk memperbesar">
                        </div>
                        ` : ''}
                    </div>
                `;
            }
            document.getElementById('view-booking-modal').classList.remove('hidden');
        }
    },
    
    closeViewBookingModal() {
        document.getElementById('view-booking-modal').classList.add('hidden');
    },

    showNotification(title, message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icon = type === 'success' ? '<i class="fa-solid fa-circle-check text-green-400"></i>' : '<i class="fa-solid fa-circle-exclamation text-red-400"></i>';
        const borderClass = type === 'success' ? 'border-green-500/30' : 'border-red-500/30';
        const bgClass = type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10';

        const toast = document.createElement('div');
        toast.className = `flex items-start gap-3 p-4 rounded-xl border ${borderClass} ${bgClass} backdrop-blur-md shadow-lg shadow-black/20 animate-slide-up max-w-sm`;
        toast.innerHTML = `
            <div class="text-xl mt-0.5">${icon}</div>
            <div>
                <h4 class="font-bold text-white text-sm">${title}</h4>
                <p class="text-slate-300 text-xs mt-1 leading-relaxed">${message}</p>
            </div>
            <button class="text-slate-400 hover:text-white ml-auto" onclick="this.parentElement.remove()">
                <i class="fa-solid fa-xmark text-sm"></i>
            </button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    },

    toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.toggle('hidden');
    },
    isAdminLoggedIn: false,

    navigate(viewId) {
        if (viewId === 'admin' && !this.isAdminLoggedIn) {
            const pass = prompt('Masukkan password admin untuk mengakses halaman ini:');
            if (pass === 'Dempo1234') {
                this.isAdminLoggedIn = true;
                this.showNotification('Akses Diberikan', 'Selamat datang di panel Admin.', 'success');
            } else {
                this.showNotification('Akses Ditolak', 'Password yang dimasukkan salah.', 'error');
                return;
            }
        }

        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const navLinks = document.querySelectorAll('.nav-links button');
        if(viewId === 'home') navLinks[0].classList.add('active');
        if(viewId === 'register') navLinks[1].classList.add('active');
        if(viewId === 'rental') navLinks[2].classList.add('active');

        const mainContent = document.getElementById('main-content');
        const template = document.getElementById(`tpl-${viewId}`);
        
        if (template) {
            mainContent.innerHTML = '';
            mainContent.appendChild(template.content.cloneNode(true));
            
            window.scrollTo(0, 0);
            if (viewId === 'home') this.renderMountains();
            if (viewId === 'register') this.initRegisterForm();
            if (viewId === 'rental') this.renderEquipment('all');
            if (viewId === 'admin') this.renderAdmin();
        }
    },

    // --- HOME VIEW ---
    renderMountains() {
        const list = document.getElementById('mountain-list');
        if (!list) return;
        
        list.innerHTML = db.mountains.map(m => `
            <div class="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div class="h-48 overflow-hidden relative">
                    <img src="${m.img}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500">
                    <div class="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium border border-white/10">
                        Kuota: ${m.kuota}
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-xl font-bold">${m.name}</h3>
                        <span class="text-brand-400 font-semibold">Rp ${(m.harga/1000).toFixed(0)}k</span>
                    </div>
                    <p class="text-slate-400 text-sm mb-4"><i class="fa-solid fa-map-pin mr-2"></i>Jalur ${m.jalur}</p>
                    <button onclick="app.navigate('register')" class="w-full py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 font-medium rounded-lg transition-all border border-brand-500/30">
                        Pilih Gunung
                    </button>
                </div>
            </div>
        `).join('');
    },

    // --- REGISTER VIEW ---
    initRegisterForm() {
        // No longer using select gunung, handled by static radio buttons
    },

    checkQuota() {
        const date = document.getElementById('reg-tgl-naik').value;
        const statusBox = document.getElementById('quota-status');
        
        if (date) {
            // Mock Dempo Quota
            const m = { kuota: 200 };
            const used = Math.floor(Math.random() * m.kuota);
            const remaining = m.kuota - used;
            
            if (remaining > 0) {
                statusBox.innerHTML = `<span class="text-brand-400 font-bold">Tersedia ${remaining} Kuota</span> <i class="fa-solid fa-check-circle text-brand-400"></i>`;
                statusBox.className = 'w-full bg-brand-500/10 border border-brand-500/30 rounded-lg p-3 text-slate-300 flex items-center justify-between';
            } else {
                statusBox.innerHTML = `<span class="text-red-400 font-bold">Kuota Penuh</span> <i class="fa-solid fa-xmark-circle text-red-400"></i>`;
                statusBox.className = 'w-full bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-slate-300 flex items-center justify-between';
            }
        }
    },

    submitRegistration(e) {
        e.preventDefault();
        const paketInput = document.querySelector('input[name="paket"]:checked');
        const paket = paketInput ? paketInput.value : 'kampung4';
        const name = document.getElementById('reg-nama').value;
        const date = document.getElementById('reg-tgl-naik').value;
        
        const bookingId = 'B-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        let gunungName = 'Gunung Dempo (Via Kampung IV)';
        if (paket === 'tugurimau') gunungName = 'Gunung Dempo (Via Tugu Rimau)';
        if (paket === 'jarai') gunungName = 'Gunung Dempo (Via Jarai)';
        
        const harga = 25000; // Same price for all routes
        
        const sksBase64 = document.getElementById('reg-health-base64').value;
        const buktiBase64 = document.getElementById('reg-bukti-base64').value;

        db.bookings.unshift({
            id: bookingId,
            nama: name,
            gunung: gunungName,
            tgl: date,
            sks: sksBase64,
            bukti: buktiBase64,
            status_bayar: 'Menunggu Verifikasi',
            status_izin: 'Pending'
        });
        
        this.saveDB();
        
        this.showNotification('Pendaftaran Tersimpan', `ID Booking: ${bookingId}. Bukti pembayaran sedang diverifikasi.`, 'success');
        this.navigate('home');
    },

    // --- RENTAL VIEW ---
    filterEquipment(category, btnElement) {
        const btns = document.querySelectorAll('.category-btn');
        btns.forEach(b => {
            b.className = 'category-btn px-4 py-2 rounded-full bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-800 transition-all whitespace-nowrap';
        });
        if(btnElement) {
            btnElement.className = 'category-btn active px-4 py-2 rounded-full bg-brand-600 text-white font-medium whitespace-nowrap';
        }
        
        this.renderEquipment(category);
    },

    renderEquipment(category = 'all') {
        const list = document.getElementById('equipment-list');
        if (!list) return;
        
        let filtered = db.equipment;
        if(category !== 'all') {
            filtered = db.equipment.filter(e => e.cat === category);
        }
        
        if (filtered.length === 0) {
            list.innerHTML = `<p class="col-span-full text-center text-slate-400 py-10">Tidak ada alat di kategori ini.</p>`;
            return;
        }

        list.innerHTML = filtered.map(e => `
            <div class="glass-card rounded-2xl overflow-hidden group">
                <div class="h-48 overflow-hidden bg-white/5 relative">
                    <img src="${e.img}" alt="${e.name}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 mix-blend-overlay opacity-80 group-hover:opacity-100">
                    <div class="absolute top-2 left-2 px-2 py-1 bg-brand-500 text-white text-xs font-bold rounded">
                        Tersedia: ${e.stok}
                    </div>
                </div>
                <div class="p-5">
                    <span class="text-xs text-slate-400 mb-1 block">${e.cat}</span>
                    <h3 class="font-bold text-lg mb-1 leading-tight h-12">${e.name}</h3>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-brand-400 font-bold">Rp ${(e.harga/1000).toFixed(0)}k <span class="text-xs text-slate-500 font-normal">/hari</span></span>
                        <button onclick="app.addToCart('${e.id}')" class="w-10 h-10 rounded-lg bg-white/10 hover:bg-brand-500 text-white flex items-center justify-center transition-all">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    toggleCart() {
        const d = document.getElementById('cart-dropdown');
        d.classList.toggle('hidden');
        this.updateCartUI();
    },

    addToCart(id) {
        const item = db.equipment.find(e => e.id === id);
        if(item) {
            const existing = cart.find(c => c.id === id);
            if(existing) existing.qty++;
            else cart.push({...item, qty: 1});
            
            this.updateCartUI();
            
            const badge = document.getElementById('cart-badge');
            badge.classList.add('animate-bounce');
            setTimeout(() => badge.classList.remove('animate-bounce'), 1000);
        }
    },
    
    removeFromCart(id) {
        cart = cart.filter(c => c.id !== id);
        this.updateCartUI();
    },

    updateCartUI() {
        const badge = document.getElementById('cart-badge');
        const items = document.getElementById('cart-items');
        const total = document.getElementById('cart-total');
        
        if(!badge || !items || !total) return;
        
        let sum = 0;
        let count = 0;
        
        items.innerHTML = cart.length === 0 ? '<p class="text-sm text-slate-400 text-center py-4">Keranjang kosong</p>' : '';
        
        cart.forEach(c => {
            sum += (c.harga * c.qty);
            count += c.qty;
            items.innerHTML += `
                <div class="flex justify-between items-center text-sm bg-slate-900/50 p-2 rounded-lg border border-white/5">
                    <div class="flex-1 truncate pr-2">
                        <div class="font-medium truncate">${c.name}</div>
                        <div class="text-xs text-slate-400">${c.qty} x Rp ${(c.harga/1000).toFixed(0)}k</div>
                    </div>
                    <button onclick="app.removeFromCart('${c.id}')" class="text-red-400 hover:text-red-300 w-6 h-6 flex items-center justify-center rounded bg-red-500/10">
                        <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                </div>
            `;
        });
        
        badge.innerText = count;
        total.innerText = `Rp ${sum.toLocaleString('id-ID')}`;
    },

    checkoutCart() {
        if(cart.length === 0) {
            this.showNotification('Keranjang Kosong', 'Tambahkan alat ke keranjang terlebih dahulu.', 'error');
            return;
        }

        let sum = 0;
        const itemNames = cart.map(c => {
            sum += (c.harga * c.qty);
            return `${c.name} (${c.qty})`;
        }).join(', ');

        const rentalId = 'R-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        db.rentalBookings.unshift({
            id: rentalId,
            nama: 'Pendaki (Tamu)', // In real app, we'd have a user session
            items: itemNames,
            total: sum,
            status: 'Pending'
        });
        this.saveDB();

        this.showNotification('Sewa Berhasil Disimpan!', 'Silakan lakukan pembayaran.', 'success');
        document.getElementById('cart-dropdown').classList.add('hidden');
        cart = []; // clear cart
        this.updateCartUI();

        // Open payment modal
        this.openPaymentModal(sum, 'rental_' + rentalId);
    },

    // --- PAYMENT MODAL ---
    openPaymentModal(amount, typeId) {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            document.getElementById('payment-amount').innerText = `Rp ${amount.toLocaleString('id-ID')}`;
            document.getElementById('payment-type').value = typeId;
            modal.classList.remove('hidden');
            document.getElementById('payment-form').reset();
        }
    },

    closePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.classList.add('hidden');
    },

    confirmPayment(e) {
        e.preventDefault();
        const typeId = document.getElementById('payment-type').value;
        
        if (typeId.startsWith('simaksi_')) {
            const id = typeId.replace('simaksi_', '');
            const booking = db.bookings.find(b => b.id === id);
            if (booking) booking.status_bayar = 'Menunggu Verifikasi';
        } else if (typeId.startsWith('rental_')) {
            const id = typeId.replace('rental_', '');
            const rental = db.rentalBookings.find(r => r.id === id);
            if (rental) rental.status = 'Menunggu Verifikasi';
        }
        
        this.saveDB();
        this.closePaymentModal();
        this.showNotification('Pembayaran Terkonfirmasi', 'Bukti transfer sedang diverifikasi oleh admin. Terima kasih!', 'success');
        
        // Refresh admin if on admin page
        const template = document.getElementById('tpl-admin');
        if (!template && document.getElementById('admin-table-bookings')) {
            this.renderAdmin();
        }
    },

    // --- ADMIN VIEW ---
    switchAdminTab(tabId) {
        document.querySelectorAll('.admin-tab-content').forEach(c => {
            c.classList.add('hidden');
            c.classList.remove('block');
        });
        document.getElementById(`admin-tab-${tabId}`).classList.remove('hidden');
        document.getElementById(`admin-tab-${tabId}`).classList.add('block');
        
        const btns = document.querySelectorAll('.admin-tab-btn');
        btns.forEach(btn => {
            btn.className = 'admin-tab-btn px-4 py-2 rounded-md font-medium text-slate-400 hover:text-white whitespace-nowrap';
        });
        if(event && event.currentTarget) {
            event.currentTarget.className = 'admin-tab-btn px-4 py-2 rounded-md bg-white/10 font-medium whitespace-nowrap active';
        }
    },

    updateBookingStatus(id, type, action) {
        const index = db.bookings.findIndex(b => b.id === id);
        if(index > -1) {
            if(type === 'izin') {
                db.bookings[index].status_izin = action === 'approve' ? 'Disetujui' : 'Ditolak';
                db.bookings[index].status_bayar = action === 'approve' ? 'Lunas' : db.bookings[index].status_bayar;
            }
            this.saveDB();
            this.renderAdmin();
        }
    },

    updateRentalStatus(id, action) {
        const index = db.rentalBookings.findIndex(r => r.id === id);
        if(index > -1) {
            db.rentalBookings[index].status = action === 'approve' ? 'Disetujui' : 'Ditolak';
            this.saveDB();
            this.renderAdmin();
            this.showNotification('Status Diperbarui', `Sewa alat ${action === 'approve' ? 'disetujui' : 'ditolak'}.`, 'success');
        }
    },

    deleteBooking(id) {
        if(confirm("Apakah Anda yakin ingin menghapus data booking SIMAKSI ini?")) {
            db.bookings = db.bookings.filter(b => b.id !== id);
            this.saveDB();
            this.renderAdmin();
            this.showNotification('Data Dihapus', 'Data booking SIMAKSI berhasil dihapus.', 'success');
        }
    },

    deleteRentalBooking(id) {
        if(confirm("Apakah Anda yakin ingin menghapus data sewa alat ini?")) {
            db.rentalBookings = db.rentalBookings.filter(r => r.id !== id);
            this.saveDB();
            this.renderAdmin();
            this.showNotification('Data Dihapus', 'Data sewa alat berhasil dihapus.', 'success');
        }
    },

    editQuota(id) {
        const m = db.mountains.find(x => x.id === id);
        if(m) {
            const newVal = prompt(`Masukkan kuota baru untuk ${m.name}:`, m.kuota);
            if(newVal && !isNaN(newVal)) {
                m.kuota = parseInt(newVal);
                this.saveDB();
                this.renderAdmin();
            }
        }
    },

    openEquipmentModal(id = null) {
        const modal = document.getElementById('equipment-modal');
        const form = document.getElementById('equipment-form');
        const title = document.getElementById('modal-title');
        const preview = document.getElementById('eq-img-preview');
        const base64Input = document.getElementById('eq-img-base64');
        
        if (modal && form) {
            form.reset();
            base64Input.value = '';
            preview.classList.add('hidden');
            
            if (id) {
                // Edit Mode
                const e = db.equipment.find(x => x.id === id);
                if (e) {
                    title.innerText = 'Edit Alat';
                    document.getElementById('eq-id').value = e.id;
                    document.getElementById('eq-name').value = e.name;
                    document.getElementById('eq-cat').value = e.cat;
                    document.getElementById('eq-price').value = e.harga;
                    document.getElementById('eq-stock').value = e.stok;
                    
                    if (e.img) {
                        preview.classList.remove('hidden');
                        preview.querySelector('img').src = e.img;
                        base64Input.value = e.img;
                    }
                }
            } else {
                // Add Mode
                title.innerText = 'Tambah Alat Baru';
                document.getElementById('eq-id').value = '';
            }
            modal.classList.remove('hidden');
        }
    },

    closeEquipmentModal() {
        const modal = document.getElementById('equipment-modal');
        if (modal) modal.classList.add('hidden');
    },

    saveEquipment(e) {
        e.preventDefault();
        
        const id = document.getElementById('eq-id').value;
        const name = document.getElementById('eq-name').value;
        const cat = document.getElementById('eq-cat').value;
        const harga = parseInt(document.getElementById('eq-price').value) || 0;
        const stok = parseInt(document.getElementById('eq-stock').value) || 0;
        let img = document.getElementById('eq-img-base64').value;
        
        if (!img) {
            img = 'https://images.unsplash.com/photo-1504280390227-361001402ea8?auto=format&fit=crop&w=400&q=80';
        }

        if (id) {
            // Update
            const index = db.equipment.findIndex(x => x.id === id);
            if (index > -1) {
                db.equipment[index] = { ...db.equipment[index], name, cat, harga, stok, img };
            }
        } else {
            // Add
            db.equipment.push({
                id: 'e' + Date.now(),
                name, cat, harga, stok, img
            });
        }
        
        this.saveDB();
        this.closeEquipmentModal();
        this.renderAdmin();
    },

    deleteEquipment(id) {
        if(confirm("Apakah Anda yakin ingin menghapus alat ini?")) {
            db.equipment = db.equipment.filter(e => e.id !== id);
            this.saveDB();
            this.renderAdmin();
        }
    },

    renderAdmin() {
        // Bookings (SIMAKSI)
        const bList = document.getElementById('admin-table-bookings');
        const bRecent = document.getElementById('admin-recent-bookings');
        if (bList) {
            bList.innerHTML = db.bookings.map(b => `
                <tr class="hover:bg-white/5 transition-all">
                    <td class="p-4 font-medium text-brand-400">${b.id}</td>
                    <td class="p-4">${b.nama}</td>
                    <td class="p-4">
                        <div class="font-medium">${b.gunung}</div>
                        <div class="text-xs text-slate-400">${b.tgl}</div>
                    </td>
                    <td class="p-4">
                        <div class="flex gap-2 justify-center">
                            ${b.sks ? `<a href="${b.sks}" target="_blank" title="Lihat SKS"><img src="${b.sks}" class="w-10 h-10 object-cover rounded border border-white/10 hover:scale-110 transition-transform"></a>` : '<span class="text-slate-500 text-xs mt-2" title="Tidak ada SKS">-</span>'}
                            ${b.bukti ? `<a href="${b.bukti}" target="_blank" title="Lihat Bukti Pembayaran"><img src="${b.bukti}" class="w-10 h-10 object-cover rounded border border-white/10 hover:scale-110 transition-transform"></a>` : ''}
                        </div>
                    </td>
                    <td class="p-4">
                        <span class="px-2 py-1 text-xs rounded-full ${b.status_bayar === 'Lunas' ? 'bg-green-500/20 text-green-400' : (b.status_bayar === 'Menunggu Verifikasi' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400')}">${b.status_bayar}</span>
                    </td>
                    <td class="p-4">
                        <span class="px-2 py-1 text-xs rounded-full ${b.status_izin === 'Disetujui' ? 'bg-green-500/20 text-green-400' : (b.status_izin === 'Ditolak' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400')}">${b.status_izin}</span>
                    </td>
                    <td class="p-4 text-right whitespace-nowrap">
                        <button onclick="app.viewBooking('${b.id}')" class="w-8 h-8 rounded bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white transition-all mr-1" title="Lihat Detail"><i class="fa-solid fa-eye"></i></button>
                        <button onclick="app.updateBookingStatus('${b.id}', 'izin', 'approve')" class="w-8 h-8 rounded bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-white transition-all mr-1" title="Setujui"><i class="fa-solid fa-check"></i></button>
                        <button onclick="app.updateBookingStatus('${b.id}', 'izin', 'reject')" class="w-8 h-8 rounded bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white transition-all mr-1" title="Tolak"><i class="fa-solid fa-xmark"></i></button>
                        <button onclick="app.deleteBooking('${b.id}')" class="w-8 h-8 rounded bg-red-500/10 hover:bg-red-500/20 transition-all text-red-400" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
            
            // Recent for overview
            bRecent.innerHTML = db.bookings.slice(0, 3).map(b => `
                <div class="flex justify-between items-center p-3 rounded-lg bg-slate-900/50 border border-white/5">
                    <div>
                        <p class="font-medium">${b.nama}</p>
                        <p class="text-xs text-slate-400">${b.gunung}</p>
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">${b.status_izin}</span>
                </div>
            `).join('');
        }

        // Rental Bookings
        const rList = document.getElementById('admin-table-rental-bookings');
        if (rList) {
            rList.innerHTML = db.rentalBookings.map(r => `
                <tr class="hover:bg-white/5 transition-all">
                    <td class="p-4 font-medium text-brand-400">${r.id}</td>
                    <td class="p-4">${r.nama}</td>
                    <td class="p-4 max-w-xs truncate" title="${r.items}">${r.items}</td>
                    <td class="p-4 font-medium">Rp ${r.total.toLocaleString('id-ID')}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 text-xs rounded-full ${r.status === 'Disetujui' ? 'bg-green-500/20 text-green-400' : (r.status === 'Ditolak' ? 'bg-red-500/20 text-red-400' : (r.status === 'Menunggu Verifikasi' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'))}">${r.status}</span>
                    </td>
                    <td class="p-4 text-right whitespace-nowrap">
                        <button onclick="app.updateRentalStatus('${r.id}', 'approve')" class="w-8 h-8 rounded bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-white transition-all mr-1" title="Setujui"><i class="fa-solid fa-check"></i></button>
                        <button onclick="app.updateRentalStatus('${r.id}', 'reject')" class="w-8 h-8 rounded bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white transition-all mr-1" title="Tolak"><i class="fa-solid fa-xmark"></i></button>
                        <button onclick="app.deleteRentalBooking('${r.id}')" class="w-8 h-8 rounded bg-red-500/10 hover:bg-red-500/20 transition-all text-red-400" title="Hapus"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }

        // Quota
        const qList = document.getElementById('admin-quota-status');
        if (qList) {
            qList.innerHTML = db.mountains.map(m => {
                const perc = Math.floor(Math.random() * 80) + 10;
                return `
                <div class="group relative">
                    <div class="flex justify-between text-sm mb-1">
                        <span>${m.name}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-slate-400">${Math.floor((perc/100)*m.kuota)} / ${m.kuota}</span>
                            <button onclick="app.editQuota('${m.id}')" class="text-xs text-brand-400 hover:text-brand-300 opacity-0 group-hover:opacity-100 transition-all"><i class="fa-solid fa-pen"></i></button>
                        </div>
                    </div>
                    <div class="w-full bg-slate-800 rounded-full h-2">
                        <div class="bg-brand-500 h-2 rounded-full" style="width: ${perc}%"></div>
                    </div>
                </div>
            `}).join('');
        }

        // Inventory
        const iList = document.getElementById('admin-table-inventory');
        if (iList) {
            iList.innerHTML = db.equipment.map(e => `
                <tr class="hover:bg-white/5 transition-all">
                    <td class="p-4 font-medium flex items-center gap-3">
                        <div class="w-10 h-10 rounded bg-white/10 overflow-hidden"><img src="${e.img}" class="w-full h-full object-cover"></div>
                        ${e.name}
                    </td>
                    <td class="p-4 text-slate-400">${e.cat}</td>
                    <td class="p-4 text-brand-400 font-medium">Rp ${(e.harga/1000).toFixed(0)}k</td>
                    <td class="p-4">${e.stok}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">${e.stok} Tersedia</span>
                    </td>
                    <td class="p-4 text-right">
                        <button onclick="app.openEquipmentModal('${e.id}')" class="w-8 h-8 rounded bg-white/10 hover:bg-white/20 transition-all text-slate-300 mr-1"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="app.deleteEquipment('${e.id}')" class="w-8 h-8 rounded bg-red-500/10 hover:bg-red-500/20 transition-all text-red-400"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

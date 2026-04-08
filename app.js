/**
 * @project     CREATE ZOOM ACCOUNT AUTOMATION
 * @version     12.0 PRO - SECURITY UPDATE
 * @author      JUY PROJECT
 */

let puppeteer = require('puppeteer');
let fs = require('fs');
let path = require('path');
let readline = require('readline');

class JuyZoomCreator {
    constructor() {
        this.isRunning = true;
        this.isLoggedIn = false;
        
        // Kode Admin disembunyikan 
        this._0x4a2 = "SlVFLU9XTkVSLTk5"; 
        
        this.configPath = path.join(__dirname, 'config.json');
        this.storageDir = 'Hasil_Akun_Zoom';
        this.storageFile = path.join(this.storageDir, 'akun_berhasil.txt');
        this.botConfig = this.loadConfig();
        
        this.names = {
            first: ['Budi', 'Siti', 'Agus', 'Lani', 'Rian', 'Eka', 'Dewi', 'Fajar', 'Zaki', 'Putra',
                'Nina', 'Hendra', 'Maya', 'Rizky', 'Sari', 'Yudi', 'Intan', 'Bayu', 'Rina', 'Dian', 'Fauzi',
                 'Lina', 'Andi', 'Siska', 'Rama', 'Vina', 'Doni', 'Sari', 'Yusuf', 'Mira', 'Hadi',
                 'Rina', 'Agung', 'Sari', 'Wawan', 'Nia', 'Fikri', 'Sari', 'Rizal', 'Dewi', 'Yanto',
                 'Sari', 'Eko', 'Rina', 'Bayu', 'Sari', 'Hendra', 'Maya', 'Rizky', 'Sari', 'Yudi'],
            last: ['Saputra', 'Lestari', 'Wijaya', 'Kusuma', 'Santoso', 'Putri', 'Pratama', 
                'Sari', 'Hidayat', 'Nugroho', 'Wulandari', 'Gunawan', 'Puspita', 'Ramadhan', 'Utama',
                'Amalia', 'Kurniawan', 'Sari', 'Aditya', 'Pertiwi',
                'Sutanto', 'Yuliana', 'Fadhil', 'Anggraini', 'Halim', 'Cahyadi', 'Sari', 'Prasetyo', 'Dewi']
        };
    }

    // Fungsi internal untuk membaca Master Key
    _getMK() { return Buffer.from(this._0x4a2, 'base64').toString(); }

    loadConfig() {
        if (fs.existsSync(this.configPath)) {
            return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        }
        let defaultConfig = { kodeAkses: "ZOM-2024-FREE" };
        fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig, null, 2));
        return defaultConfig;
    }

    saveConfig(newKey) {
        this.botConfig.kodeAkses = newKey;
        fs.writeFileSync(this.configPath, JSON.stringify(this.botConfig, null, 2));
    }

    async ask(query) {
        let rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        return new Promise(resolve => rl.question(query, ans => { rl.close(); resolve(ans); }));
    }

    showBanner() {
        console.clear();
        console.log("\x1b[36m%s\x1b[0m", `
    ╔════════════════════════════════════════════════════════╗
    ║  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗      ║
    ║  ██╔═══╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝      ║
    ║  ██║    ██████╔╝█████╗  ███████║   ██║   █████╗        ║
    ║  ██║    ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝        ║
    ║  ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗      ║
    ║   ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝      ║
    ║                                                        ║
    ║  ███████╗ ██████╗  ██████╗ ███╗   ███╗                 ║
    ║  ╚══███╔╝██╔═══██╗██╔═══██╗████╗ ████║                 ║
    ║    ███╔╝ ██║   ██║██║   ██║██╔████╔██║                 ║
    ║   ███╔╝  ██║   ██║██║   ██║██║╚██╔╝██║                 ║
    ║  ███████╗╚██████╔╝╚██████╔╝██║ ╚═╝ ██║                 ║
    ║  ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝                 ║
    ╠════════════════════════════════════════════════════════╣
    ║ [SYSTEM]  : ZOOM CREATOR - PRIVATE EDITION             ║
    ║ [AUTHOR]  : JUY PROJECT                                ║
    ║ [CONTROL] : PRESS 'S' TO TERMINATE PROCESS             ║
    ╚════════════════════════════════════════════════════════╝
        `);
    }

    initStopListener() {
        this.isRunning = true;
        if (process.stdin.isTTY) {
            process.stdin.removeAllListeners('keypress');
            readline.emitKeypressEvents(process.stdin);
            process.stdin.setRawMode(true);
            process.stdin.on('keypress', (str, key) => {
                if (key.name === 's') {
                    console.log("\n\n\x1b[31m    [!] SIGNAL: Menghentikan antrian. Kembali ke menu...\x1b[0m");
                    this.isRunning = false;
                }
                if (key.ctrl && key.name === 'c') process.exit();
            });
        }
    }

    async runWorker() {
        let targetInput = await this.ask('\n    [>] Jumlah Akun: ');
        let target = parseInt(targetInput) || 1;
        let passCustom = await this.ask('    [>] Password Custom: ');
        
        console.log("\n\x1b[32m    [🚀] JUY PROJECT ENGINE RUNNING...\x1b[0m\n");
        this.initStopListener();

        if (!fs.existsSync(this.storageDir)) fs.mkdirSync(this.storageDir);

        let sukses = 0;
        while (sukses < target && this.isRunning) {
            let browser = await puppeteer.launch({ 
                headless: false, 
                slowMo: 60,
                args: ['--window-size=600,900', '--window-position=0,0'] 
            });

            try {
                let pageGen = await browser.newPage();
                let pageZoom = await browser.newPage();
                pageZoom.setDefaultNavigationTimeout(50000);

                process.stdout.write(`    \x1b[37m[#${sukses + 1}]\x1b[0m Ambil Email...`);
                await pageGen.goto('https://generator.email/', { waitUntil: 'networkidle2' });
                let emailUser = await pageGen.$eval('#email_ch_text', el => el.innerText);
                console.log(` \x1b[32m[${emailUser}]\x1b[0m`);

                await pageZoom.goto('https://zoom.us/id/signup', { waitUntil: 'networkidle2' });
                await pageZoom.waitForSelector('#year');
                await pageZoom.type('#year', '1999'); await pageZoom.keyboard.press('Enter');
                
                await pageZoom.waitForSelector('#email', { visible: true });
                await pageZoom.type('#email', emailUser); await pageZoom.keyboard.press('Enter');

                await new Promise(r => setTimeout(r, 4000)); 
                let isBlocked = await pageZoom.evaluate(() => {
                    return document.body.innerText.includes('33000') || document.body.innerText.includes('Unable to sign up');
                });

                if (isBlocked) {
                    console.log(`    \x1b[31m [!] Error 33000! Ganti Email...\x1b[0m`);
                    throw new Error("Zoom Blocked");
                }

                let kodeOTP = null;
                for (let r = 1; r <= 4; r++) {
                    process.stdout.write(`    [⏳] Scan OTP (${r}/4)...`);
                    await new Promise(res => setTimeout(res, 10000));
                    await pageGen.reload();
                    kodeOTP = await pageGen.evaluate(() => {
                        let m = document.body.innerText.match(/\d{6}/);
                        return m ? m[0] : null;
                    });
                    if (kodeOTP) { console.log(` \x1b[32m[OK: ${kodeOTP}]\x1b[0m`); break; }
                    else { console.log(` \x1b[31m[N/A]\x1b[0m`); }
                }

                if (!kodeOTP) throw new Error("OTP Timeout");

                await pageZoom.bringToFront();
                await pageZoom.waitForSelector('[data-testid="pin-code"]', { visible: true });
                let pinInputs = await pageZoom.$$('.zoom-pin-code__item');
                if (pinInputs.length >= 6) {
                    await pinInputs[0].click();
                    for (let i = 0; i < 6; i++) {
                        await pinInputs[i].click();
                        await pageZoom.keyboard.press(kodeOTP[i]);
                        await new Promise(r => setTimeout(r, 400));
                    }
                    await new Promise(r => setTimeout(r, 1000));
                    await pageZoom.keyboard.press('Enter');
                }

                await pageZoom.waitForSelector('#firstName', { visible: true, timeout: 25000 });
                let nD = this.names.first[Math.floor(Math.random() * this.names.first.length)];
                let nB = this.names.last[Math.floor(Math.random() * this.names.last.length)];
                let pFinal = passCustom || "Masuk12345!";

                await pageZoom.type('#firstName', nD);
                await pageZoom.type('#lastName', nB);
                let passFields = await pageZoom.$$('input[type="password"]');
                for (let field of passFields) await field.type(pFinal);

                await pageZoom.click('button[data-testid="continue-btn"]');
                await new Promise(r => setTimeout(r, 8000));

                fs.appendFileSync(this.storageFile, `Email: ${emailUser} | Pass: ${pFinal} | Nama: ${nD} ${nB}\n`);
                console.log(`    \x1b[42m SUCCESS \x1b[0m Data Tersimpan.`);
                sukses++;

            } catch (e) {
                console.error(`    \x1b[31m [!] Sesi dilewati: ${e.message}\x1b[0m`);
            } finally {
                await browser.close();
            }
        }
        console.log("\n    [!] Selesai. Kembali ke menu utama...");
        await new Promise(r => setTimeout(r, 2000));
        await this.start();
    }

    async adminPanel() {
        let verify = await this.ask('\n    [?] Masukkan Master Key: ');
        if (verify !== this._getMK()) {
            console.log("\x1b[31m    [X] Akses Ilegal! Hubungi @juy_market\x1b[0m"); 
            await this.start();
            return;
        }

        console.log("\n    --- ADMIN CONTROL PANEL ---");
        console.log("    [A] Lihat Database");
        console.log("    [B] Update License Key");
        let sub = await this.ask('\n    [>] Pilih: ');

        if (sub.toLowerCase() === 'a') {
            if (fs.existsSync(this.storageFile)) console.log("\n" + fs.readFileSync(this.storageFile, 'utf8'));
            else console.log("    [!] Kosong.");
        } else if (sub.toLowerCase() === 'b') {
            let newKey = await this.ask('    [>] New License Key: ');
            this.saveConfig(newKey);
            console.log("    [OK] License Updated!");
        }
        await this.ask('\n    Tekan ENTER untuk kembali...');
        await this.start();
    }

    async start() {
        this.showBanner();

        if (!this.isLoggedIn) {
            let inputAwal = await this.ask('\x1b[33m    [?] Masukkan Kode Akses: \x1b[0m');
            // Cek apakah input cocok dengan config atau master key yang sudah di-decode
            if (inputAwal !== this.botConfig.kodeAkses && inputAwal !== this._getMK()) {
                console.log("\n\x1b[31m    [X] Kode Akses Salah! Silahkan minta ke @juy_market\x1b[0m"); 
                process.exit();
            }
            this.isLoggedIn = true;
        }

        console.log("\n    [1] Buat Akun Zoom");
        console.log("    [2] Admin & License Manager");
        console.log("    [0] Exit");
        
        let choice = await this.ask('\n    [>] Pilih Menu: ');
        if (choice === "1") await this.runWorker();
        else if (choice === "2") await this.adminPanel();
        else process.exit();
    }
}

let JuyBot = new JuyZoomCreator();
JuyBot.start();
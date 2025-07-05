# Dashboard Admin E-Commerce Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Dashboard Admin E-Commerce" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pilih cara menjalankan server:" -ForegroundColor Yellow
Write-Host "1. Python HTTP Server (Port 8080)" -ForegroundColor White
Write-Host "2. Node.js HTTP Server (Port 8080)" -ForegroundColor White
Write-Host "3. Buka langsung di browser" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Masukkan pilihan (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Menjalankan Python HTTP Server..." -ForegroundColor Green
        Write-Host "Dashboard akan tersedia di: http://localhost:8080" -ForegroundColor Yellow
        Write-Host "Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Red
        Write-Host ""
        
        try {
            python -m http.server 8080
        }
        catch {
            Write-Host "Error: Python tidak ditemukan atau tidak terinstall!" -ForegroundColor Red
            Write-Host "Silakan install Python terlebih dahulu dari https://python.org" -ForegroundColor Yellow
        }
    }
    "2" {
        Write-Host ""
        Write-Host "Menjalankan Node.js HTTP Server..." -ForegroundColor Green
        Write-Host "Dashboard akan tersedia di: http://localhost:8080" -ForegroundColor Yellow
        Write-Host "Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Red
        Write-Host ""
        
        try {
            npx http-server . -p 8080 -o
        }
        catch {
            Write-Host "Error: Node.js tidak ditemukan atau tidak terinstall!" -ForegroundColor Red
            Write-Host "Silakan install Node.js terlebih dahulu dari https://nodejs.org" -ForegroundColor Yellow
        }
    }
    "3" {
        Write-Host ""
        Write-Host "Membuka dashboard di browser..." -ForegroundColor Green
        Start-Process "index.html"
    }
    default {
        Write-Host "Pilihan tidak valid!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Tekan Enter untuk keluar..." -ForegroundColor Gray
Read-Host

@echo off
echo ========================================
echo   Dashboard Admin E-Commerce
echo ========================================
echo.
echo Pilih cara menjalankan server:
echo 1. Python HTTP Server (Port 8080)
echo 2. Node.js HTTP Server (Port 8080)
echo 3. Buka langsung di browser
echo.
set /p choice="Masukkan pilihan (1-3): "

if "%choice%"=="1" (
    echo.
    echo Menjalankan Python HTTP Server...
    echo Dashboard akan tersedia di: http://localhost:8080
    echo Tekan Ctrl+C untuk menghentikan server
    echo.
    python -m http.server 8080
) else if "%choice%"=="2" (
    echo.
    echo Menjalankan Node.js HTTP Server...
    echo Dashboard akan tersedia di: http://localhost:8080
    echo Tekan Ctrl+C untuk menghentikan server
    echo.
    npx http-server . -p 8080 -o
) else if "%choice%"=="3" (
    echo.
    echo Membuka dashboard di browser...
    start index.html
) else (
    echo Pilihan tidak valid!
    pause
)

pause

@echo off
echo ====================================
echo Medagil AI Platform - Mock数据演示
echo ====================================
echo.

echo [1/4] 启动后端服务...
cd /d "%~dp0backend"
start "Medagil Backend" cmd /k "npm run dev"
echo 后端服务已启动 (端口: 5000)
echo.

echo [2/4] 启动前端应用...
cd /d "%~dp0frontend"
start "Medagil Frontend" cmd /k "npm run dev"
echo 前端应用已启动 (端口: 3000)
echo.

echo [3/4] 启动管理后台...
cd /d "%~dp0admin"
start "Medagil Admin" cmd /k "npm run dev"
echo 管理后台已启动 (端口: 3001)
echo.

echo [4/4] 启动微信小程序...
echo 请使用微信开发者工具打开以下目录:
echo "%~dp0miniprogram"
echo.

echo ====================================
echo 所有服务已启动！
echo 后端服务: http://localhost:5000
echo 前端应用: http://localhost:3000
echo 管理后台: http://localhost:3001
echo ====================================
echo.
echo 注意: 本演示使用Mock数据，无需MySQL数据库
echo.
pause
